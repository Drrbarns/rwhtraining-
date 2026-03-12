import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: "admin@rwhmasterclass.com",
        password: "AdminPassword2026!",
    });

    if (authError) {
        console.error("Login failed:", authError);
        return;
    }

    console.log("Logged in user:", authData.user.id);

    const { data, error } = await supabase.from('profiles').select('role').eq('id', authData.user.id).single();

    console.log("Profile data:", data);
    console.log("Profile error:", error);
}

check();
