"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export async function deleteApplicationAction(id: string) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        return { success: false, error: "Supabase config missing" };
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { error } = await supabase
        .from("applications")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("[RWH] Delete application error:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/admin");
    revalidatePath("/admin/applications");
    revalidatePath("/admin/drafts");
    return { success: true };
}