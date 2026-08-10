import {
  createVerificationChallenge,
  generateCode,
  isValidEmail,
  normalizeEmail,
  sameOriginRequest,
  setJsonHeaders,
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
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "invalid-email" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) {
    console.error("[TraderTab] RESEND_API_KEY/RESEND_FROM_EMAIL not configured");
    return res.status(500).json({ error: "email-service-not-configured" });
  }

  try {
    const code = generateCode();
    const { challenge, expiresAt } = createVerificationChallenge(email, code);

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [email],
        subject: "Seu código de verificação do TraderTab",
        html: `
          <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;color:#171717">
            <h2 style="margin-bottom:8px">Confirme seu e-mail no TraderTab</h2>
            <p>Use o código abaixo para concluir seu cadastro:</p>
            <div style="font-size:32px;font-weight:700;letter-spacing:8px;padding:18px 0">${code}</div>
            <p>Este código expira em 10 minutos.</p>
            <p style="font-size:13px;color:#666">Se você não solicitou este cadastro, ignore esta mensagem.</p>
          </div>
        `,
        text: `TraderTab - Seu código de verificação é ${code}. Ele expira em 10 minutos.`,
      }),
    });

    if (!resendResponse.ok) {
      const detail = await resendResponse.text();
      console.error("[TraderTab] Resend error", resendResponse.status, detail);
      return res.status(502).json({ error: "email-send-failed" });
    }

    return res.status(200).json({ challenge, expiresAt });
  } catch (error) {
    console.error("[TraderTab] Verification email error", error);
    return res.status(500).json({ error: "verification-send-failed" });
  }
}
