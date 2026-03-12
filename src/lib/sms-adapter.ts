/**
 * SMS Adapter - Supports Moolre, Hubtel, Arkesel, or generic HTTP SMS gateways.
 * Configure via environment variables.
 *
 * Moolre SMS (Ghana):
 *   SMS_PROVIDER      = "moolre"
 *   MOOLRE_SMS_VASKEY = your X-API-VASKEY from Moolre dashboard
 *   SMS_SENDER_ID     = approved sender ID (must be registered with Moolre)
 *
 * Other providers:
 *   SMS_PROVIDER    = "hubtel" | "arkesel" | "generic"
 *   SMS_API_KEY     = your API key
 *   SMS_API_SECRET  = your API secret (Hubtel)
 *   SMS_SENDER_ID   = sender name (e.g. "RWH")
 *   SMS_BASE_URL    = base URL for generic provider
 */

const MOOLRE_SMS_URL = "https://api.moolre.com/open/sms/send";

export interface SmsPayload {
  to: string;
  message: string;
  senderName?: string;
  ref?: string;
}

export interface SmsResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export class SmsAdapter {
  private static get provider() {
    return process.env.SMS_PROVIDER || "moolre";
  }

  private static get apiKey() {
    return process.env.SMS_API_KEY || "";
  }

  private static get apiSecret() {
    return process.env.SMS_API_SECRET || "";
  }

  private static get senderId() {
    return process.env.SMS_SENDER_ID || "RWH";
  }

  /** Moolre SMS: X-API-VASKEY from Moolre dashboard (SMS / VAS product) */
  private static get moolreVasKey() {
    return process.env.MOOLRE_SMS_VASKEY || "";
  }

  static isConfigured(): boolean {
    if (this.provider === "moolre") {
      return !!this.moolreVasKey && !!this.senderId;
    }
    return !!this.apiKey;
  }

  /**
   * Format for Ghana: 233XXXXXXXXX (no leading + for Moolre API).
   * Moolre typically expects local format (0XXXXXXXXX) or 233XXXXXXXXX.
   */
  static formatPhoneGhana(phone: string): string {
    let cleaned = phone.replace(/\s+/g, "").replace(/[^0-9+]/g, "");
    if (cleaned.startsWith("+")) {
      cleaned = cleaned.slice(1);
    }
    if (cleaned.startsWith("0")) {
      cleaned = "233" + cleaned.slice(1);
    } else if (!cleaned.startsWith("233")) {
      cleaned = "233" + cleaned;
    }
    return cleaned;
  }

  static async send(payload: SmsPayload): Promise<SmsResult> {
    if (!this.isConfigured()) {
      console.log("[SMS] Not configured, skipping:", payload.to);
      return { success: false, error: "SMS not configured" };
    }

    const to = this.formatPhoneGhana(payload.to);
    const sender = payload.senderName || this.senderId;

    try {
      switch (this.provider) {
        case "moolre":
          return await this.sendMoolre(to, payload.message, sender, payload.ref);
        case "arkesel":
          return await this.sendArkesel(to, payload.message, sender);
        case "hubtel":
          return await this.sendHubtel(to, payload.message, sender);
        default:
          return await this.sendGeneric(to, payload.message, sender);
      }
    } catch (error) {
      console.error("[SMS] Send error:", error);
      return { success: false, error: String(error) };
    }
  }

  /**
   * Moolre SMS Gateway - POST https://api.moolre.com/open/sms/send
   * Headers: X-API-VASKEY (required), Content-Type: application/json
   * Body: { type: 1, senderid, messages: [{ recipient, message, ref? }] }
   */
  private static async sendMoolre(
    recipient: string,
    message: string,
    senderId: string,
    ref?: string
  ): Promise<SmsResult> {
    const vasKey = this.moolreVasKey;
    if (!vasKey) {
      return { success: false, error: "MOOLRE_SMS_VASKEY is not set" };
    }

    const body = {
      type: 1,
      senderid: senderId,
      messages: [
        {
          recipient,
          message,
          ...(ref ? { ref } : {}),
        },
      ],
    };

    const res = await fetch(MOOLRE_SMS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-VASKEY": vasKey,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok && (data.status === 1 || data.status === "1")) {
      return {
        success: true,
        messageId: ref || data.data?.ref || undefined,
      };
    }

    const errorMessage =
      data.message || (typeof data.code === "string" ? data.code : "Moolre SMS failed");
    return { success: false, error: errorMessage };
  }

  private static async sendArkesel(to: string, message: string, sender: string): Promise<SmsResult> {
    const res = await fetch("https://sms.arkesel.com/api/v2/sms/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": this.apiKey,
      },
      body: JSON.stringify({
        sender,
        message,
        recipients: [to],
      }),
    });

    const data = await res.json();
    if (res.ok && data.status === "success") {
      return { success: true, messageId: data.data?.[0]?.id };
    }
    return { success: false, error: data.message || "Arkesel SMS failed" };
  }

  private static async sendHubtel(to: string, message: string, sender: string): Promise<SmsResult> {
    const auth = Buffer.from(`${this.apiKey}:${this.apiSecret}`).toString("base64");
    const res = await fetch("https://smsc.hubtel.com/v1/messages/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${auth}`,
      },
      body: JSON.stringify({
        From: sender,
        To: to,
        Content: message,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      return { success: true, messageId: data.MessageId };
    }
    return { success: false, error: data.Message || "Hubtel SMS failed" };
  }

  private static async sendGeneric(to: string, message: string, sender: string): Promise<SmsResult> {
    const baseUrl = process.env.SMS_BASE_URL;
    if (!baseUrl) return { success: false, error: "SMS_BASE_URL not set" };

    const res = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({ to, message, sender }),
    });

    const data = await res.json();
    return { success: res.ok, messageId: data.id, error: data.error };
  }

  static async sendBulk(messages: SmsPayload[]): Promise<SmsResult[]> {
    const results: SmsResult[] = [];
    for (const msg of messages) {
      const result = await this.send(msg);
      results.push(result);
      await new Promise(r => setTimeout(r, 100));
    }
    return results;
  }
}
