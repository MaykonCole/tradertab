import {
  isValidEmail,
  normalizeEmail,
  sameOriginRequest,
  setJsonHeaders,
  verifyLicenseGrant,
} from "./_emailVerification.js";

const HISTORY_ODD_LICENSE_URL = process.env.HISTORYODD_LICENSE_URL?.trim();

export default async function handler(req, res) {
  setJsonHeaders(res);

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method-not-allowed" });
  }

  if (!sameOriginRequest(req)) {
    return res.status(403).json({ error: "invalid-origin" });
  }

  if (!HISTORY_ODD_LICENSE_URL) {
    console.error("[TraderTab] HISTORYODD_LICENSE_URL is not configured");
    return res.status(500).json({ error: "license-service-not-configured" });
  }

  const customerEmail = normalizeEmail(req.body?.customerEmail);
  const licenseGrant = String(req.body?.licenseGrant || "");

  if (!isValidEmail(customerEmail) || !licenseGrant) {
    return res.status(400).json({ error: "invalid-license-request" });
  }

  try {
    if (!verifyLicenseGrant(customerEmail, licenseGrant)) {
      return res.status(403).json({ error: "invalid-license-grant" });
    }

    const upstream = await fetch(HISTORY_ODD_LICENSE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        durationDays: 10,
        customerEmail,
        maxDevices: 1,
        productName: "HistoryOddPro",
      }),
    });

    const payload = await upstream.json().catch(() => ({}));

    if (!upstream.ok) {
      console.error("[TraderTab] License service error", upstream.status, payload);
      return res.status(502).json({ error: "license-service-failed" });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("[TraderTab] License generation error", error);
    return res.status(500).json({ error: "license-generation-failed" });
  }
}
