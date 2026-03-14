/**
 * Resets all student accounts to the default password: 12345678
 * Students will be prompted to change it on first login via the dashboard.
 *
 * Run: npx tsx reset-student-passwords.ts
 */
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const DEFAULT_PASSWORD = "12345678";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey =
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function main() {
    if (!supabaseUrl || !supabaseServiceKey) {
        console.error("Missing NEXT_PUBLIC_SUPABASE_URL or service key in .env.local");
        process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get all student profiles
    const { data: students, error } = await supabase
        .from("profiles")
        .select("id, full_name, role")
        .eq("role", "STUDENT");

    if (error) {
        console.error("Failed to fetch students:", error.message);
        process.exit(1);
    }

    if (!students?.length) {
        console.log("No students found.");
        return;
    }

    console.log(`\nResetting passwords for ${students.length} student(s) to "${DEFAULT_PASSWORD}"...\n`);

    let success = 0;
    let failed = 0;

    for (const student of students) {
        const { error: updateError } = await supabase.auth.admin.updateUserById(student.id, {
            password: DEFAULT_PASSWORD,
        });

        if (updateError) {
            console.error(`  ❌ ${student.full_name} (${student.id}): ${updateError.message}`);
            failed++;
        } else {
            console.log(`  ✅ ${student.full_name}`);
            success++;
        }
    }

    console.log(`\n==========================================`);
    console.log(`  Done: ${success} updated, ${failed} failed`);
    console.log(`  Default password: ${DEFAULT_PASSWORD}`);
    console.log(`  Students login at: https://remoteworkhub.org/student`);
    console.log(`==========================================\n`);
}

main();
