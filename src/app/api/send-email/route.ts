import { NextResponse } from "next/server";
import { Resend } from "resend";

// Replace re_xxxxxxxxx with your real API key in .env.local as RESEND_API_KEY
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
    try {
        const { data, error } = await resend.emails.send({
            from: "onboarding@resend.dev",
            to: "info@remoteworkhub.com",
            subject: "Hello World",
            html: "<p>Congrats on sending your <strong>first email</strong>!</p>",
        });

        if (error) {
            return NextResponse.json({ error }, { status: 400 });
        }

        return NextResponse.json({ data });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
