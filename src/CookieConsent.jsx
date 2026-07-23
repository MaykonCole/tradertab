import React, { useEffect, useState } from "react";
import { Cookie, ShieldCheck, SlidersHorizontal, X } from "lucide-react";
import {
  applyAnalyticsConsent,
  COOKIE_PREFERENCES_KEY,
  trackEvent,
} from "./firebase";

const copy = {
  pt: {
    title: "Sua privacidade importa",
    text: "Usamos cookies necessários para login e preferências. Com sua autorização, usamos o Google Analytics para entender como o TraderTab é utilizado.",
    accept: "Aceitar todos",
    necessary: "Somente necessários",
    configure: "Configurar",
    settingsTitle: "Preferências de cookies",
    settingsText:
      "Você pode alterar sua escolha a qualquer momento pelo rodapé.",
    requiredTitle: "Cookies necessários",
    requiredText:
      "Mantêm login, idioma, tema, segurança e preferências básicas. Não podem ser desativados.",
    analyticsTitle: "Medição e Analytics",
    analyticsText:
      "Ajuda a medir acessos e uso de recursos sem enviar nome, e-mail, data de nascimento, país ou clube.",
    alwaysActive: "Sempre ativos",
    save: "Salvar preferências",
    privacy: "Política de Privacidade",
  },
  en: {
    title: "Your privacy matters",
    text: "We use essential cookies for login and preferences. With your permission, Google Analytics helps us understand how TraderTab is used.",
    accept: "Accept all",
    necessary: "Essential only",
    configure: "Configure",
    settingsTitle: "Cookie preferences",
    settingsText: "You can change this choice at any time in the footer.",
    requiredTitle: "Essential cookies",
    requiredText:
      "Keep login, language, theme, security and basic preferences working. They cannot be disabled.",
    analyticsTitle: "Measurement and Analytics",
    analyticsText:
      "Helps measure visits and feature usage without sending name, email, age, nationality or favorite club.",
    alwaysActive: "Always active",
    save: "Save preferences",
    privacy: "Privacy Policy",
  },
  es: {
    title: "Tu privacidad importa",
    text: "Usamos cookies necesarias para inicio de sesión y preferencias. Con tu autorización, Google Analytics nos ayuda a entender cómo se usa TraderTab.",
    accept: "Aceptar todo",
    necessary: "Solo necesarias",
    configure: "Configurar",
    settingsTitle: "Preferencias de cookies",
    settingsText:
      "Puedes cambiar esta elección en cualquier momento desde el pie de página.",
    requiredTitle: "Cookies necesarias",
    requiredText:
      "Mantienen el inicio de sesión, idioma, tema, seguridad y preferencias básicas. No pueden desactivarse.",
    analyticsTitle: "Medición y Analytics",
    analyticsText:
      "Ayuda a medir accesos y uso de funciones sin enviar nombre, correo, edad, nacionalidad o club.",
    alwaysActive: "Siempre activas",
    save: "Guardar preferencias",
    privacy: "Política de Privacidad",
  },
};

const loadPreferences = () => {
  try {
    return JSON.parse(localStorage.getItem(COOKIE_PREFERENCES_KEY));
  } catch {
    return null;
  }
};

export default function CookieConsent({
  language,
  settingsOpen,
  onSettingsClose,
}) {
  const t = copy[language] || copy.pt;
  const [preferences, setPreferences] = useState(loadPreferences);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(
    () => loadPreferences()?.analytics === true,
  );
  const [internalSettingsOpen, setInternalSettingsOpen] = useState(false);
  const showSettings = settingsOpen || internalSettingsOpen;

  useEffect(() => {
    if (preferences) applyAnalyticsConsent(preferences.analytics === true);
  }, []);

  useEffect(() => {
    if (settingsOpen) {
      setAnalyticsEnabled(loadPreferences()?.analytics === true);
    }
  }, [settingsOpen]);

  const savePreferences = (analytics) => {
    const nextPreferences = {
      necessary: true,
      analytics,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(
      COOKIE_PREFERENCES_KEY,
      JSON.stringify(nextPreferences),
    );
    setPreferences(nextPreferences);
    setAnalyticsEnabled(analytics);
    applyAnalyticsConsent(analytics);

    if (analytics) {
      trackEvent("cookie_consent_updated", { analytics: "granted" });
    }

    setInternalSettingsOpen(false);
    onSettingsClose?.();
  };

  const closeSettings = () => {
    setInternalSettingsOpen(false);
    onSettingsClose?.();
  };

  return (
    <>
      {!preferences && !showSettings && (
        <aside className="cookie-banner" aria-label={t.title}>
          <span className="cookie-banner-icon">
            <Cookie size={24} />
          </span>
          <div className="cookie-banner-copy">
            <strong>{t.title}</strong>
            <p>{t.text}</p>
            <a href="#privacidade">{t.privacy}</a>
          </div>
          <div className="cookie-banner-actions">
            <button
              type="button"
              className="cookie-secondary"
              onClick={() => savePreferences(false)}
            >
              {t.necessary}
            </button>
            <button
              type="button"
              className="cookie-secondary"
              onClick={() => setInternalSettingsOpen(true)}
            >
              <SlidersHorizontal size={16} />
              {t.configure}
            </button>
            <button
              type="button"
              className="cookie-primary"
              onClick={() => savePreferences(true)}
            >
              {t.accept}
            </button>
          </div>
        </aside>
      )}

      {showSettings && (
        <div
          className="cookie-settings-backdrop"
          role="presentation"
          onMouseDown={closeSettings}
        >
          <section
            className="cookie-settings"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-settings-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="cookie-settings-close"
              onClick={closeSettings}
              aria-label="Fechar"
            >
              <X size={19} />
            </button>

            <span className="cookie-settings-icon">
              <ShieldCheck size={24} />
            </span>
            <h2 id="cookie-settings-title">{t.settingsTitle}</h2>
            <p className="cookie-settings-intro">{t.settingsText}</p>

            <div className="cookie-option">
              <div>
                <strong>{t.requiredTitle}</strong>
                <p>{t.requiredText}</p>
              </div>
              <span className="always-active">{t.alwaysActive}</span>
            </div>

            <label className="cookie-option">
              <div>
                <strong>{t.analyticsTitle}</strong>
                <p>{t.analyticsText}</p>
              </div>
              <span className="switch">
                <input
                  type="checkbox"
                  checked={analyticsEnabled}
                  onChange={(event) =>
                    setAnalyticsEnabled(event.target.checked)
                  }
                />
                <span aria-hidden="true" />
              </span>
            </label>

            <a className="cookie-privacy-link" href="#privacidade">
              {t.privacy}
            </a>
            <button
              type="button"
              className="cookie-save"
              onClick={() => savePreferences(analyticsEnabled)}
            >
              {t.save}
            </button>
          </section>
        </div>
      )}
    </>
  );
}
