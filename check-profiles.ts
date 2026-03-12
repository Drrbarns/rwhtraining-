import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function check() {
    console.log("Checking profiles...");
    const { data, error } = await supabase.from("profiles").select("*");
    console.log("Profiles:", data);
    console.log("Error:", error);

    const { data: authData } = await supabase.auth.admin.listUsers();
    console.log("Users:", authData.users.map(u => ({ id: u.id, email: u.email })));
}

check();
