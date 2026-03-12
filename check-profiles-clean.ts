import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY!);

async function check() {
    console.log("Checking profiles...");
    const { data, error } = await supabase.from("profiles").select("*");
    console.log(JSON.stringify(data, null, 2));
}

check();
