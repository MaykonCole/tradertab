import {
  isValidEmail,
  normalizeEmail,
  sameOriginRequest,
  setJsonHeaders,
  verifyChallenge,
  createLicenseGrant,
} from "./_emailVerification.js";

export default async function handler(req, res) {
  setJsonHeaders(res);

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method-not-allowed" });
  }

  if (!sameOriginRequest(req)) {
    return res.status(403).json({ error: "invalid-origin" });
  }

  const email = normalizeEmail(req.body?.email);
  const code = String(req.body?.code || "").trim();
  const challenge = String(req.body?.challenge || "");

  if (!isValidEmail(email) || !/^\d{6}$/.test(code) || !challenge) {
    return res.status(400).json({ error: "invalid-verification-data" });
  }

  try {
    if (!verifyChallenge(email, code, challenge)) {
      return res.status(400).json({ error: "invalid-or-expired-code" });
    }

    return res.status(200).json({ verified: true, licenseGrant: createLicenseGrant(email) });
  } catch (error) {
    console.error("[TraderTab] Verification error", error);
    return res.status(500).json({ error: "verification-failed" });
  }
}
