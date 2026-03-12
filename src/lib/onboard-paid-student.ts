import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy");

function generateSecurePassword() {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 12; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

export type ApplicationRow = {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    phone?: string | null;
    city?: string | null;
    amount_ghs: number;
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
        // If application already has user_id, user was created — only resend email if needed
        const { data: existingEnrollment } = await supabase
            .from("enrollments")
            .select("id")
            .eq("application_id", appData.id)
            .single();

        if (existingEnrollment && appData.user_id) {
            // User already onboarded; optionally could resend credentials here
            return { ok: true };
        }

        const tempPassword = generateSecurePassword();

        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: appData.email,
            password: tempPassword,
            email_confirm: true,
            user_metadata: { full_name: `${appData.first_name} ${appData.last_name}` },
        });

        if (authError) {
            if (authError.message.includes("already been registered")) {
                // User exists — ensure profile/enrollment exist, send welcome (no password)
                const { data: existingUsers } = await supabase.auth.admin.listUsers();
                const existing = existingUsers?.users?.find((u) => u.email === appData.email);
                if (existing) {
                    await ensureProfileAndEnrollment(supabase, appData, existing.id);
                    await sendWelcomeEmailNoPassword(appData.email, appData.first_name);
                    return { ok: true, emailSent: true };
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
            balance_due: 1000 - appData.amount_ghs,
        });

        await supabase.from("applications").update({ user_id: authData.user.id }).eq("id", appData.id);

        const emailSent = await sendCredentialsEmail(
            appData.email,
            tempPassword,
            appData.first_name,
            appData.last_name
        );
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
            balance_due: 1000 - appData.amount_ghs,
        });
    }
    await supabase.from("applications").update({ user_id: userId }).eq("id", appData.id);
}

async function sendWelcomeEmailNoPassword(email: string, firstName: string): Promise<boolean> {
    if (!process.env.RESEND_API_KEY) return false;
    try {
        await resend.emails.send({
            from: process.env.EMAIL_FROM
                ? `${process.env.EMAIL_FROM.split("@")[0]} <${process.env.EMAIL_FROM}>`
                : "Masterclass Admissions <onboarding@resend.dev>",
            to: email,
            subject: "Welcome to the Masterclass — You're In!",
            html: `
                <h2>Welcome to the Elite Web Development Masterclass!</h2>
                <p>Hi ${firstName}, your payment has been successfully processed.</p>
                <p>Your student account is ready. Log in with your existing credentials:</p>
                <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://remoteworkhub.org"}/student" style="background: #2563EB; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; margin-top: 12px;">Login to Dashboard</a>
            `,
        });
        return true;
    } catch (e) {
        console.error("[Onboard] Welcome email error:", e);
        return false;
    }
}

async function sendCredentialsEmail(
    email: string,
    password: string,
    firstName: string,
    lastName: string
): Promise<boolean> {
    if (!process.env.RESEND_API_KEY) {
        console.log("[Onboard] RESEND_API_KEY missing, skipping credentials email");
        return false;
    }
    try {
        await resend.emails.send({
            from: process.env.EMAIL_FROM
                ? `${process.env.EMAIL_FROM.split("@")[0]} <${process.env.EMAIL_FROM}>`
                : "Masterclass Admissions <onboarding@resend.dev>",
            to: email,
            subject: "Your Masterclass Student Credentials",
            html: `
                <h2>Welcome to the Elite Web Development Masterclass!</h2>
                <p>Hi ${firstName}, your payment has been successfully processed.</p>
                <p>Your student account has been provisioned. You can log into your student dashboard using the following credentials:</p>
                <div style="background: #f4f4f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 0; font-family: monospace;"><strong>Email:</strong> ${email}</p>
                    <p style="margin: 8px 0 0 0; font-family: monospace;"><strong>Password:</strong> ${password}</p>
                </div>
                <p>Please log in and update your password immediately.</p>
                <br />
                <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://remoteworkhub.org"}/student" style="background: #2563EB; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Login to Dashboard</a>
            `,
        });
        console.log(`[Onboard] Emailed credentials to ${email}`);
        return true;
    } catch (e) {
        console.error("[Onboard] Email error:", e);
        return false;
    }
}
