import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { PaystackAdapter } from "@/lib/paystack-adapter";

/**
 * POST /api/student/pay-balance
 * Initiates a Paystack payment for the student's outstanding balance.
 * Authenticated via Bearer token (student's Supabase access token).
 */
export async function POST(request: NextRequest) {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseServiceKey) {
            return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
        }

        const authHeader = request.headers.get("authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const accessToken = authHeader.substring(7);

        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Verify the student's token
        const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
        if (authError || !user) {
            return NextResponse.json({ error: "Invalid session" }, { status: 401 });
        }

        // Get approved application
        const { data: application } = await supabase
            .from("applications")
            .select("*")
            .eq("user_id", user.id)
            .eq("status", "APPROVED")
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

        if (!application) {
            return NextResponse.json({ error: "No approved application found" }, { status: 404 });
        }

        // Get enrollment with outstanding balance
        const { data: enrollment } = await supabase
            .from("enrollments")
            .select("*")
            .eq("user_id", user.id)
            .single();

        if (!enrollment || Number(enrollment.balance_due) <= 0) {
            return NextResponse.json({ error: "No outstanding balance" }, { status: 400 });
        }

        const balanceDue = Number(enrollment.balance_due);
        const reference = PaystackAdapter.generateReference();

        // Save balance payment record
        await supabase.from("payments").insert({
            reference,
            email: user.email || application.email,
            phone: application.phone || "",
            first_name: application.first_name || "",
            last_name: application.last_name || "",
            network: "CARD",
            amount_ghs: balanceDue,
            tier: application.tier || "50",
            gateway: "paystack",
            payment_type: "balance",
            application_id: application.id,
            status: "PENDING",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        });

        // Initialize Paystack transaction
        const gatewayRes = await PaystackAdapter.initializeTransaction({
            email: user.email || application.email,
            amount_ghs: balanceDue,
            first_name: application.first_name || "",
            last_name: application.last_name || "",
            reference,
            returnPath: "/student",
        });

        if (!gatewayRes.checkout_url) {
            return NextResponse.json({ error: gatewayRes.message || "Payment initialization failed" }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            checkout_url: gatewayRes.checkout_url,
            reference,
            amount: balanceDue,
        });
    } catch (error) {
        console.error("[Pay Balance] Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
