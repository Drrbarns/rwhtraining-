/**
 * Creates a test student account so you can log in to the student dashboard.
 * Run: npx tsx create-test-student.ts
 * Then sign in at https://remoteworkhub.org/student with the credentials below.
 */
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey =
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY!;

const TEST_EMAIL = "teststudent@remoteworkhub.org";
const TEST_PASSWORD = "TestView123!";

async function main() {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or service key in .env.local");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Get active cohort
  const { data: cohort } = await supabase
    .from("cohorts")
    .select("id")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  const cohortId = cohort?.id;
  if (!cohortId) {
    console.error("No active cohort found. Create one in Supabase first.");
    process.exit(1);
  }

  // Create or get auth user
  let userId: string;
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
    email_confirm: true,
    user_metadata: { full_name: "Test Student" },
  });

  if (authError) {
    if (authError.message.includes("already been registered")) {
      const { data: list } = await supabase.auth.admin.listUsers();
      const existing = list?.users?.find((u) => u.email === TEST_EMAIL);
      if (!existing) {
        console.error("User exists but could not be found:", authError.message);
        process.exit(1);
      }
      userId = existing.id;
      console.log("Test student user already exists. Ensuring profile and enrollment...");
    } else {
      console.error("Failed to create test student:", authError.message);
      process.exit(1);
    }
  } else {
    userId = authData.user!.id;
  }

  // Profile (STUDENT) — must exist before application (user_id FK)
  await supabase.from("profiles").upsert({
    id: userId,
    role: "STUDENT",
    full_name: "Test Student",
    phone: "0000000000",
    city: "Accra",
  });

  // Minimal application for this test user
  const { data: app } = await supabase
    .from("applications")
    .select("id")
    .eq("email", TEST_EMAIL)
    .limit(1)
    .single();

  let applicationId: string;
  if (app?.id) {
    applicationId = app.id;
    await supabase.from("applications").update({ user_id: userId }).eq("id", applicationId);
  } else {
    const { data: newApp, error: insertAppErr } = await supabase
      .from("applications")
      .insert({
        first_name: "Test",
        last_name: "Student",
        email: TEST_EMAIL,
        phone: "0000000000",
        tier: "50",
        amount_ghs: 500,
        payment_status: "PAID",
        status: "APPROVED",
        is_unfinished: false,
        cohort_id: cohortId,
        user_id: userId,
      })
      .select("id")
      .single();
    if (insertAppErr || !newApp?.id) {
      console.error("Failed to create application:", insertAppErr?.message);
      process.exit(1);
    }
    applicationId = newApp.id;
  }

  // Enrollment
  const { data: existingEnroll } = await supabase
    .from("enrollments")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (!existingEnroll) {
    await supabase.from("enrollments").insert({
      user_id: userId,
      cohort_id: cohortId,
      application_id: applicationId,
      is_active: true,
      total_paid: 500,
      balance_due: 500,
    });
  }

  console.log("\n✅ TEST STUDENT READY\n");
  console.log("==========================================");
  console.log("  Student portal: https://remoteworkhub.org/student");
  console.log("  Email:         ", TEST_EMAIL);
  console.log("  Password:      ", TEST_PASSWORD);
  console.log("==========================================\n");
}

main();
