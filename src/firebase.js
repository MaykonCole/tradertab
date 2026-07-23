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
  doc,
  getDoc,
  getFirestore,
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
