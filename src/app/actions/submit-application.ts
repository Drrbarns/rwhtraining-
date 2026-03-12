"use server";

import { MoolreAdapter, type PaymentTier, type MomoNetwork, type TransactionPayload } from "@/lib/moolre-adapter";
import { PaystackAdapter } from "@/lib/paystack-adapter";
import { createClient } from "@supabase/supabase-js";

export async function submitApplicationAction(formData: FormData) {
    // 1. Gather all data from form
    const applicationId = formData.get("applicationId") as string || ""; // ID if they started as a draft
    const firstName = (formData.get("firstName") as string) || "";
    const lastName = (formData.get("lastName") as string) || "";
    const email = (formData.get("email") as string) || "";
    const phone = (formData.get("phone") as string) || "";
    const city = (formData.get("city") as string) || "";
    const occupation = (formData.get("occupation") as string) || "";
    const experience = (formData.get("experience") as string) || "";
    const reason = (formData.get("reason") as string) || "";
    const tier = (formData.get("tier") as PaymentTier) || "50";
    const paymentMethod = (formData.get("paymentMethod") as string) || "moolre";
    const network = (formData.get("network") as MomoNetwork) || "MTN";
    const momoNumber = (formData.get("momoNumber") as string) || phone;

    const usePaystack = paymentMethod === "paystack";

    let amount_ghs = 500;
    if (tier === "20") amount_ghs = 200;
    if (tier === "100") amount_ghs = 1000;

    // 2. Validate minimum required fields
    if (!firstName || !lastName || !email) {
        return { success: false, error: "Missing required fields", redirect_url: null };
    }

    if (!usePaystack && !momoNumber) {
        return { success: false, error: "Mobile money number is required for Mobile Money payments", redirect_url: null };
    }

    // 3. Generate unique payment reference
    const reference = MoolreAdapter.generateReference();

    // 4. Save application and payment to Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY;

    if (supabaseUrl && supabaseServiceKey) {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        const applicationData = {
            first_name: firstName,
            last_name: lastName,
            email,
            phone,
            city,
            occupation,
            experience,
            reason,
            tier,
            amount_ghs,
            payment_reference: reference,
            payment_status: "PENDING",
            status: "PENDING_REVIEW",
            is_unfinished: false, // Mark as final
            updated_at: new Date().toISOString(),
        };

        let appError;
        if (applicationId) {
            // Update the existing draft application record
            const { error } = await supabase.from("applications")
                .update(applicationData)
                .eq("id", applicationId);
            appError = error;
        } else {
            // Insert a new application record if no draft ID provided
            const { error } = await supabase.from("applications").insert({
                ...applicationData,
                created_at: new Date().toISOString(),
            });
            appError = error;
        }

        if (appError) {
            console.error("[RWH] Failed to save application:", appError);
        }

        // Insert the payment record
        const { error: payError } = await supabase.from("payments").insert({
            reference,
            email,
            phone: usePaystack ? phone : momoNumber,
            network: usePaystack ? "CARD" : network,
            amount_ghs,
            tier,
            first_name: firstName,
            last_name: lastName,
            gateway: usePaystack ? "paystack" : "moolre",
            status: "PENDING",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        });

        if (payError) {
            console.error("[RWH] Failed to save payment:", payError);
        }
    }

    // 5. Call payment gateway (Moolre or Paystack)
    let gatewayRes;

    if (usePaystack) {
        gatewayRes = await PaystackAdapter.initializeTransaction({
            email,
            amount_ghs,
            first_name: firstName,
            last_name: lastName,
            reference,
        });
        console.log("[RWH] Paystack response:", {
            reference: gatewayRes.reference,
            status: gatewayRes.status,
            message: gatewayRes.message,
        });
    } else {
        const transactionPayload: TransactionPayload = {
            email,
            amount_ghs,
            tier,
            phone: momoNumber,
            network,
            first_name: firstName,
            last_name: lastName,
            reference,
        };
        gatewayRes = await MoolreAdapter.initializeTransaction(transactionPayload);
        console.log("[RWH] Moolre response:", {
            reference: gatewayRes.reference,
            status: gatewayRes.status,
            message: gatewayRes.message,
        });
    }

    return {
        success: true,
        error: null,
        redirect_url: gatewayRes.checkout_url,
        reference: gatewayRes.reference,
        payment_status: gatewayRes.status,
        message: gatewayRes.message,
    };
}
