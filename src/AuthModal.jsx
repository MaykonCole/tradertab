import React, { useEffect, useMemo, useState } from "react";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRound,
  X,
} from "lucide-react";
import CountrySelect, {
  findCountryCodeByName,
  getCountryName,
} from "./CountrySelect";
import {
  firebaseConfigured,
  loginWithEmail,
  loginWithGoogle,
  registerWithEmail,
  rejectUnderageAccount,
  requestPasswordReset,
  saveUserProfile,
} from "./firebase";

const copy = {
  pt: {
    title: "Entrar no TraderTab",
    subtitle: "Libere filtros, Race e a organização das colunas.",
    google: "Continuar com Google",
    or: "ou use seu e-mail",
    email: "E-mail",
    password: "Senha",
    enter: "Entrar",
    create: "Criar conta",
    createLink: "Criar uma conta",
    loginLink: "Já tenho uma conta",
    forgot: "Esqueci minha senha",
    resetSent: "Enviamos o link de recuperação para seu e-mail.",
    config:
      "O login está pronto. Adicione as chaves do Firebase no arquivo .env para ativá-lo.",
    profileTitle: "Complete seu perfil",
    profileSubtitle:
      "Data de nascimento e país são obrigatórios. O clube é opcional.",
    birthDate: "Data de nascimento",
    country: "País",
    countryPlaceholder: "Busque e selecione um país",
    club: "Clube do coração (opcional)",
    clubPlaceholder: "Ex.: Atlético-MG",
    save: "Salvar e continuar",
    requiredProfile:
      "Informe uma data de nascimento válida e selecione um país da lista.",
    underage:
      "O TraderTab é exclusivo para maiores de 18 anos. Sua conta não poderá ser criada.",
    registerHint:
      "A conta somente será criada após validar a maioridade e o país.",
  },
  en: {
    title: "Sign in to TraderTab",
    subtitle: "Unlock filters, Race and column organization.",
    google: "Continue with Google",
    or: "or use your email",
    email: "Email",
    password: "Password",
    enter: "Sign in",
    create: "Create account",
    createLink: "Create an account",
    loginLink: "I already have an account",
    forgot: "Forgot my password",
    resetSent: "We sent a recovery link to your email.",
    config:
      "Login is ready. Add the Firebase keys to the .env file to activate it.",
    profileTitle: "Complete your profile",
    profileSubtitle:
      "Date of birth and country are required. Favorite club is optional.",
    birthDate: "Date of birth",
    country: "Country",
    countryPlaceholder: "Search and select a country",
    club: "Favorite club (optional)",
    clubPlaceholder: "E.g. Arsenal",
    save: "Save and continue",
    requiredProfile:
      "Enter a valid date of birth and select a country from the list.",
    underage:
      "TraderTab is only available to people aged 18 or older. Your account cannot be created.",
    registerHint:
      "The account will only be created after validating age and country.",
  },
  es: {
    title: "Entrar en TraderTab",
    subtitle: "Desbloquea filtros, Race y la organización de columnas.",
    google: "Continuar con Google",
    or: "o usa tu correo",
    email: "Correo",
    password: "Contraseña",
    enter: "Entrar",
    create: "Crear cuenta",
    createLink: "Crear una cuenta",
    loginLink: "Ya tengo una cuenta",
    forgot: "Olvidé mi contraseña",
    resetSent: "Enviamos el enlace de recuperación a tu correo.",
    config:
      "El login está listo. Agrega las claves de Firebase al archivo .env para activarlo.",
    profileTitle: "Completa tu perfil",
    profileSubtitle:
      "La fecha de nacimiento y el país son obligatorios. El club es opcional.",
    birthDate: "Fecha de nacimiento",
    country: "País",
    countryPlaceholder: "Busca y selecciona un país",
    club: "Club favorito (opcional)",
    clubPlaceholder: "Ej.: Atlético de Madrid",
    save: "Guardar y continuar",
    requiredProfile:
      "Ingresa una fecha de nacimiento válida y selecciona un país de la lista.",
    underage:
      "TraderTab es exclusivo para mayores de 18 años. Tu cuenta no podrá ser creada.",
    registerHint:
      "La cuenta solo se creará después de validar la edad y el país.",
  },
};

const calculateAge = (birthDate) => {
  if (!birthDate) return null;

  const parts = birthDate.split("-").map(Number);
  if (parts.length !== 3 || parts.some((part) => !Number.isFinite(part))) {
    return null;
  }

  const [year, month, day] = parts;
  const parsedDate = new Date(year, month - 1, day);

  if (
    parsedDate.getFullYear() !== year ||
    parsedDate.getMonth() !== month - 1 ||
    parsedDate.getDate() !== day ||
    parsedDate > new Date()
  ) {
    return null;
  }

  const today = new Date();
  let age = today.getFullYear() - year;
  const hadBirthday =
    today.getMonth() > month - 1 ||
    (today.getMonth() === month - 1 && today.getDate() >= day);

  if (!hadBirthday) age -= 1;
  return age;
};

const friendlyError = (error, language) => {
  const messages = {
    pt: {
      invalidCredential: "E-mail ou senha inválidos.",
      emailInUse: "Este e-mail já possui uma conta.",
      weakPassword: "Use uma senha com pelo menos 6 caracteres.",
      invalidEmail: "Informe um endereço de e-mail válido.",
      userDisabled: "Esta conta foi desativada.",
      tooManyRequests:
        "Muitas tentativas foram realizadas. Aguarde alguns minutos e tente novamente.",
      network: "Não foi possível conectar. Verifique sua internet e tente novamente.",
      popupBlocked: "O navegador bloqueou a janela do Google. Permita pop-ups e tente novamente.",
      unauthorizedDomain: "Este domínio ainda não está autorizado para login.",
      default: "Não foi possível concluir. Tente novamente.",
    },
    en: {
      invalidCredential: "Invalid email or password.",
      emailInUse: "An account already exists for this email.",
      weakPassword: "Use a password with at least 6 characters.",
      invalidEmail: "Enter a valid email address.",
      userDisabled: "This account has been disabled.",
      tooManyRequests:
        "Too many attempts were made. Wait a few minutes and try again.",
      network: "Unable to connect. Check your internet connection and try again.",
      popupBlocked: "The browser blocked the Google window. Allow pop-ups and try again.",
      unauthorizedDomain: "This domain is not yet authorized for sign-in.",
      default: "We could not complete the request. Try again.",
    },
    es: {
      invalidCredential: "El correo o la contraseña no son válidos.",
      emailInUse: "Ya existe una cuenta con este correo.",
      weakPassword: "Usa una contraseña de al menos 6 caracteres.",
      invalidEmail: "Ingresa una dirección de correo válida.",
      userDisabled: "Esta cuenta ha sido desactivada.",
      tooManyRequests:
        "Se realizaron demasiados intentos. Espera unos minutos e inténtalo de nuevo.",
      network: "No fue posible conectar. Revisa tu conexión e inténtalo de nuevo.",
      popupBlocked: "El navegador bloqueó la ventana de Google. Permite ventanas emergentes e inténtalo de nuevo.",
      unauthorizedDomain: "Este dominio todavía no está autorizado para iniciar sesión.",
      default: "No fue posible completar la solicitud. Inténtalo de nuevo.",
    },
  };
  const current = messages[language] || messages.pt;
  if (error?.message === "firebase-not-configured")
    return (copy[language] || copy.pt).config;
  const code = error?.code || "";
  if (code.includes("invalid-credential") || code.includes("wrong-password"))
    return current.invalidCredential;
  if (code.includes("email-already-in-use")) return current.emailInUse;
  if (code.includes("weak-password")) return current.weakPassword;
  if (code.includes("invalid-email")) return current.invalidEmail;
  if (code.includes("user-disabled")) return current.userDisabled;
  if (code.includes("too-many-requests")) return current.tooManyRequests;
  if (code.includes("network-request-failed")) return current.network;
  if (code.includes("popup-blocked")) return current.popupBlocked;
  if (code.includes("unauthorized-domain")) return current.unauthorizedDomain;
  if (code.includes("popup-closed")) return "";
  return current.default;
};

function ProfileFields({
  t,
  language,
  birthDate,
  setBirthDate,
  countryCode,
  setCountryCode,
  favoriteClub,
  setFavoriteClub,
}) {
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const oldestDate = useMemo(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 120);
    return date.toISOString().slice(0, 10);
  }, []);
  const age = calculateAge(birthDate);

  return (
    <>
      <div className="profile-required-fields">
        <label>
          <span>{t.birthDate}</span>
          <div className="auth-input">
            <input
              type="date"
              min={oldestDate}
              max={today}
              value={birthDate}
              onChange={(event) => setBirthDate(event.target.value)}
              required
            />
          </div>
          {age !== null && (
            <small className={`calculated-age ${age < 18 ? "underage" : ""}`}>
              {language === "pt"
                ? `${age} anos`
                : language === "es"
                  ? `${age} años`
                  : `${age} years old`}
            </small>
          )}
        </label>

        <CountrySelect
          language={language}
          value={countryCode}
          onChange={setCountryCode}
          label={t.country}
          placeholder={t.countryPlaceholder}
          required
        />
      </div>

      <label>
        <span>{t.club}</span>
        <input
          value={favoriteClub}
          maxLength="80"
          onChange={(event) => setFavoriteClub(event.target.value)}
          placeholder={t.clubPlaceholder}
        />
      </label>
    </>
  );
}

export default function AuthModal({
  language,
  user,
  profile,
  onClose,
  onProfileSaved,
}) {
  const t = copy[language] || copy.pt;
  const [mode, setMode] = useState(user ? "profile" : "login");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [birthDate, setBirthDate] = useState(profile?.birthDate || "");
  const [countryCode, setCountryCode] = useState(
    profile?.countryCode ||
      findCountryCodeByName(
        profile?.country || profile?.nationality,
        language,
      ),
  );
  const [favoriteClub, setFavoriteClub] = useState(profile?.favoriteClub || "");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const profileCompletionRequired = Boolean(
    user &&
      (!profile?.birthDate ||
        !profile?.countryCode ||
        !Number.isFinite(Number(profile?.age)) ||
        Number(profile?.age) < 18),
  );

  useEffect(() => {
    if (user) {
      setMode("profile");
      setEmail(user.email || "");
      setBirthDate(profile?.birthDate || "");
      setCountryCode(
        profile?.countryCode ||
          findCountryCodeByName(
            profile?.country || profile?.nationality,
            language,
          ),
      );
      setFavoriteClub(profile?.favoriteClub || "");
    }
  }, [user, profile, language]);

  const run = async (action) => {
    setBusy(true);
    setMessage("");
    try {
      await action();
    } catch (error) {
      setMessage(friendlyError(error, language));
    } finally {
      setBusy(false);
    }
  };

  const buildProfile = () => {
    const age = calculateAge(birthDate);

    if (age === null || !countryCode) {
      setMessage(t.requiredProfile);
      return null;
    }

    if (age < 18) {
      window.alert(t.underage);
      setMessage(t.underage);
      return { underage: true };
    }

    return {
      age,
      birthDate,
      countryCode,
      country: getCountryName(countryCode, language),
      favoriteClub: favoriteClub.trim(),
    };
  };

  const submitCredentials = (event) => {
    event.preventDefault();

    if (mode === "login") {
      run(() => loginWithEmail(email.trim(), password));
      return;
    }

    const nextProfile = buildProfile();
    if (!nextProfile || nextProfile.underage) return;

    run(async () => {
      await registerWithEmail(email.trim(), password, nextProfile);
      onProfileSaved(nextProfile);
      onClose();
    });
  };

  const submitProfile = (event) => {
    event.preventDefault();
    const nextProfile = buildProfile();
    if (!nextProfile) return;

    if (nextProfile.underage) {
      run(async () => {
        await rejectUnderageAccount();
        onClose();
      });
      return;
    }

    run(async () => {
      await saveUserProfile(user.uid, nextProfile);
      onProfileSaved(nextProfile);
      onClose();
    });
  };

  const profileFields = (
    <ProfileFields
      t={t}
      language={language}
      birthDate={birthDate}
      setBirthDate={setBirthDate}
      countryCode={countryCode}
      setCountryCode={setCountryCode}
      favoriteClub={favoriteClub}
      setFavoriteClub={setFavoriteClub}
    />
  );

  return (
    <div
      className="auth-backdrop"
      role="presentation"
      onMouseDown={profileCompletionRequired ? undefined : onClose}
    >
      <section
        className="auth-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {!profileCompletionRequired && (
          <button
            type="button"
            className="auth-close"
            onClick={onClose}
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        )}

        <div className="auth-brand">
          <span className="auth-brand-mark">TT</span>
          <strong>TraderTab</strong>
        </div>

        {mode === "profile" ? (
          <form className="auth-form" onSubmit={submitProfile}>
            <div className="auth-heading">
              <span className="auth-heading-icon">
                <UserRound size={22} />
              </span>
              <div>
                <h2 id="auth-title">{t.profileTitle}</h2>
                <p>{t.profileSubtitle}</p>
              </div>
            </div>
            <label>
              <span>{t.email}</span>
              <input value={email} disabled />
            </label>
            {profileFields}
            {message && <p className="auth-message error">{message}</p>}
            <button className="auth-primary" disabled={busy} type="submit">
              {busy ? "..." : t.save}
            </button>
          </form>
        ) : (
          <>
            <div className="auth-heading auth-heading-login">
              <span className="auth-heading-icon">
                <LockKeyhole size={22} />
              </span>
              <div>
                <h2 id="auth-title">{t.title}</h2>
                <p>{t.subtitle}</p>
              </div>
            </div>

            {!firebaseConfigured && <p className="auth-config">{t.config}</p>}

            <button
              type="button"
              className="google-button"
              disabled={busy || !firebaseConfigured}
              onClick={() => run(loginWithGoogle)}
            >
              <span className="google-g">G</span>
              {t.google}
            </button>

            <div className="auth-divider">
              <span>{t.or}</span>
            </div>

            <form className="auth-form" onSubmit={submitCredentials}>
              <label>
                <span>{t.email}</span>
                <div className="auth-input">
                  <Mail size={18} />
                  <input
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>
              </label>
              <label>
                <span>{t.password}</span>
                <div className="auth-input">
                  <LockKeyhole size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete={
                      mode === "register" ? "new-password" : "current-password"
                    }
                    minLength="6"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label="Exibir senha"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </label>

              {mode === "register" && (
                <>
                  {profileFields}
                  <p className="register-profile-hint">{t.registerHint}</p>
                </>
              )}

              {message && (
                <p
                  className={`auth-message ${message === t.resetSent ? "success" : "error"}`}
                >
                  {message}
                </p>
              )}
              <button
                className="auth-primary"
                disabled={busy || !firebaseConfigured}
                type="submit"
              >
                {busy ? "..." : mode === "register" ? t.create : t.enter}
              </button>
            </form>

            <div className="auth-footer-actions">
              <button
                type="button"
                onClick={() => {
                  setMode(mode === "register" ? "login" : "register");
                  setMessage("");
                }}
              >
                {mode === "register" ? t.loginLink : t.createLink}
              </button>
              {mode === "login" && (
                <button
                  type="button"
                  onClick={() =>
                    email.trim()
                      ? run(async () => {
                          await requestPasswordReset(email.trim());
                          setMessage(t.resetSent);
                        })
                      : setMessage(
                          language === "pt"
                            ? "Informe seu e-mail primeiro."
                            : "Enter your email first.",
                        )
                  }
                >
                  {t.forgot}
                </button>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
