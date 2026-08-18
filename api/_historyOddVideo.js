import crypto from "node:crypto";

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

const getSecret = () => {
  const configuredSecret =
    process.env.HISTORYODD_VIDEO_SECRET?.trim() ||
    process.env.HISTORYODD_LICENSE_ADMIN_TOKEN?.trim();

  if (configuredSecret) return configuredSecret;

  // Desenvolvimento local: o segredo serve apenas para manter a sessão de
  // progresso íntegra durante o `npm run dev`. Em produção continuamos
  // exigindo um segredo privado configurado no servidor.
  if (process.env.NODE_ENV !== "production") {
    const localSeed =
      process.env.FIREBASE_API_KEY?.trim() ||
      process.env.VITE_FIREBASE_API_KEY?.trim();
    if (localSeed) return `tradertab-historyodd-local:${localSeed}`;
  }

  return "";
};

const base64UrlEncode = (value) =>
  Buffer.from(value).toString("base64url");

const base64UrlDecode = (value) =>
  Buffer.from(value, "base64url").toString("utf8");

const signatureFor = (encodedPayload) => {
  const secret = getSecret();
  if (!secret) throw new Error("historyodd-video-secret-not-configured");

  return crypto
    .createHmac("sha256", secret)
    .update(encodedPayload)
    .digest("base64url");
};

export const createHistoryOddVideoToken = (payload) => {
  const encodedPayload = base64UrlEncode(
    JSON.stringify({
      ...payload,
      tokenVersion: 1,
    }),
  );
  return `${encodedPayload}.${signatureFor(encodedPayload)}`;
};

export const verifyHistoryOddVideoToken = (token, expectedType) => {
  const [encodedPayload, providedSignature] = String(token || "").split(".");
  if (!encodedPayload || !providedSignature) return null;

  const expectedSignature = signatureFor(encodedPayload);
  const providedBuffer = Buffer.from(providedSignature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    providedBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(providedBuffer, expectedBuffer)
  ) {
    return null;
  }

  let payload;
  try {
    payload = JSON.parse(base64UrlDecode(encodedPayload));
  } catch {
    return null;
  }

  if (!payload || payload.tokenVersion !== 1) return null;
  if (expectedType && payload.type !== expectedType) return null;
  if (payload.expiresAt && Date.now() > Number(payload.expiresAt)) return null;

  return payload;
};

export const createProgressToken = (payload) =>
  createHistoryOddVideoToken({
    ...payload,
    type: "historyodd-video-progress",
    expiresAt: Date.now() + TOKEN_TTL_MS,
  });

export const createCompletionToken = (payload) =>
  createHistoryOddVideoToken({
    ...payload,
    type: "historyodd-video-complete",
    expiresAt: Date.now() + TOKEN_TTL_MS,
  });

export const verifyCompletionToken = (token) =>
  verifyHistoryOddVideoToken(token, "historyodd-video-complete");
