import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "");

const DEFAULT_FROM_NAME = "Remote Work Hub";

function getFromAddress(): string {
  const email = process.env.EMAIL_FROM || "onboarding@resend.dev";
  return `${DEFAULT_FROM_NAME} <${email}>`;
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  fromName?: string;
  replyTo?: string;
}

export async function sendEmail(opts: SendEmailOptions): Promise<{ success: boolean; id?: string; error?: string }> {
  if (!process.env.RESEND_API_KEY) {
    console.log("[Email] RESEND_API_KEY not configured, skipping:", opts.to);
    return { success: false, error: "Email not configured" };
  }

  try {
    const from = opts.fromName
      ? `${opts.fromName} <${process.env.EMAIL_FROM || "onboarding@resend.dev"}>`
      : getFromAddress();

    const { data, error } = await resend.emails.send({
      from,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      ...(opts.replyTo ? { reply_to: opts.replyTo } : {}),
    });

    if (error) {
      console.error("[Email] Resend error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (err) {
    console.error("[Email] Send error:", err);
    return { success: false, error: String(err) };
  }
}
