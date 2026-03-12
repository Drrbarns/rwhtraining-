import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/send-email";
import { wrapInLayout } from "@/lib/email-templates";

export async function POST() {
    try {
        const html = wrapInLayout(
            `<h2>Hello from Remote Work Hub!</h2>
            <p>Congrats on sending your first email. Everything is working perfectly.</p>
            <div style="text-align: center; margin: 32px 0 16px;">
              <a href="https://remoteworkhub.org" style="display: inline-block; background: #2563EB; color: #ffffff; padding: 15px 36px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 14px;">Visit Website &rarr;</a>
            </div>`,
            "Test email from Remote Work Hub"
        );

        const result = await sendEmail({
            to: "info@remoteworkhub.com",
            subject: "Hello World",
            html,
        });

        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 400 });
        }

        return NextResponse.json({ success: true, id: result.id });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
