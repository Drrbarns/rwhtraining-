"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ShieldCheck, CheckCircle2, CreditCard, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { submitApplicationAction } from "@/app/actions/submit-application";
import { autosaveApplicationAction } from "@/app/actions/autosave";

export default function ApplyPage() {
    const [step, setStep] = useState(1);
    const [applicationId, setApplicationId] = useState<string | null>(null);
    const [selectedTier, setSelectedTier] = useState("50");
    const [selectedNetwork, setSelectedNetwork] = useState("MTN");
    const [paymentMethod, setPaymentMethod] = useState<"moolre" | "paystack">("moolre");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const totalSteps = 4;
    const progressPercent = (step / totalSteps) * 100;

    const handleNext = async () => {
        const currentStepDiv = document.getElementById(`step-${step}`);
        if (currentStepDiv) {
            const invalidFields = currentStepDiv.querySelectorAll(':invalid');
            if (invalidFields.length > 0) {
                const firstInvalid = invalidFields[0] as HTMLInputElement | HTMLTextAreaElement;
                if (firstInvalid && typeof firstInvalid.reportValidity === 'function') {
                    firstInvalid.reportValidity();
                }
                return;
            }
        }

        // Autosave when moving to the next step
        try {
            const form = document.querySelector('form') as HTMLFormElement;
            if (form) {
                const formData = new FormData(form);
                formData.set("tier", selectedTier);
                const res = await autosaveApplicationAction(formData, applicationId || undefined);
                if (res.success && res.id) {
                    setApplicationId(res.id);
                }
            }
        } catch (error) {
            console.error("Autosave failed:", error);
        }

        if (step < totalSteps) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const form = e.target as HTMLFormElement;
            const formData = new FormData(form);
            // Append the selected tier since RadioGroup doesn't natively serialize
            formData.set("tier", selectedTier);
            formData.set("paymentMethod", paymentMethod);
            if (applicationId) {
                formData.set("applicationId", applicationId);
            }

            const res = await submitApplicationAction(formData);

            if (res.success && res.redirect_url) {
                window.location.href = res.redirect_url;
            } else {
                alert(`Error: ${res.error || "Something went wrong sending your application. Please try again."}`);
                setIsSubmitting(false);
            }
        } catch (error) {
            console.error("Submission failed:", error);
            alert("A critical network error occurred. Please check your connection and try again.");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-gray-100 flex flex-col md:flex-row font-sans selection:bg-purple-500/30">

            {/* Left Banner Info (Always visible on md/lg) */}
            <div className="hidden md:flex md:w-[40%] lg:w-[35%] border-r border-white/5 flex-col justify-between p-12 lg:p-14 relative overflow-hidden group">
                {/* Hero 3 Backing */}
                <div
                    className="absolute inset-0 bg-[url('/hero3.jpeg')] bg-cover bg-center opacity-30 group-hover:scale-105 transition-transform duration-[20s] ease-out pointer-events-none"
                    style={{ filter: "grayscale(80%) sepia(20%) hue-rotate(5deg)" }}
                />

                {/* Premium Gradated Overlays */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/70 via-[#121212]/90 to-[#121212] pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(37,99,235,0.15),transparent_50%)] pointer-events-none mix-blend-color-dodge" />

                <div className="relative z-10 isolate flex flex-col h-full">
                    <div>
                        <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white font-semibold text-xs uppercase tracking-widest transition-colors mb-16 group/link">
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover/link:-translate-x-1.5 transition-transform" />
                            Back to Masterclass
                        </Link>

                        <h1 className="text-4xl lg:text-5xl font-serif font-bold tracking-tight mb-6 text-white leading-[1.1]">
                            Extreme <br className="hidden lg:block" />Engineering.
                        </h1>
                        <p className="text-gray-400 leading-relaxed mb-12 text-[15px] max-w-sm">
                            This application acts as your first technical commit. We filter strictly for ambition and the drive to command top-tier scalable software.
                        </p>

                        <div className="space-y-4">
                            <div className="flex gap-4 items-start group/feature p-5 -ml-5 rounded-2xl hover:bg-white/[0.03] border border-transparent hover:border-white/5 transition-all">
                                <div className="p-2.5 bg-[#2563EB]/10 border border-[#2563EB]/20 rounded-xl shrink-0 group-hover/feature:border-[#2563EB]/40 group-hover/feature:shadow-[0_0_15px_rgba(37,99,235,0.1)] transition-all">
                                    <ShieldCheck className="w-5 h-5 text-[#2563EB]" />
                                </div>
                                <div>
                                    <strong className="block text-gray-200 mb-1 font-bold text-sm tracking-wider uppercase">Strict Quality Control</strong>
                                    <span className="text-gray-500 font-medium text-sm leading-relaxed block pr-4">Only 10 slots maximum per cohort. Ensuring pure, high-fidelity technical mentoring.</span>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start group/feature p-5 -ml-5 rounded-2xl hover:bg-white/[0.03] border border-transparent hover:border-white/5 transition-all">
                                <div className="p-2.5 bg-[#2563EB]/10 border border-[#2563EB]/20 rounded-xl shrink-0 group-hover/feature:border-[#2563EB]/40 group-hover/feature:shadow-[0_0_15px_rgba(37,99,235,0.1)] transition-all">
                                    <CheckCircle2 className="w-5 h-5 text-[#2563EB]" />
                                </div>
                                <div>
                                    <strong className="block text-gray-200 mb-1 font-bold text-sm tracking-wider uppercase">Zero-Theory Driven</strong>
                                    <span className="text-gray-500 font-medium text-sm leading-relaxed block pr-4">No padded content. You assemble and launch production-grade infrastructure immediately.</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto pt-8 flex items-end justify-between border-t border-white/5">
                        <span className="text-[10px] text-gray-600 tracking-widest uppercase font-bold">© 2026 RWH</span>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse" />
                            <span className="text-[10px] text-[#2563EB] tracking-widest uppercase font-bold">Secure Portal</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Form Area */}
            <div className="w-full md:w-[60%] lg:w-[65%] flex flex-col min-h-screen">

                {/* Mobile Header Elements */}
                <div className="md:hidden p-6 border-b border-white/5 bg-[#121212]">
                    <Link href="/" className="inline-flex items-center text-gray-400 font-medium text-sm mb-4 tracking-wide">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Return
                    </Link>
                    <h2 className="text-xl font-bold tracking-tight">Application Portal</h2>
                </div>

                {/* Progress Bar & Frame Container */}
                <div className="flex-grow flex flex-col justify-center max-w-2xl px-8 py-12 mx-auto w-full relative">

                    <div className="mb-14 relative">
                        <div className="flex items-end justify-between mb-5">
                            <div className="flex flex-col gap-1.5">
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-white/20 animate-pulse" />
                                    Phase {step} <span className="text-white/20 px-1">/</span> {totalSteps}
                                </span>
                                <span className="text-white font-serif text-lg tracking-wide hidden sm:block">
                                    {step === 1 && "Personal Details"}
                                    {step === 2 && "Profile & Background"}
                                    {step === 3 && "Motivation & Commitment"}
                                    {step === 4 && "Select Enrollment Tier"}
                                </span>
                            </div>
                            <span className="text-xs font-bold text-[#2563EB] tracking-[0.2em]">
                                {step === 1 && "INITIATION"}
                                {step === 2 && "ANALYSIS"}
                                {step === 3 && "COMMITMENT"}
                                {step === 4 && "SECURE SLOT"}
                            </span>
                        </div>

                        {/* God-level progress timeline */}
                        <div className="relative w-full h-[1px] bg-white/[0.05] rounded-full overflow-visible">
                            {/* Glowing active bar */}
                            <div
                                className="absolute top-1/2 -translate-y-1/2 left-0 h-[2px] bg-gradient-to-r from-[#2563EB]/40 to-[#2563EB] transition-all duration-1000 ease-in-out rounded-full shadow-[0_0_12px_rgba(37,99,235,0.8)]"
                                style={{ width: `${progressPercent}%` }}
                            >
                                <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_white]" />
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8 min-h-[400px]">

                        {/* Step 1: Basics */}
                        <div id="step-1" className={`space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ${step === 1 ? 'block' : 'hidden'}`}>
                            <div>
                                <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3 tracking-tight text-white">Who are you?</h2>
                                <p className="text-gray-400 text-lg leading-relaxed">Basic identification to secure your position in the upcoming cohort.</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-3 relative group">
                                    <Label htmlFor="firstName" className="text-gray-400 font-bold uppercase tracking-widest text-xs transition-colors group-focus-within:text-[#2563EB]">First Name</Label>
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-full h-1/2 bg-[#2563EB]/5 blur-[20px] opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000 pointer-events-none rounded-full" />
                                    <Input id="firstName" name="firstName" placeholder="Kwame" className="relative z-10 h-14 bg-[#121212] border-white/10 rounded-2xl px-5 text-base focus:border-[#2563EB]/40 focus:ring-1 focus:ring-[#2563EB]/20 text-gray-200 placeholder:text-gray-600 shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-all" required />
                                </div>
                                <div className="space-y-3 relative group">
                                    <Label htmlFor="lastName" className="text-gray-400 font-bold uppercase tracking-widest text-xs transition-colors group-focus-within:text-[#2563EB]">Last Name</Label>
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-full h-1/2 bg-[#2563EB]/5 blur-[20px] opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000 pointer-events-none rounded-full" />
                                    <Input id="lastName" name="lastName" placeholder="Mensah" className="relative z-10 h-14 bg-[#121212] border-white/10 rounded-2xl px-5 text-base focus:border-[#2563EB]/40 focus:ring-1 focus:ring-[#2563EB]/20 text-gray-200 placeholder:text-gray-600 shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-all" required />
                                </div>
                            </div>

                            <div className="space-y-3 relative group">
                                <Label htmlFor="email" className="text-gray-400 font-bold uppercase tracking-widest text-xs transition-colors group-focus-within:text-[#2563EB]">Email Address</Label>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-full h-1/2 bg-[#2563EB]/5 blur-[20px] opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000 pointer-events-none rounded-full" />
                                <Input id="email" name="email" type="email" placeholder="k.mensah@example.com" className="relative z-10 h-14 bg-[#121212] border-white/10 rounded-2xl px-5 text-base focus:border-[#2563EB]/40 focus:ring-1 focus:ring-[#2563EB]/20 text-gray-200 placeholder:text-gray-600 shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-all" required />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-3 relative group">
                                    <Label htmlFor="phone" className="text-gray-400 font-bold uppercase tracking-widest text-xs transition-colors group-focus-within:text-[#2563EB]">WhatsApp Number</Label>
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-full h-1/2 bg-[#2563EB]/5 blur-[20px] opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000 pointer-events-none rounded-full" />
                                    <Input id="phone" name="phone" type="tel" placeholder="+233 5X XXX XXXX" className="relative z-10 h-14 bg-[#121212] border-white/10 rounded-2xl px-5 text-base focus:border-[#2563EB]/40 focus:ring-1 focus:ring-[#2563EB]/20 text-gray-200 placeholder:text-gray-600 shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-all" required />
                                </div>
                                <div className="space-y-3 relative group">
                                    <Label htmlFor="city" className="text-gray-400 font-bold uppercase tracking-widest text-xs transition-colors group-focus-within:text-[#2563EB]">City / Location</Label>
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-full h-1/2 bg-[#2563EB]/5 blur-[20px] opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000 pointer-events-none rounded-full" />
                                    <Input id="city" name="city" placeholder="e.g. Accra, Ghana" className="relative z-10 h-14 bg-[#121212] border-white/10 rounded-2xl px-5 text-base focus:border-[#2563EB]/40 focus:ring-1 focus:ring-[#2563EB]/20 text-gray-200 placeholder:text-gray-600 shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-all" required />
                                </div>
                            </div>
                        </div>

                        {/* Step 2: Background */}
                        <div id="step-2" className={`space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ${step === 2 ? 'block' : 'hidden'}`}>
                            <div>
                                <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3 tracking-tight text-white">Your Background.</h2>
                                <p className="text-gray-400 text-lg leading-relaxed">We accept absolute beginners, but we strictly require professionals with a high action threshold.</p>
                            </div>

                            <div className="space-y-4">
                                <Label className="text-gray-300 font-bold uppercase tracking-widest text-[#2563EB] text-xs">Current Occupation</Label>
                                <RadioGroup defaultValue="student" className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2" name="occupation">
                                    {['Student', 'Recent Graduate', 'Employed Professional', 'Freelancer/Entrepreneur'].map((opt) => (
                                        <div key={opt} className="relative group">
                                            <div className="absolute inset-0 bg-[#2563EB]/5 blur-[20px] opacity-0 group-focus-within:opacity-100 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-2xl" />
                                            <div className="flex items-center space-x-3 border border-white/5 bg-[#121212] rounded-2xl p-5 hover:border-[#2563EB]/20 hover:bg-white/[0.02] transition-all cursor-pointer shadow-sm relative z-10">
                                                <RadioGroupItem value={opt.toLowerCase()} id={`occ-${opt}`} className="border-gray-500 text-[#2563EB] data-[state=checked]:border-[#2563EB]" />
                                                <Label htmlFor={`occ-${opt}`} className="text-gray-200 font-medium cursor-pointer flex-1">{opt}</Label>
                                            </div>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>

                            <div className="space-y-4 pt-4">
                                <Label className="text-gray-300 font-bold uppercase tracking-widest text-[#2563EB] text-xs">Prior Coding Experience Level</Label>
                                <RadioGroup defaultValue="none" className="grid gap-4 pt-2" name="experience">
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-[#2563EB]/5 blur-[20px] opacity-0 group-focus-within:opacity-100 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-2xl" />
                                        <div className="flex items-center space-x-4 border border-white/5 bg-[#121212] rounded-2xl p-6 hover:border-[#2563EB]/20 hover:bg-white/[0.02] transition-all cursor-pointer shadow-sm relative z-10">
                                            <RadioGroupItem value="none" id="exp-1" className="border-gray-500 mt-0.5 text-[#2563EB] data-[state=checked]:border-[#2563EB]" />
                                            <Label htmlFor="exp-1" className="cursor-pointer flex-1">
                                                <span className="block font-bold text-gray-200 mb-1.5 text-[15px]">Absolute Beginner</span>
                                                <span className="text-gray-500 font-medium text-sm leading-relaxed block">I have never written a line of code. Ready to start from point zero.</span>
                                            </Label>
                                        </div>
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-[#2563EB]/5 blur-[20px] opacity-0 group-focus-within:opacity-100 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-2xl" />
                                        <div className="flex items-center space-x-4 border border-white/5 bg-[#121212] rounded-2xl p-6 hover:border-[#2563EB]/20 hover:bg-white/[0.02] transition-all cursor-pointer shadow-sm relative z-10">
                                            <RadioGroupItem value="some" id="exp-2" className="border-gray-500 mt-0.5 text-[#2563EB] data-[state=checked]:border-[#2563EB]" />
                                            <Label htmlFor="exp-2" className="cursor-pointer flex-1">
                                                <span className="block font-bold text-gray-200 mb-1.5 text-[15px]">Know Some Basics</span>
                                                <span className="text-gray-500 font-medium text-sm leading-relaxed block">I've watched tutorials or know basic HTML/CSS. Ready to build full-scale apps.</span>
                                            </Label>
                                        </div>
                                    </div>
                                </RadioGroup>
                            </div>

                            <div className="pt-6">
                                <div className="flex items-start gap-4 p-5 rounded-2xl border border-[#2563EB]/10 bg-[#2563EB]/5 hover:border-[#2563EB]/20 transition-all duration-500 shadow-sm relative overflow-hidden group">
                                    <div className="absolute top-0 left-0 w-1 p-0 h-full bg-[#2563EB]/50 scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-bottom" />
                                    <Checkbox id="laptop" name="laptop" className="mt-1 w-5 h-5 border-[#2563EB]/40 data-[state=checked]:bg-[#2563EB] data-[state=checked]:border-[#2563EB] data-[state=checked]:text-black shrink-0 transition-colors" required />
                                    <div className="space-y-1.5 pt-0.5 w-full">
                                        <Label htmlFor="laptop" className="cursor-pointer text-[15px] font-bold text-[#2563EB] block">Hardware & Internet Requirement</Label>
                                        <Label htmlFor="laptop" className="cursor-pointer text-sm text-[#2563EB]/70 leading-relaxed font-medium block">I confirm that I have access to a reliable, working laptop and an internet connection to participate in this cohort.</Label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Step 3: Motivation */}
                        <div id="step-3" className={`space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ${step === 3 ? 'block' : 'hidden'}`}>
                            <div>
                                <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3 tracking-tight text-white">Your Drive.</h2>
                                <p className="text-gray-400 text-lg leading-relaxed">We don't do theoretical padding. Prove your ambition to claim a seat.</p>
                            </div>

                            <div className="space-y-4">
                                <Label htmlFor="reason" className="text-gray-300 font-bold uppercase tracking-widest text-[#2563EB] text-xs">Why you over thousands of others?</Label>
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-[#2563EB]/10 blur-[40px] opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000 pointer-events-none rounded-2xl" />
                                    <Textarea id="reason" name="reason" placeholder="I am tired of basic tutorials. I want to engineer production-ready apps..." className="relative min-h-[180px] bg-[#121212] border-white/10 rounded-2xl p-6 text-[15px] focus:border-[#2563EB]/40 focus:ring-1 focus:ring-[#2563EB]/20 resize-none leading-relaxed text-gray-200 placeholder:text-gray-600 transition-all z-10 shadow-[0_4px_20px_rgba(0,0,0,0.2)]" required />
                                </div>
                            </div>

                            <div className="space-y-4 pt-6">
                                {/* Commit Card */}
                                <div className="flex items-start gap-4 p-5 rounded-2xl border border-white/5 bg-[#121212] hover:border-white/10 hover:bg-white/[0.02] transition-all duration-500 shadow-sm relative overflow-hidden group">
                                    <div className="absolute top-0 left-0 w-1 p-0 h-full bg-[#2563EB]/30 scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-bottom" />
                                    <Checkbox id="commit" name="commit" className="mt-1 w-5 h-5 border-gray-600 data-[state=checked]:bg-[#2563EB] data-[state=checked]:border-[#2563EB] data-[state=checked]:text-black shrink-0 transition-colors" required />
                                    <div className="space-y-1.5 pt-0.5 w-full">
                                        <Label htmlFor="commit" className="cursor-pointer text-[15px] font-bold text-gray-200 block">Savage Execution Required</Label>
                                        <Label htmlFor="commit" className="cursor-pointer text-sm text-gray-500 leading-relaxed font-medium block">I understand this is a highly practical execution program. I commit to putting in the necessary hours. Results strictly depend on my execution.</Label>
                                    </div>
                                </div>

                                {/* Refund Card */}
                                <div className="flex items-start gap-4 p-5 rounded-2xl border border-red-500/10 bg-red-500/5 hover:border-red-500/20 hover:bg-red-500/10 transition-all duration-500 shadow-sm relative overflow-hidden group">
                                    <div className="absolute top-0 left-0 w-1 p-0 h-full bg-red-500/50 scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-bottom" />
                                    <Checkbox id="refund" name="refund" className="mt-1 w-5 h-5 border-red-500/40 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500 data-[state=checked]:text-white shrink-0 transition-colors" required />
                                    <div className="space-y-1.5 pt-0.5 w-full">
                                        <Label htmlFor="refund" className="cursor-pointer text-[15px] font-bold text-red-300 block">Strictly Non-Refundable</Label>
                                        <Label htmlFor="refund" className="cursor-pointer text-sm text-red-200/60 leading-relaxed font-medium block">I have explicitly read and accepted that all reservation deposits and tuition payments are final once a slot is secured.</Label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Step 4: Payment Target */}
                        <div id="step-4" className={`space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ${step === 4 ? 'block' : 'hidden'}`}>
                            <div>
                                <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3 tracking-tight text-white">Final Step: Secure Seat.</h2>
                                <p className="text-gray-400 text-lg leading-relaxed">How would you like to handle your enrollment fee today? Completing this blocks your seat out of the 10 available.</p>
                            </div>

                            <div className="space-y-4">
                                {/* Tier 1: Deposit */}
                                <button
                                    type="button"
                                    onClick={() => setSelectedTier("20")}
                                    className={`group relative w-full flex items-center justify-between p-6 rounded-2xl border bg-[#121212] cursor-pointer transition-all duration-500 text-left overflow-hidden ${selectedTier === "20" ? "border-[#2563EB] shadow-[0_4px_30px_rgba(37,99,235,0.1)]" : "border-white/5 hover:border-white/10 hover:bg-white/[0.02]"}`}
                                >
                                    <div className={`absolute top-0 left-0 w-1 p-0 h-full bg-[#2563EB]/50 transition-transform duration-500 origin-bottom ${selectedTier === "20" ? 'scale-y-100' : 'scale-y-0 group-hover:scale-y-100'}`} />
                                    <div className="flex gap-4 items-center pl-2 relative z-10">
                                        <div className={`w-5 h-5 rounded-full border transition-colors flex items-center justify-center shrink-0 ${selectedTier === "20" ? "border-[#2563EB] bg-[#2563EB]" : "border-gray-600 group-hover:border-gray-500"}`}>
                                            {selectedTier === "20" && <div className="w-2 h-2 bg-black rounded-full shadow-sm" />}
                                        </div>
                                        <div>
                                            <span className="block text-[17px] tracking-wide font-bold text-gray-200 mb-1 transition-colors">20% Deposit <span className={`font-medium ml-2 text-sm transition-colors ${selectedTier === "20" ? "text-[#2563EB]/80" : "text-gray-600"}`}>(GHS 200)</span></span>
                                            <span className="text-[15px] font-medium text-gray-500 transition-colors">Lock your seat now, pay the rest later.</span>
                                        </div>
                                    </div>
                                </button>

                                {/* Tier 2: 50% (Recommended) */}
                                <button
                                    type="button"
                                    onClick={() => setSelectedTier("50")}
                                    className={`group relative w-full flex items-center justify-between p-6 rounded-2xl border bg-[#121212] cursor-pointer transition-all duration-500 text-left overflow-hidden ${selectedTier === "50" ? "border-[#2563EB] shadow-[0_4px_30px_rgba(37,99,235,0.15)] bg-[#2563EB]/[0.02]" : "border-[#2563EB]/20 hover:border-[#2563EB]/40 hover:bg-[#2563EB]/5"}`}
                                >
                                    <div className="absolute right-0 top-0 bg-[#2563EB] text-black text-[10px] font-bold px-4 py-1.5 uppercase tracking-widest rounded-bl-xl shadow-sm">Recommended</div>
                                    <div className={`absolute top-0 left-0 w-1.5 p-0 h-full bg-[#2563EB] transition-transform duration-500 origin-bottom ${selectedTier === "50" ? 'scale-y-100' : 'scale-y-0 group-hover:scale-y-100 shadow-[0_0_15px_rgba(37,99,235,1)]'}`} />
                                    <div className="absolute inset-0 bg-[#2563EB]/5 blur-[30px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

                                    <div className="flex gap-4 items-center pl-2 relative z-10">
                                        <div className={`w-5 h-5 rounded-full border transition-colors flex items-center justify-center shrink-0 ${selectedTier === "50" ? "border-[#2563EB] bg-[#2563EB]" : "border-[#2563EB]/30 group-hover:border-[#2563EB]/60"}`}>
                                            {selectedTier === "50" && <div className="w-2 h-2 bg-black rounded-full shadow-sm" />}
                                        </div>
                                        <div>
                                            <span className={`block text-[17px] tracking-wide font-bold mb-1 transition-colors ${selectedTier === "50" ? "text-white" : "text-gray-200"}`}>50% Half-Payment <span className={`font-medium ml-2 text-sm transition-colors ${selectedTier === "50" ? "text-[#2563EB]" : "text-[#2563EB]/60"}`}>(GHS 500)</span></span>
                                            <span className="text-[15px] font-medium text-gray-500 transition-colors">Access all initial portal features immediately.</span>
                                        </div>
                                    </div>
                                </button>

                                {/* Tier 3: 100% */}
                                <button
                                    type="button"
                                    onClick={() => setSelectedTier("100")}
                                    className={`group relative w-full flex items-center justify-between p-6 rounded-2xl border bg-[#121212] cursor-pointer transition-all duration-500 text-left overflow-hidden ${selectedTier === "100" ? "border-white/50 shadow-[0_4px_30px_rgba(255,255,255,0.05)] bg-white/[0.02]" : "border-white/5 hover:border-white/10 hover:bg-white/[0.02]"}`}
                                >
                                    <div className={`absolute top-0 left-0 w-1 p-0 h-full bg-white/30 transition-transform duration-500 origin-bottom ${selectedTier === "100" ? 'scale-y-100' : 'scale-y-0 group-hover:scale-y-100'}`} />

                                    <div className="flex gap-4 items-center pl-2 relative z-10">
                                        <div className={`w-5 h-5 rounded-full border transition-colors flex items-center justify-center shrink-0 ${selectedTier === "100" ? "border-white bg-white" : "border-gray-600 group-hover:border-gray-500"}`}>
                                            {selectedTier === "100" && <div className="w-2 h-2 bg-black rounded-full shadow-sm" />}
                                        </div>
                                        <div>
                                            <span className={`block text-[17px] tracking-wide font-bold mb-1 transition-colors ${selectedTier === "100" ? "text-white" : "text-gray-200"}`}>100% Full Payment <span className="text-gray-600 font-medium ml-2 text-sm">(GHS 1000)</span></span>
                                            <span className="text-[15px] font-medium text-gray-500 transition-colors">Zero distractions. Full VIP priority boarding.</span>
                                        </div>
                                    </div>
                                </button>
                            </div>

                            {/* Payment Method Selector */}
                            <div className="mt-8 pt-8 border-t border-white/10 space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-1">Payment Method</h3>
                                    <p className="text-gray-500 text-sm">Choose how you would like to pay. International users can pay with card.</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod("moolre")}
                                        className={`flex items-start gap-4 p-5 rounded-2xl border text-left transition-all ${
                                            paymentMethod === "moolre"
                                                ? "border-[#2563EB] bg-[#2563EB]/10 shadow-[0_0_20px_rgba(37,99,235,0.15)]"
                                                : "border-white/5 bg-[#121212] hover:border-white/10"
                                        }`}
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center shrink-0">
                                            <Phone className="w-5 h-5 text-yellow-400" />
                                        </div>
                                        <div>
                                            <span className="block font-bold text-gray-200 mb-1">Mobile Money (Ghana)</span>
                                            <span className="text-sm text-gray-500">MTN MoMo, Telecel, AirtelTigo — pay with your phone.</span>
                                        </div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod("paystack")}
                                        className={`flex items-start gap-4 p-5 rounded-2xl border text-left transition-all ${
                                            paymentMethod === "paystack"
                                                ? "border-[#00c3f7] bg-[#00c3f7]/10 shadow-[0_0_20px_rgba(0,195,247,0.15)]"
                                                : "border-white/5 bg-[#121212] hover:border-white/10"
                                        }`}
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-[#00c3f7]/20 flex items-center justify-center shrink-0">
                                            <CreditCard className="w-5 h-5 text-[#00c3f7]" />
                                        </div>
                                        <div>
                                            <span className="block font-bold text-gray-200 mb-1">Card / International</span>
                                            <span className="text-sm text-gray-500">Visa, Mastercard — for those outside Ghana.</span>
                                        </div>
                                    </button>
                                </div>
                                <input type="hidden" name="paymentMethod" value={paymentMethod} />
                            </div>

                            {/* Mobile Money Payment Details — only when Moolre selected */}
                            {paymentMethod === "moolre" && (
                            <div className="mt-6 pt-6 border-t border-white/10 space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-1">Mobile Money Details</h3>
                                    <p className="text-gray-500 text-sm">Enter the number that will receive the payment prompt.</p>
                                </div>

                                <div className="space-y-4">
                                    <Label htmlFor="network" className="text-gray-300 font-bold uppercase tracking-widest text-[#2563EB] text-xs">Network Provider</Label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { value: "MTN", label: "MTN MoMo", activeColor: "border-yellow-500 bg-yellow-500/20 text-yellow-300 shadow-[0_0_20px_rgba(234,179,8,0.15)]", color: "border-yellow-500/20 bg-yellow-500/5 text-yellow-400 hover:bg-yellow-500/10" },
                                            { value: "TELECEL", label: "Telecel Cash", activeColor: "border-red-500 bg-red-500/20 text-red-300 shadow-[0_0_20px_rgba(239,68,68,0.15)]", color: "border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10" },
                                            { value: "AIRTELTIGO", label: "AT Money", activeColor: "border-blue-500 bg-blue-500/20 text-blue-300 shadow-[0_0_20px_rgba(59,130,246,0.15)]", color: "border-blue-500/20 bg-blue-500/5 text-blue-400 hover:bg-blue-500/10" },
                                        ].map((net) => (
                                            <button
                                                key={net.value}
                                                type="button"
                                                onClick={() => setSelectedNetwork(net.value)}
                                                className={`p-4 rounded-xl border text-center font-bold text-sm transition-all ${selectedNetwork === net.value ? net.activeColor : net.color}`}
                                            >
                                                {net.label}
                                            </button>
                                        ))}
                                    </div>
                                    <input type="hidden" name="network" value={selectedNetwork} />
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="momoNumber" className="text-gray-300 font-bold uppercase tracking-widest text-[#2563EB] text-xs">Mobile Money Number</Label>
                                    <Input
                                        id="momoNumber"
                                        name="momoNumber"
                                        type="tel"
                                        placeholder="0241234567"
                                        className="bg-[#121212] border-white/10 rounded-2xl p-6 text-[15px] focus:border-[#2563EB]/40 focus:ring-1 focus:ring-[#2563EB]/20 text-gray-200 placeholder:text-gray-600 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.2)] h-14"
                                        required
                                    />
                                    <p className="text-gray-600 text-xs">This number will receive a payment prompt from Moolre. Make sure it matches your selected network.</p>
                                </div>
                            </div>
                            )}
                        </div>

                        {/* Navigation Buttons footer */}
                        <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                            <Button type="button" variant="ghost" onClick={handleBack} disabled={step === 1} className="group flex items-center gap-3 text-gray-400 hover:text-white hover:bg-transparent px-2 font-semibold tracking-wide disabled:opacity-30 transition-all">
                                <div className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center group-hover:border-transparent group-hover:bg-white/10 transition-all">
                                    <ArrowLeft className="w-4 h-4" />
                                </div>
                                Go Back
                            </Button>

                            {step < totalSteps ? (
                                <Button type="button" onClick={handleNext} className="bg-white hover:bg-gray-200 text-black rounded-full px-8 h-12 font-bold tracking-wide shadow-lg shadow-white/5">
                                    Continue Form
                                </Button>
                            ) : (
                                <Button type="submit" disabled={isSubmitting} className="bg-[#D4AF37] hover:bg-[#B5952F] text-black rounded-full px-10 h-14 text-lg font-bold tracking-wide shadow-[0_0_40px_-10px_rgba(212,175,55,0.4)] disabled:opacity-50">
                                    {isSubmitting ? "Processing..." : "Proceed to Checkout"}
                                    {!isSubmitting && <ArrowRight className="ml-2 w-5 h-5" />}
                                </Button>
                            )}
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}
