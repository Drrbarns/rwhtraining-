export interface PaystackTransactionPayload {
    email: string;
    amount_ghs: number;
    first_name: string;
    last_name: string;
    reference?: string;
    returnPath?: string;
}

export interface PaystackGatewayResponse {
    reference: string;
    checkout_url: string | null;
    status: "INITIATED" | "SUCCESS" | "FAILED" | "PENDING";
    message: string;
    raw?: unknown;
}

const PAYSTACK_API_URL = "https://api.paystack.co";

/**
 * Paystack Payment Adapter — For card & international payments
 * Supports Ghana (GHS) and international card payments.
 * Amount in GHS is converted to pesewas (1 GHS = 100 pesewas).
 */
export class PaystackAdapter {
    /**
     * Generate a unique transaction reference (shared with Moolre for consistency)
     */
    static generateReference(): string {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 100000)
            .toString()
            .padStart(5, "0");
        return `RWH-${timestamp}-${random}`;
    }

    /**
     * Initiate a card/international payment via Paystack
     */
    static async initializeTransaction(
        payload: PaystackTransactionPayload
    ): Promise<PaystackGatewayResponse> {
        const reference = payload.reference || this.generateReference();
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const returnSuffix = payload.returnPath ? `&returnPath=${encodeURIComponent(payload.returnPath)}` : "";
        const callbackUrl = `${appUrl}/apply/checkout?ref=${reference}&amount=${payload.amount_ghs}&gateway=paystack${returnSuffix}`;

        const secretKey = process.env.PAYSTACK_SECRET_KEY;

        if (!secretKey) {
            console.error("[PaystackAdapter] Missing PAYSTACK_SECRET_KEY");
            return {
                reference,
                checkout_url: `/apply/checkout?ref=${reference}&amount=${payload.amount_ghs}&status=failed`,
                status: "FAILED",
                message: "Paystack is not configured. Please use Mobile Money for Ghana.",
            };
        }

        // Paystack uses smallest currency unit: GHS → pesewas (× 100)
        const amountInPesewas = Math.round(payload.amount_ghs * 100);

        try {
            const body = {
                email: payload.email,
                amount: amountInPesewas,
                currency: "GHS",
                reference,
                callback_url: callbackUrl,
                metadata: {
                    first_name: payload.first_name,
                    last_name: payload.last_name,
                },
            };

            const response = await fetch(`${PAYSTACK_API_URL}/transaction/initialize`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${secretKey}`,
                },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (data.status === true && data.data?.authorization_url) {
                return {
                    reference,
                    checkout_url: data.data.authorization_url,
                    status: "PENDING",
                    message: data.message || "Payment initiated. Complete payment on the next page.",
                    raw: data,
                };
            }

            return {
                reference,
                checkout_url: `/apply/checkout?ref=${reference}&amount=${payload.amount_ghs}&status=failed`,
                status: "FAILED",
                message: data.message || "Payment initiation failed.",
                raw: data,
            };
        } catch (error) {
            console.error("[Paystack] Network error:", error);
            return {
                reference,
                checkout_url: `/apply/checkout?ref=${reference}&amount=${payload.amount_ghs}&status=error`,
                status: "FAILED",
                message: "Could not connect to payment gateway. Please try again.",
            };
        }
    }

    /**
     * Verify a Paystack transaction
     */
    static async verifyTransaction(reference: string): Promise<{
        status: "SUCCESS" | "PENDING" | "FAILED";
        message: string;
        data?: unknown;
    }> {
        const secretKey = process.env.PAYSTACK_SECRET_KEY;

        if (!secretKey) {
            return { status: "FAILED", message: "Missing Paystack configuration" };
        }

        try {
            const response = await fetch(
                `${PAYSTACK_API_URL}/transaction/verify/${encodeURIComponent(reference)}`,
                {
                    headers: {
                        Authorization: `Bearer ${secretKey}`,
                    },
                }
            );

            const data = await response.json();

            if (!data.status) {
                return {
                    status: "FAILED",
                    message: data.message || "Verification failed.",
                };
            }

            const txStatus = data.data?.status?.toLowerCase();

            if (txStatus === "success") {
                return {
                    status: "SUCCESS",
                    message: "Payment verified successfully.",
                    data: data.data,
                };
            }

            if (txStatus === "pending" || txStatus === "processing" || txStatus === "abandoned") {
                return {
                    status: "PENDING",
                    message: data.message || "Payment is still processing.",
                    data: data.data,
                };
            }

            return {
                status: "FAILED",
                message: data.message || "Payment verification failed.",
                data: data.data,
            };
        } catch (error) {
            console.error("[Paystack] Verify error:", error);
            return {
                status: "FAILED",
                message: "Could not verify payment status.",
            };
        }
    }
}
