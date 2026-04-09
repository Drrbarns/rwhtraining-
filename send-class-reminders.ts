/**
 * Class Reminder Messaging — Sends SMS + Email reminders leading up to class.
 *
 * Schedule (Ghana time = UTC+0):
 *   Wave 1 — NOW          — Location & directions
 *   Wave 2 — NOW          — Meeting info, time, what to bring
 *   Wave 3 — 8:00 PM tonight — Get excited, sleep well
 *   Wave 4 — 6:00 AM Apr 20  — Good morning, today is the day
 *   Wave 5 — 8:00 AM Apr 20  — Are you on your way?
 *   Wave 6 — 9:45 AM Apr 20  — Starting in 10 mins!
 *
 * Run all waves:     USE_DATABASE=1 npx tsx send-class-reminders.ts
 * Run specific wave: USE_DATABASE=1 ONLY_WAVES=1,2 npx tsx send-class-reminders.ts
 */
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { SmsAdapter } from "./src/lib/sms-adapter";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = `Remote Work Hub <${process.env.EMAIL_FROM || "onboarding@resend.dev"}>`;

type Contact = { first_name: string; email: string | null; phone: string };

function normalizePhone(p: string): string {
    const cleaned = p.replace(/\s+/g, "").replace(/[^0-9+]/g, "");
    if (cleaned.startsWith("0")) return "233" + cleaned.slice(1);
    if (!cleaned.startsWith("233")) return "233" + cleaned;
    return cleaned;
}

async function getStudentsFromDb(): Promise<Contact[]> {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY;
    if (!url || !key) { console.error("Missing Supabase creds"); process.exit(1); }
    const supabase = createClient(url, key);
    const { data, error } = await supabase.from("enrollments").select("*, applications(*)");
    if (error) { console.error("DB error:", error.message); process.exit(1); }
    const out: Contact[] = [];
    const seen = new Set<string>();
    for (const e of data || []) {
        const app = (e as any).applications;
        if (!app) continue;
        const email = (app.email ?? "").trim().toLowerCase();
        if (email === "teststudent@remoteworkhub.org") continue;
        const phone = normalizePhone(app.phone ?? "");
        if (!email && !phone) continue;
        if (seen.has(email || phone)) continue;
        seen.add(email || phone);
        out.push({ first_name: (app.first_name || "there").trim(), email: app.email ?? null, phone: app.phone || "" });
    }
    return out;
}

// ─── Message Templates ───────────────────────────────────────────────────────

function msg1(name: string) {
    const sms = `Hi ${name}! 📍 Reminder: The RWH Masterclass begins Monday, April 20 at 10:00AM sharp!\n\nLocation: 111 Newtown RD, Accra Newtown.\n🗺 Search "Doctor Barns Tech" on Google Maps, Bolt or Uber.\n🚕 From Circle: take a Newtown car, stop at ADB Bank.\n📞 Need directions? Call: 0599551331\n\nPlease arrive BEFORE 10:00AM. See you there! 🚀 - Remote Work Hub`;

    const email = makeEmail(name, `📍 Class Tomorrow — Here's the Location & Directions`, `
      <div style="text-align:center;margin-bottom:28px;">
        <div style="width:64px;height:64px;background:linear-gradient(135deg,#dbeafe,#bfdbfe);border-radius:50%;margin:0 auto 12px;line-height:64px;font-size:28px;">📍</div>
        <h2 style="font-size:22px;font-weight:800;color:#0f172a;margin:0;">Class is TOMORROW!</h2>
        <p style="color:#64748b;margin:8px 0 0;font-size:15px;">Monday, April 20 · 10:00AM sharp</p>
      </div>
      <p style="font-size:15px;color:#334155;line-height:1.7;">Hi <strong>${name}</strong>! Just a reminder — we have class tomorrow. Here's everything you need to get to us:</p>
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;padding:24px;margin:20px 0;">
        <p style="font-size:13px;font-weight:800;color:#2563EB;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px;">📍 Address</p>
        <p style="font-size:18px;font-weight:800;color:#0f172a;margin:0;">111 Newtown RD, Accra Newtown</p>
      </div>
      <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:16px;padding:24px;margin:20px 0;">
        <p style="font-size:14px;font-weight:800;color:#0369a1;margin:0 0 12px;">🗺 How to Find Us</p>
        <ul style="margin:0;padding:0 0 0 20px;font-size:14px;color:#334155;line-height:2;">
          <li>Search <strong>"Doctor Barns Tech"</strong> on Google Maps</li>
          <li>Order a <strong>Bolt or Uber</strong> to "Doctor Barns Tech"</li>
          <li>From <strong>Circle</strong>: take a Newtown car → stop at <strong>ADB Bank</strong></li>
        </ul>
      </div>
      <div style="background:#fef3c7;border:1px solid #fcd34d;border-radius:16px;padding:20px;margin:20px 0;display:flex;align-items:center;gap:16px;">
        <span style="font-size:28px;">📞</span>
        <div>
          <p style="font-size:13px;font-weight:700;color:#92400e;margin:0 0 4px;text-transform:uppercase;">Need Directions? Call Us</p>
          <p style="font-size:20px;font-weight:800;color:#0f172a;margin:0;letter-spacing:1px;">0599 551 331</p>
        </div>
      </div>
      <div style="background:linear-gradient(135deg,#2563EB,#4f46e5);border-radius:16px;padding:20px;text-align:center;margin:24px 0;">
        <p style="color:#ffffff;font-size:15px;font-weight:700;margin:0;">⏰ Please arrive <strong>BEFORE 10:00AM</strong></p>
        <p style="color:#bfdbfe;font-size:13px;margin:6px 0 0;">Monday, April 20, 2026 · We'll be starting promptly!</p>
      </div>
      <p style="font-size:14px;color:#64748b;text-align:center;">See you tomorrow! 🚀</p>`);

    return { sms, email, subject: "📍 Class Tomorrow — Location & Directions" };
}

function msg2(name: string) {
    const sms = `Hey ${name}! 📋 Quick info for tomorrow's class:\n\n🕙 Time: 10:00AM sharp (arrive before!)\n📍 Location: 111 Newtown RD, Accra Newtown\n💻 Bring your laptop if you have one\n📱 Charge your phone fully\n\nDon't have a laptop? No worries — just come ready to learn!\n\nSee you at 10AM tomorrow. 🚀 - Remote Work Hub`;

    const email = makeEmail(name, `📋 Tomorrow's Class — Everything You Need to Know`, `
      <div style="text-align:center;margin-bottom:28px;">
        <div style="width:64px;height:64px;background:linear-gradient(135deg,#d1fae5,#a7f3d0);border-radius:50%;margin:0 auto 12px;line-height:64px;font-size:28px;">📋</div>
        <h2 style="font-size:22px;font-weight:800;color:#0f172a;margin:0;">Everything You Need for Tomorrow</h2>
        <p style="color:#64748b;margin:8px 0 0;font-size:15px;">Monday, April 20 at 10:00AM</p>
      </div>
      <p style="font-size:15px;color:#334155;line-height:1.7;">Hi <strong>${name}</strong>! Here's a quick rundown for tomorrow's class:</p>
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;padding:24px;margin:20px 0;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:10px 0;font-size:14px;color:#64748b;font-weight:700;border-bottom:1px solid #f1f5f9;">⏰ Time</td>
            <td style="padding:10px 0;font-size:14px;color:#0f172a;font-weight:700;border-bottom:1px solid #f1f5f9;">10:00AM sharp (arrive before!)</td>
          </tr>
          <tr>
            <td style="padding:10px 0;font-size:14px;color:#64748b;font-weight:700;border-bottom:1px solid #f1f5f9;">📍 Location</td>
            <td style="padding:10px 0;font-size:14px;color:#0f172a;font-weight:700;border-bottom:1px solid #f1f5f9;">111 Newtown RD, Accra Newtown</td>
          </tr>
          <tr>
            <td style="padding:10px 0;font-size:14px;color:#64748b;font-weight:700;border-bottom:1px solid #f1f5f9;">🗺 Find Us</td>
            <td style="padding:10px 0;font-size:14px;color:#0f172a;font-weight:700;border-bottom:1px solid #f1f5f9;">Search "Doctor Barns Tech" on Maps</td>
          </tr>
          <tr>
            <td style="padding:10px 0;font-size:14px;color:#64748b;font-weight:700;">📞 Call</td>
            <td style="padding:10px 0;font-size:14px;color:#0f172a;font-weight:700;">0599 551 331</td>
          </tr>
        </table>
      </div>
      <div style="background:#f0fdf4;border:2px solid #4ade80;border-radius:16px;padding:24px;margin:20px 0;text-align:center;">
        <p style="font-size:18px;font-weight:800;color:#166534;margin:0;">💻 Bring your laptop if you have one!</p>
        <p style="font-size:14px;color:#4b7a5c;margin:10px 0 0;">We'll be coding hands-on. Don't have one? No worries — just come ready to learn!</p>
      </div>
      <div style="background:#fef3c7;border:1px solid #fcd34d;border-radius:16px;padding:20px;margin:20px 0;">
        <p style="font-size:14px;color:#92400e;font-weight:600;margin:0;">📱 <strong>Charge your phone fully</strong> before you leave. Make sure you have your charger too!</p>
      </div>
      <div style="background:linear-gradient(135deg,#2563EB,#4f46e5);border-radius:16px;padding:20px;text-align:center;margin:24px 0;">
        <p style="color:#ffffff;font-size:15px;font-weight:700;margin:0;">We can't wait to see you tomorrow! 🚀</p>
        <p style="color:#bfdbfe;font-size:13px;margin:6px 0 0;">Monday, April 20 · 10:00AM · 111 Newtown RD</p>
      </div>`);

    return { sms, email, subject: "📋 Tomorrow's Class — Time, Location & What to Bring" };
}

function msg3(name: string) {
    const sms = `${name}, get some rest tonight! 😴\n\nTomorrow you're showing up for yourself. Class is at 10:00AM at 111 Newtown RD, Accra Newtown.\n\nSet your alarm, charge your devices, sleep well. We'll see you bright and early! 🌟\n\n- Doctor Barns & Remote Work Hub`;

    const email = makeEmail(name, `🌙 Get Some Rest — Big Day Tomorrow!`, `
      <div style="text-align:center;margin-bottom:28px;">
        <div style="width:64px;height:64px;background:linear-gradient(135deg,#e0e7ff,#c7d2fe);border-radius:50%;margin:0 auto 12px;line-height:64px;font-size:28px;">🌙</div>
        <h2 style="font-size:22px;font-weight:800;color:#0f172a;margin:0;">Rest Up, ${name}!</h2>
        <p style="color:#64748b;margin:8px 0 0;font-size:15px;">Big day tomorrow.</p>
      </div>
      <p style="font-size:15px;color:#334155;line-height:1.8;">Hey <strong>${name}</strong>! Just a quick evening check-in. Tomorrow morning you walk into a room where you'll level up your skills and take a real step forward.</p>
      <div style="background:linear-gradient(135deg,#0f172a,#1e293b);border-radius:20px;padding:28px;margin:24px 0;text-align:center;">
        <p style="font-size:16px;color:#94a3b8;margin:0 0 12px;font-style:italic;">Tonight's checklist:</p>
        <p style="font-size:15px;color:#60a5fa;margin:0 0 6px;font-weight:600;">✅ Set your alarm for early</p>
        <p style="font-size:15px;color:#60a5fa;margin:0 0 6px;font-weight:600;">✅ Charge your laptop & phone</p>
        <p style="font-size:15px;color:#60a5fa;margin:0 0 6px;font-weight:600;">✅ Get some good sleep</p>
        <p style="font-size:15px;color:#60a5fa;margin:0;font-weight:600;">✅ Come ready to learn at 10AM</p>
      </div>
      <div style="background:linear-gradient(135deg,#2563EB,#4f46e5);border-radius:16px;padding:20px;text-align:center;margin:24px 0;">
        <p style="color:#ffffff;font-size:15px;font-weight:700;margin:0;">📍 111 Newtown RD, Accra Newtown</p>
        <p style="color:#bfdbfe;font-size:13px;margin:6px 0 0;">Monday, April 20 · 10:00AM sharp</p>
      </div>
      <p style="font-size:15px;color:#334155;text-align:center;font-weight:700;">Sleep well. See you tomorrow! 🌟</p>
      <p style="font-size:14px;color:#64748b;text-align:center;">— Doctor Barns & Remote Work Hub ❤️</p>`);

    return { sms, email, subject: `🌙 Rest Up, ${name} — Big Day Tomorrow!` };
}

function msg4(name: string) {
    const sms = `Good morning ${name}! ☀️\n\nTODAY IS THE DAY! Class starts at 10:00AM.\n\nHave a good breakfast, get ready, and head to:\n📍 111 Newtown RD, Accra Newtown\n🗺 Search "Doctor Barns Tech" on Maps\n\nWe're excited to see you today! 🚀 - Remote Work Hub`;

    const email = makeEmail(name, `☀️ Good Morning — Class Today at 10AM!`, `
      <div style="text-align:center;margin-bottom:28px;">
        <div style="width:64px;height:64px;background:linear-gradient(135deg,#fef3c7,#fde68a);border-radius:50%;margin:0 auto 12px;line-height:64px;font-size:28px;">☀️</div>
        <h2 style="font-size:24px;font-weight:800;color:#0f172a;margin:0;">Good Morning, ${name}!</h2>
        <p style="color:#64748b;margin:8px 0 0;font-size:15px;">Monday, April 20, 2026 — Class Day!</p>
      </div>
      <div style="background:linear-gradient(135deg,#2563EB,#1d4ed8);border-radius:20px;padding:32px;margin:20px 0;text-align:center;">
        <p style="font-size:28px;font-weight:900;color:#ffffff;margin:0;letter-spacing:-1px;">CLASS TODAY! 🎓</p>
        <p style="font-size:16px;color:#bfdbfe;margin:10px 0 0;">Starting at <strong style="color:#ffffff;">10:00AM</strong> — arrive before!</p>
      </div>
      <p style="font-size:15px;color:#334155;line-height:1.8;">Have a good breakfast, get yourself ready, and make your way to us!</p>
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;padding:24px;margin:20px 0;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:8px 0;font-size:14px;color:#64748b;font-weight:700;">📍 Location</td>
            <td style="padding:8px 0;font-size:14px;color:#0f172a;font-weight:700;">111 Newtown RD, Accra Newtown</td>
          </tr>
          <tr>
            <td style="padding:8px 0;font-size:14px;color:#64748b;font-weight:700;">⏰ Time</td>
            <td style="padding:8px 0;font-size:14px;color:#0f172a;font-weight:700;">10:00AM sharp</td>
          </tr>
          <tr>
            <td style="padding:8px 0;font-size:14px;color:#64748b;font-weight:700;">💻 Bring</td>
            <td style="padding:8px 0;font-size:14px;color:#0f172a;font-weight:700;">Laptop + charger (if you have one)</td>
          </tr>
          <tr>
            <td style="padding:8px 0;font-size:14px;color:#64748b;font-weight:700;">📞 Directions</td>
            <td style="padding:8px 0;font-size:14px;color:#0f172a;font-weight:700;">0599 551 331</td>
          </tr>
        </table>
      </div>
      <p style="font-size:15px;color:#334155;text-align:center;font-weight:700;">Can't wait to see you today. Let's go! 🚀</p>`);

    return { sms, email, subject: "☀️ Good Morning! Class Today at 10AM!" };
}

function msg5(name: string) {
    const sms = `Hey ${name}! 🚗 Are you on your way?\n\nWe're at 111 Newtown RD, Accra Newtown — everyone is arriving!\n\n🗺 Search "Doctor Barns Tech" on Maps\nRide safely, see you very soon. Class at 10:00AM ⏰ - Remote Work Hub`;

    const email = makeEmail(name, `🚗 Are You On Your Way?`, `
      <div style="text-align:center;margin-bottom:28px;">
        <div style="width:64px;height:64px;background:linear-gradient(135deg,#d1fae5,#a7f3d0);border-radius:50%;margin:0 auto 12px;line-height:64px;font-size:28px;">🚗</div>
        <h2 style="font-size:22px;font-weight:800;color:#0f172a;margin:0;">Are You On Your Way?</h2>
        <p style="color:#64748b;margin:8px 0 0;font-size:15px;">Class starts at 10:00AM!</p>
      </div>
      <p style="font-size:15px;color:#334155;line-height:1.8;">Hi <strong>${name}</strong>! Students are arriving at 111 Newtown RD — the energy is real!</p>
      <div style="background:#f0fdf4;border:2px solid #4ade80;border-radius:16px;padding:24px;margin:20px 0;text-align:center;">
        <p style="font-size:16px;font-weight:800;color:#166534;margin:0;">If you're on your way — <span style="color:#15803d;">ride safely!</span> 🙏</p>
        <p style="font-size:14px;color:#4b7a5c;margin:10px 0 0;">We're expecting you. See you very soon!</p>
      </div>
      <div style="background:#fef3c7;border:1px solid #fcd34d;border-radius:16px;padding:20px;margin:20px 0;">
        <p style="font-size:14px;color:#92400e;font-weight:700;margin:0 0 8px;">📍 Not sure where to go?</p>
        <p style="font-size:14px;color:#78350f;margin:0;">111 Newtown RD, Accra Newtown · Search "Doctor Barns Tech" on maps · Call: <strong>0599 551 331</strong></p>
      </div>`);

    return { sms, email, subject: "🚗 Are You On Your Way? See You Soon!" };
}

function msg6(name: string) {
    const sms = `Hey ${name}! 🎓 Are you seated and ready?\n\nWe're starting class in exactly 10 MINUTES! 🔥\n\nIf you're still on your way, please hurry.\n\nLet's GO! 🚀 - Doctor Barns & Remote Work Hub`;

    const email = makeEmail(name, `🔥 Starting in 10 Minutes — Are You Ready?`, `
      <div style="text-align:center;margin-bottom:28px;">
        <div style="width:64px;height:64px;background:linear-gradient(135deg,#fee2e2,#fca5a5);border-radius:50%;margin:0 auto 12px;line-height:64px;font-size:28px;">🔥</div>
        <h2 style="font-size:24px;font-weight:800;color:#0f172a;margin:0;">We Start in 10 Minutes!</h2>
      </div>
      <div style="background:linear-gradient(135deg,#dc2626,#b91c1c);border-radius:20px;padding:32px;margin:20px 0;text-align:center;">
        <p style="font-size:32px;font-weight:900;color:#ffffff;margin:0;letter-spacing:-1px;">T-10 MINUTES 🚀</p>
        <p style="font-size:16px;color:#fca5a5;margin:10px 0 0;">Class is <strong style="color:#ffffff;">starting NOW</strong></p>
      </div>
      <p style="font-size:15px;color:#334155;line-height:1.8;">Hi <strong>${name}</strong>! Are you seated and ready? In 10 minutes we begin!</p>
      <p style="font-size:15px;color:#334155;line-height:1.8;">If you're still on your way, please hurry — we're starting promptly at 10:00AM.</p>
      <div style="background:linear-gradient(135deg,#0f172a,#1e293b);border-radius:16px;padding:24px;text-align:center;margin:24px 0;">
        <p style="font-size:18px;font-weight:800;color:#60a5fa;margin:0;">Let's build. 💻</p>
      </div>
      <p style="font-size:15px;color:#64748b;text-align:center;">— Doctor Barns & Remote Work Hub ❤️</p>`);

    return { sms, email, subject: "🔥 Starting in 10 Minutes — Are You Seated?" };
}

// ─── Email Builder ────────────────────────────────────────────────────────────

function makeEmail(name: string, headline: string, bodyContent: string): string {
    return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
<tr><td style="background:linear-gradient(135deg,#0a0a0a,#1a1a2e);padding:28px 40px;text-align:center;">
  <p style="color:#94a3b8;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:2px;margin:0 0 6px;">RWH Elite Masterclass 2026</p>
  <h1 style="color:#ffffff;font-size:20px;font-weight:800;margin:0;">${headline}</h1>
</td></tr>
<tr><td style="padding:32px 40px;">${bodyContent}</td></tr>
<tr><td style="background:#f8fafc;padding:20px 40px;text-align:center;border-top:1px solid #e2e8f0;">
  <p style="font-size:12px;color:#94a3b8;margin:0;">Remote Work Hub · 111 Newtown RD, Accra Newtown</p>
  <p style="font-size:12px;color:#94a3b8;margin:4px 0 0;">Questions? Call: 0599 551 331</p>
</td></tr>
</table></td></tr></table></body></html>`;
}

let recipients: Contact[] = [];

async function sendWave(
    waveNum: number,
    getContent: (name: string) => { sms: string; email: string; subject: string }
) {
    const { subject } = getContent("Test");
    console.log(`\n${"=".repeat(60)}`);
    console.log(`📤 WAVE ${waveNum}: ${subject}`);
    console.log(`   Sending to ${recipients.length} recipients at ${new Date().toLocaleTimeString("en-GH", { timeZone: "Africa/Accra" })}`);
    console.log("=".repeat(60));

    let emailOk = 0, emailSkip = 0, emailFail = 0, smsOk = 0, smsFail = 0;

    for (const person of recipients) {
        const { sms, email, subject } = getContent(person.first_name.trim());
        process.stdout.write(`  ${person.first_name.trim().padEnd(18)} `);

        if (person.email) {
            try {
                const { error } = await resend.emails.send({ from: FROM, to: person.email, subject, html: email });
                if (error) throw new Error(error.message);
                process.stdout.write("✅ email  ");
                emailOk++;
            } catch {
                process.stdout.write(`❌ email  `);
                emailFail++;
            }
            await delay(400);
        } else {
            process.stdout.write("⚠️  no email  ");
            emailSkip++;
        }

        const res = await SmsAdapter.send({ to: person.phone, message: sms });
        if (res.success) { process.stdout.write("✅ sms\n"); smsOk++; }
        else { process.stdout.write(`❌ sms(${res.error?.slice(0, 25)})\n`); smsFail++; }
        await delay(200);
    }

    const total = recipients.length;
    console.log(`\n  ✅ Wave ${waveNum} done → Email: ${emailOk}/${total - emailSkip}  SMS: ${smsOk}/${total}\n`);
}

function delay(ms: number) { return new Promise(r => setTimeout(r, ms)); }

function msUntil(targetDate: Date): number {
    return Math.max(0, targetDate.getTime() - Date.now());
}

function scheduleAt(targetDate: Date, label: string, fn: () => Promise<void>) {
    const ms = msUntil(targetDate);
    const timeStr = targetDate.toLocaleTimeString("en-GH", { timeZone: "Africa/Accra", hour: "2-digit", minute: "2-digit" });
    if (ms <= 0) {
        console.log(`⚡ ${label} is due now — sending immediately`);
        fn();
    } else {
        const mins = Math.round(ms / 60000);
        console.log(`⏰ ${label} scheduled for ${timeStr} Ghana time (in ~${mins} min)`);
        setTimeout(fn, ms);
    }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
    if (!process.env.RESEND_API_KEY) {
        console.error("❌ Missing RESEND_API_KEY"); process.exit(1);
    }

    if (process.env.USE_DATABASE === "1" || process.env.USE_DATABASE === "true") {
        console.log("\n📂 Loading enrolled students from Supabase...");
        recipients = await getStudentsFromDb();
        console.log(`   → ${recipients.length} students loaded\n`);
    } else {
        console.error("❌ Please run with USE_DATABASE=1 to load students from DB");
        process.exit(1);
    }

    const onlyWaves = process.env.ONLY_WAVES?.split(",").map(w => parseInt(w.trim(), 10)).filter(n => n >= 1 && n <= 6) ?? [];

    if (onlyWaves.length > 0) {
        console.log(`\n🚀 Sending Wave(s): ${onlyWaves.join(", ")} to ${recipients.length} students\n`);
        if (onlyWaves.includes(1)) await sendWave(1, msg1);
        if (onlyWaves.includes(2)) await sendWave(2, msg2);
        if (onlyWaves.includes(3)) await sendWave(3, msg3);
        if (onlyWaves.includes(4)) await sendWave(4, msg4);
        if (onlyWaves.includes(5)) await sendWave(5, msg5);
        if (onlyWaves.includes(6)) await sendWave(6, msg6);
        console.log("\n✅ Done.\n");
        return;
    }

    // Full schedule mode
    const now = new Date();
    const apr20_6am   = new Date("2026-04-20T06:00:00Z");
    const apr20_8am   = new Date("2026-04-20T08:00:00Z");
    const apr20_945am = new Date("2026-04-20T09:45:00Z");

    console.log("\n🚀 CLASS REMINDER MESSAGING SCHEDULER");
    console.log("==========================================");
    console.log(`Now (Ghana): ${now.toLocaleString("en-GH", { timeZone: "Africa/Accra" })}`);
    console.log(`\n📅 Schedule:`);
    console.log(`  Wave 4 — 6:00AM  Apr 20     → Good morning`);
    console.log(`  Wave 5 — 8:00AM  Apr 20     → Are you on your way?`);
    console.log(`  Wave 6 — 9:45AM  Apr 20     → Starting in 10 mins!`);
    console.log(`\n${recipients.length} students will receive each wave via email + SMS.\n`);

    scheduleAt(apr20_6am,   "Wave 4 (good morning)",     () => sendWave(4, msg4));
    scheduleAt(apr20_8am,   "Wave 5 (on your way?)",     () => sendWave(5, msg5));
    scheduleAt(apr20_945am, "Wave 6 (starting in 10!)",  () => sendWave(6, msg6));

    const lastMs = msUntil(apr20_945am) + 5 * 60 * 1000;
    console.log(`\n⏳ Process will stay alive until all 6 waves are sent (~${Math.round(lastMs / 3600000)} hrs).\n`);
}

main().catch(console.error);
