/**
 * Check for saved data in completed vs abandoned draft applications.
 * Run: npx tsx check-application-data.ts
 */
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_SERVICE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase
    .from("applications")
    .select("id, first_name, last_name, email, status, is_unfinished, created_at, updated_at");

  if (error) {
    console.error("Error fetching applications:", error.message);
    process.exit(1);
  }

  const all = data ?? [];
  const completed = all.filter((a) => !a.is_unfinished);
  const abandoned = all.filter((a) => a.is_unfinished);

  console.log("═══ APPLICATION DATA SUMMARY ═══\n");
  console.log(`Total records:     ${all.length}`);
  console.log(`Completed:         ${completed.length}`);
  console.log(`Abandoned drafts:  ${abandoned.length}\n`);

  if (completed.length > 0) {
    console.log("═══ COMPLETED APPLICATIONS ═══");
    completed.forEach((a, i) => {
      console.log(
        `${i + 1}. ${a.first_name} ${a.last_name} | ${a.email} | ${a.status} | ${a.created_at}`
      );
    });
    console.log("");
  }

  if (abandoned.length > 0) {
    console.log("═══ ABANDONED DRAFTS ═══");
    abandoned.forEach((a, i) => {
      console.log(
        `${i + 1}. ${a.first_name || "—"} ${a.last_name || "—"} | ${a.email || "No email"} | ${a.updated_at}`
      );
    });
  }

  if (all.length === 0) {
    console.log("No application data found in the database.");
  }
}

check();
