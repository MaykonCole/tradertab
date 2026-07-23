import React from "react";
import { ArrowLeft, Mail, ShieldCheck } from "lucide-react";

const content = {
  pt: {
    title: "Política de Privacidade",
    updated: "Última atualização: 23 de julho de 2026",
    intro:
      "Esta política explica, de forma simples, quais dados o TraderTab utiliza e para quais finalidades.",
    collectedTitle: "Dados coletados",
    collected: [
      "Conta: e-mail, nome, foto e provedor de login fornecidos pelo Firebase Authentication.",
      "Perfil: data de nascimento, idade calculada, país e clube do coração opcional informados pelo usuário.",
      "Preferências: idioma, tema, consentimento de cookies e ordem das colunas.",
      "Medição opcional: páginas visitadas, dispositivo, localização aproximada e interações com recursos, somente quando o usuário autoriza o Google Analytics.",
    ],
    purposeTitle: "Finalidades",
    purposes: [
      "Autenticar a conta e manter a sessão.",
      "Personalizar a experiência e salvar preferências.",
      "Liberar filtros, Race e reorganização de colunas para usuários autenticados.",
      "Entender o uso do site e melhorar o produto quando a medição for autorizada.",
      "Proteger o serviço e diagnosticar falhas.",
    ],
    providersTitle: "Serviços utilizados",
    providers:
      "Utilizamos Firebase Authentication e Cloud Firestore para conta, perfil e preferências; Google Analytics para medição opcional; e Vercel para hospedagem do site.",
    passwordsTitle: "Senhas",
    passwords:
      "O TraderTab não armazena senhas. O cadastro, a validação, a recuperação e a sessão são processados pelo Firebase Authentication.",
    cookiesTitle: "Cookies e medição",
    cookies:
      "Cookies e armazenamentos necessários mantêm login e preferências. O Google Analytics só é ativado após autorização. A escolha pode ser alterada pelo link Preferências de cookies no rodapé.",
    rightsTitle: "Solicitações sobre dados",
    rights:
      "Você pode solicitar acesso, correção ou exclusão de dados da sua conta pelo contato abaixo. Podemos pedir confirmação da identidade antes de atender à solicitação.",
    contactTitle: "Contato",
    contactText: "E-mail para assuntos de privacidade:",
    back: "Voltar ao TraderTab",
  },
  en: {
    title: "Privacy Policy",
    updated: "Last updated: July 23, 2026",
    intro:
      "This policy explains, in simple terms, which data TraderTab uses and why.",
    collectedTitle: "Data collected",
    collected: [
      "Account: email, name, photo and login provider supplied by Firebase Authentication.",
      "Profile: date of birth, calculated age, country and optional favorite club entered by the user.",
      "Preferences: language, theme, cookie consent and column order.",
      "Optional measurement: visited pages, device, approximate location and feature interactions, only when Google Analytics is authorized.",
    ],
    purposeTitle: "Purposes",
    purposes: [
      "Authenticate the account and maintain the session.",
      "Personalize the experience and save preferences.",
      "Unlock filters, Race and column reordering for authenticated users.",
      "Understand usage and improve the product when measurement is authorized.",
      "Protect the service and diagnose failures.",
    ],
    providersTitle: "Services used",
    providers:
      "We use Firebase Authentication and Cloud Firestore for accounts, profiles and preferences; Google Analytics for optional measurement; and Vercel to host the website.",
    passwordsTitle: "Passwords",
    passwords:
      "TraderTab does not store passwords. Registration, validation, recovery and sessions are processed by Firebase Authentication.",
    cookiesTitle: "Cookies and measurement",
    cookies:
      "Essential cookies and storage keep login and preferences working. Google Analytics is enabled only after authorization. The choice can be changed through Cookie preferences in the footer.",
    rightsTitle: "Data requests",
    rights:
      "You may request access, correction or deletion of account data using the contact below. We may request identity confirmation before completing a request.",
    contactTitle: "Contact",
    contactText: "Privacy contact email:",
    back: "Back to TraderTab",
  },
  es: {
    title: "Política de Privacidad",
    updated: "Última actualización: 23 de julio de 2026",
    intro:
      "Esta política explica de forma sencilla qué datos utiliza TraderTab y para qué.",
    collectedTitle: "Datos recopilados",
    collected: [
      "Cuenta: correo, nombre, foto y proveedor de acceso suministrados por Firebase Authentication.",
      "Perfil: fecha de nacimiento, edad calculada, país y club favorito opcional informados por el usuario.",
      "Preferencias: idioma, tema, consentimiento de cookies y orden de columnas.",
      "Medición opcional: páginas visitadas, dispositivo, ubicación aproximada e interacciones, solo cuando se autoriza Google Analytics.",
    ],
    purposeTitle: "Finalidades",
    purposes: [
      "Autenticar la cuenta y mantener la sesión.",
      "Personalizar la experiencia y guardar preferencias.",
      "Habilitar filtros, Race y reorganización de columnas.",
      "Entender el uso y mejorar el producto cuando se autoriza la medición.",
      "Proteger el servicio y diagnosticar fallos.",
    ],
    providersTitle: "Servicios utilizados",
    providers:
      "Utilizamos Firebase Authentication y Cloud Firestore para cuentas, perfiles y preferencias; Google Analytics para medición opcional; y Vercel para alojar el sitio.",
    passwordsTitle: "Contraseñas",
    passwords:
      "TraderTab no almacena contraseñas. El registro, validación, recuperación y sesión son procesados por Firebase Authentication.",
    cookiesTitle: "Cookies y medición",
    cookies:
      "Las cookies y almacenamientos necesarios mantienen el acceso y las preferencias. Google Analytics solo se activa tras autorización. La elección puede cambiarse desde el pie de página.",
    rightsTitle: "Solicitudes de datos",
    rights:
      "Puedes solicitar acceso, corrección o eliminación de datos usando el contacto siguiente. Podemos pedir confirmación de identidad.",
    contactTitle: "Contacto",
    contactText: "Correo para asuntos de privacidad:",
    back: "Volver a TraderTab",
  },
};

export default function PrivacyPolicy({ language, onBack }) {
  const t = content[language] || content.pt;

  return (
    <main className="privacy-page">
      <div className="privacy-shell">
        <button type="button" className="privacy-back" onClick={onBack}>
          <ArrowLeft size={18} />
          {t.back}
        </button>

        <header className="privacy-header">
          <span>
            <ShieldCheck size={28} />
          </span>
          <div>
            <small>TraderTab</small>
            <h1>{t.title}</h1>
            <p>{t.updated}</p>
          </div>
        </header>

        <p className="privacy-intro">{t.intro}</p>

        <section>
          <h2>{t.collectedTitle}</h2>
          <ul>{t.collected.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>

        <section>
          <h2>{t.purposeTitle}</h2>
          <ul>{t.purposes.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>

        <section>
          <h2>{t.providersTitle}</h2>
          <p>{t.providers}</p>
        </section>

        <section>
          <h2>{t.passwordsTitle}</h2>
          <p>{t.passwords}</p>
        </section>

        <section>
          <h2>{t.cookiesTitle}</h2>
          <p>{t.cookies}</p>
        </section>

        <section>
          <h2>{t.rightsTitle}</h2>
          <p>{t.rights}</p>
        </section>

        <section className="privacy-contact">
          <Mail size={20} />
          <div>
            <h2>{t.contactTitle}</h2>
            <p>{t.contactText}</p>
            <a href="mailto:myradardev@gmail.com">myradardev@gmail.com</a>
          </div>
        </section>
      </div>
    </main>
  );
}
