import { loadEnvConfig } from '@next/env';
loadEnvConfig('./');

const MOOLRE_LINK_URL = "https://api.moolre.com/embed/link";

async function run() {
  const apiUser = process.env.MOOLRE_API_USER || "";
  const apiPubKey = process.env.MOOLRE_API_PUBKEY || "";
  const apiKey = process.env.MOOLRE_API_KEY || "";

  try {
    const body = {
      type: 1,
      amount: "500",
      email: "test@example.com",
      externalref: "RWH-TEST-" + Date.now(),
      callback: "http://localhost:3000/api/moolre/webhook",
      redirect: "http://localhost:3000/apply/checkout?ref=test",
      reusable: "0",
      currency: "GHS",
      accountnumber: apiKey,
      metadata: {}
    };

    const res = await fetch(MOOLRE_LINK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-USER": apiUser,
        "X-API-PUBKEY": apiPubKey,
      },
      body: JSON.stringify(body),
    });

    const text = await res.text();
    console.log(`Status: ${res.status}`);
    console.log(`Body: ${text}`);
  } catch (err) {
    console.error(`Error:`, err);
  }
}
run();
