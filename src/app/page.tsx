"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useSpring, Variants } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Rocket,
  GraduationCap,
  Phone,
  MapPin,
  Globe,
  Flame,
  Monitor,
  Building2,
  Briefcase,
  Target,
  Award,
  Terminal,
  Cpu,
  LineChart,
  Users,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SocialShareButtons } from "@/components/SocialShareButtons";

const FADE_UP: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

const STAGGER: Variants = {
  visible: { transition: { staggerChildren: 0.15 } },
};

export default function MasterpieceHomepage() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <div className="bg-white text-slate-900 min-h-screen selection:bg-blue-600/20 selection:text-blue-900 font-sans overflow-x-hidden">
      {/* Scroll Progress */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-blue-600 z-50 origin-left" style={{ scaleX }} />

      {/* ─── STANDARD CORPORATE HEADER ─── */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 py-2 sm:py-3 shadow-sm transition-all h-16 sm:h-20 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full flex items-center justify-between gap-3">

          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-blue-50 text-blue-600">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 hidden sm:flex items-baseline">
              Remote Work Hub
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {['Curriculum', 'Portfolio', 'Challenge', 'Internship', 'FAQ'].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-[14px] font-semibold text-slate-600 hover:text-blue-600 transition-colors py-2"
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* CTA Group */}
          <div className="flex items-center gap-2 sm:gap-5 shrink-0">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md bg-amber-50 border border-amber-200/60">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
              </span>
              <span className="text-[12px] font-bold text-amber-700 tracking-wide whitespace-nowrap">
                Only 10 Seats Available
              </span>
            </div>
            <Link href="/apply">
              <Button className="h-9 px-4 sm:h-11 sm:px-7 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-bold text-[12px] sm:text-[14px] transition-all duration-300 shadow-md hover:shadow-lg">
                Secure Your Seat
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ─── FULL BACKGROUND IMAGE HERO ─── */}
      <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 md:pt-48 md:pb-40 min-h-[90vh] sm:min-h-[95vh] flex items-center overflow-hidden">
        {/* Absolute Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero_bg_dark.jpg"
            alt="Young ambitious web developer learning"
            fill
            className="object-cover object-top"
            priority
          />
          {/* 20% Corporate Blue Overlay */}
          <div className="absolute inset-0 bg-[#0a192f]/20" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="max-w-3xl">

            <motion.div initial="hidden" animate="visible" variants={STAGGER} className="flex flex-col items-start text-left bg-white/95 backdrop-blur-xl p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-[2rem] border border-white/40 shadow-2xl max-w-2xl">

              {/* Top Badge */}
              <motion.div variants={FADE_UP} className="mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                  <span className="text-blue-700 text-[13px] font-bold tracking-widest uppercase">
                    2026 Elite Masterclass
                  </span>
                </div>
              </motion.div>

              {/* Main Headline */}
              <motion.h1 variants={FADE_UP} className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-5 sm:mb-6">
                Become a Professional <br className="hidden lg:block" />
                <span className="text-blue-600">Web Developer</span><br className="hidden lg:block" />
                <span className="text-slate-600 font-semibold tracking-tight text-xl sm:text-2xl md:text-3xl mt-2 sm:mt-3 block">
                  &amp; Secure Your First Client in 30 Days.
                </span>
              </motion.h1>

              {/* Sub-headline */}
              <motion.p variants={FADE_UP} className="text-base sm:text-lg text-slate-600 mb-6 sm:mb-8 leading-relaxed max-w-xl">
                This isn't another tutorial hell. We engineer absolute beginners into high-value developers capable of building the complex systems that corporate clients exactly pay for.
              </motion.p>

              {/* High-End Trust Checks */}
              <motion.div variants={FADE_UP} className="grid sm:grid-cols-2 gap-4 mb-10 w-full">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-[14px] font-bold text-slate-700">Diploma Certification</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                      <Flame className="w-4 h-4 text-amber-500" />
                    </div>
                    <span className="text-[14px] font-bold text-slate-700">Top 2 Get <span className="text-blue-600">Hired</span></span>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="text-[14px] font-bold text-slate-700">First Client <span className="text-emerald-600">Guaranteed</span></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-[14px] font-bold text-slate-700">No Experience Required</span>
                  </div>
                </div>
              </motion.div>

              {/* Primary Call to Action */}
              <motion.div variants={FADE_UP} className="flex flex-col sm:flex-row items-center gap-6 w-full">
                <Link href="/apply" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto h-14 px-8 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-bold text-base transition-all duration-300 shadow-[0_8px_20px_rgba(37,99,235,0.2)] hover:shadow-[0_12px_25px_rgba(37,99,235,0.3)] hover:-translate-y-0.5 group">
                    Apply for the Masterclass
                    <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <div className="flex flex-col items-center sm:items-start shrink-0">
                  <span className="text-[11px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">Program Fee</span>
                  <span className="text-2xl font-black text-slate-900 tracking-tight">GHS 1,000</span>
                </div>
              </motion.div>

            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── THE REALITY SHIFT (High Contrast Deep Blue Section) ─── */}
      <section className="py-16 sm:py-24 bg-[#0a192f] text-white border-y border-[#112240]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 items-center">

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={STAGGER}>
              <motion.span variants={FADE_UP} className="text-blue-400 font-bold uppercase tracking-widest text-sm mb-4 block">The Industry Reality</motion.span>
              <motion.h2 variants={FADE_UP} className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-6">
                Tutorials Will Not Get You Paid.
              </motion.h2>
              <motion.div variants={FADE_UP} className="space-y-6 text-slate-300 text-lg leading-relaxed">
                <p>
                  The market is flooded with "developers" who can only build basic landing pages after watching endless free tutorials online. But here is the brutal truth: <strong className="text-white border-b-2 border-blue-500">Corporate clients don't pay high retainers for landing pages; they pay for complex business systems.</strong>
                </p>
                <p>
                  Our masterclass is a rigid, offline immersion specifically designed to strip away the fluff. We focus entirely on high-value, production-grade logic—the exact systems that companies are actively paying thousands of Cedis to acquire.
                </p>
              </motion.div>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={STAGGER} className="grid sm:grid-cols-2 gap-6">
              {[
                { icon: Terminal, title: "Offline Immersion", desc: "Hands-on, in-person mentorship to enforce focus and rapid learning." },
                { icon: Target, title: "Client Acquisition", desc: "Learn the exact psychology of finding and closing real corporate deals." },
                { icon: Cpu, title: "Real Architecture", desc: "Build scalable databases, strict authentication, and business logic." },
                { icon: Award, title: "Premium Branding", desc: "Position yourself as a highly-skilled agency, not a cheap freelancer." },
              ].map((feature, i) => (
                <div key={i} className="bg-[#112240] border border-[#233554] p-6 rounded-2xl hover:border-blue-500 transition-colors group">
                  <div className="w-12 h-12 bg-blue-500/10 flex items-center justify-center rounded-lg mb-5 group-hover:bg-blue-500/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </motion.div>

          </div>
        </div>
      </section>

      {/* ─── CURRICULUM: WHAT YOU WILL ACHIEVE ─── */}
      <section id="curriculum" className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={STAGGER} className="text-center mb-16 max-w-3xl mx-auto">
            <motion.span variants={FADE_UP} className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-3 block">Program Outcomes</motion.span>
            <motion.h2 variants={FADE_UP} className="text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight mb-6">
              What You Will Achieve by Day 30
            </motion.h2>
            <motion.p variants={FADE_UP} className="text-slate-600 text-lg">
              By the end of this intensive program, you will transition from an absolute beginner to a capable technical consultant ready to take on clients.
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={STAGGER} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
            {[
              { title: "Build Corporate Sites", desc: "Design and code high-performance, responsive websites for corporate entities." },
              { title: "Develop E-Commerce", desc: "Build full-scale online stores including user carts, products, and secure payment flows." },
              { title: "Engineer Dashboards", desc: "Create the internal management software that companies rely on to run daily operations." },
              { title: "Start Your Agency", desc: "Structure your own web development company, from basic legalities to service pricing." },
              { title: "Land Your First Client — Guaranteed", desc: "We don't let you leave without a paying client. Every student signs their first web design contract before the program ends." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                variants={FADE_UP}
                className={`flex gap-4 sm:gap-5 p-5 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-200 hover:shadow-lg transition-all ${i === 4 ? 'sm:col-span-2 lg:col-span-1' : ''}`}
              >
                <div className="shrink-0 mt-1">
                  <CheckCircle className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-slate-900 font-bold text-xl mb-2">{item.title}</h3>
                  <p className="text-slate-600 text-base leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── THE PORTFOLIO: SYSTEMS WE BUILD ─── */}
      <section id="portfolio" className="py-16 sm:py-24 bg-slate-100 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={STAGGER} className="text-center mb-16 max-w-3xl mx-auto">
            <motion.span variants={FADE_UP} className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-3 block">High-Ticket Software</motion.span>
            <motion.h2 variants={FADE_UP} className="text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight mb-6">
              Real Business Systems You Will Build.
            </motion.h2>
            <motion.p variants={FADE_UP} className="text-slate-600 text-lg">
              We focus on building the exact enterprise tools and portals that real businesses use heavily, giving you an elite portfolio right out of the gate.
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={STAGGER} className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {[
              { name: "School Management", desc: "Student, teacher & administrative portals.", icon: Building2 },
              { name: "POS Systems", desc: "Sales, inventory, and automated receipts.", icon: Monitor },
              { name: "Hotel Management", desc: "Real-time room booking and guest tracking.", icon: Briefcase },
              { name: "Hospital Management", desc: "Patient histories, appointments & records.", icon: ShieldCheck },
              { name: "CRM Systems", desc: "Lead pipelines & customer relationships.", icon: Users },
              { name: "Hostel Management", desc: "Tenant bed-space allocation & rent billing.", icon: Building2 },
              { name: "Accounting Software", desc: "Dynamic invoicing & financial reporting.", icon: LineChart },
              { name: "ERP Platforms", desc: "Full-scale company resource planning.", icon: Cpu },
            ].map((sys) => (
              <motion.div
                key={sys.name}
                variants={FADE_UP}
                className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all group"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-3 sm:mb-5 group-hover:bg-blue-600 transition-colors">
                  <sys.icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-bold text-slate-900 text-base sm:text-lg mb-1 sm:mb-2">{sys.name}</h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">{sys.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── OUR GUARANTEES ─── */}
      <section className="py-10 sm:py-16 bg-[#0a192f] border-y border-[#112240]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={STAGGER} className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            <motion.div variants={FADE_UP} className="flex items-start sm:items-center gap-4 sm:gap-5 bg-[#112240] border border-[#233554] rounded-2xl p-5 sm:p-8">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                <Target className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-white font-extrabold text-base sm:text-lg mb-1">First Client Guaranteed</h3>
                <p className="text-slate-400 text-[13px] sm:text-[14px] leading-relaxed">Every single student will sign their first paying web design client before the training ends. We make sure of it.</p>
              </div>
            </motion.div>
            <motion.div variants={FADE_UP} className="flex items-start sm:items-center gap-4 sm:gap-5 bg-[#112240] border border-[#233554] rounded-2xl p-5 sm:p-8">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center shrink-0">
                <Flame className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400" />
              </div>
              <div>
                <h3 className="text-white font-extrabold text-base sm:text-lg mb-1">Top 2 Get Hired by Doctor Barns Tech</h3>
                <p className="text-slate-400 text-[13px] sm:text-[14px] leading-relaxed">The two best-performing students will receive a full-time job offer. Train hard, stand out, and walk into a career.</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── CHALLENGE & PAID INTERNSHIP ─── */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-12">

            {/* The 100K Challenge */}
            <motion.div
              id="challenge"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={FADE_UP}
              className="bg-amber-50 rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-14 border border-amber-200"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-amber-100 text-amber-800 text-sm font-bold uppercase tracking-wider mb-6">
                <Rocket className="w-4 h-4" />
                The Special Challenge
              </div>

              <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 sm:mb-6 leading-tight">
                Join our <span className="text-amber-600">100K in 2 Weeks</span> Client Generation Challenge.
              </h3>

              <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                We don't want you to just know how to code. We mandate that you know how to sell. During the program, you will learn how to:
              </p>

              <div className="space-y-4 text-slate-700 font-medium">
                {[
                  "Find high-paying, verified real-world clients.",
                  "Pitch, negotiate, and close your first contract.",
                  "Start replacing your income with freelance development.",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-amber-500 shrink-0" />
                    <span className="text-[16px] leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* The Internship + Hiring Bonus */}
            <motion.div
              id="internship"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={FADE_UP}
              className="bg-slate-50 rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-14 border border-slate-200 flex flex-col justify-between"
            >
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-100 text-blue-700 text-sm font-bold uppercase tracking-wider mb-6">
                  <Award className="w-4 h-4" />
                  Internship + Hiring
                </div>

                <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 leading-tight">
                  1-Month <span className="text-blue-600">Paid Internship</span>
                </h3>
                <p className="text-slate-900 text-xl font-bold mb-6 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  With Doctor Barns Tech
                </p>
                <p className="text-slate-600 text-[16px] leading-relaxed mb-6">
                  After your 30 days of training, transition directly into an offline, paid internship role. Work elbow-to-elbow with senior developers on actual live projects and supercharge your resume immediately.
                </p>

                <div className="bg-blue-600 text-white rounded-2xl p-5 mb-8">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                      <Flame className="w-5 h-5 text-amber-300" />
                    </div>
                    <span className="font-extrabold text-lg tracking-tight">Top 2 Students Get Hired</span>
                  </div>
                  <p className="text-blue-100 text-[14px] leading-relaxed pl-11">
                    The two highest-performing graduates will receive a <strong className="text-white">full-time job offer</strong> from Doctor Barns Tech. Prove your skill and walk straight into a career.
                  </p>
                </div>
              </div>

              {/* Mentorship Image */}
              <div className="relative w-full h-48 md:h-64 rounded-2xl overflow-hidden shadow-inner mt-4 border border-slate-200">
                <Image
                  src="/internship_mentorship.png"
                  alt="Senior and junior developers collaborating"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ─── FAQ (SEO: Featured Snippets) ─── */}
      <section id="faq" className="py-16 sm:py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={STAGGER} className="text-center mb-16">
            <motion.span variants={FADE_UP} className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-3 block">Common Questions</motion.span>
            <motion.h2 variants={FADE_UP} className="text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight mb-4">
              Frequently Asked Questions
            </motion.h2>
            <motion.p variants={FADE_UP} className="text-slate-600 text-lg max-w-2xl mx-auto">
              Everything you need to know about the masterclass before you apply.
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={STAGGER} className="space-y-4">
            {[
              {
                q: "Do I need any prior coding experience?",
                a: "No. This masterclass is designed for absolute beginners. We take you from zero to building production-ready web applications in 30 days. All you need is a laptop, dedication, and the willingness to learn."
              },
              {
                q: "What exactly will I be able to build after the masterclass?",
                a: "You will build corporate websites, e-commerce platforms with payment integration, management dashboards (school, hotel, hospital, POS systems), CRM tools, and full SaaS products. These are the exact systems that businesses pay thousands of Cedis for."
              },
              {
                q: "Is the first client really guaranteed?",
                a: "Yes. We have a dedicated client acquisition module where you learn lead generation, pitching, and closing. We work with every student individually to ensure you sign your first paying web design client before the program ends."
              },
              {
                q: "How does the paid internship work?",
                a: "After the 30-day masterclass, every student transitions into a 1-month paid internship at Doctor Barns Tech. You'll work on real client projects alongside senior developers, building your portfolio and professional experience."
              },
              {
                q: "What does 'Top 2 Get Hired' mean?",
                a: "The two highest-performing students in the cohort will receive a full-time job offer from Doctor Barns Tech. Performance is evaluated based on project quality, initiative, and client work during the program."
              },
              {
                q: "Can I pay in installments?",
                a: "Yes. You can start with a 20% deposit (GHS 200), a 50% payment (GHS 500), or pay the full GHS 1,000 upfront. All payment tiers secure your seat immediately."
              },
              {
                q: "What tech stack will I learn?",
                a: "You'll master Next.js (React), TypeScript, Tailwind CSS, Supabase (PostgreSQL), authentication systems, payment gateways (Paystack, Moolre), and deployment. This is the same modern stack used by top startups worldwide."
              },
              {
                q: "Is the training online or offline?",
                a: "The masterclass is fully offline and in-person at our training facility on TIT Newtown Road, Accra, Ghana. This ensures hands-on mentorship, peer collaboration, and zero distractions."
              },
              {
                q: "What is the 100K in 2 Weeks Challenge?",
                a: "It's our client generation challenge where students learn to find, pitch, and close high-paying corporate clients. The goal is to help you generate GHS 100,000 worth of contracts within 2 weeks of completing the program."
              },
              {
                q: "What do I get at the end of the program?",
                a: "You receive a Diploma Certification in Web Development, a professional portfolio of real projects, your first paying client, a 1-month paid internship, access to our alumni network, and a chance to be hired full-time by Doctor Barns Tech."
              },
            ].map((faq, i) => (
              <motion.details
                key={i}
                variants={FADE_UP}
                className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                <summary className="flex items-center justify-between cursor-pointer p-4 sm:p-6 text-left font-bold text-slate-900 text-[14px] sm:text-[16px] leading-relaxed list-none [&::-webkit-details-marker]:hidden">
                  <span className="pr-3 sm:pr-4">{faq.q}</span>
                  <span className="text-blue-600 shrink-0 text-2xl font-light group-open:rotate-45 transition-transform duration-300">+</span>
                </summary>
                <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0 text-slate-600 text-[13px] sm:text-[15px] leading-relaxed border-t border-slate-100 mt-0 pt-4">
                  {faq.a}
                </div>
              </motion.details>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── STRONG FINAL CTA ─── */}
      <section className="py-16 sm:py-24 bg-blue-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight mb-4 sm:mb-6">
              Your Engineering Career Starts <span className="text-amber-300">March 16.</span>
            </h2>
            <p className="text-blue-100 text-base sm:text-xl mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
              Certification, paid internship, your first paying client, and the chance to get hired — all included. Limited seats per cohort to ensure elite-level training.
            </p>

            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-8 sm:mb-10 text-white/90 font-medium text-[12px] sm:text-[14px]">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Offline (Accra)
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                First Client Guaranteed
              </div>
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-300" />
                Top 2 Get Hired
              </div>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-6 text-slate-900 mb-10 sm:mb-12">
              <div className="text-left">
                <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-1">One-Time Fee</p>
                <p className="text-4xl font-extrabold text-slate-900">GHS 1,000</p>
              </div>

              <Link href="/apply" className="w-full md:w-auto">
                <Button className="w-full h-16 px-10 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-bold text-lg shadow-md hover:shadow-lg transition-all hover:-translate-y-1 flex items-center justify-center gap-3 group">
                  Apply Now
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>

            <SocialShareButtons />
          </motion.div>
        </div>
      </section>

      {/* ─── WELL THOUGHT OUT BEAUTIFUL FOOTER ─── */}
      <footer className="bg-[#0a192f] text-slate-400 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 border-b border-[#112240] pb-10 sm:pb-12 mb-8">

            {/* Brand Logo & About */}
            <div className="sm:col-span-2 lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600/20 text-blue-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="font-extrabold text-xl tracking-tight text-white">
                  Remote Work Hub
                </div>
              </div>
              <p className="text-[15px] leading-relaxed max-w-md pr-4">
                The premier Elite Web Development & SaaS Masterclass in Ghana. We engineer beginners into highly capable developers, complete with a paid internship and professional certification.
              </p>
            </div>

            {/* Program Links */}
            <div>
              <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">The Program</h4>
              <ul className="space-y-4">
                {['Curriculum', 'Portfolio Systems', 'Internship Bonus', '100K Challenge'].map(link => (
                  <li key={link}>
                    <Link href="/" className="hover:text-blue-400 transition-colors text-sm">{link}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Information */}
            <div>
              <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Contact Us</h4>
              <ul className="space-y-5">
                <li>
                  <a href="tel:+233209636158" className="flex items-center gap-3 hover:text-blue-400 transition-colors text-sm">
                    <Phone className="w-4 h-4 text-blue-500" />
                    +233 20 963 6158
                  </a>
                </li>
                <li>
                  <a href="https://remoteworkhub.org" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-blue-400 transition-colors text-sm">
                    <Globe className="w-4 h-4 text-blue-500" />
                    remoteworkhub.org
                  </a>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <span>TIT Newtown Road,<br /> Accra, Ghana</span>
                </li>
              </ul>
            </div>

          </div>

          <div className="flex flex-col md:flex-row items-center justify-between text-sm">
            <p>&copy; 2026 Remote Work Hub. All rights reserved.</p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <Link href="/" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
// For Clock icon import
function Clock(props: React.ComponentProps<"svg">) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}
