import { Card } from "@/components/ui/card";
import { Settings, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
    return (
        <div className="space-y-10 animate-in slide-in-from-bottom-6 duration-1000">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200/60 pb-8">
                <div className="space-y-3">
                    <h1 className="text-3xl md:text-[42px] font-extrabold tracking-tight text-slate-900 leading-none">System Settings</h1>
                    <p className="text-slate-500 text-[15px] font-medium">Configure gateway links, pricing flags, and platform operations.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="border-slate-200/60 bg-white text-slate-700 hover:text-slate-900 rounded-xl hover:bg-slate-50 transition-all duration-300 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_15px_-3px_rgba(0,0,0,0.05)] font-bold text-[13px] h-11 px-5">
                        <Save className="w-4 h-4 mr-2" /> Save Config
                    </Button>
                </div>
            </div>

            <Card className="border-slate-200/60 bg-white min-h-[500px] flex flex-col items-center justify-center text-center p-8 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] rounded-2xl">
                <div className="relative mb-6">
                    <div className="absolute inset-0 bg-blue-100 blur-2xl rounded-full opacity-50" />
                    <div className="w-20 h-20 rounded-2xl bg-white border border-slate-200/60 flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative z-10">
                        <Settings className="w-10 h-10 text-slate-300" />
                    </div>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-2 tracking-tight">Settings Locked</h3>
                <p className="text-slate-500 max-w-md font-medium leading-relaxed">Global configuration values are hardcoded via your environment deployments securely at this moment.</p>
            </Card>
        </div>
    );
}
