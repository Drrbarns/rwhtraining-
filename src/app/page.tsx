"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, Variants, AnimatePresence } from "framer-motion";
import {
  ArrowRight, CheckCircle2, Rocket, GraduationCap,
  MapPin, Globe, Flame, Monitor, Building2, Briefcase, Target,
  Award, Terminal, Cpu, LineChart, Users, Star, MessageCircle,
  Zap, Plus, Store, Hotel, LayoutDashboard, ClipboardList, CircleDollarSign
} from "lucide-react";
import { Container } from "@/components/layout/Container";
import { stats, faqs, brand } from "@/lib/siteData";

const FADE_UP: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};
const STAGGER: Variants = {
  visible: { transition: { staggerChildren: 0.12 } },
};

const iconMap: Record<string, React.ElementType> = {
  GraduationCap, Monitor, Building2, Activity: Zap, Users,
  Home: MapPin, LineChart, Cpu, ShoppingCart: Target,
  LayoutDashboard: Terminal, Heart: Star, Globe,
};

const systems = [
  { icon: GraduationCap, title: "School Management", desc: "Student, teacher & administrative portals.", value: "Market Value: GHS 8k - 15k" },
  { icon: Store, title: "POS Systems", desc: "Sales, inventory, and automated receipts.", value: "Market Value: GHS 7k - 12k" },
  { icon: Hotel, title: "Hotel Management", desc: "Real-time room booking and guest tracking.", value: "Market Value: GHS 10k - 20k" },
  { icon: ClipboardList, title: "Hospital Management", desc: "Patient histories, appointments & records.", value: "Market Value: GHS 12k - 25k" },
  { icon: Users, title: "CRM Systems", desc: "Lead pipelines & customer relationships.", value: "Market Value: GHS 8k - 18k" },
  { icon: Building2, title: "Hostel Management", desc: "Tenant bed-space allocation & rent billing.", value: "Market Value: GHS 8k - 14k" },
  { icon: CircleDollarSign, title: "Accounting Software", desc: "Dynamic invoicing & financial reporting.", value: "Market Value: GHS 10k - 22k" },
  { icon: LayoutDashboard, title: "ERP Platforms", desc: "Full-scale company resource planning.", value: "Market Value: GHS 20k+" },
];

// Weeks preview for home page
const weekHighlights = [
  { week: 1, title: "HTML, CSS & React Foundations", color: "bg-blue-50 border-blue-200", badge: "bg-blue-600" },
  { week: 2, title: "TypeScript, Tailwind & Advanced UI", color: "bg-blue-50 border-blue-200", badge: "bg-blue-600" },
  { week: 3, title: "Backend, Databases & Auth Systems", color: "bg-indigo-50 border-indigo-200", badge: "bg-indigo-600" },
  { week: 4, title: "E-Commerce & Payment Gateways", color: "bg-blue-50 border-blue-200", badge: "bg-blue-600" },
  { week: 5, title: "Enterprise Dashboards & ERP Systems", color: "bg-blue-50 border-blue-200", badge: "bg-blue-600" },
  { week: 6, title: "Client Acquisition & Agency Launch", color: "bg-amber-50 border-amber-200", badge: "bg-amber-500" },
];

export default function HomePage() {
  return (
    <div className="bg-white text-slate-900 overflow-x-hidden">

      {/* ─── HERO ─── */}
      <section className="relative min-h-[90vh] md:min-h-screen bg-[#0a192f] flex items-center pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero_bg_dark.jpg"
            alt="Young ambitious web developer learning"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-transparent to-transparent opacity-90" />
        </div>

        <Container className="relative z-10 w-full flex items-center min-h-[70vh]">
          <div className="w-full max-w-2xl mr-auto">
            <div className="space-y-8 flex flex-col items-start text-left w-full">
              <motion.div variants={FADE_UP} className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold uppercase tracking-wider rounded-full backdrop-blur-sm font-jakarta">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                2026 Elite Masterclass · Only 10 Seats Available
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl md:text-6xl lg:text-[5rem] font-extrabold text-white tracking-tight leading-[1.1] font-jakarta"
              >
                Become a Professional <br className="hidden md:block" />
                <span className="text-blue-500">Web Developer</span>{" "}
                &amp; Secure Your First Client in <span className="text-amber-400">30 Days.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg md:text-xl text-slate-300 font-light leading-relaxed max-w-2xl font-jakarta"
              >
                This isn&apos;t another tutorial hell. We engineer absolute beginners into high-value developers capable of building the complex systems that corporate clients exactly pay for.
              </motion.p>

              <motion.div variants={FADE_UP} className="grid grid-cols-2 gap-y-4 gap-x-2 w-full max-w-lg pt-2 font-jakarta">
                {[
                  { icon: CheckCircle2, text: "Diploma Certification", color: "text-blue-400" },
                  { icon: Flame, text: "Top 2 Get Hired", color: "text-amber-400" },
                  { icon: CheckCircle2, text: "First Client Guaranteed", color: "text-emerald-400" },
                  { icon: CheckCircle2, text: "No Experience Required", color: "text-blue-400" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2.5">
                    <item.icon className={`w-4 h-4 ${item.color} shrink-0`} />
                    <span className="text-[13px] font-medium text-white">{item.text}</span>
                  </div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-start gap-6 pt-8 w-full font-jakarta"
              >
                <Link href="/apply" className="h-14 px-8 text-[15px] bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all duration-300 w-full sm:w-auto rounded-xl inline-flex items-center justify-center">
                  Apply for the Masterclass <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <div className="flex flex-col justify-center text-left">
                  <span className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mb-1">Program Fee</span>
                  <span className="text-2xl font-black text-white leading-none tracking-tight">GHS 1,000</span>
                </div>
              </motion.div>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── STATS BAR ─── */}
      <section className="py-10 bg-white border-b border-slate-100">
        <Container>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={STAGGER}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 divide-y-2 lg:divide-y-0 lg:divide-x divide-slate-100"
          >
            {stats.map((stat) => (
              <motion.div key={stat.label} variants={FADE_UP} className="text-center px-6 py-2">
                <div className="text-3xl md:text-4xl font-black text-blue-600 mb-1">{stat.value}</div>
                <div className="text-sm font-bold text-slate-900 mb-0.5">{stat.label}</div>
                <div className="text-xs text-slate-500">{stat.desc}</div>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* ─── THE REALITY SHIFT ─── */}
      <section className="py-20 sm:py-28 bg-[#0a192f] text-white">
        <Container>
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={STAGGER}
            >
              <motion.span variants={FADE_UP} className="eyebrow text-blue-400 mb-4 block">
                The Industry Reality
              </motion.span>
              <motion.h2 variants={FADE_UP} className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-6">
                Tutorials Will Not{" "}
                <span className="text-blue-400">Get You Paid.</span>
              </motion.h2>
              <motion.div variants={FADE_UP} className="space-y-5 text-slate-400 text-lg leading-relaxed">
                <p>
                  The market is flooded with &ldquo;developers&rdquo; who can only build basic landing pages after
                  watching endless free tutorials. But the brutal truth:{" "}
                  <strong className="text-white border-b border-blue-500">
                    Corporate clients don&apos;t pay high retainers for landing pages — they pay for complex business systems.
                  </strong>
                </p>
                <p>
                  Our masterclass is a rigid, offline immersion specifically designed to strip away the fluff.
                  We focus on high-value, production-grade systems — the exact software Ghanaian companies
                  are actively paying GHS 5,000 to GHS 15,000 to acquire.
                </p>
              </motion.div>
              <motion.div variants={FADE_UP} className="mt-8">
                <Link href="/about" className="inline-flex items-center gap-2 text-blue-400 font-semibold hover:text-blue-300 transition-colors group text-sm">
                  Learn about our approach
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={STAGGER}
              className="grid sm:grid-cols-2 gap-4"
            >
              {[
                { icon: Terminal, title: "Offline Immersion", desc: "Hands-on, in-person mentorship to enforce focus and accelerate learning." },
                { icon: Target, title: "Client Acquisition", desc: "Learn the exact psychology of finding, pitching & closing real corporate deals." },
                { icon: Cpu, title: "Real Architecture", desc: "Build scalable databases, strict authentication, and enterprise business logic." },
                { icon: Award, title: "Premium Positioning", desc: "Position yourself as a high-value agency — not a cheap, disposable freelancer." },
              ].map((f) => (
                <motion.div
                  key={f.title}
                  variants={FADE_UP}
                  className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-blue-500/50 hover:bg-white/8 transition-all group"
                >
                  <div className="w-11 h-11 bg-blue-500/10 flex items-center justify-center rounded-xl mb-4 group-hover:bg-blue-500/20 transition-colors">
                    <f.icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-white font-bold text-base mb-2">{f.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ─── WHAT YOU WILL ACHIEVE ─── */}
      <section id="curriculum" className="py-24 sm:py-32 bg-white border-y border-slate-200 overflow-hidden">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20 sm:mb-28">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={STAGGER}
              className="max-w-2xl"
            >
              <motion.span variants={FADE_UP} className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-blue-600 mb-6">
                <span className="w-8 h-px bg-blue-600" />
                Program Outcomes
              </motion.span>
              <motion.h2 variants={FADE_UP} className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-950">
                What You Will Achieve
                <br className="hidden sm:block" />
                <span className="font-serif italic text-slate-500 font-medium">by Day 30</span>
              </motion.h2>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={FADE_UP}
              className="max-w-md md:pb-3"
            >
              <p className="text-lg leading-relaxed text-slate-600">
                By the end of this intensive program, you transition from absolute beginner
                to a capable technical consultant ready to take on real paying clients.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={STAGGER}
            className="grid gap-x-12 gap-y-20 md:grid-cols-2 lg:grid-cols-3"
          >
            {[
              { title: "Build Corporate Websites", desc: "Design and code high-performance, responsive websites for corporate clients — the kind that close contracts." },
              { title: "Develop Full E-Commerce Platforms", desc: "Build complete online stores with product catalogs, cart systems, and live payment processing via Paystack." },
              { title: "Engineer Complex Dashboards", desc: "Create the internal management software that companies rely on to run their daily operations." },
              { title: "Start Your Web Dev Agency", desc: "Structure your own web development company — from legal basics to service packaging and premium pricing." },
              { title: "Land Your First Client — Guaranteed", desc: "We don't let you leave without a paying contract. Every student signs their first web design deal before the program ends." },
              { title: "Become Internship-Ready", desc: "Build delivery discipline, technical confidence, and communication standards to thrive in paid internship environments." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                variants={FADE_UP}
                className="group relative flex flex-col"
              >
                <div className="absolute -top-14 left-0 text-[9rem] leading-none font-serif font-bold text-slate-100 -z-10 transition-colors duration-500 group-hover:text-blue-50 pointer-events-none select-none">
                  {String(i + 1).padStart(2, "0")}
                </div>

                <div className="relative z-10 pt-6 border-t-2 border-slate-200 transition-colors duration-300 group-hover:border-blue-600 flex-1 flex flex-col">
                  <div className="mb-6 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 transition-colors duration-300 group-hover:text-blue-600">
                      Phase {i + 1}
                    </span>
                    <div className="opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50">
                        <CheckCircle2 className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                  </div>
                  <h3 className="mb-4 text-2xl font-bold tracking-tight text-slate-950 transition-colors duration-300 group-hover:text-blue-950">
                    {item.title}
                  </h3>
                  <p className="text-base leading-relaxed text-slate-600 mt-auto">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* ─── SYSTEMS PORTFOLIO ─── */}
      <section id="portfolio" className="py-20 sm:py-28 bg-gradient-to-b from-slate-200 to-slate-100 border-y border-slate-300/70">
        <Container>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={STAGGER}
            className="text-center mb-16 max-w-3xl mx-auto"
          >
            <motion.span variants={FADE_UP} className="eyebrow mb-3 block">High-Ticket Software</motion.span>
            <motion.h2 variants={FADE_UP} className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight mb-5">
              Real Business Systems You Will Build.
            </motion.h2>
            <motion.p variants={FADE_UP} className="text-slate-600 text-lg">
              We focus exclusively on the enterprise tools and portals that real businesses
              pay heavily for — giving you an elite, high-value portfolio from day one.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={STAGGER}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {systems.map((sys) => {
              const Icon = sys.icon;
              return (
                <motion.div
                  key={sys.title}
                  variants={FADE_UP}
                  className="bg-slate-50 border border-slate-200 p-5 rounded-xl hover:shadow-md hover:border-blue-300 hover:bg-white transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-3 group-hover:bg-blue-600 transition-colors">
                    <Icon className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1">{sys.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed mb-2">{sys.desc}</p>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{sys.value}</span>
                </motion.div>
              );
            })}
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={FADE_UP}
            className="mt-10 rounded-2xl border border-blue-100 bg-blue-50/70 px-6 py-4 text-center"
          >
            <p className="text-sm font-medium text-blue-900">
              Every system above is taught step-by-step in class, then built by you for your portfolio.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* ─── FAQ ON HOME ─── */}
      <section className="py-24 sm:py-32 bg-slate-50 border-y border-slate-200" id="faq">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:items-start">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={STAGGER}
              className="lg:sticky lg:top-32"
            >
              <motion.span variants={FADE_UP} className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-blue-600 mb-6">
                <span className="w-8 h-px bg-blue-600" />
                Common Questions
              </motion.span>
              <motion.h2 variants={FADE_UP} className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-950 mb-6">
                Frequently Asked
                <br className="hidden lg:block" />
                <span className="font-serif italic text-slate-500 font-medium">Questions</span>
              </motion.h2>
              <motion.p variants={FADE_UP} className="text-lg leading-relaxed text-slate-600 mb-10 max-w-md">
                Everything you need to know about the masterclass before you apply. If you have additional questions, our admissions team is ready to assist you.
              </motion.p>

              <motion.div variants={FADE_UP} className="relative w-full aspect-[4/3] max-w-sm overflow-hidden rounded-2xl shadow-sm border border-slate-200">
                <Image
                  src="/african_tech_lab_wide_7.png"
                  alt="Senior and junior developers collaborating"
                  fill
                  className="object-cover"
                />
              </motion.div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={STAGGER}
              className="flex flex-col"
            >
              {faqs.slice(0, 10).map((item) => (
                <motion.details
                  key={item.q}
                  variants={FADE_UP}
                  className="group border-b border-slate-200 last:border-0"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-base sm:text-lg font-medium text-slate-900 transition-colors hover:text-blue-600">
                    <span className="flex-1">{item.q}</span>
                    <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white transition-colors group-hover:border-blue-200 group-hover:bg-blue-50 group-open:border-blue-600 group-open:bg-blue-600">
                      <Plus className="absolute h-4 w-4 text-slate-400 transition-transform group-hover:text-blue-600 group-open:rotate-45 group-open:text-white" />
                    </span>
                  </summary>
                  <div className="overflow-hidden pr-2 sm:pr-12 pb-6">
                    <p className="text-sm sm:text-base leading-relaxed text-slate-600">{item.a}</p>
                  </div>
                </motion.details>
              ))}
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ─── GUARANTEES ─── */}
      <section
        className="relative py-16 text-white bg-fixed bg-cover bg-center"
        style={{ backgroundImage: "url('/african_students_collaborating_2.png')" }}
      >
        <div className="absolute inset-0 bg-slate-950/30" />
        <Container className="relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={STAGGER}
            className="grid gap-6 lg:grid-cols-2"
          >
            {[
              {
                icon: Target,
                title: "First Client Guaranteed",
                desc: "Every single student will sign their first paying web design client before the training ends. We make sure of it.",
              },
              {
                icon: Flame,
                title: "Top 2 Get Hired by Doctor Barns Tech",
                desc: "The two best-performing students will receive a full-time job offer. Train hard, stand out, and walk into a career.",
              },
            ].map((g) => (
              <motion.div
                key={g.title}
                variants={FADE_UP}
                className="rounded-3xl border border-white/20 bg-white/10 p-7 backdrop-blur-sm"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/20">
                  <g.icon className="h-6 w-6 text-blue-200" />
                </div>
                <h3 className="mt-5 text-2xl font-bold tracking-tight text-white">{g.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-slate-100">{g.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* ─── CHALLENGE + INTERNSHIP ─── */}
      <section id="challenge" className="py-20 sm:py-28 bg-white">
        <Container>
          <div className="grid lg:grid-cols-2 gap-8">

            {/* 100K Challenge */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={FADE_UP}
              className="bg-amber-50 rounded-3xl p-8 sm:p-12 border border-amber-200"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-6">
                <Rocket className="w-3.5 h-3.5" />
                The Special Challenge
              </div>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 leading-tight">
                Join our{" "}
                <span className="text-amber-600">100K in 2 Weeks</span>{" "}
                Client Generation Challenge.
              </h3>
              <p className="text-slate-600 text-base mb-8 leading-relaxed">
                We don&apos;t just train you to code. We mandate that you know how to sell. During the program, you will learn how to:
              </p>
              <div className="space-y-4">
                {[
                  "Find high-paying, verified real-world clients in Accra and beyond.",
                  "Pitch, negotiate, and close your first development contract.",
                  "Start replacing your income with freelance web development revenue.",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Internship + Hiring */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={FADE_UP}
              className="bg-slate-50 rounded-3xl p-8 sm:p-12 border border-slate-200 flex flex-col justify-between"
            >
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6">
                  <Award className="w-3.5 h-3.5" />
                  Internship + Hiring
                </div>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2 leading-tight">
                  1-Month{" "}
                  <span className="text-blue-600">Paid Internship</span>
                </h3>
                <p className="text-slate-900 font-bold text-lg mb-5 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  With Doctor Barns Tech
                </p>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  After your 30 days of training, transition directly into an offline, paid internship role.
                  Work elbow-to-elbow with senior developers on actual live client projects — supercharging
                  your portfolio and professional experience instantly.
                </p>
                <div className="bg-blue-600 text-white rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                      <Flame className="w-4 h-4 text-amber-300" />
                    </div>
                    <span className="font-extrabold text-base tracking-tight">Top 2 Students Get Hired</span>
                  </div>
                  <p className="text-blue-100 text-xs leading-relaxed pl-11">
                    The two highest-performing graduates will receive a full-time job offer from Doctor Barns Tech.
                    Prove your skill and walk straight into a career.
                  </p>
                </div>
              </div>
              <div id="internship" className="relative w-full h-44 rounded-2xl overflow-hidden shadow-inner mt-6 border border-slate-200">
                <Image
                  src="/internship_mentorship.png"
                  alt="Senior and junior developers collaborating"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-16 sm:py-20 bg-white relative">
        <Container>
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-[#0a192f] rounded-[2.5rem] relative overflow-hidden shadow-2xl"
          >
            {/* Decorative glow */}
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute inset-0 grid-overlay-dark opacity-40" />

            <div className="relative z-10 flex flex-col lg:flex-row items-stretch">
              {/* Left: CTA Content */}
              <div className="flex-1 p-10 md:p-16 lg:p-20 flex flex-col justify-center">
                <span className="inline-flex w-fit items-center px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[10px] font-bold tracking-widest uppercase mb-6">
                  Application Open Now
                </span>
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-5 leading-[1.1]">
                  Your Engineering Career{" "}
                  <br className="hidden md:block" />
                  Starts{" "}
                  <span className="text-amber-400">March 16.</span>
                </h2>
                <p className="text-slate-400 text-base leading-relaxed mb-8 max-w-md">
                  Certification, paid internship, your first paying client, and the chance to get hired —
                  all included. Limited seats per cohort to ensure elite-level training.
                </p>

                <div className="flex flex-wrap gap-4 mb-8 text-slate-400 text-sm font-medium">
                  {[
                    { icon: MapPin, text: "Offline · Accra" },
                    { icon: Target, text: "First Client Guaranteed" },
                    { icon: Flame, text: "Top 2 Get Hired" },
                    { icon: GraduationCap, text: "Diploma Certified" },
                  ].map((item) => (
                    <div key={item.text} className="flex items-center gap-2">
                      <item.icon className="w-4 h-4 text-blue-400" />
                      {item.text}
                    </div>
                  ))}
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 max-w-sm flex items-center justify-between gap-6 mb-6">
                  <div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">One-Time Fee</p>
                    <p className="text-4xl font-black text-white">GHS 1,000</p>
                  </div>
                  <Link href="/apply" className="flex items-center gap-2 h-14 px-7 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition-all hover:-translate-y-0.5 shadow-lg group shrink-0">
                    Apply Now
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                <div className="inline-flex items-center gap-3 px-4 py-2 bg-black/20 rounded-full border border-white/5 w-fit">
                  <p className="text-xs text-slate-400 font-medium">Share with a friend</p>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText("https://remoteworkhub.org")}
                    className="px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
                  >
                    Copy Link
                  </button>
                </div>
              </div>

              {/* Right: Background Image Panel */}
              <div className="w-full lg:w-[420px] relative min-h-[300px] lg:min-h-full">
                <Image
                  src="/hero_bg_dark.jpg"
                  alt="Students coding at Doctor Barns Tech"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#0a192f] via-[#0a192f]/60 to-transparent" />
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

    </div>
  );
}
