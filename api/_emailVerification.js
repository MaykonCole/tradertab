import crypto from "node:crypto";

const VERIFICATION_TTL_MS = 10 * 60 * 1000;

export function setJsonHeaders(res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
}

export function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

export function getSecret() {
  const secret = process.env.EMAIL_VERIFICATION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("EMAIL_VERIFICATION_SECRET is missing or too short");
  }
  return secret;
}

function signPayload(payload, secret) {
  return crypto.createHmac("sha256", secret).update(payload).digest("base64url");
}

export function createVerificationChallenge(email, code) {
  const expiresAt = Date.now() + VERIFICATION_TTL_MS;
  const nonce = crypto.randomBytes(16).toString("base64url");
  const payload = `${email}|${code}|${expiresAt}|${nonce}`;
  const signature = signPayload(payload, getSecret());

  return {
    challenge: Buffer.from(
      JSON.stringify({ email, expiresAt, nonce, signature }),
      "utf8",
    ).toString("base64url"),
    expiresAt,
  };
}

export function verifyChallenge(email, code, challenge) {
  let parsed;
  try {
    parsed = JSON.parse(Buffer.from(String(challenge || ""), "base64url").toString("utf8"));
  } catch {
    return false;
  }

  if (
    !parsed ||
    parsed.email !== email ||
    !Number.isFinite(parsed.expiresAt) ||
    parsed.expiresAt < Date.now() ||
    parsed.expiresAt > Date.now() + VERIFICATION_TTL_MS + 30_000 ||
    typeof parsed.nonce !== "string" ||
    typeof parsed.signature !== "string"
  ) {
    return false;
  }

  const payload = `${email}|${code}|${parsed.expiresAt}|${parsed.nonce}`;
  const expected = signPayload(payload, getSecret());
  const provided = Buffer.from(parsed.signature);
  const expectedBuffer = Buffer.from(expected);

  return (
    provided.length === expectedBuffer.length &&
    crypto.timingSafeEqual(provided, expectedBuffer)
  );
}

export function generateCode() {
  return crypto.randomInt(100000, 1000000).toString();
}

export function sameOriginRequest(req) {
  const origin = req.headers.origin;
  if (!origin) return true;

  try {
    const originUrl = new URL(origin);
    const forwardedHost = req.headers["x-forwarded-host"] || req.headers.host;
    return Boolean(forwardedHost) && originUrl.host === forwardedHost;
  } catch {
    return false;
  }
}
