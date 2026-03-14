/**
 * Sends login credentials to all students via email AND SMS.
 * Run: npx tsx send-credentials.ts
 */
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { Resend } from "resend";
import { SmsAdapter } from "./src/lib/sms-adapter";

const LOGIN_URL = "https://remoteworkhub.org/student";
const DEFAULT_PASSWORD = "12345678";
const WHATSAPP = "https://chat.whatsapp.com/HI1MK05kBGA2wqxz3TA1s9";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_ADDRESS = process.env.EMAIL_FROM || "onboarding@resend.dev";
const FROM = `Remote Work Hub <${FROM_ADDRESS}>`;

const students = [
    { first_name: "Emmanuel", email: "anyimahemma.001@gmail.com", phone: "+233535029108" },
    { first_name: "Emmanuella", email: "airllarackon@icloud.com", phone: "0506640015" },
    { first_name: "Erica Angela", email: "angelatakyiwaa93@gmail.com", phone: "0598118600" },
    { first_name: "Ethel", email: "ethelafful4@gmail.com", phone: "07770198045" },
    { first_name: "Eunice", email: "yeunice158@gmail.com", phone: "0247259558" },
    { first_name: "Georgina", email: "gina.appiah1@icloud.com", phone: "+233257232210" },
    { first_name: "Jessica", email: "kayjessica239@gmail.com", phone: "0594075733" },
    { first_name: "Jessica", email: "jessicalarteyvi07@gmail.com", phone: "0531588139" },
    { first_name: "Maxwell", email: "kojoblins238@gmail.com", phone: "0593518263" },
    { first_name: "Prince", email: "annanprinceofori@yahoo.com", phone: "0203413984" },
    { first_name: "Princess", email: "Earldwara@gmail.com", phone: "+233248907887" },
    { first_name: "Saviour", email: "winningofcourse007@gmail.com", phone: "0548831566" },
    { first_name: "Susana Emmanuella", email: "suzannuella@gmail.com", phone: "0559591823" },
];

async function sendCredentialEmail(student: typeof students[0]) {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
        
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#0a0a0a,#1a1a2e);padding:36px 40px;text-align:center;">
            <div style="width:56px;height:56px;background:#2563EB;border-radius:14px;margin:0 auto 16px;display:inline-flex;align-items:center;justify-content:center;font-size:26px;line-height:56px;">🎓</div>
            <h1 style="color:#ffffff;font-size:22px;font-weight:800;margin:0;letter-spacing:-0.5px;">CohortHQ — Student Portal</h1>
            <p style="color:#94a3b8;font-size:14px;margin:8px 0 0;">Remote Work Hub Masterclass 2026</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:36px 40px;">
            <h2 style="font-size:20px;font-weight:800;color:#0f172a;margin:0 0 8px;">Hello ${student.first_name}! 👋</h2>
            <p style="font-size:15px;color:#334155;line-height:1.7;margin:0 0 24px;">
              Your student account is ready. Use the credentials below to log into your <strong>CohortHQ student dashboard</strong>.
            </p>

            <!-- Credentials Box -->
            <div style="background:linear-gradient(135deg,#0f172a,#1e293b);border-radius:16px;padding:28px;margin:0 0 24px;border:1px solid #334155;">
              <p style="font-size:11px;color:#64748b;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 6px;">Login URL</p>
              <p style="font-size:14px;color:#60a5fa;font-weight:600;font-family:'Courier New',monospace;margin:0 0 20px;">${LOGIN_URL}</p>
              
              <div style="height:1px;background:#334155;margin:0 0 20px;"></div>
              
              <p style="font-size:11px;color:#64748b;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 6px;">Email</p>
              <p style="font-size:15px;color:#ffffff;font-weight:600;font-family:'Courier New',monospace;margin:0 0 20px;word-break:break-all;">${student.email}</p>
              
              <div style="height:1px;background:#334155;margin:0 0 20px;"></div>
              
              <p style="font-size:11px;color:#64748b;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 6px;">Default Password</p>
              <p style="font-size:24px;color:#4ade80;font-weight:800;font-family:'Courier New',monospace;margin:0;letter-spacing:4px;">${DEFAULT_PASSWORD}</p>
            </div>

            <!-- Warning -->
            <div style="background:#fffbeb;border:1px solid #fbbf24;border-radius:12px;padding:16px 20px;margin:0 0 28px;">
              <p style="font-size:13px;color:#92400e;font-weight:700;margin:0;">⚠️ Please change your password immediately after logging in. Go to <strong>Profile → Change Password</strong> on your dashboard.</p>
            </div>

            <!-- CTA -->
            <div style="text-align:center;margin:0 0 28px;">
              <a href="${LOGIN_URL}" style="display:inline-block;background:#2563EB;color:#ffffff;padding:15px 40px;border-radius:12px;text-decoration:none;font-weight:700;font-size:15px;">
                Login to Dashboard →
              </a>
            </div>

            <!-- WhatsApp -->
            <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:16px 20px;text-align:center;">
              <p style="font-size:13px;color:#166534;font-weight:700;margin:0 0 8px;">📱 Join the Cohort WhatsApp Group</p>
              <a href="${WHATSAPP}" style="color:#16a34a;font-weight:700;font-size:13px;">${WHATSAPP}</a>
            </div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;padding:24px 40px;text-align:center;border-top:1px solid #e2e8f0;">
            <p style="font-size:12px;color:#94a3b8;margin:0;">Remote Work Hub Masterclass · 111 Newtown RD, Accra Newtown</p>
            <p style="font-size:12px;color:#94a3b8;margin:4px 0 0;">We start <strong style="color:#64748b;">Monday, March 16, 2026</strong> 🚀</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    const { error } = await resend.emails.send({
        from: FROM,
        to: student.email,
        subject: "Your CohortHQ Login Credentials — Remote Work Hub Masterclass",
        html,
    });

    if (error) throw new Error(error.message);
}

async function main() {
    if (!process.env.RESEND_API_KEY) {
        console.error("Missing RESEND_API_KEY in .env.local");
        process.exit(1);
    }

    console.log(`\nSending credentials to ${students.length} students via email + SMS...\n`);

    let emailOk = 0, emailFail = 0, smsOk = 0, smsFail = 0;

    for (const student of students) {
        process.stdout.write(`  ${student.first_name.padEnd(22)} `);

        // EMAIL
        try {
            await sendCredentialEmail(student);
            process.stdout.write("✅ email  ");
            emailOk++;
        } catch (e: any) {
            process.stdout.write(`❌ email(${String(e.message || e)?.slice(0,50)})  `);
            emailFail++;
        }

        // Small delay between emails
        await new Promise(r => setTimeout(r, 400));

        // SMS
        if (student.phone?.trim()) {
            const smsText = `Hi ${student.first_name.trim()}! Your Remote Work Hub Masterclass student portal is ready.\nURL: ${LOGIN_URL}\nEmail: ${student.email}\nPassword: ${DEFAULT_PASSWORD}\nPlease change your password after login.\nJoin WhatsApp: ${WHATSAPP} - Remote Work Hub`;
            const res = await SmsAdapter.send({ to: student.phone, message: smsText });
            if (res.success) { process.stdout.write("✅ sms\n"); smsOk++; }
            else { process.stdout.write(`❌ sms(${res.error?.slice(0,30)})\n`); smsFail++; }
            await new Promise(r => setTimeout(r, 200));
        } else {
            process.stdout.write("⚠️  no phone\n");
        }
    }

    console.log(`
==========================================
  Email: ${emailOk} sent, ${emailFail} failed
  SMS:   ${smsOk} sent, ${smsFail} failed
==========================================
`);
}

main();
