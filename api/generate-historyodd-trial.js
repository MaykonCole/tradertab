import {
  isValidEmail,
  normalizeEmail,
  sameOriginRequest,
  setJsonHeaders,
} from "./_emailVerification.js";
import { getBearerToken, verifyFirebaseIdToken } from "./_firebaseAuth.js";
import { verifyCompletionToken } from "./_historyOddVideo.js";

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

  // Visitante: o e-mail é informado diretamente no popup após a conclusão
  // do vídeo. A validação de acesso à conta/e-mail será feita no HistoryOdd.
  const customerEmail = normalizeEmail(req.body?.customerEmail);
  if (!isValidEmail(customerEmail)) {
    return { error: "invalid-license-request", status: 400 };
  }

  return { customerEmail, source: "guest-email" };
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
    const completion = verifyCompletionToken(req.body?.videoCompletionToken);
    if (!completion) {
      return res.status(403).json({ error: "video-completion-required" });
    }

    const identity = await resolveCustomerEmail(req);
    if (identity.error) {
      return res.status(identity.status).json({ error: identity.error });
    }

    if (!isValidEmail(identity.customerEmail)) {
      return res.status(400).json({ error: "invalid-license-request" });
    }

    // A conclusão pertence exatamente ao contexto que assistiu ao vídeo.
    // Logado: exige o mesmo UID. Visitante: exige o fluxo sem Firebase e
    // utiliza apenas o e-mail digitado no popup (Trial de 10 dias).
    if (completion.authUid) {
      if (identity.source !== "firebase") {
        return res.status(403).json({ error: "video-completion-user-mismatch" });
      }

      const firebaseIdToken = getBearerToken(req);
      const firebaseUser = await verifyFirebaseIdToken(firebaseIdToken);
      if (!firebaseUser || firebaseUser.uid !== completion.authUid) {
        return res.status(403).json({ error: "video-completion-user-mismatch" });
      }
    } else if (identity.source !== "guest-email") {
      return res.status(403).json({ error: "video-completion-user-mismatch" });
    }

    const durationDays = Number(completion.entitlementDays) === 20 ? 20 : 10;

    const upstream = await fetch(historyOddLicenseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${historyOddLicenseAdminToken}`,
      },
      body: JSON.stringify({
        durationDays,
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
