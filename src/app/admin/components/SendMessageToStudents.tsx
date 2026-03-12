"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Loader2, X, Send } from "lucide-react";

type Props = { paidCount: number };

export function SendMessageToStudents({ paidCount }: Props) {
    const [open, setOpen] = useState(false);
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ sent: number; total: number; message: string } | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!body.trim()) return;
        setLoading(true);
        setResult(null);
        try {
            const res = await fetch("/api/admin/email-students", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    subject: subject.trim() || "Message from Remote Work Hub Masterclass",
                    body: body.trim(),
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to send");
            setResult({ sent: data.sent, total: data.total, message: data.message });
            setSubject("");
            setBody("");
        } catch (err) {
            setResult({
                sent: 0,
                total: 0,
                message: err instanceof Error ? err.message : "Something went wrong.",
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="flex items-center justify-between w-full p-4 rounded-xl border border-slate-200/60 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all group text-left"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <Mail className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900">Email Paid Students</h4>
                        <p className="text-xs text-slate-500 font-medium">
                            Send message to {paidCount} paid {paidCount === 1 ? "student" : "students"}
                        </p>
                    </div>
                </div>
            </button>

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div
                        className="absolute inset-0"
                        onClick={() => {
                            if (!loading) setOpen(false);
                        }}
                    />
                    <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 border border-slate-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-extrabold text-slate-900">Send Message to Paid Students</h3>
                            <button
                                onClick={() => !loading && setOpen(false)}
                                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label className="text-slate-600 font-semibold">Subject</Label>
                                <Input
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="e.g. Welcome to the Masterclass"
                                    className="mt-1.5 rounded-xl"
                                />
                            </div>
                            <div>
                                <Label className="text-slate-600 font-semibold">Message (HTML supported)</Label>
                                <Textarea
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                    placeholder="Hi {{first_name}}, &#10;&#10;Your message here..."
                                    rows={8}
                                    required
                                    className="mt-1.5 rounded-xl resize-none"
                                />
                                <p className="text-xs text-slate-400 mt-1">
                                    Use {"{{first_name}}"} for personalized greeting
                                </p>
                            </div>
                            {result && (
                                <div
                                    className={`p-3 rounded-xl text-sm font-medium ${
                                        result.sent > 0
                                            ? "bg-emerald-50 text-emerald-700"
                                            : "bg-amber-50 text-amber-700"
                                    }`}
                                >
                                    {result.message}
                                </div>
                            )}
                            <div className="flex gap-3 pt-2">
                                <Button
                                    type="submit"
                                    disabled={loading || !body.trim()}
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4 mr-2" />
                                            Send to {paidCount} {paidCount === 1 ? "student" : "students"}
                                        </>
                                    )}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => !loading && setOpen(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
