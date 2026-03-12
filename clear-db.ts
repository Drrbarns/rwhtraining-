import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY!);

async function wipeDatabase() {
    console.log("Wiping mock applications...");
    const { error: appsError } = await supabase.from('applications').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (appsError) console.error("Error wiping applications:", appsError);
    else console.log("Applications wiped.");

    console.log("Wiping mock enrollments...");
    const { error: enrollsError } = await supabase.from('enrollments').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (enrollsError) console.error("Error wiping enrollments:", enrollsError);
    else console.log("Enrollments wiped.");

    console.log("Wiping mock student profiles...");
    const { error: profError } = await supabase.from('profiles').delete().eq('role', 'STUDENT');
    if (profError) console.error("Error wiping student profiles:", profError);
    else console.log("Student profiles wiped.");

    // Delete users except for the admin
    const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();
    if (usersError) {
        console.error("Error fetching users:", usersError);
    } else {
        const studentUsers = usersData.users.filter(u => u.email !== "admin@rwhmasterclass.com");
        for (const u of studentUsers) {
            await supabase.auth.admin.deleteUser(u.id);
        }
        console.log(`Deleted ${studentUsers.length} test users from Auth.`);
    }

    console.log("Done wiping mock data.");
}

wipeDatabase();
