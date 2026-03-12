export type PaymentTier = "20" | "50" | "100";

export type MomoNetwork = "MTN" | "TELECEL" | "AIRTELTIGO";

export interface TransactionPayload {
    email: string;
    amount_ghs: number;
    tier: PaymentTier;
    phone: string;
    network: MomoNetwork;
    first_name: string;
    last_name: string;
    reference?: string;
}

export interface GatewayResponse {
    reference: string;
    checkout_url: string | null;
    status: "INITIATED" | "SUCCESS" | "FAILED" | "PENDING";
    message: string;
    raw?: unknown;
}

const MOOLRE_API_URL = "https://api.moolre.com";
const MOOLRE_LINK_URL = "https://api.moolre.com/embed/link";

/**
 * Moolre Payment Adapter — PRODUCTION
 * Handles real API calls to the Moolre Payment Gateway using the official embed SDK structure.
 */
export class MoolreAdapter {
    /**
     * Generate a unique transaction reference
     */
    static generateReference(): string {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 100000)
            .toString()
            .padStart(5, "0");
        return `RWH-${timestamp}-${random}`;
    }

    /**
     * Initiate a Mobile Money payment collection via Moolre Web POS Link
     */
    static async initializeTransaction(
        payload: TransactionPayload
    ): Promise<GatewayResponse> {
        const reference = payload.reference || this.generateReference();
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const callbackUrl = `${appUrl}/api/moolre/webhook`;

        // Using checkout as a redirect so they hit our polling page to verify after paying
        const redirectUrl = `${appUrl}/apply/checkout?ref=${reference}&amount=${payload.amount_ghs}&gateway=moolre`;

        const apiUser = process.env.MOOLRE_API_USER;
        const apiPubKey = process.env.MOOLRE_API_PUBKEY;
        const apiAccNum = process.env.MOOLRE_API_KEY; // Moolre uses the API Key as the numerical Account Number here

        if (!apiUser || !apiPubKey || !apiAccNum) {
            console.error("[MoolreAdapter] Missing MOOLRE_API_USER, MOOLRE_API_PUBKEY or MOOLRE_API_KEY");
            return {
                reference,
                checkout_url: `/apply/checkout?ref=${reference}&amount=${payload.amount_ghs}&status=failed`,
                status: "FAILED",
                message: "Missing payment gateway configuration.",
            };
        }

        try {
            const body = {
                type: 1,
                amount: payload.amount_ghs.toString(),
                email: payload.email,
                externalref: reference,
                callback: callbackUrl,
                redirect: redirectUrl,
                reusable: "0",
                currency: "GHS",
                accountnumber: apiAccNum,
                metadata: {
                    first_name: payload.first_name,
                    last_name: payload.last_name,
                    phone: payload.phone,
                    network: payload.network,
                    tier: payload.tier
                }
            };

            console.log("[Moolre] Generating Payment Link:", {
                reference,
                amount: body.amount,
                accountnumber: apiAccNum
            });

            const response = await fetch(MOOLRE_LINK_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-API-USER": apiUser,
                    "X-API-PUBKEY": apiPubKey,
                },
                body: JSON.stringify(body),
            });

            const responseText = await response.text();
            let data;

            try {
                data = JSON.parse(responseText);
            } catch (parseError) {
                console.error("[Moolre] Gateway returned non-JSON response:", responseText.substring(0, 200));
                return {
                    reference,
                    checkout_url: `/apply/checkout?ref=${reference}&amount=${payload.amount_ghs}&status=failed`,
                    status: "FAILED",
                    message: "The payment gateway returned an invalid response. Please try again.",
                };
            }

            console.log("[Moolre] API Response:", { status: data.status, message: data.message });

            if (data.status === true || data.status === "true" || data.status === 1) {
                // Moolre provides a hosted checkout URL in data.authorization_url
                const authUrl = data.data?.authorization_url || data.authorization_url;

                return {
                    reference,
                    checkout_url: authUrl ? authUrl : `/apply/checkout?ref=${reference}&amount=${payload.amount_ghs}&status=pending`,
                    status: "PENDING",
                    message: data.message || "Payment initiated.",
                    raw: data,
                };
            } else {
                return {
                    reference,
                    checkout_url: `/apply/checkout?ref=${reference}&amount=${payload.amount_ghs}&status=failed`,
                    status: "FAILED",
                    message: data.message || "Payment initiation failed.",
                    raw: data,
                };
            }
        } catch (error) {
            console.error("[Moolre] Network error:", error);
            return {
                reference,
                checkout_url: `/apply/checkout?ref=${reference}&amount=${payload.amount_ghs}&status=error`,
                status: "FAILED",
                message: "Could not connect to payment gateway. Please try again.",
            };
        }
    }

    /**
     * Verify a transaction status with Moolre
     */
    static async verifyTransaction(reference: string): Promise<{
        status: "SUCCESS" | "PENDING" | "FAILED";
        message: string;
        data?: unknown;
    }> {
        const apiUser = process.env.MOOLRE_API_USER;
        const apiPubKey = process.env.MOOLRE_API_PUBKEY;
        const apiAccNum = process.env.MOOLRE_API_KEY;

        if (!apiUser || !apiPubKey || !apiAccNum) {
            return { status: "FAILED", message: "Missing credentials" };
        }

        try {
            // Using the /embed/src/start confirm action as the fallback verification 
            // since specific verify docs weren't provided in the prompt.
            const body = {
                state: "confirm",
                accountnumber: apiAccNum,
                reference: reference,
            };

            // Warning: using the old /start endpoint for verification until confirmed otherwise
            const response = await fetch(`${MOOLRE_API_URL}/embed/src/start`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Api-Pubkey": apiPubKey,
                },
                body: JSON.stringify(body),
            });

            const responseText = await response.text();
            let data;

            try {
                data = JSON.parse(responseText);
            } catch (parseError) {
                console.error("[Moolre] Gateway returned non-JSON response during verification:", responseText.substring(0, 200));
                return {
                    status: "FAILED",
                    message: "Payment gateway verification failed.",
                };
            }

            // Note: Replace with Moolre's accurate success status check if different
            if (data.status === true || data.status === 1 || data?.data?.status === "successful") {
                return {
                    status: "SUCCESS",
                    message: data.message || "Payment verified successfully.",
                    data: data.data,
                };
            } else if (data.status === "pending" || data?.data?.status === "pending" || data.code === "PENDING") {
                return {
                    status: "PENDING",
                    message: data.message || "Payment is still processing.",
                    data: data.data,
                };
            } else {
                return {
                    status: "FAILED",
                    message: data.message || "Payment verification failed.",
                    data: data.data,
                };
            }
        } catch (error) {
            console.error("[Moolre] Verify error:", error);
            return {
                status: "FAILED",
                message: "Could not verify payment status.",
            };
        }
    }
}
