import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log("Starting...");
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: "admin@rwhmasterclass.com",
        password: "AdminPassword2026!",
    });

    if (authError) {
        fs.writeFileSync("output.json", JSON.stringify({ step: "login", error: authError }));
        return;
    }

    const { data, error } = await supabase.from('profiles').select('role').eq('id', authData.user.id).single();

    fs.writeFileSync("output.json", JSON.stringify({ step: "fetch", data, error }));
}

check().then(() => console.log("Done"));
