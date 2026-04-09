import { SupabaseClient } from "@supabase/supabase-js";
import { COURSE_TOTAL_GHS } from "@/lib/pricing";
import { sendEmail } from "@/lib/send-email";
import { SmsAdapter } from "@/lib/sms-adapter";
import { EMAIL_TEMPLATES, SMS_TEMPLATES, mergeVariables } from "@/lib/email-templates";

const DEFAULT_STUDENT_PASSWORD = "12345678";

export type ApplicationRow = {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    phone?: string | null;
    city?: string | null;
    amount_ghs: number;
    tier?: string | null;
    cohort_id: string;
    user_id?: string | null;
};

/**
 * Creates auth user, profile, enrollment, and sends credentials email.
 * Idempotent: skips creation if user already exists for this application.
 */
export async function onboardPaidStudent(
    supabase: SupabaseClient,
    appData: ApplicationRow
): Promise<{ ok: boolean; emailSent?: boolean; error?: string }> {
    try {
        const { data: existingEnrollment } = await supabase
            .from("enrollments")
            .select("id, total_paid, balance_due")
            .eq("application_id", appData.id)
            .single();

        if (existingEnrollment && appData.user_id) {
            // Balance payment: update enrollment financials if there's still a balance
            if (appData.amount_ghs > 0 && Number(existingEnrollment.balance_due) > 0) {
                const newTotalPaid = Number(existingEnrollment.total_paid) + appData.amount_ghs;
                const newBalanceDue = Math.max(0, Number(existingEnrollment.balance_due) - appData.amount_ghs);
                await supabase.from("enrollments").update({
                    total_paid: newTotalPaid,
                    balance_due: newBalanceDue,
                    updated_at: new Date().toISOString(),
                }).eq("id", existingEnrollment.id);
                console.log(`[Onboard] Updated enrollment balance: paid=${newTotalPaid}, due=${newBalanceDue}`);
            }
            return { ok: true };
        }

        const tempPassword = DEFAULT_STUDENT_PASSWORD;

        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: appData.email,
            password: tempPassword,
            email_confirm: true,
            user_metadata: { full_name: `${appData.first_name} ${appData.last_name}` },
        });

        if (authError) {
            if (authError.message.includes("already been registered")) {
                const { data: existingUsers } = await supabase.auth.admin.listUsers();
                const existing = existingUsers?.users?.find((u) => u.email === appData.email);
                if (existing) {
                    await ensureProfileAndEnrollment(supabase, appData, existing.id);
                    const emailSent = await sendWelcomeExistingEmail(appData.email, appData.first_name);
                    await sendWelcomeSms(appData.first_name, appData.email, DEFAULT_STUDENT_PASSWORD, appData.phone);
                    return { ok: true, emailSent };
                }
            }
            console.error("[Onboard] Auth error:", authError);
            return { ok: false, error: authError.message };
        }

        if (!authData?.user) return { ok: false, error: "No user returned" };

        await supabase.from("profiles").insert({
            id: authData.user.id,
            role: "STUDENT",
            full_name: `${appData.first_name} ${appData.last_name}`,
            phone: appData.phone || "",
            city: appData.city || "",
        });

        await supabase.from("enrollments").insert({
            user_id: authData.user.id,
            cohort_id: appData.cohort_id,
            application_id: appData.id,
            is_active: true,
            total_paid: appData.amount_ghs,
            balance_due: COURSE_TOTAL_GHS - appData.amount_ghs,
        });

        await supabase.from("applications").update({ user_id: authData.user.id }).eq("id", appData.id);

        const emailSent = await sendCredentialsEmail(
            appData.email,
            tempPassword,
            appData.first_name,
            appData.last_name
        );
        await sendPaymentConfirmationSms(appData.first_name, appData.amount_ghs, appData.tier, appData.phone);
        await sendWelcomeSms(appData.first_name, appData.email, tempPassword, appData.phone);
        return { ok: true, emailSent };
    } catch (e) {
        console.error("[Onboard] Error:", e);
        return { ok: false, error: String(e) };
    }
}

async function ensureProfileAndEnrollment(
    supabase: SupabaseClient,
    appData: ApplicationRow,
    userId: string
) {
    const { data: prof } = await supabase.from("profiles").select("id").eq("id", userId).single();
    if (!prof) {
        await supabase.from("profiles").insert({
            id: userId,
            role: "STUDENT",
            full_name: `${appData.first_name} ${appData.last_name}`,
            phone: appData.phone || "",
            city: appData.city || "",
        });
    }
    const { data: enroll } = await supabase
        .from("enrollments")
        .select("id")
        .eq("application_id", appData.id)
        .single();
    if (!enroll) {
        await supabase.from("enrollments").insert({
            user_id: userId,
            cohort_id: appData.cohort_id,
            application_id: appData.id,
            is_active: true,
            total_paid: appData.amount_ghs,
            balance_due: COURSE_TOTAL_GHS - appData.amount_ghs,
        });
    }
    await supabase.from("applications").update({ user_id: userId }).eq("id", appData.id);
}

async function sendWelcomeExistingEmail(email: string, firstName: string): Promise<boolean> {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://remoteworkhub.org";
    const template = EMAIL_TEMPLATES.welcome_existing;
    const html = mergeVariables(template.body, {
        first_name: firstName,
        login_url: `${appUrl}/student`,
    });

    const result = await sendEmail({
        to: email,
        subject: mergeVariables(template.subject, { first_name: firstName }),
        html,
    });
    return result.success;
}

async function sendCredentialsEmail(
    email: string,
    password: string,
    firstName: string,
    lastName: string
): Promise<boolean> {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://remoteworkhub.org";
    const template = EMAIL_TEMPLATES.credentials;
    const html = mergeVariables(template.body, {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        login_url: `${appUrl}/student`,
    });

    const result = await sendEmail({
        to: email,
        subject: mergeVariables(template.subject, { first_name: firstName }),
        html,
    });

    if (result.success) {
        console.log(`[Onboard] Emailed credentials to ${email}`);
    }
    return result.success;
}

async function sendPaymentConfirmationSms(
    firstName: string,
    amount: number,
    tier: string | null | undefined,
    phone: string | null | undefined
): Promise<void> {
    if (!phone?.trim()) return;
    const tierLabel = tier ? `${tier}%` : "your";
    const message = mergeVariables(SMS_TEMPLATES.payment_confirmation.body, {
        first_name: firstName,
        amount: String(amount),
        tier: tierLabel,
    });
    const result = await SmsAdapter.send({ to: phone, message });
    if (result.success) console.log(`[Onboard] Payment confirmation SMS sent to ${phone}`);
    else console.warn(`[Onboard] Payment confirmation SMS failed:`, result.error);
}

async function sendWelcomeSms(
    firstName: string,
    email: string,
    password: string,
    phone: string | null | undefined
): Promise<void> {
    if (!phone?.trim()) return;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://remoteworkhub.org";
    const message = mergeVariables(SMS_TEMPLATES.welcome_sms.body, {
        first_name: firstName,
        email,
        password,
        login_url: `${appUrl}/student`,
    });
    const result = await SmsAdapter.send({ to: phone, message });
    if (result.success) console.log(`[Onboard] Welcome SMS sent to ${phone}`);
    else console.warn(`[Onboard] Welcome SMS failed:`, result.error);
}
