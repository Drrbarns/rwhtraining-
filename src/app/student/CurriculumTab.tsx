"use client";

import { useState } from "react";
import { BookOpen, FileText, ChevronRight, ExternalLink, Copy, CheckCircle2, Terminal, Palette, Sparkles, Rocket, Code2, Globe, CreditCard as CardIcon, Wrench, ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type CurriculumView = "overview" | "reference" | "week1" | "week2" | "week3" | "week4";

const TOOLS_DOWNLOAD = [
    { name: "Node.js", url: "https://nodejs.org/", label: "Download LTS" },
    { name: "Git", url: "https://git-scm.com/downloads", label: "Download for OS" },
    { name: "Cursor AI IDE", url: "https://cursor.sh/", label: "Download App" },
    { name: "ChatGPT", url: "https://chat.openai.com/", label: "Create Account" },
];

const PLATFORMS = [
    { name: "GitHub", url: "https://github.com/", label: "Create Account" },
    { name: "Vercel", url: "https://vercel.com/", label: "Create Account" },
    { name: "Supabase", url: "https://supabase.com/", label: "Create Account" },
    { name: "Paystack", url: "https://paystack.com/", label: "Merchant Account" },
];

const MEDIA_TOOLS = [
    { name: "Whisk", url: "https://labs.google/fx/tools/whisk", label: "Image Generation" },
    { name: "Resend", url: "https://resend.com/", label: "Transactional Emails" },
    { name: "WhatsApp CTA", url: "https://wa.me/", label: "Button Link" },
    { name: "Moolre", url: "https://moolre.com/", label: "Payments API" },
];

const TERMINAL_COMMANDS = [
    { cmd: "npm install", desc: "Downloads all dependencies. Run this first after cloning." },
    { cmd: "npm run dev", desc: "Starts your local development server at localhost:3000." },
    { cmd: "npm run build", desc: "Prepares your website for live production deployment." },
    { cmd: "git init", desc: "Creates a new Git repository (run once per project)." },
    { cmd: "git add .", desc: "Stages all changed files to be saved." },
    { cmd: 'git commit -m "update"', desc: "Saves a snapshot of your project with a message." },
    { cmd: "git push", desc: "Sends your saved code up to GitHub." },
    { cmd: "npm i -g vercel", desc: "Installs the Vercel CLI globally on your machine (run once)." },
    { cmd: "npx vercel", desc: "Connects your local project to your Vercel account." },
    { cmd: "vercel --prod", desc: "Deploys your website live to the internet." },
];

const FONTS = {
    serif: [
        { name: "Playfair Display", style: "luxury, editorial" },
        { name: "Merriweather", style: "readable, blog-style" },
        { name: "Lora", style: "elegant body text" },
        { name: "Cormorant Garamond", style: "high-end" },
        { name: "Libre Baskerville", style: "editorial" },
    ],
    sansSerif: [
        { name: "Inter", style: "versatile, UI" },
        { name: "Poppins", style: "rounded, friendly" },
        { name: "Space Grotesk", style: "tech, startup" },
        { name: "DM Sans", style: "minimal, clean" },
        { name: "Plus Jakarta Sans", style: "professional" },
    ],
    display: [
        { name: "Clash Display", style: "bold, contemporary" },
        { name: "Satoshi", style: "modern display" },
        { name: "Syne", style: "distinctive" },
        { name: "Bebas Neue", style: "condensed, poster" },
        { name: "Bricolage Grotesque", style: "editorial" },
    ],
};

const AI_VOCAB = [
    "Premium", "Fortune 500", "God-level UI", "Glassmorphism", "Neumorphism",
    "Bento Grid", "Micro-interactions", "Edge-to-Edge Layout", "Brutalist Typography", "Skeleton Loading",
];

const PROMPTS = [
    {
        id: "foundation",
        title: "The Foundation Prompt",
        week: "Week 1",
        text: `You are an elite product team (UX + UI + full-stack + SEO).

Create a complete, production-ready Next.js website for a [Niche/Company Name].

Hard constraints:
- Must have: Homepage, About Page, Services Page, and Contact Page.
- Use a [Premium Dark / Clean Light] UI aesthetic.
- Design must feel like a Fortune 500 tech company — no generic AI-slop templates.
- Use Inter font for body and Playfair Display for headings.
- Include a high-converting Hero section.
- NO PURPLE gradients at all.
- Use smart defaults for any missing information.
- If ambiguous, make strong sensible decisions and proceed without asking questions.
- Include skeleton loading states where appropriate.
- Use responsive design to ensure mobile compatibility.`,
    },
    {
        id: "redesign",
        title: "Section Redesign Prompt",
        week: "Week 2",
        text: `I have attached a screenshot of the current [Header / Hero / Footer] section.

Redesign ONLY this specific section into a premium, Fortune-500 style layout.
Incorporate subtle micro-animations on hover.
Use a bento grid structure if applicable, and implement smooth glassmorphism with soft diffused drop shadows.

Do not break the overall layout — just replace the target section with the new God-level design.`,
    },
    {
        id: "component",
        title: "Advanced Component Prompt",
        week: "Week 2",
        text: `Create a reusable [Product / Service] Card component.

Constraints:
- Edge-to-Edge layout where the image fills the card natively.
- Subtle floating 3D hover effect (lifting off the page).
- 'Action / Buy' button uses a frosted glass background blur over the image.
- Brutalist contrast for the main price/title typography.
- Must be fully responsive.`,
    },
    {
        id: "supabase",
        title: "Supabase Form Prompt",
        week: "Week 3",
        text: `I want to connect my existing Contact Form to Supabase.

1. Generate the exact SQL to create a \`contact_messages\` table with: id, created_at, name, email, and message.
2. Update my Next.js contact form component so that on submit:
   - It shows a "Sending..." loading state.
   - It securely inserts the data into Supabase.
   - It shows a clear success feedback message.

Implement client-side validation before submission (email format, required fields). Use \`process.env.NEXT_PUBLIC_SUPABASE_URL\` and \`NEXT_PUBLIC_SUPABASE_ANON_KEY\`.`,
    },
];

const WEEK_DATA = [
    {
        id: "week1" as CurriculumView,
        num: "01",
        title: "Visual Decomposition",
        subtitle: "Week 1",
        goal: "Learn how to read AI-generated websites, isolate structures, and modify them using targeted prompts without breaking the layout.",
        tasks: [
            { bold: "Generate a base layout:", text: "Use your master prompts to ask Cursor to build a complete initial landing page." },
            { bold: "Analyze the structure:", text: "Identify the Header, Hero, Features, Testimonial, and Footer sections visually." },
            { bold: "Targeted redesign:", text: "Take a screenshot of the Header or Hero section ONLY." },
            { bold: "Prompt for replacement:", text: "Write a new prompt asking the AI to redesign ONLY that section into a premium Fortune-500 layout." },
        ],
        deliverable: 'Show a "Before" and "After" screenshot of the specific section you successfully commanded the AI to redesign.',
    },
    {
        id: "week2" as CurriculumView,
        num: "02",
        title: "Multi-Page Architecture",
        subtitle: "Week 2",
        goal: "Construct a complete web presence by generating, linking, and styling the crucial pages of a business website.",
        tasks: [
            { bold: "Build core pages:", text: "Generate a Home, About, Services, and Contact page." },
            { bold: "Implement Form UI:", text: "Construct a Contact Form with client-side validation (required fields & email format)." },
            { bold: 'Apply God-Level design:', text: 'Refine components using AI vocabulary like "Glassmorphism", "Bento Grid", and "Edge-to-Edge Layout".' },
            { bold: "Custom 404:", text: 'Generate a branded "Page Not Found" page.' },
        ],
        deliverable: "A functioning local multi-page website (running on localhost:3000) where navigation routes between all 4 pages and the 404 error state.",
    },
    {
        id: "week3" as CurriculumView,
        num: "03",
        title: "Systems & Integration",
        subtitle: "Week 3",
        goal: "Evolve your static UI into a functional web application by connecting a database and implementing a payment gateway.",
        tasks: [
            { bold: "Supabase Database:", text: "Create a project, design a contact_messages table schema, and get your API keys." },
            { bold: "Connect the Form:", text: 'Update your Contact form to securely send data into Supabase. Add "Sending…" loading states and success messages.' },
            { bold: "Payments API:", text: 'Build a Product page featuring a "Buy" button.' },
            { bold: "Checkout Flow:", text: "Connect the Buy button to route the customer to Paystack or Moolre checkout." },
        ],
        deliverable: "Submit a test message through your frontend and show it appearing in your Supabase Table Editor. Show a successful payment link opening.",
    },
    {
        id: "week4" as CurriculumView,
        num: "04",
        title: "The Final Deployment",
        subtitle: "Week 4 — Capstone",
        goal: "Push your code to production, manage environment variables securely, apply SEO fundamentals, and present to the world.",
        tasks: [
            { bold: "Version Control:", text: "Initialize Git, commit your project, and push it to a new GitHub repository." },
            { bold: "Vercel Deployment:", text: "Import your GitHub repo to Vercel. Add your Supabase/Paystack .env keys to Vercel Environment Variables." },
            { bold: "SEO & Trust:", text: "Add a Favicon, setup Open Graph (OG) tags for social sharing, and ensure basic meta titles are present." },
        ],
        deliverable: null,
        checklist: [
            "Beautiful Homepage", "Working Database Form", "Valid Payment Button",
            "Live vercel.app URL", "Premium Font/Design", "Open Graph Share Tags",
        ],
    },
];

const ARCHITECTURE = {
    pages: ["Home — Landing hub + Hero", "About — Company and trust building", "Services/Product — Offerings + Buy tools", "Contact — Form connected to Supabase"],
    sections: ["Header: Logo, Navigation, CTA Button", "Body: Features, Testimonials, Pricing", "Footer: Socials, Legal Links, Contact Info"],
    qa: ["Test on Mobile, Tablet & Desktop", "Check all navigation links", "Submit a test contact form", "Run a test payment", "Add Custom 404 Page"],
    seo: ["Favicon — Browser tab icon", "OG Tags — Social media share previews", "Analytics — Add GA4 tracking snippet", "Legal — Privacy Policy & Cookie Banner"],
};

function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);
    return (
        <button
            onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-all shrink-0"
        >
            {copied ? <><CheckCircle2 className="w-3 h-3 text-emerald-400" /><span className="text-emerald-400">Copied</span></> : <><Copy className="w-3 h-3" /> Copy</>}
        </button>
    );
}

function ToolLink({ name, url, label }: { name: string; url: string; label: string }) {
    return (
        <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3.5 rounded-xl border border-white/5 bg-black/30 hover:border-[#2563EB]/30 hover:bg-[#2563EB]/5 transition-all group">
            <span className="text-[13px] font-semibold text-white group-hover:text-[#2563EB] transition-colors">{name}</span>
            <span className="text-[11px] font-medium text-gray-500 flex items-center gap-1">{label} <ExternalLink className="w-3 h-3" /></span>
        </a>
    );
}

function SectionCard({ title, number, icon: Icon, children }: { title: string; number: string; icon: React.ElementType; children: React.ReactNode }) {
    return (
        <Card className="bg-[#121212] border-white/5">
            <CardContent className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-[#2563EB]" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-[#2563EB] uppercase tracking-widest">{number}</p>
                        <h3 className="text-[17px] font-bold text-white">{title}</h3>
                    </div>
                </div>
                {children}
            </CardContent>
        </Card>
    );
}

function MasterReference() {
    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-2">Master Reference</h2>
                <p className="text-gray-400 text-[15px]">Your definitive guide for the masterclass. All required tools, commands, and AI prompts.</p>
            </div>

            <SectionCard title="Required Accounts & Tools" number="01" icon={Wrench}>
                <p className="text-[13px] text-gray-400 mb-5">Before writing any code, install and create accounts on these platforms.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">Software to Download</h4>
                        <div className="space-y-2">
                            {TOOLS_DOWNLOAD.map(t => <ToolLink key={t.name} {...t} />)}
                        </div>
                    </div>
                    <div>
                        <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">Platforms to Sign Up</h4>
                        <div className="space-y-2">
                            {PLATFORMS.map(t => <ToolLink key={t.name} {...t} />)}
                        </div>
                    </div>
                </div>
            </SectionCard>

            <SectionCard title="Media & Engagement Tools" number="02" icon={Globe}>
                <p className="text-[13px] text-gray-400 mb-5">Optional integrations to make your website more professional and interactive.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {MEDIA_TOOLS.map(t => <ToolLink key={t.name} {...t} />)}
                </div>
            </SectionCard>

            <SectionCard title="Terminal Dictionary" number="03" icon={Terminal}>
                <p className="text-[13px] text-gray-400 mb-5">Open Cursor&apos;s Terminal (Ctrl + ` or View → Terminal). Use these commands to control your project.</p>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="pb-3 pr-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Command</th>
                                <th className="pb-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">What it does</th>
                            </tr>
                        </thead>
                        <tbody>
                            {TERMINAL_COMMANDS.map(c => (
                                <tr key={c.cmd} className="border-b border-white/[0.03] group">
                                    <td className="py-3 pr-4">
                                        <code className="text-[13px] font-mono text-[#2563EB] bg-[#2563EB]/10 px-2 py-1 rounded-md whitespace-nowrap">{c.cmd}</code>
                                    </td>
                                    <td className="py-3 text-[13px] text-gray-400">{c.desc}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </SectionCard>

            <SectionCard title="Typography & Design Systems" number="04" icon={Palette}>
                <p className="text-[13px] text-gray-400 mb-5">Use these specific font names in your prompts to get professional, polished results.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {[
                        { title: "Serif (Formal, Editorial)", fonts: FONTS.serif },
                        { title: "Sans-Serif (Clean, Modern UI)", fonts: FONTS.sansSerif },
                        { title: "Display (Bold, Impactful)", fonts: FONTS.display },
                    ].map(group => (
                        <div key={group.title}>
                            <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">{group.title}</h4>
                            <div className="space-y-2">
                                {group.fonts.map(f => (
                                    <div key={f.name} className="flex items-center justify-between p-2.5 rounded-lg border border-white/[0.03] bg-black/20">
                                        <span className="text-[13px] font-semibold text-white">{f.name}</span>
                                        <span className="text-[11px] text-gray-500">{f.style}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div>
                    <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">AI Design Vocabulary</h4>
                    <div className="flex flex-wrap gap-2">
                        {AI_VOCAB.map(v => (
                            <span key={v} className="px-3 py-1.5 rounded-full text-[12px] font-semibold bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/20">{v}</span>
                        ))}
                    </div>
                </div>
            </SectionCard>

            <SectionCard title="The Master Prompts" number="05" icon={Sparkles}>
                <p className="text-[13px] text-gray-400 mb-5">Copy and paste these exact prompts into Cursor. Fill in the [ ] text with your own business details.</p>
                <div className="space-y-5">
                    {PROMPTS.map(p => (
                        <div key={p.id} className="rounded-xl border border-white/5 bg-black/30 overflow-hidden">
                            <div className="flex items-center justify-between p-4 border-b border-white/5">
                                <div>
                                    <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-widest">{p.week}</span>
                                    <h4 className="text-[14px] font-bold text-white mt-0.5">{p.title}</h4>
                                </div>
                                <CopyButton text={p.text} />
                            </div>
                            <pre className="p-4 text-[13px] text-gray-300 font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto">{p.text}</pre>
                        </div>
                    ))}
                </div>
            </SectionCard>

            <SectionCard title="Project Architecture & Launch Checklist" number="06" icon={Rocket}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">Required Pages</h4>
                        <div className="space-y-2">
                            {ARCHITECTURE.pages.map(p => (
                                <div key={p} className="flex items-center gap-2 p-2.5 rounded-lg border border-white/[0.03] bg-black/20">
                                    <ChevronRight className="w-3 h-3 text-[#2563EB] shrink-0" />
                                    <span className="text-[13px] text-gray-300">{p}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">Required Sections per Page</h4>
                        <div className="space-y-2">
                            {ARCHITECTURE.sections.map(s => (
                                <div key={s} className="flex items-center gap-2 p-2.5 rounded-lg border border-white/[0.03] bg-black/20">
                                    <ChevronRight className="w-3 h-3 text-[#2563EB] shrink-0" />
                                    <span className="text-[13px] text-gray-300">{s}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">Pre-Launch QA Checklist</h4>
                        <div className="space-y-2">
                            {ARCHITECTURE.qa.map(q => (
                                <div key={q} className="flex items-center gap-2.5 p-2.5 rounded-lg border border-white/[0.03] bg-black/20">
                                    <div className="w-4 h-4 rounded border border-white/10 shrink-0" />
                                    <span className="text-[13px] text-gray-300">{q}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">SEO & Trust</h4>
                        <div className="space-y-2">
                            {ARCHITECTURE.seo.map(s => (
                                <div key={s} className="flex items-center gap-2.5 p-2.5 rounded-lg border border-white/[0.03] bg-black/20">
                                    <div className="w-4 h-4 rounded border border-white/10 shrink-0" />
                                    <span className="text-[13px] text-gray-300">{s}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </SectionCard>
        </div>
    );
}

function WeekAssignment({ week }: { week: typeof WEEK_DATA[number] }) {
    return (
        <div className="space-y-6">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/20">{week.subtitle}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-2">{week.title}</h2>
                <p className="text-gray-400 text-[15px] max-w-2xl">{week.goal}</p>
            </div>

            <Card className="bg-[#121212] border-white/5">
                <CardContent className="p-6 md:p-8">
                    <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-5">Tasks</h3>
                    <div className="space-y-4">
                        {week.tasks.map((task, i) => (
                            <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-white/[0.03] bg-black/20">
                                <div className="w-8 h-8 rounded-lg bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center shrink-0 mt-0.5">
                                    <span className="text-[12px] font-bold text-[#2563EB]">{i + 1}</span>
                                </div>
                                <p className="text-[14px] text-gray-300 leading-relaxed">
                                    <strong className="text-white font-semibold">{task.bold}</strong> {task.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {week.deliverable && (
                <Card className="bg-[#2563EB]/5 border-[#2563EB]/20 border-dashed">
                    <CardContent className="p-6">
                        <h4 className="text-[10px] font-bold text-[#2563EB] uppercase tracking-widest mb-2">Deliverable</h4>
                        <p className="text-[14px] text-gray-300 leading-relaxed">{week.deliverable}</p>
                    </CardContent>
                </Card>
            )}

            {week.checklist && (
                <Card className="bg-gradient-to-br from-[#2563EB]/10 to-indigo-600/10 border-[#2563EB]/20">
                    <CardContent className="p-6">
                        <h4 className="text-[10px] font-bold text-[#2563EB] uppercase tracking-widest mb-4">Final Presentation Checklist</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {week.checklist.map(item => (
                                <div key={item} className="flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-black/20">
                                    <div className="w-5 h-5 rounded border border-white/10 shrink-0" />
                                    <span className="text-[13px] font-medium text-gray-300">{item}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

export default function CurriculumTab() {
    const [view, setView] = useState<CurriculumView>("overview");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navItems: { id: CurriculumView; label: string; icon: React.ElementType; desc: string }[] = [
        { id: "overview", label: "Overview", icon: BookOpen, desc: "Course outline" },
        { id: "reference", label: "Master Reference", icon: FileText, desc: "Tools & prompts" },
        { id: "week1", label: "Week 1", icon: Code2, desc: "Visual Decomposition" },
        { id: "week2", label: "Week 2", icon: Globe, desc: "Multi-Page Architecture" },
        { id: "week3", label: "Week 3", icon: CardIcon, desc: "Systems & Integration" },
        { id: "week4", label: "Week 4", icon: Rocket, desc: "Final Deployment" },
    ];

    const activeNav = navItems.find(n => n.id === view)!;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Mobile dropdown nav */}
            <div className="md:hidden">
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="w-full flex items-center justify-between p-4 rounded-xl bg-[#121212] border border-white/5 text-left"
                >
                    <div className="flex items-center gap-3">
                        <activeNav.icon className="w-4 h-4 text-[#2563EB]" />
                        <div>
                            <p className="text-[13px] font-bold text-white">{activeNav.label}</p>
                            <p className="text-[11px] text-gray-500">{activeNav.desc}</p>
                        </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${mobileMenuOpen ? "rotate-180" : ""}`} />
                </button>
                {mobileMenuOpen && (
                    <div className="mt-2 rounded-xl bg-[#121212] border border-white/5 overflow-hidden">
                        {navItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => { setView(item.id); setMobileMenuOpen(false); }}
                                className={`w-full flex items-center gap-3 p-3.5 text-left transition-colors ${view === item.id ? "bg-[#2563EB]/10 text-[#2563EB]" : "text-gray-400 hover:bg-white/5"}`}
                            >
                                <item.icon className="w-4 h-4 shrink-0" />
                                <div>
                                    <p className="text-[13px] font-bold">{item.label}</p>
                                    <p className="text-[11px] text-gray-500">{item.desc}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex gap-6">
                {/* Desktop sidebar nav */}
                <div className="hidden md:block w-56 shrink-0">
                    <div className="sticky top-24 space-y-1">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 px-3">Curriculum</p>
                        {navItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => setView(item.id)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                                    view === item.id
                                        ? "bg-[#2563EB]/10 border border-[#2563EB]/20 text-[#2563EB]"
                                        : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                                }`}
                            >
                                <item.icon className="w-4 h-4 shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-[13px] font-bold truncate">{item.label}</p>
                                    <p className="text-[10px] text-gray-500 truncate">{item.desc}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content area */}
                <div className="flex-1 min-w-0">
                    {view === "overview" && (
                        <div className="space-y-6">
                            <div className="mb-8">
                                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-2">Web Development Masterclass</h2>
                                <p className="text-gray-400 text-[15px]">Access your masterclass reference guide and weekly assignments below.</p>
                            </div>

                            {/* Master Reference Card */}
                            <button onClick={() => setView("reference")} className="w-full text-left">
                                <Card className="bg-[#121212] border-white/5 hover:border-[#2563EB]/30 hover:bg-[#2563EB]/5 transition-all group cursor-pointer">
                                    <CardContent className="p-6 md:p-8">
                                        <div className="flex items-center gap-5">
                                            <div className="w-16 h-16 rounded-2xl bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center shrink-0 group-hover:bg-[#2563EB]/20 transition-colors">
                                                <FileText className="w-7 h-7 text-[#2563EB]" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-[18px] font-bold text-white group-hover:text-[#2563EB] transition-colors">Master Reference</h3>
                                                <p className="text-[13px] text-gray-400 mt-1">All required tool links, terminal commands, and exact AI prompts for the course.</p>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-[#2563EB] transition-colors shrink-0" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </button>

                            {/* Week Cards */}
                            <div>
                                <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4 px-1">Weekly Assignments</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {WEEK_DATA.map(week => (
                                        <button key={week.id} onClick={() => setView(week.id)} className="text-left">
                                            <Card className="bg-[#121212] border-white/5 hover:border-[#2563EB]/30 hover:bg-[#2563EB]/5 transition-all group cursor-pointer h-full">
                                                <CardContent className="p-5 md:p-6">
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-12 h-12 rounded-xl bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center shrink-0 group-hover:bg-[#2563EB]/20 transition-colors">
                                                            <span className="text-[16px] font-extrabold text-[#2563EB] font-mono">{week.num}</span>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{week.subtitle}</span>
                                                            <h4 className="text-[15px] font-bold text-white mt-1 group-hover:text-[#2563EB] transition-colors">{week.title}</h4>
                                                            <p className="text-[12px] text-gray-500 mt-1.5 line-clamp-2">{week.goal}</p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {view === "reference" && <MasterReference />}

                    {WEEK_DATA.map(week => (
                        view === week.id && <WeekAssignment key={week.id} week={week} />
                    ))}
                </div>
            </div>
        </div>
    );
}
