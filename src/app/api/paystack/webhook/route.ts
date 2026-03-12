import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createHmac, timingSafeEqual } from "crypto";
import { onboardPaidStudent } from "@/lib/onboard-paid-student";

/**
 * POST /api/paystack/webhook
 * Receives payment events from Paystack.
 * Verifies signature and updates payment record on charge.success.
 */
export async function POST(request: NextRequest) {
    try {
        const rawBody = await request.text();
        const signature = request.headers.get("x-paystack-signature") || "";

        const secretKey = process.env.PAYSTACK_SECRET_KEY;
        if (!secretKey) {
            console.error("[Paystack Webhook] Missing PAYSTACK_SECRET_KEY");
            return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
        }

        // Verify webhook signature
        const expectedHash = createHmac("sha512", secretKey).update(rawBody).digest("hex");
        if (!timingSafeEqual(Buffer.from(expectedHash, "hex"), Buffer.from(signature, "hex"))) {
            console.error("[Paystack Webhook] Invalid signature");
            return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
        }

        const body = JSON.parse(rawBody);
        const event = body.event;
        const data = body.data;

        if (event !== "charge.success") {
            return NextResponse.json({ received: true });
        }

        const reference = data?.reference;
        if (!reference) {
            console.error("[Paystack Webhook] No reference in charge.success");
            return NextResponse.json({ error: "Missing reference" }, { status: 400 });
        }

        console.log(`[Paystack Webhook] charge.success for ${reference}`);

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY;

        if (supabaseUrl && supabaseServiceKey) {
            const supabase = createClient(supabaseUrl, supabaseServiceKey);

            const { error: paymentError } = await supabase
                .from("payments")
                .update({
                    status: "PAID",
                    paystack_response: data,
                    paid_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                })
                .eq("reference", reference)
                .eq("gateway", "paystack");

            if (paymentError) {
                console.error("[Paystack Webhook] Error updating payment:", paymentError);
            } else {
                console.log(`[Paystack Webhook] Payment ${reference} updated to PAID`);

                const { data: appData, error: appError } = await supabase
                    .from("applications")
                    .update({
                        payment_status: "PAID",
                        status: "APPROVED",
                        updated_at: new Date().toISOString(),
                    })
                    .eq("payment_reference", reference)
                    .select()
                    .single();

                if (appError) {
                    console.error("[Paystack Webhook] Error updating application:", appError);
                } else if (appData) {
                    console.log(`[Paystack Webhook] Setting up student portal for ${appData.email}`);
                    const result = await onboardPaidStudent(supabase, appData);
                    if (!result.ok) {
                        console.error("[Paystack Webhook] Onboarding error:", result.error);
                    }
                }
            }
        }

        return NextResponse.json({ received: true, reference });
    } catch (error) {
        console.error("[Paystack Webhook] Processing error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({
        service: "Paystack Webhook Handler",
        status: "active",
        timestamp: new Date().toISOString(),
    });
}
