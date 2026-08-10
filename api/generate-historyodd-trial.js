import {
  isValidEmail,
  normalizeEmail,
  sameOriginRequest,
  setJsonHeaders,
  verifyLicenseGrant,
} from "./_emailVerification.js";
import { getBearerToken, verifyFirebaseIdToken } from "./_firebaseAuth.js";

const getLicenseUrl = () => process.env.HISTORYODD_LICENSE_URL?.trim();
const getLicenseAdminToken = () =>
  process.env.HISTORYODD_LICENSE_ADMIN_TOKEN?.trim();

const resolveCustomerEmail = async (req) => {
  // Fluxo para usuários já logados: o e-mail vem exclusivamente do Firebase,
  // nunca do body manipulável no navegador.
  const firebaseIdToken = getBearerToken(req);
  if (firebaseIdToken) {
    const firebaseUser = await verifyFirebaseIdToken(firebaseIdToken);
    if (!firebaseUser?.email) {
      return { error: "invalid-auth-token", status: 401 };
    }

    return { customerEmail: normalizeEmail(firebaseUser.email), source: "firebase" };
  }

  // Fluxo já existente do cadastro: o grant é emitido somente após validar
  // o código enviado ao e-mail pelo Resend.
  const customerEmail = normalizeEmail(req.body?.customerEmail);
  const licenseGrant = String(req.body?.licenseGrant || "");

  if (!isValidEmail(customerEmail) || !licenseGrant) {
    return { error: "authentication-required", status: 401 };
  }

  if (!verifyLicenseGrant(customerEmail, licenseGrant)) {
    return { error: "invalid-license-grant", status: 403 };
  }

  return { customerEmail, source: "email-grant" };
};

export default async function handler(req, res) {
  setJsonHeaders(res);

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method-not-allowed" });
  }

  if (!sameOriginRequest(req)) {
    return res.status(403).json({ error: "invalid-origin" });
  }

  const historyOddLicenseUrl = getLicenseUrl();
  const historyOddLicenseAdminToken = getLicenseAdminToken();

  if (!historyOddLicenseUrl) {
    console.error("[TraderTab] HISTORYODD_LICENSE_URL is not configured");
    return res.status(500).json({ error: "license-service-not-configured" });
  }

  if (!historyOddLicenseAdminToken) {
    console.error(
      "[TraderTab] HISTORYODD_LICENSE_ADMIN_TOKEN is not configured",
    );
    return res.status(500).json({ error: "license-admin-token-not-configured" });
  }

  try {
    const identity = await resolveCustomerEmail(req);
    if (identity.error) {
      return res.status(identity.status).json({ error: identity.error });
    }

    if (!isValidEmail(identity.customerEmail)) {
      return res.status(400).json({ error: "invalid-license-request" });
    }

    const upstream = await fetch(historyOddLicenseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${historyOddLicenseAdminToken}`,
      },
      body: JSON.stringify({
        durationDays: 10,
        customerEmail: identity.customerEmail,
        maxDevices: 1,
        productName: "HistoryOddPro",
      }),
    });

    const payload = await upstream.json().catch(() => ({}));

    if (upstream.status === 409 && payload?.error === "TrialAlreadyUsed") {
      return res.status(409).json({ error: "trial-already-used" });
    }

    if (!upstream.ok) {
      console.error(
        "[TraderTab] License service error",
        upstream.status,
        payload,
      );
      return res.status(502).json({ error: "license-service-failed" });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    if (error?.message === "firebase-api-key-not-configured") {
      console.error("[TraderTab] Firebase API key is not configured for API auth");
      return res.status(500).json({ error: "firebase-auth-not-configured" });
    }

    console.error("[TraderTab] License generation error", error);
    return res.status(500).json({ error: "license-generation-failed" });
  }
}
