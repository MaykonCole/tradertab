const FIREBASE_API_KEY =
  process.env.FIREBASE_API_KEY?.trim() ||
  process.env.VITE_FIREBASE_API_KEY?.trim();

export const getBearerToken = (req) => {
  const authorization = String(req.headers?.authorization || "").trim();
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || "";
};

export const verifyFirebaseIdToken = async (idToken) => {
  if (!FIREBASE_API_KEY) {
    throw new Error("firebase-api-key-not-configured");
  }

  if (!idToken) return null;

  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(FIREBASE_API_KEY)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    },
  );

  if (!response.ok) return null;

  const payload = await response.json().catch(() => ({}));
  const user = Array.isArray(payload?.users) ? payload.users[0] : null;

  if (!user?.localId || !user?.email) return null;

  return {
    uid: String(user.localId),
    email: String(user.email).trim().toLowerCase(),
    emailVerified: Boolean(user.emailVerified),
  };
};
