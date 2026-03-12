import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupAdmin() {
    console.log("Setting up Master Admin Account...");
    const email = "admin@rwhmasterclass.com";
    const password = "AdminPassword2026!";

    // 1. Create the user in Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true,
        user_metadata: { full_name: "Master Admin" }
    });

    if (authError && !authError.message.includes('already been registered')) {
        console.error("Failed to create admin auth user:", authError);
        return;
    }

    // Try finding the user if they already exist
    const { data: usersData } = await supabase.auth.admin.listUsers();
    const user = usersData?.users.find(u => u.email === email);

    if (user) {
        // 2. Insert or update the profile to ADMIN
        const { error: profileError } = await supabase.from('profiles').upsert({
            id: user.id,
            role: 'SUPER_ADMIN',
            full_name: 'Master Admin',
            phone: '0000000000',
            city: 'HQ'
        });

        if (profileError) {
            console.error("Failed to update profile role:", profileError);
        } else {
            console.log("\n✅ ADMIN CREATED SUCCESSFULLY!");
            console.log("===================================");
            console.log("Email:    ", email);
            console.log("Password: ", password);
            console.log("===================================");
            console.log("Login at /admin to access the Mission Control.");
        }
    }
}

setupAdmin();
