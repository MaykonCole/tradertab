import { getApp, getApps, initializeApp } from "firebase/app";
import {
  getAnalytics,
  isSupported as isAnalyticsSupported,
  logEvent,
  setAnalyticsCollectionEnabled,
} from "firebase/analytics";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  deleteUser,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const firebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.appId,
);

const app = firebaseConfigured
  ? getApps().length
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;

export const COOKIE_PREFERENCES_KEY = "tradertab-cookie-preferences-v1";

const hasAnalyticsConsent = () => {
  if (typeof window === "undefined") return false;

  try {
    const preferences = JSON.parse(
      localStorage.getItem(COOKIE_PREFERENCES_KEY),
    );
    return preferences?.analytics === true;
  } catch {
    return false;
  }
};

let analyticsPromise = null;

const getAnalyticsInstance = () => {
  if (
    !app ||
    !firebaseConfig.measurementId ||
    typeof window === "undefined" ||
    !hasAnalyticsConsent()
  ) {
    return Promise.resolve(null);
  }

  if (!analyticsPromise) {
    analyticsPromise = isAnalyticsSupported()
      .then((supported) => {
        if (!supported) return null;

        const analytics = getAnalytics(app);
        setAnalyticsCollectionEnabled(analytics, true);
        return analytics;
      })
      .catch((error) => {
        console.warn(
          "[TraderTab] Google Analytics não está disponível.",
          error,
        );
        return null;
      });
  }

  return analyticsPromise;
};

export const applyAnalyticsConsent = (enabled) => {
  if (enabled) {
    getAnalyticsInstance().then((analytics) => {
      if (analytics) setAnalyticsCollectionEnabled(analytics, true);
    });
    return;
  }

  if (analyticsPromise) {
    analyticsPromise.then((analytics) => {
      if (analytics) setAnalyticsCollectionEnabled(analytics, false);
    });
  }
};

/*
 * Registra um evento sem interromper a funcionalidade principal caso o
 * Analytics esteja bloqueado pelo navegador ou indisponível.
 *
 * Nunca envie e-mail, nome, data de nascimento, país, clube ou senha.
 */
export const trackEvent = (eventName, parameters = {}) => {
  getAnalyticsInstance()
    .then((analytics) => {
      if (!analytics) return;

      logEvent(analytics, eventName, {
        ...parameters,
        ...(import.meta.env.DEV ? { debug_mode: true } : {}),
      });
    })
    .catch((error) => {
      console.warn(
        `[TraderTab] Falha ao registrar o evento ${eventName}.`,
        error,
      );
    });
};

const ensureConfigured = () => {
  if (!auth || !db) {
    throw new Error("firebase-not-configured");
  }
};

const ensureUserDocument = async (user) => {
  const userRef = doc(db, "users", user.uid);
  const snapshot = await getDoc(userRef);

  await setDoc(
    userRef,
    {
      email: user.email || "",
      name: user.displayName || "",
      photoUrl: user.photoURL || "",
      authProvider: user.providerData?.[0]?.providerId || "password",
      updatedAt: serverTimestamp(),
      ...(snapshot.exists() ? {} : { createdAt: serverTimestamp() }),
    },
    { merge: true },
  );

  return snapshot.exists() ? snapshot.data() : null;
};

export const observeAuth = (callback) => {
  if (!auth) {
    callback(null);
    return () => {};
  }

  return onAuthStateChanged(auth, async (user) => {
    if (!user) {
      callback(null);
      return;
    }

    try {
      const existingProfile = await ensureUserDocument(user);

      callback({
        user,
        profile: existingProfile,
      });
    } catch (error) {
      console.error("[TraderTab] Falha ao carregar perfil.", error);

      callback({
        user,
        profile: null,
      });
    }
  });
};

export const loginWithGoogle = async () => {
  ensureConfigured();

  trackEvent("login_started", {
    method: "google",
  });

  const provider = new GoogleAuthProvider();

  provider.setCustomParameters({
    prompt: "select_account",
  });

  const credential = await signInWithPopup(auth, provider);

  // Evento recomendado pelo Google Analytics.
  trackEvent("login", {
    method: "google",
  });

  return credential;
};

export const loginWithEmail = async (email, password) => {
  ensureConfigured();

  trackEvent("login_started", {
    method: "password",
  });

  const credential = await signInWithEmailAndPassword(auth, email, password);

  trackEvent("login", {
    method: "password",
  });

  return credential;
};

export const registerWithEmail = async (email, password, profile) => {
  ensureConfigured();

  const credential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );

  try {
    await saveUserProfile(credential.user.uid, profile);
  } catch (error) {
    await deleteUser(credential.user).catch(() => {});
    throw error;
  }

  // Evento recomendado pelo Google Analytics.
  trackEvent("sign_up", {
    method: "password",
  });

  return credential;
};

export const requestPasswordReset = async (email) => {
  ensureConfigured();

  await sendPasswordResetEmail(auth, email);

  trackEvent("password_reset_requested", {
    method: "email",
  });
};

export const logout = async () => {
  ensureConfigured();

  await signOut(auth);

  trackEvent("logout_completed");
};

export const rejectUnderageAccount = async () => {
  ensureConfigured();

  if (auth.currentUser) {
    await deleteUser(auth.currentUser);
  }
};

export const loadUserProfile = async (userId) => {
  ensureConfigured();

  const snapshot = await getDoc(doc(db, "users", userId));

  return snapshot.exists() ? snapshot.data() : null;
};

export const saveUserProfile = async (userId, profile) => {
  ensureConfigured();

  await setDoc(
    doc(db, "users", userId),
    {
      age: Number(profile.age),
      birthDate: profile.birthDate,
      countryCode: profile.countryCode,
      country: profile.country,
      favoriteClub: profile.favoriteClub?.trim() || "",
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  /*
   * Registra apenas que o perfil foi preenchido.
   * Não envia os valores dos campos para o Analytics.
   */
  trackEvent("profile_completed");
};

export const loadColumnOrder = async (userId) => {
  ensureConfigured();

  const snapshot = await getDoc(doc(db, "users", userId));

  return snapshot.exists() ? snapshot.data()?.preferences?.columnOrder : null;
};

export const saveColumnOrder = async (userId, columnOrder) => {
  ensureConfigured();

  await setDoc(
    doc(db, "users", userId),
    {
      preferences: {
        columnOrder,
      },
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  trackEvent("column_reordered", {
    column_count: columnOrder.length,
  });
};

const emptyFavoritePreferences = {
  teams: [],
  leagues: [],
  homeOddMin: null,
  homeOddMax: null,
  awayOddMin: null,
  awayOddMax: null,
  overOddMin: null,
  overOddMax: null,
  underOddMin: null,
  underOddMax: null,
  positionsMin: null,
  positionsMax: null,
};

const sanitizeNumber = (value) => {
  if (value === "" || value === null || value === undefined) return null;
  const parsed = Number(String(value).replace(",", "."));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

const sanitizeStringList = (values) =>
  [...new Set((Array.isArray(values) ? values : []).map((item) => String(item).trim()))]
    .filter(Boolean)
    .slice(0, 100);

export const loadFavoritePreferences = async (userId) => {
  ensureConfigured();

  const snapshot = await getDoc(doc(db, "users", userId));
  const stored = snapshot.exists() ? snapshot.data()?.favorites : null;

  const hasStoredField = (field) =>
    Object.prototype.hasOwnProperty.call(stored || {}, field);

  const readOddPreference = (currentField, legacyField) => {
    // Um valor null salvo representa um campo que o usuário apagou.
    // Só usa o campo legado quando a propriedade nova ainda não existe.
    if (hasStoredField(currentField)) {
      return sanitizeNumber(stored[currentField]);
    }

    return sanitizeNumber(stored?.[legacyField]);
  };

  return {
    ...emptyFavoritePreferences,
    ...(stored || {}),
    teams: sanitizeStringList(stored?.teams),
    leagues: sanitizeStringList(stored?.leagues),
    // Migra o range genérico apenas para usuários que ainda não possuem
    // os novos campos de Casa e Fora. Campos apagados não voltam mais.
    homeOddMin: readOddPreference("homeOddMin", "oddsMin"),
    homeOddMax: readOddPreference("homeOddMax", "oddsMax"),
    awayOddMin: readOddPreference("awayOddMin", "oddsMin"),
    awayOddMax: readOddPreference("awayOddMax", "oddsMax"),
    overOddMin: sanitizeNumber(stored?.overOddMin),
    overOddMax: sanitizeNumber(stored?.overOddMax),
    underOddMin: sanitizeNumber(stored?.underOddMin),
    underOddMax: sanitizeNumber(stored?.underOddMax),
    positionsMin: sanitizeNumber(stored?.positionsMin),
    positionsMax: sanitizeNumber(stored?.positionsMax),
  };
};

export const saveFavoritePreferences = async (userId, preferences) => {
  ensureConfigured();

  const sanitized = {
    teams: sanitizeStringList(preferences.teams),
    leagues: sanitizeStringList(preferences.leagues),
    homeOddMin: sanitizeNumber(preferences.homeOddMin),
    homeOddMax: sanitizeNumber(preferences.homeOddMax),
    awayOddMin: sanitizeNumber(preferences.awayOddMin),
    awayOddMax: sanitizeNumber(preferences.awayOddMax),
    overOddMin: sanitizeNumber(preferences.overOddMin),
    overOddMax: sanitizeNumber(preferences.overOddMax),
    underOddMin: sanitizeNumber(preferences.underOddMin),
    underOddMax: sanitizeNumber(preferences.underOddMax),
    positionsMin: sanitizeNumber(preferences.positionsMin),
    positionsMax: sanitizeNumber(preferences.positionsMax),
  };

  await setDoc(
    doc(db, "users", userId),
    {
      favorites: sanitized,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  trackEvent("favorite_preferences_saved", {
    team_count: sanitized.teams.length,
    league_count: sanitized.leagues.length,
    has_odds_range: Boolean(
      sanitized.homeOddMin ||
        sanitized.homeOddMax ||
        sanitized.awayOddMin ||
        sanitized.awayOddMax ||
        sanitized.overOddMin ||
        sanitized.overOddMax ||
        sanitized.underOddMin ||
        sanitized.underOddMax,
    ),
    has_positions_range: Boolean(
      sanitized.positionsMin || sanitized.positionsMax,
    ),
  });

  return sanitized;
};

const favoriteGameDocumentId = (gameId) =>
  encodeURIComponent(String(gameId || "")).slice(0, 1200);

const favoriteGameSnapshot = (game) => ({
  externalId: String(game.id),
  date: String(game.date || ""),
  time: String(game.time || ""),
  country: String(game.country || ""),
  competition: String(game.competition || ""),
  home: String(game.home || ""),
  away: String(game.away || ""),
  homePosition: sanitizeNumber(game.homePosition),
  awayPosition: sanitizeNumber(game.awayPosition),
  homeOdd: sanitizeNumber(game.homeOdd),
  drawOdd: sanitizeNumber(game.drawOdd),
  awayOdd: sanitizeNumber(game.awayOdd),
  over25Odd: sanitizeNumber(game.over25Odd),
  under25Odd: sanitizeNumber(game.under25Odd),
  classification: String(game.classification || "balanced"),
  homeForm: sanitizeStringList(game.homeForm).slice(0, 8),
  awayForm: sanitizeStringList(game.awayForm).slice(0, 8),
});

export const observeFavoriteGames = (userId, callback, onError) => {
  ensureConfigured();

  return onSnapshot(
    collection(db, "users", userId, "favoriteGames"),
    (snapshot) => {
      callback(
        snapshot.docs.map((favoriteDoc) => ({
          id: favoriteDoc.data().externalId || favoriteDoc.id,
          ...favoriteDoc.data(),
        })),
      );
    },
    onError,
  );
};

export const saveFavoriteGame = async (userId, game) => {
  ensureConfigured();

  const gameId = favoriteGameDocumentId(game.id);
  if (!gameId) throw new Error("favorite-game-invalid");

  await setDoc(
    doc(db, "users", userId, "favoriteGames", gameId),
    {
      ...favoriteGameSnapshot(game),
      savedAt: serverTimestamp(),
    },
    { merge: true },
  );

  trackEvent("favorite_game_added");
};

export const removeFavoriteGame = async (userId, gameId) => {
  ensureConfigured();

  const documentId = favoriteGameDocumentId(gameId);
  if (!documentId) return;

  await deleteDoc(doc(db, "users", userId, "favoriteGames", documentId));
  trackEvent("favorite_game_removed");
};
