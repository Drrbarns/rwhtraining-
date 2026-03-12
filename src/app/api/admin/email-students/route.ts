import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * POST /api/admin/email-students
 * Sends an email to all students who have registered and paid.
 * Requires admin session.
 */
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", session.user.id)
            .single();

        if (!profile || (profile.role !== "ADMIN" && profile.role !== "SUPER_ADMIN")) {
            return NextResponse.json({ error: "Forbidden: Admin only" }, { status: 403 });
        }

        const body = await request.json();
        const subject = (body.subject as string)?.trim() || "Message from Remote Work Hub Masterclass";
        const htmlBody = (body.body as string)?.trim() || "<p>No content.</p>";

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY;
        if (!supabaseUrl || !supabaseServiceKey) {
            return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
        }

        const serviceSupabase = createServiceClient(supabaseUrl, supabaseServiceKey);
        const { data: paidApps, error } = await serviceSupabase
            .from("applications")
            .select("email, first_name")
            .eq("payment_status", "PAID")
            .not("email", "is", null);

        if (error) {
            console.error("[Email Students] DB error:", error);
            return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
        }

        const recipients = (paidApps || []).filter((a) => a.email);
        if (recipients.length === 0) {
            return NextResponse.json({
                ok: true,
                sent: 0,
                message: "No paid students to email.",
            });
        }

        if (!process.env.RESEND_API_KEY) {
            return NextResponse.json({ error: "Email service not configured (RESEND_API_KEY)" }, { status: 500 });
        }

        const fromEmail = process.env.EMAIL_FROM || "onboarding@resend.dev";
        const fromName = process.env.EMAIL_FROM
            ? (process.env.EMAIL_FROM.split("@")[0] || "Masterclass")
            : "Masterclass Admissions";

        let sent = 0;
        for (const r of recipients) {
            const firstName = r.first_name || "Student";
            const personalizedHtml = htmlBody.replace(/\{\{first_name\}\}/g, firstName);
            const { error: sendError } = await resend.emails.send({
                from: `${fromName} <${fromEmail}>`,
                to: r.email,
                subject,
                html: personalizedHtml,
            });
            if (!sendError) sent++;
        }

        return NextResponse.json({
            ok: true,
            sent,
            total: recipients.length,
            message: `Emailed ${sent} of ${recipients.length} paid students.`,
        });
    } catch (e) {
        console.error("[Email Students] Error:", e);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
