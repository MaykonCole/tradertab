import crypto from "node:crypto";
import { sameOriginRequest, setJsonHeaders } from "./_emailVerification.js";
import { getBearerToken, verifyFirebaseIdToken } from "./_firebaseAuth.js";
import {
  createCompletionToken,
  createProgressToken,
  verifyHistoryOddVideoToken,
} from "./_historyOddVideo.js";

const CHECKPOINT_TOLERANCE_SECONDS = 15;
const MIN_COMPLETION_RATIO = 0.95;
const END_TOLERANCE_SECONDS = 3;
const MAX_DURATION_SECONDS = 4 * 60 * 60;
const ALLOWED_PLAYBACK_RATES = [1, 1.25, 1.5, 2];

const toFiniteNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

const resolveAuthUser = async (req) => {
  const token = getBearerToken(req);
  if (!token) return null;
  return verifyFirebaseIdToken(token);
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

  try {
    const currentTime = toFiniteNumber(req.body?.currentTime);
    const duration = toFiniteNumber(req.body?.duration);
    const ended = req.body?.ended === true;
    const requestedPlaybackRate = req.body?.playbackRate == null
      ? 1
      : toFiniteNumber(req.body.playbackRate);
    const playbackRate = ALLOWED_PLAYBACK_RATES.includes(requestedPlaybackRate)
      ? requestedPlaybackRate
      : null;
    const now = Date.now();

    if (
      currentTime === null ||
      duration === null ||
      duration <= 0 ||
      duration > MAX_DURATION_SECONDS ||
      currentTime < 0 ||
      currentTime > duration + END_TOLERANCE_SECONDS ||
      playbackRate === null
    ) {
      return res.status(400).json({ error: "invalid-video-progress" });
    }

    const authUser = await resolveAuthUser(req);
    const previousToken = String(req.body?.progressToken || "");
    const previous = previousToken
      ? verifyHistoryOddVideoToken(previousToken, "historyodd-video-progress")
      : null;

    if (previousToken && !previous) {
      return res.status(400).json({ error: "invalid-progress-token" });
    }

    const sessionId = previous?.sessionId || crypto.randomUUID();
    const previousMediaTime = Number(previous?.mediaTime || 0);
    const previousWatched = Number(previous?.watchedSeconds || 0);
    const startedAt = Number(previous?.startedAt || now);
    const previousUid = previous?.authUid || null;

    // A sessão de vídeo é vinculada exatamente à identidade que a iniciou.
    // Trocar de conta ou entrar/sair exige uma nova sessão desde 0%.
    const currentUid = authUser?.uid || null;
    if (previous && previousUid !== currentUid) {
      return res.status(403).json({ error: "progress-user-mismatch" });
    }

    const delta = currentTime - previousMediaTime;
    const previousUpdatedAt = Number(previous?.updatedAt || now);
    const elapsedServerSeconds = Math.max(0, (now - previousUpdatedAt) / 1000);
    const maxSequentialAdvance = Math.min(
      CHECKPOINT_TOLERANCE_SECONDS,
      Math.max(2.5, elapsedServerSeconds * playbackRate + 2.5),
    );
    const isSequentialAdvance =
      delta >= -0.75 && delta <= maxSequentialAdvance;

    let acceptedMediaTime = previousMediaTime;
    let watchedSeconds = previousWatched;

    if (!previous) {
      acceptedMediaTime = Math.min(currentTime, 1.5);
      watchedSeconds = acceptedMediaTime;
    } else if (isSequentialAdvance) {
      if (delta > 0) {
        acceptedMediaTime = currentTime;
        watchedSeconds = Math.min(duration, previousWatched + delta);
      } else {
        acceptedMediaTime = currentTime;
      }
    }

    const watchedRatio = Math.min(1, watchedSeconds / duration);
    const nearEnd = currentTime >= Math.max(0, duration - END_TOLERANCE_SECONDS);
    const completed = ended && nearEnd && watchedRatio >= MIN_COMPLETION_RATIO;

    const authUid = previousUid || authUser?.uid || null;
    const entitlementDays = authUid ? 14 : 7;

    const progressToken = createProgressToken({
      sessionId,
      startedAt,
      mediaTime: acceptedMediaTime,
      watchedSeconds,
      duration,
      authUid,
      updatedAt: now,
    });

    let completionToken = null;
    if (completed) {
      completionToken = createCompletionToken({
        sessionId,
        authUid,
        entitlementDays,
        duration,
        watchedSeconds,
        completedAt: now,
      });
    }

    return res.status(200).json({
      success: true,
      progressToken,
      completionToken,
      completed,
      entitlementDays,
      watchedRatio,
      allowedSeekTo: Math.min(duration, acceptedMediaTime + 2),
    });
  } catch (error) {
    if (error?.message === "firebase-api-key-not-configured") {
      return res.status(500).json({ error: "firebase-auth-not-configured" });
    }

    if (error?.message === "historyodd-video-secret-not-configured") {
      console.error("[TraderTab] HISTORYODD_VIDEO_SECRET is not configured");
      return res.status(500).json({ error: "video-secret-not-configured" });
    }

    console.error("[TraderTab] HistoryOdd video progress error", error);
    return res.status(500).json({ error: "video-progress-failed" });
  }
}
