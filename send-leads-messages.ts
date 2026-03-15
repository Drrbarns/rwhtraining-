/**
 * Marketing Message Scheduler — Non-Enrolled Leads
 * Sends 5 waves of SMS + Email to leads who haven't enrolled yet.
 *
 * Schedule (Ghana time = UTC+0):
 *   Wave 1 — NOW          — Exclusive guest invitation to FIRST CLASS
 *   Wave 2 — +45 min      — Last chance to secure a seat (GHS 200)
 *   Wave 3 — 6:00AM Mar 16 — Good morning, your guest spot is waiting
 *   Wave 4 — 8:00AM Mar 16 — Are you on your way?
 *   Wave 5 — 9:45AM Mar 16 — Get in here! Starting in 10 mins
 *
 * Run: npx tsx send-leads-messages.ts
 */
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { Resend } from "resend";
import { SmsAdapter } from "./src/lib/sms-adapter";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = `Doctor Barns <${process.env.EMAIL_FROM || "onboarding@resend.dev"}>`;
const APPLY_URL = "https://remoteworkhub.org/apply";

// Clean, de-duped list of non-enrolled leads only
// - Excludes already enrolled students (they have separate messaging)
// - Excludes Doctor Barns's own accounts
// - Excludes fake/invalid phone numbers
const leads = [
    { first_name: "Abena",           email: "abena37@gmail.com",                phone: "0506254041" },
    { first_name: "Ernest",          email: "abenaetornam1@gmail.com",           phone: "0544510928" },
    { first_name: "Sarah",           email: "adzahcorm@gmail.com",               phone: "0543059843" },
    { first_name: "Deborah",         email: "agyapongd340@gmail.com",            phone: "0535598662" },
    { first_name: "Nana Yeboah",     email: "boatengnanayeboah19@gmail.com",     phone: "0200651326" },
    { first_name: "Edward",          email: "danquaheddie@gmail.com",            phone: "0553848495" },
    { first_name: "Donald",          email: "donaldakpagana47@gmail.com",        phone: "+233538730683" },
    { first_name: "Timothy",         email: "enusimpson@gmail.com",              phone: "0239403322" },
    { first_name: "Esther",          email: "ey93202@gmail.com",                 phone: "0591060322" },
    { first_name: "Christopher",     email: "hitsonjason3@gmail.com",            phone: "0539569336" },
    { first_name: "Ida",             email: "idahosa242@gmail.com",              phone: "+233203386344" },
    { first_name: "Joseph",          email: "issakajoseph880@gmail.com",         phone: "0594158528" },
    { first_name: "Kingsford",       email: "kingsfordkwakye66@gmail.com",       phone: "+233549598881" },
    { first_name: "Maxwell",         email: null,                                phone: "+233593510263" }, // typo in email, SMS only
    { first_name: "Nathaniel",       email: "Nathanielalexis37@gmail.com",       phone: "0556454612" },
    { first_name: "Emmanuel",        email: "Opizarotech2006@gmail.com",         phone: "0535653506" },
    { first_name: "Tulasi",          email: "pearltulasi123@gmail.com",          phone: "+233593999741" },
    { first_name: "Precious",        email: "preciousopongyamfuaa@gmail.com",    phone: "+233242641449" },
    { first_name: "Isaac",           email: "sasuisaac332@gmail.com",            phone: "0535507304" },
    { first_name: "Einstein",        email: "stvintel@gmail.com",                phone: "0547045441" },
    { first_name: "Kelvin",          email: "tenisinclair19@gmail.com",          phone: "+233549883612" },
];

// ─── Message Templates ────────────────────────────────────────────────────────

function msg1(name: string) {
    const sms = `Hi ${name}! 🌟 Doctor Barns here.

I went through our list personally and I've selected YOU for an exclusive guest seat at the FIRST CLASS of the RWH Elite Web Dev Masterclass — tomorrow, completely free. No payment, no commitment.

Come experience day one, see what it's really about, and decide for yourself.

📍 111 Newtown RD, Accra Newtown
🗺 Search "Doctor Barns Tech" on Google Maps, Bolt or Uber
📞 Directions: 0599551331
⏰ Mon March 16 · 10:00AM

This is for you only. I want you in that room. 🚀 - Doctor Barns`;

    const email = makeEmail(name, `🌟 ${name}, You've Been Personally Selected — Exclusive Invitation`, `
      <div style="text-align:center;margin-bottom:28px;">
        <div style="width:64px;height:64px;background:linear-gradient(135deg,#fef9c3,#fde68a);border-radius:50%;margin:0 auto 12px;line-height:64px;font-size:28px;">🌟</div>
        <h2 style="font-size:22px;font-weight:800;color:#0f172a;margin:0;">You've Been Personally Selected</h2>
        <p style="color:#64748b;margin:8px 0 0;">A personal message from Doctor Barns</p>
      </div>

      <p style="font-size:15px;color:#334155;line-height:1.8;">Hi <strong>${name}</strong>,</p>
      <p style="font-size:15px;color:#334155;line-height:1.8;">I personally went through every single person who showed interest in the RWH Elite Web Dev Masterclass — and I handpicked a very small group of people I believe <em>deserve</em> to experience this first.</p>
      <p style="font-size:15px;color:#334155;line-height:1.8;"><strong>You're one of them.</strong></p>

      <div style="background:linear-gradient(135deg,#0f172a,#1e293b);border-radius:20px;padding:28px;margin:24px 0;text-align:center;border:1px solid #334155;">
        <p style="font-size:13px;color:#60a5fa;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 10px;">Your Exclusive Invitation</p>
        <p style="font-size:18px;font-weight:800;color:#ffffff;margin:0 0 8px;">A FREE guest seat at the First Class</p>
        <p style="font-size:14px;color:#94a3b8;margin:0;">No payment. No commitment. Just come and see.</p>
      </div>

      <p style="font-size:15px;color:#334155;line-height:1.8;">Come to the first day of the <strong>2026 Elite Web Development & SaaS Masterclass</strong>, experience the energy and the learning, meet the cohort — and make your decision after you've seen it for yourself.</p>

      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;padding:24px;margin:24px 0;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="padding:8px 0;font-size:14px;color:#64748b;font-weight:700;width:110px;">📍 Location</td><td style="padding:8px 0;font-size:14px;color:#0f172a;font-weight:700;">111 Newtown RD, Accra Newtown</td></tr>
          <tr><td style="padding:8px 0;font-size:14px;color:#64748b;font-weight:700;">🗺 Find Us</td><td style="padding:8px 0;font-size:14px;color:#0f172a;">Search <strong>"Doctor Barns Tech"</strong> on Google Maps, Bolt or Uber</td></tr>
          <tr><td style="padding:8px 0;font-size:14px;color:#64748b;font-weight:700;">🚕 From Circle</td><td style="padding:8px 0;font-size:14px;color:#0f172a;">Take a Newtown car → stop at <strong>ADB Bank</strong></td></tr>
          <tr><td style="padding:8px 0;font-size:14px;color:#64748b;font-weight:700;">📞 Directions</td><td style="padding:8px 0;font-size:14px;color:#0f172a;font-weight:800;letter-spacing:1px;">0599 551 331</td></tr>
          <tr><td style="padding:8px 0;font-size:14px;color:#64748b;font-weight:700;">⏰ Time</td><td style="padding:8px 0;font-size:14px;color:#0f172a;font-weight:700;">Monday, March 16 · Arrive before 10:00AM</td></tr>
        </table>
      </div>

      <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;padding:16px 20px;margin:20px 0;">
        <p style="font-size:14px;color:#1e40af;font-weight:600;margin:0;">💡 If you want to make it official before tomorrow, you can secure your seat with just a <strong>GHS 200 deposit</strong> at <a href="${APPLY_URL}" style="color:#2563EB;">${APPLY_URL}</a></p>
      </div>

      <p style="font-size:15px;color:#334155;line-height:1.8;">I don't extend this invitation to everyone. I'm extending it to you because I think you're ready.</p>
      <p style="font-size:15px;color:#334155;">See you tomorrow. 🚀</p>
      <p style="font-size:14px;color:#64748b;font-weight:700;">— Doctor Barns</p>
    `);

    return { sms, email, subject: `🌟 ${name}, A Personal Invitation from Doctor Barns` };
}

function msg2(name: string) {
    const sms = `Hey ${name}! If you want to officially lock in your seat before tomorrow, you can start with just GHS 200 tonight.

👉 ${APPLY_URL} — takes 5 mins.

Or just show up tomorrow as my guest. Either way, I want you there. 💪

📍 111 Newtown RD, Accra Newtown · 10:00AM Mon
- Doctor Barns`;

    const email = makeEmail(name, `⚡ Lock In Your Seat Tonight — Just GHS 200`, `
      <div style="text-align:center;margin-bottom:28px;">
        <div style="width:64px;height:64px;background:linear-gradient(135deg,#dbeafe,#bfdbfe);border-radius:50%;margin:0 auto 12px;line-height:64px;font-size:28px;">⚡</div>
        <h2 style="font-size:22px;font-weight:800;color:#0f172a;margin:0;">Make It Official Tonight</h2>
      </div>
      <p style="font-size:15px;color:#334155;line-height:1.8;">Hi <strong>${name}</strong>! If you want to officially secure your full seat in the cohort before tomorrow, you can lock it in right now with just a <strong>GHS 200 deposit</strong>.</p>
      <div style="text-align:center;margin:28px 0;">
        <a href="${APPLY_URL}" style="display:inline-block;background:#2563EB;color:#ffffff;padding:16px 40px;border-radius:12px;text-decoration:none;font-weight:700;font-size:15px;">Secure My Seat — GHS 200 →</a>
      </div>
      <p style="font-size:14px;color:#64748b;text-align:center;">Takes less than 5 minutes. Or just show up tomorrow as my guest — either way, I want you there. 💪</p>
      <p style="font-size:14px;color:#64748b;text-align:center;font-weight:600;">— Doctor Barns</p>
    `);

    return { sms, email, subject: `⚡ ${name}, Secure Your Seat Tonight — GHS 200 Deposit` };
}

function msg3(name: string) {
    const sms = `Good morning ${name}! ☀️

Today is the day. Your exclusive guest spot at the RWH Masterclass is waiting for you.

We start at 10:00AM — make sure you leave early!

📍 111 Newtown RD, Accra Newtown
🗺 Search "Doctor Barns Tech" on Google Maps
📞 Directions: 0599551331

Come! I'm expecting you. 🚀 - Doctor Barns`;

    const email = makeEmail(name, `☀️ Good Morning ${name} — Your Guest Spot is Waiting!`, `
      <div style="text-align:center;margin-bottom:28px;">
        <div style="width:64px;height:64px;background:linear-gradient(135deg,#fef3c7,#fde68a);border-radius:50%;margin:0 auto 12px;line-height:64px;font-size:28px;">☀️</div>
        <h2 style="font-size:22px;font-weight:800;color:#0f172a;margin:0;">Good Morning, ${name}!</h2>
        <p style="color:#64748b;margin:8px 0 0;font-size:15px;">Today is the day. Monday, March 16.</p>
      </div>
      <p style="font-size:15px;color:#334155;line-height:1.8;">Your exclusive guest seat at the <strong>RWH Elite Web Dev Masterclass</strong> is waiting. This is the moment — come and experience what everyone's talking about.</p>
      <div style="background:linear-gradient(135deg,#2563EB,#1d4ed8);border-radius:16px;padding:24px;margin:20px 0;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="padding:6px 0;font-size:14px;color:#bfdbfe;font-weight:700;">📍 Location</td><td style="padding:6px 0;font-size:14px;color:#ffffff;font-weight:700;">111 Newtown RD, Accra Newtown</td></tr>
          <tr><td style="padding:6px 0;font-size:14px;color:#bfdbfe;font-weight:700;">⏰ Time</td><td style="padding:6px 0;font-size:14px;color:#ffffff;font-weight:700;">10:00AM sharp (arrive before!)</td></tr>
          <tr><td style="padding:6px 0;font-size:14px;color:#bfdbfe;font-weight:700;">📞 Call</td><td style="padding:6px 0;font-size:14px;color:#ffffff;font-weight:700;">0599 551 331</td></tr>
        </table>
      </div>
      <p style="font-size:14px;color:#64748b;text-align:center;font-weight:600;">I'm expecting you there. Let's go! 🚀 — Doctor Barns</p>
    `);

    return { sms, email, subject: `☀️ Good Morning ${name} — Your Guest Spot Awaits at 10AM Today!` };
}

function msg4(name: string) {
    const sms = `Hey ${name}! 🚗 Are you heading to the RWH Masterclass?

We're at 111 Newtown RD, Accra Newtown. Students are pouring in and the room is buzzing!

Ride safely and we'll see you soon. Class starts at 10:00AM sharp ⏰ - Doctor Barns`;

    const email = makeEmail(name, `🚗 ${name}, Are You On Your Way?`, `
      <div style="text-align:center;margin-bottom:28px;">
        <div style="width:64px;height:64px;background:linear-gradient(135deg,#d1fae5,#a7f3d0);border-radius:50%;margin:0 auto 12px;line-height:64px;font-size:28px;">🚗</div>
        <h2 style="font-size:22px;font-weight:800;color:#0f172a;margin:0;">Are You On Your Way?</h2>
      </div>
      <p style="font-size:15px;color:#334155;line-height:1.8;">Hi <strong>${name}</strong>! Students are arriving at 111 Newtown RD and the excitement in the room is real. Your guest spot is still waiting — please come!</p>
      <div style="background:#fef3c7;border:1px solid #fcd34d;border-radius:16px;padding:20px;margin:20px 0;">
        <p style="font-size:14px;color:#92400e;font-weight:700;margin:0 0 8px;">Still need directions?</p>
        <p style="font-size:14px;color:#78350f;margin:0;">📍 111 Newtown RD, Accra Newtown · Search "Doctor Barns Tech" · Call <strong>0599 551 331</strong></p>
      </div>
      <p style="font-size:14px;color:#64748b;text-align:center;">Ride safely. We'll see you very soon! — Doctor Barns</p>
    `);

    return { sms, email, subject: `🚗 ${name}, Are You On Your Way? Class Starts at 10AM!` };
}

function msg5(name: string) {
    const sms = `${name}! 🔥 Are you inside?

The RWH Masterclass is starting in 10 MINUTES. If you're nearby — walk in RIGHT NOW. Your guest seat is here.

Don't let this moment pass you by. Get in here! 🎓 - Doctor Barns`;

    const email = makeEmail(name, `🔥 Starting in 10 Minutes — Get In Here!`, `
      <div style="text-align:center;margin-bottom:28px;">
        <div style="width:64px;height:64px;background:linear-gradient(135deg,#fee2e2,#fca5a5);border-radius:50%;margin:0 auto 12px;line-height:64px;font-size:28px;">🔥</div>
        <h2 style="font-size:24px;font-weight:800;color:#0f172a;margin:0;">Starting in 10 Minutes!</h2>
      </div>
      <div style="background:linear-gradient(135deg,#dc2626,#b91c1c);border-radius:20px;padding:28px;margin:20px 0;text-align:center;">
        <p style="font-size:28px;font-weight:900;color:#ffffff;margin:0;">T-10 MINUTES 🚀</p>
        <p style="font-size:15px;color:#fca5a5;margin:10px 0 0;">If you're nearby — walk in <strong style="color:#ffffff;">RIGHT NOW</strong></p>
      </div>
      <p style="font-size:15px;color:#334155;line-height:1.8;">Hi <strong>${name}</strong>! Are you inside? Your guest seat is here and we're about to start. This is the moment — don't let it pass.</p>
      <p style="font-size:15px;color:#334155;text-align:center;font-weight:700;">📍 111 Newtown RD, Accra Newtown · Call: 0599 551 331</p>
      <p style="font-size:14px;color:#64748b;text-align:center;">— Doctor Barns</p>
    `);

    return { sms, email, subject: `🔥 ${name} — Starting in 10 Minutes! Are You Inside?` };
}

// ─── Email Builder ────────────────────────────────────────────────────────────

function makeEmail(name: string, headline: string, bodyContent: string): string {
    return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
<tr><td style="background:linear-gradient(135deg,#0a0a0a,#1a1a2e);padding:28px 40px;text-align:center;">
  <p style="color:#94a3b8;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:2px;margin:0 0 6px;">Doctor Barns · Remote Work Hub</p>
  <h1 style="color:#ffffff;font-size:20px;font-weight:800;margin:0;">${headline}</h1>
</td></tr>
<tr><td style="padding:32px 40px;">${bodyContent}</td></tr>
<tr><td style="background:#f8fafc;padding:20px 40px;text-align:center;border-top:1px solid #e2e8f0;">
  <p style="font-size:12px;color:#94a3b8;margin:0;">Doctor Barns Tech · 111 Newtown RD, Accra Newtown</p>
  <p style="font-size:12px;color:#94a3b8;margin:4px 0 0;">Directions: 0599 551 331</p>
</td></tr>
</table></td></tr></table></body></html>`;
}

// ─── Send a single wave ───────────────────────────────────────────────────────

async function sendWave(
    waveNum: number,
    getContent: (name: string) => { sms: string; email: string | null; subject: string }
) {
    const { subject } = getContent("Test");
    console.log(`\n${"=".repeat(60)}`);
    console.log(`📤 WAVE ${waveNum}: ${subject.replace("Test, ", "")}`);
    console.log(`   ${new Date().toLocaleTimeString("en-GH", { timeZone: "Africa/Accra" })} · ${leads.length} leads`);
    console.log("=".repeat(60));

    let emailOk = 0, emailSkip = 0, emailFail = 0, smsOk = 0, smsFail = 0;

    for (const lead of leads) {
        const { sms, email, subject } = getContent(lead.first_name.trim());
        process.stdout.write(`  ${lead.first_name.trim().padEnd(16)} `);

        // Email (skip if null email — typo in address)
        if (lead.email) {
            try {
                const { error } = await resend.emails.send({ from: FROM, to: lead.email, subject, html: email! });
                if (error) throw new Error(error.message);
                process.stdout.write("✅ email  ");
                emailOk++;
            } catch {
                process.stdout.write("❌ email  ");
                emailFail++;
            }
            await delay(400);
        } else {
            process.stdout.write("⚠️  no email  ");
            emailSkip++;
        }

        // SMS
        const res = await SmsAdapter.send({ to: lead.phone, message: sms });
        if (res.success) { process.stdout.write("✅ sms\n"); smsOk++; }
        else { process.stdout.write(`❌ sms(${res.error?.slice(0, 25)})\n`); smsFail++; }
        await delay(200);
    }

    console.log(`\n  ✅ Wave ${waveNum} done — Email: ${emailOk}/${leads.length - emailSkip}  SMS: ${smsOk}/${leads.length}\n`);
}

function delay(ms: number) { return new Promise(r => setTimeout(r, ms)); }

function msUntil(d: Date) { return Math.max(0, d.getTime() - Date.now()); }

function scheduleAt(d: Date, label: string, fn: () => Promise<void>) {
    const ms = msUntil(d);
    const t = d.toLocaleTimeString("en-GH", { timeZone: "Africa/Accra", hour: "2-digit", minute: "2-digit" });
    if (ms <= 0) { console.log(`⚡ ${label} — sending now`); fn(); }
    else { console.log(`⏰ ${label} → ${t} Ghana time (~${Math.round(ms / 60000)} min away)`); setTimeout(fn, ms); }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
    if (!process.env.RESEND_API_KEY) { console.error("❌ Missing RESEND_API_KEY"); process.exit(1); }

    const now = new Date();
    const wave2Time = new Date(now.getTime() + 45 * 60 * 1000); // +45 min

    const mar16_6am   = new Date("2026-03-16T06:00:00Z");
    const mar16_8am   = new Date("2026-03-16T08:00:00Z");
    const mar16_945am = new Date("2026-03-16T09:45:00Z");

    console.log("\n🎯 RWH LEADS MARKETING SCHEDULER");
    console.log("==================================");
    console.log(`Now (Ghana): ${now.toLocaleString("en-GH", { timeZone: "Africa/Accra" })}`);
    console.log(`\n📅 Schedule:`);
    console.log(`  Wave 1 — NOW             → Exclusive guest invitation to first class`);
    console.log(`  Wave 2 — +45 min         → Last chance to secure a seat (GHS 200)`);
    console.log(`  Wave 3 — 6:00AM  Mar 16  → Good morning, guest spot waiting`);
    console.log(`  Wave 4 — 8:00AM  Mar 16  → Are you on your way?`);
    console.log(`  Wave 5 — 9:45AM  Mar 16  → Starting in 10 mins, get in here!\n`);
    console.log(`👥 ${leads.length} leads · Each receives SMS + Email (where valid)\n`);

    await sendWave(1, msg1);

    scheduleAt(wave2Time,   "Wave 2 (GHS 200 push)",      () => sendWave(2, msg2));
    scheduleAt(mar16_6am,   "Wave 3 (good morning)",       () => sendWave(3, msg3));
    scheduleAt(mar16_8am,   "Wave 4 (on your way)",        () => sendWave(4, msg4));
    scheduleAt(mar16_945am, "Wave 5 (10 mins — get in!)", () => sendWave(5, msg5));

    const lastMs = msUntil(mar16_945am) + 5 * 60 * 1000;
    console.log(`\n⏳ Process stays alive for ~${Math.round(lastMs / 3600000)} hrs until all waves fire.\n`);
}

main().catch(console.error);
