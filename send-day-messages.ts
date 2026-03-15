/**
 * Masterclass Day Messaging Scheduler
 * Sends 6 waves of SMS + Email to all enrolled students.
 *
 * Schedule (Ghana time = UTC+0):
 *   Message 1 — NOW          — Location & directions
 *   Message 2 — +30 min      — Bring your laptop
 *   Message 3 — +60 min      — Congratulations in advance
 *   Message 4 — 6:00 AM Mar 16 — Good morning, get ready
 *   Message 5 — 8:00 AM Mar 16 — Are you on your way?
 *   Message 6 — 9:45 AM Mar 16 — Seated? Starting in 10 mins!
 *
 * Run: npx tsx send-day-messages.ts
 */
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { Resend } from "resend";
import { SmsAdapter } from "./src/lib/sms-adapter";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = `Remote Work Hub <${process.env.EMAIL_FROM || "onboarding@resend.dev"}>`;
const LOGIN_URL = "https://remoteworkhub.org/student";

const students = [
    { first_name: "Dela", email: "delaamezah@gmail.com", phone: "0201322740" },
    { first_name: "Emmanuel", email: "anyimahemma.001@gmail.com", phone: "+233535029108" },
    { first_name: "Emmanuella", email: "airllarackon@icloud.com", phone: "0506640015" },
    { first_name: "Erica Angela", email: "angelatakyiwaa93@gmail.com", phone: "0598118600" },
    { first_name: "Ethel", email: "ethelafful4@gmail.com", phone: "07770198045" },
    { first_name: "Eunice", email: "yeunice158@gmail.com", phone: "0247259558" },
    { first_name: "Georgina", email: "gina.appiah1@icloud.com", phone: "+233257232210" },
    { first_name: "Gilbert", email: "gilbertessuman@gmail.com", phone: "+233578066952" },
    { first_name: "Jessica", email: "kayjessica239@gmail.com", phone: "0594075733" },
    { first_name: "Jessica", email: "jessicalarteyvi07@gmail.com", phone: "0531588139" },
    { first_name: "Jessica Ama", email: "jessicaamadarkoayedu@gmail.com", phone: "0243447192" },
    { first_name: "Maxwell", email: "kojoblins238@gmail.com", phone: "0593518263" },
    { first_name: "Prince", email: "annanprinceofori@yahoo.com", phone: "0203413984" },
    { first_name: "Princess", email: "Earldwara@gmail.com", phone: "+233248907887" },
    { first_name: "Saviour", email: "winningofcourse007@gmail.com", phone: "0548831566" },
    { first_name: "Steward", email: "stewardmoore22@gmail.com", phone: "+233543111607" },
    { first_name: "Susana", email: "suzannuella@gmail.com", phone: "0559591823" },
    { first_name: "Taufic", email: "Tauficbashir785@gmail.com", phone: "0598353266" },
];

// ─── Message Templates ───────────────────────────────────────────────────────

function msg1(name: string) {
    const sms = `Hi ${name}! 📍 The RWH Masterclass is TOMORROW at 10:00AM sharp!\n\nLocation: 111 Newtown RD, Accra Newtown.\n🗺 Search "Doctor Barns Tech" on Google Maps, Bolt or Uber.\n🚕 From Circle: take a Newtown car, stop at ADB Bank.\n📞 Need directions? Call: 0599551331\n\nPlease arrive BEFORE 10:00AM. See you tomorrow! 🚀 - Remote Work Hub`;

    const email = makeEmail(name, `📍 See You Tomorrow — Here's How to Find Us`, `
      <div style="text-align:center;margin-bottom:28px;">
        <div style="width:64px;height:64px;background:linear-gradient(135deg,#dbeafe,#bfdbfe);border-radius:50%;margin:0 auto 12px;line-height:64px;font-size:28px;">📍</div>
        <h2 style="font-size:22px;font-weight:800;color:#0f172a;margin:0;">The Masterclass is TOMORROW!</h2>
        <p style="color:#64748b;margin:8px 0 0;font-size:15px;">Monday, March 16 · 10:00AM sharp</p>
      </div>
      <p style="font-size:15px;color:#334155;line-height:1.7;">Hi <strong>${name}</strong>! We're so excited to see you tomorrow. Here's everything you need to get to us:</p>
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
        <p style="color:#bfdbfe;font-size:13px;margin:6px 0 0;">We'll be starting promptly. Don't be late!</p>
      </div>
      <p style="font-size:14px;color:#64748b;text-align:center;">See you tomorrow! Can't wait 🚀</p>`);

    return { sms, email, subject: "📍 Masterclass Tomorrow — Location & Directions" };
}

function msg2(name: string) {
    const sms = `Hey ${name}! 💻 Quick reminder for tomorrow's RWH Masterclass:\n\nIf you have a LAPTOP — please bring it! We'll be coding hands-on from day one.\n\nDon't have one? No worries, we'll sort you out. Just come ready to learn!\n\nSee you at 10:00AM. 111 Newtown RD, Accra Newtown 🚀 - Remote Work Hub`;

    const email = makeEmail(name, `💻 Don't Forget Your Laptop Tomorrow!`, `
      <div style="text-align:center;margin-bottom:28px;">
        <div style="width:64px;height:64px;background:linear-gradient(135deg,#d1fae5,#a7f3d0);border-radius:50%;margin:0 auto 12px;line-height:64px;font-size:28px;">💻</div>
        <h2 style="font-size:22px;font-weight:800;color:#0f172a;margin:0;">Bring Your Laptop!</h2>
      </div>
      <p style="font-size:15px;color:#334155;line-height:1.7;">Hi <strong>${name}</strong>! Just a quick but important reminder for tomorrow:</p>
      <div style="background:#f0fdf4;border:2px solid #4ade80;border-radius:16px;padding:24px;margin:20px 0;text-align:center;">
        <p style="font-size:18px;font-weight:800;color:#166534;margin:0;">🖥 If you have a laptop — <span style="color:#15803d;">BRING IT!</span></p>
        <p style="font-size:14px;color:#4b7a5c;margin:10px 0 0;">We'll be building real things from day one. Hands on the keyboard from hour one.</p>
      </div>
      <div style="background:#fef3c7;border:1px solid #fcd34d;border-radius:16px;padding:20px;margin:20px 0;">
        <p style="font-size:14px;color:#92400e;font-weight:600;margin:0;">💡 <strong>No laptop?</strong> Don't worry — just come! We'll make sure no one is left behind. Bring yourself, your energy, and your willingness to learn.</p>
      </div>
      <div style="background:linear-gradient(135deg,#2563EB,#4f46e5);border-radius:16px;padding:20px;text-align:center;margin:24px 0;">
        <p style="color:#ffffff;font-size:15px;font-weight:700;margin:0;">📍 111 Newtown RD, Accra Newtown</p>
        <p style="color:#bfdbfe;font-size:13px;margin:6px 0 0;">Tomorrow · Monday March 16 · 10:00AM</p>
      </div>`);

    return { sms, email, subject: "💻 Don't Forget Your Laptop — Masterclass Tomorrow" };
}

function msg3(name: string) {
    const sms = `${name}, CONGRATULATIONS in advance! 🎉\n\nYou made a decision that will change your life. Tomorrow you begin your journey to becoming a professional web developer — and we couldn't be prouder.\n\nSleep well tonight. Come fresh, come hungry, come ready to BUILD.\n\nWe'll see you at 10:00AM tomorrow. 🚀\n\n- Doctor Barns & The Remote Work Hub Team`;

    const email = makeEmail(name, `🎉 Congratulations in Advance, ${name}!`, `
      <div style="text-align:center;margin-bottom:28px;">
        <div style="width:64px;height:64px;background:linear-gradient(135deg,#fef9c3,#fde68a);border-radius:50%;margin:0 auto 12px;line-height:64px;font-size:28px;">🎉</div>
        <h2 style="font-size:22px;font-weight:800;color:#0f172a;margin:0;">Congratulations, ${name}!</h2>
        <p style="color:#64748b;margin:8px 0 0;font-size:15px;">Your journey begins tomorrow.</p>
      </div>
      <p style="font-size:15px;color:#334155;line-height:1.8;">You did something most people only talk about — <strong>you actually signed up and showed up.</strong> That alone puts you ahead of 99% of people.</p>
      <p style="font-size:15px;color:#334155;line-height:1.8;">Tomorrow you walk into a room where you'll learn to build real web applications, work on real products, and take the first real step toward a tech career — and potentially a paid internship at Doctor Barns Tech.</p>
      <div style="background:linear-gradient(135deg,#0f172a,#1e293b);border-radius:20px;padding:28px;margin:24px 0;text-align:center;">
        <p style="font-size:16px;color:#94a3b8;margin:0 0 8px;font-style:italic;">"The best time to plant a tree was 20 years ago.</p>
        <p style="font-size:16px;color:#94a3b8;margin:0 0 16px;font-style:italic;">The second best time is <strong style="color:#60a5fa;">tomorrow morning at 10am.</strong>"</p>
        <p style="font-size:13px;color:#475569;margin:0;">— Doctor Barns</p>
      </div>
      <p style="font-size:15px;color:#334155;line-height:1.8;">Sleep well tonight, ${name}. Come fresh, come hungry, come <strong>ready to build</strong>. We cannot wait to see what you create.</p>
      <div style="background:linear-gradient(135deg,#2563EB,#4f46e5);border-radius:16px;padding:20px;text-align:center;margin:24px 0;">
        <p style="color:#ffffff;font-size:15px;font-weight:700;margin:0;">📍 111 Newtown RD, Accra Newtown</p>
        <p style="color:#bfdbfe;font-size:13px;margin:6px 0 0;">Tomorrow · Monday March 16 · 10:00AM sharp</p>
      </div>
      <p style="font-size:15px;color:#334155;text-align:center;font-weight:700;">See you there. Let's build. 🚀</p>
      <p style="font-size:14px;color:#64748b;text-align:center;">— Doctor Barns & The Remote Work Hub Team ❤️</p>`);

    return { sms, email, subject: `🎉 Congratulations in Advance, ${name}! Tomorrow is your day.` };
}

function msg4(name: string) {
    const sms = `Good morning ${name}! ☀️\n\nTODAY IS THE DAY! The RWH Elite Web Dev Masterclass starts at 10:00AM.\n\nHave a good breakfast, get dressed, and head to:\n📍 111 Newtown RD, Accra Newtown\n\nWe're SO excited to see you today! 🚀 - Remote Work Hub`;

    const email = makeEmail(name, `☀️ Good Morning — TODAY IS THE DAY!`, `
      <div style="text-align:center;margin-bottom:28px;">
        <div style="width:64px;height:64px;background:linear-gradient(135deg,#fef3c7,#fde68a);border-radius:50%;margin:0 auto 12px;line-height:64px;font-size:28px;">☀️</div>
        <h2 style="font-size:24px;font-weight:800;color:#0f172a;margin:0;">Good Morning, ${name}!</h2>
        <p style="color:#64748b;margin:8px 0 0;font-size:15px;">Today is the day. March 16, 2026.</p>
      </div>
      <div style="background:linear-gradient(135deg,#2563EB,#1d4ed8);border-radius:20px;padding:32px;margin:20px 0;text-align:center;">
        <p style="font-size:28px;font-weight:900;color:#ffffff;margin:0;letter-spacing:-1px;">TODAY IS THE DAY! 🎓</p>
        <p style="font-size:16px;color:#bfdbfe;margin:10px 0 0;">The RWH Elite Web Development & SaaS Masterclass begins at <strong style="color:#ffffff;">10:00AM</strong></p>
      </div>
      <p style="font-size:15px;color:#334155;line-height:1.8;">Have a good breakfast, get yourself ready, and make your way to us. We've been preparing to give you the best possible day 1!</p>
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;padding:24px;margin:20px 0;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:8px 0;font-size:14px;color:#64748b;font-weight:700;">📍 Location</td>
            <td style="padding:8px 0;font-size:14px;color:#0f172a;font-weight:700;">111 Newtown RD, Accra Newtown</td>
          </tr>
          <tr>
            <td style="padding:8px 0;font-size:14px;color:#64748b;font-weight:700;">⏰ Time</td>
            <td style="padding:8px 0;font-size:14px;color:#0f172a;font-weight:700;">10:00AM sharp (arrive before!)</td>
          </tr>
          <tr>
            <td style="padding:8px 0;font-size:14px;color:#64748b;font-weight:700;">💻 Bring</td>
            <td style="padding:8px 0;font-size:14px;color:#0f172a;font-weight:700;">Laptop (if you have one)</td>
          </tr>
          <tr>
            <td style="padding:8px 0;font-size:14px;color:#64748b;font-weight:700;">📞 Directions</td>
            <td style="padding:8px 0;font-size:14px;color:#0f172a;font-weight:700;">0599 551 331</td>
          </tr>
        </table>
      </div>
      <p style="font-size:15px;color:#334155;text-align:center;font-weight:700;">We can't wait to see you today. Let's go! 🚀</p>`);

    return { sms, email, subject: "☀️ Good Morning! Today is the Day — Masterclass at 10AM!" };
}

function msg5(name: string) {
    const sms = `Hey ${name}! 🚗 Are you on your way to the RWH Masterclass?\n\nWe're at 111 Newtown RD, Accra Newtown — everyone is getting ready and the excitement is real!\n\nRide safely, we'll see you very soon. Class starts at 10:00AM ⏰ - Remote Work Hub`;

    const email = makeEmail(name, `🚗 Are You On Your Way?`, `
      <div style="text-align:center;margin-bottom:28px;">
        <div style="width:64px;height:64px;background:linear-gradient(135deg,#d1fae5,#a7f3d0);border-radius:50%;margin:0 auto 12px;line-height:64px;font-size:28px;">🚗</div>
        <h2 style="font-size:22px;font-weight:800;color:#0f172a;margin:0;">Are You On Your Way?</h2>
        <p style="color:#64748b;margin:8px 0 0;font-size:15px;">Class starts at 10:00AM!</p>
      </div>
      <p style="font-size:15px;color:#334155;line-height:1.8;">Hi <strong>${name}</strong>! The energy at 111 Newtown RD is building up — students are arriving, laptops are being set up, and the learning is about to begin!</p>
      <div style="background:#f0fdf4;border:2px solid #4ade80;border-radius:16px;padding:24px;margin:20px 0;text-align:center;">
        <p style="font-size:16px;font-weight:800;color:#166534;margin:0;">If you're on your way — <span style="color:#15803d;">ride safely!</span> 🙏</p>
        <p style="font-size:14px;color:#4b7a5c;margin:10px 0 0;">We're expecting you. See you very soon!</p>
      </div>
      <div style="background:#fef3c7;border:1px solid #fcd34d;border-radius:16px;padding:20px;margin:20px 0;">
        <p style="font-size:14px;color:#92400e;font-weight:700;margin:0 0 8px;">📍 Not sure where to go?</p>
        <p style="font-size:14px;color:#78350f;margin:0;">111 Newtown RD, Accra Newtown · Search "Doctor Barns Tech" on maps · Call: <strong>0599 551 331</strong></p>
      </div>`);

    return { sms, email, subject: "🚗 Are You On Your Way? See You Very Soon!" };
}

function msg6(name: string) {
    const sms = `Hey ${name}! 🎓 Are you seated and ready?\n\nWe're starting the RWH Elite Web Dev Masterclass in exactly 10 MINUTES! 🔥\n\nIf you're still on your way, please hurry — this is the moment you've been waiting for.\n\nLet's GO! 🚀 - Doctor Barns & Remote Work Hub`;

    const email = makeEmail(name, `🔥 Starting in 10 Minutes — Are You Ready?`, `
      <div style="text-align:center;margin-bottom:28px;">
        <div style="width:64px;height:64px;background:linear-gradient(135deg,#fee2e2,#fca5a5);border-radius:50%;margin:0 auto 12px;line-height:64px;font-size:28px;">🔥</div>
        <h2 style="font-size:24px;font-weight:800;color:#0f172a;margin:0;">We Start in 10 Minutes!</h2>
      </div>
      <div style="background:linear-gradient(135deg,#dc2626,#b91c1c);border-radius:20px;padding:32px;margin:20px 0;text-align:center;">
        <p style="font-size:32px;font-weight:900;color:#ffffff;margin:0;letter-spacing:-1px;">T-10 MINUTES 🚀</p>
        <p style="font-size:16px;color:#fca5a5;margin:10px 0 0;">The RWH Elite Web Dev Masterclass is <strong style="color:#ffffff;">starting NOW</strong></p>
      </div>
      <p style="font-size:15px;color:#334155;line-height:1.8;">Hi <strong>${name}</strong>! Are you seated and ready? This is the moment you invested in, the moment you've been waiting for.</p>
      <p style="font-size:15px;color:#334155;line-height:1.8;">In 10 minutes, you'll write your first line of code (if you haven't already), meet your cohort, and begin 30 days that will change everything.</p>
      <div style="background:linear-gradient(135deg,#0f172a,#1e293b);border-radius:16px;padding:24px;text-align:center;margin:24px 0;">
        <p style="font-size:18px;font-weight:800;color:#60a5fa;margin:0;">Today you become a developer. Let's build. 💻</p>
      </div>
      <p style="font-size:15px;color:#64748b;text-align:center;">— Doctor Barns & The Remote Work Hub Team ❤️</p>`);

    return { sms, email, subject: "🔥 Starting in 10 Minutes — Are You Seated and Ready?" };
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

// ─── Send a single wave ───────────────────────────────────────────────────────

async function sendWave(
    waveNum: number,
    getContent: (name: string) => { sms: string; email: string; subject: string }
) {
    const { subject } = getContent("Test");
    console.log(`\n${"=".repeat(60)}`);
    console.log(`📤 WAVE ${waveNum}: ${subject}`);
    console.log(`   Sending to ${students.length} students at ${new Date().toLocaleTimeString("en-GH", { timeZone: "Africa/Accra" })}`);
    console.log("=".repeat(60));

    let emailOk = 0, emailFail = 0, smsOk = 0, smsFail = 0;

    for (const student of students) {
        const { sms, email, subject } = getContent(student.first_name.trim());
        process.stdout.write(`  ${student.first_name.trim().padEnd(18)} `);

        // Email
        try {
            const { error } = await resend.emails.send({ from: FROM, to: student.email, subject, html: email });
            if (error) throw new Error(error.message);
            process.stdout.write("✅ email  ");
            emailOk++;
        } catch (e: any) {
            process.stdout.write(`❌ email  `);
            emailFail++;
        }
        await delay(400);

        // SMS
        const res = await SmsAdapter.send({ to: student.phone, message: sms });
        if (res.success) { process.stdout.write("✅ sms\n"); smsOk++; }
        else { process.stdout.write(`❌ sms(${res.error?.slice(0,25)})\n`); smsFail++; }
        await delay(200);
    }

    console.log(`\n  ✅ Wave ${waveNum} done → Email: ${emailOk}/${students.length}  SMS: ${smsOk}/${students.length}\n`);
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

    const now = new Date();
    const wave1Time = now; // Send now
    const wave2Time = new Date(now.getTime() + 30 * 60 * 1000);  // +30 min
    const wave3Time = new Date(now.getTime() + 60 * 60 * 1000);  // +60 min

    // Tomorrow absolute times (UTC = Ghana time)
    const mar16_6am  = new Date("2026-03-16T06:00:00Z");
    const mar16_8am  = new Date("2026-03-16T08:00:00Z");
    const mar16_945am = new Date("2026-03-16T09:45:00Z");

    console.log("\n🚀 RWH MASTERCLASS DAY MESSAGING SCHEDULER");
    console.log("==========================================");
    console.log(`Now (Ghana): ${now.toLocaleString("en-GH", { timeZone: "Africa/Accra" })}`);
    console.log(`\n📅 Scheduled send times:`);
    console.log(`  Wave 1 — NOW            → Location & directions`);
    console.log(`  Wave 2 — +30 min        → Bring your laptop`);
    console.log(`  Wave 3 — +60 min        → Congratulations in advance`);
    console.log(`  Wave 4 — 6:00AM  Mar 16 → Good morning`);
    console.log(`  Wave 5 — 8:00AM  Mar 16 → Are you on your way?`);
    console.log(`  Wave 6 — 9:45AM  Mar 16 → Seated? Starting in 10 mins`);
    console.log(`\n${students.length} students will receive each wave via email + SMS.\n`);

    // Send all waves (will block on wave 1 then schedule the rest)
    await sendWave(1, msg1);

    scheduleAt(wave2Time, "Wave 2 (laptop reminder)", () => sendWave(2, msg2));
    scheduleAt(wave3Time, "Wave 3 (congratulations)", () => sendWave(3, msg3));
    scheduleAt(mar16_6am,  "Wave 4 (good morning)",    () => sendWave(4, msg4));
    scheduleAt(mar16_8am,  "Wave 5 (on your way)",     () => sendWave(5, msg5));
    scheduleAt(mar16_945am,"Wave 6 (seated? 10 mins)", () => sendWave(6, msg6));

    // Keep process alive until all waves are done
    const lastMs = msUntil(mar16_945am) + 5 * 60 * 1000;
    console.log(`\n⏳ Process will stay alive until all 6 waves are sent (~${Math.round(lastMs/3600000)} hrs).\n`);
}

main().catch(console.error);
