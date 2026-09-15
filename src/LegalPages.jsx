import React from "react";
import { CircleHelp, FileText, Info, ShieldCheck } from "lucide-react";
import { localizePtPT } from "./ptPt";

const pages = {
  pt: {
    about: {
      icon: Info,
      title: "Sobre o TraderTab",
      updated: "Informação editorial e de produto",
      sections: [
        ["O que é", "O TraderTab é uma ferramenta independente de organização e análise pré-jogo. O site reúne informações de partidas, odds e filtros para facilitar a leitura do mercado esportivo."],
        ["Como usamos os dados", "Os dados exibidos servem como apoio informativo. O TraderTab não executa apostas, não recebe depósitos e não garante resultados financeiros."],
        ["Independência", "O TraderTab não é uma casa de apostas. Quando existirem anúncios, eles serão identificados e separados das ferramentas de análise."],
        ["Contato", "Dúvidas, correções ou sugestões podem ser enviadas para myradardev@gmail.com."],
      ],
    },
    terms: {
      icon: FileText,
      title: "Termos de Uso",
      updated: "Última atualização: 15 de setembro de 2026",
      sections: [
        ["Uso do serviço", "O TraderTab oferece conteúdo e ferramentas informativas. Você é responsável pelas decisões tomadas a partir das informações exibidas no site."],
        ["Sem garantia de resultado", "Odds, classificações, filtros, estatísticas e demais indicadores podem mudar, conter atrasos ou indisponibilidades. Nenhuma informação constitui promessa de lucro ou recomendação financeira."],
        ["Conta e segurança", "O usuário é responsável por manter o acesso à própria conta seguro e por fornecer informações verdadeiras ao criar ou completar o cadastro."],
        ["Propriedade e uso", "A interface, marca, textos e funcionalidades do TraderTab não podem ser copiados ou redistribuídos de forma que viole direitos aplicáveis ou prejudique o serviço."],
        ["Publicidade", "O site pode exibir publicidade de terceiros. Anúncios não representam endosso do TraderTab e devem permanecer visualmente separados das ferramentas e dos dados do produto."],
        ["Alterações", "Estes termos podem ser atualizados para refletir mudanças legais, técnicas ou de produto. A versão publicada nesta página é a vigente."],
      ],
    },
    responsible: {
      icon: ShieldCheck,
      title: "Jogo Responsável",
      updated: "Conteúdo destinado a maiores de 18 anos",
      sections: [
        ["Aposta não é investimento", "O TraderTab é uma ferramenta de análise. Apostas esportivas envolvem risco real de perda e não devem ser tratadas como renda garantida ou investimento."],
        ["Defina limites", "Use apenas valores que não comprometam despesas essenciais. Estabeleça limites de tempo e dinheiro e evite tentar recuperar perdas aumentando exposição."],
        ["Faça pausas", "Se a atividade deixar de ser entretenimento, causar ansiedade, conflitos ou perda de controle, interrompa o uso e procure orientação especializada."],
        ["Proteção de menores", "O conteúdo e os recursos relacionados a apostas são destinados exclusivamente a adultos. Menores de 18 anos não devem utilizar ferramentas voltadas a apostas."],
      ],
    },
  },
  en: {
    about: {
      icon: Info,
      title: "About TraderTab",
      updated: "Editorial and product information",
      sections: [
        ["What it is", "TraderTab is an independent pre-match organization and analysis tool. It brings together match information, odds and filters to make sports-market reading easier."],
        ["How data is used", "Displayed data is informational. TraderTab does not place bets, accept deposits or guarantee financial outcomes."],
        ["Independence", "TraderTab is not a bookmaker. When advertising is present, it is identified and kept separate from analysis tools."],
        ["Contact", "Questions, corrections or suggestions can be sent to myradardev@gmail.com."],
      ],
    },
    terms: {
      icon: FileText,
      title: "Terms of Use",
      updated: "Last updated: September 15, 2026",
      sections: [
        ["Use of the service", "TraderTab provides informational content and tools. You are responsible for decisions made using information displayed on the website."],
        ["No outcome guarantee", "Odds, classifications, filters, statistics and other indicators may change, be delayed or become unavailable. Nothing on the site is a promise of profit or financial advice."],
        ["Account and security", "Users are responsible for keeping account access secure and for providing accurate information when creating or completing an account."],
        ["Ownership and use", "TraderTab's interface, brand, copy and functionality may not be copied or redistributed in ways that infringe applicable rights or harm the service."],
        ["Advertising", "The website may display third-party advertising. Ads do not represent TraderTab endorsement and must remain visually separate from product tools and data."],
        ["Changes", "These terms may be updated to reflect legal, technical or product changes. The version published on this page is the current version."],
      ],
    },
    responsible: {
      icon: ShieldCheck,
      title: "Responsible Gambling",
      updated: "Content intended for adults aged 18+",
      sections: [
        ["Betting is not investing", "TraderTab is an analysis tool. Sports betting involves a real risk of loss and should not be treated as guaranteed income or an investment."],
        ["Set limits", "Only use money that does not affect essential expenses. Set time and money limits and avoid increasing exposure in an attempt to recover losses."],
        ["Take breaks", "If gambling stops being entertainment or causes anxiety, conflict or loss of control, stop and seek appropriate professional support."],
        ["Protect minors", "Betting-related content and tools are for adults only. People under 18 should not use tools designed around gambling."],
      ],
    },
  },
  es: {
    about: {
      icon: Info,
      title: "Acerca de TraderTab",
      updated: "Información editorial y del producto",
      sections: [
        ["Qué es", "TraderTab es una herramienta independiente de organización y análisis previo al partido. Reúne información de partidos, cuotas y filtros para facilitar la lectura del mercado deportivo."],
        ["Uso de los datos", "Los datos mostrados son informativos. TraderTab no realiza apuestas, no recibe depósitos y no garantiza resultados financieros."],
        ["Independencia", "TraderTab no es una casa de apuestas. Cuando exista publicidad, se identificará y se mantendrá separada de las herramientas de análisis."],
        ["Contacto", "Puedes enviar dudas, correcciones o sugerencias a myradardev@gmail.com."],
      ],
    },
    terms: {
      icon: FileText,
      title: "Términos de Uso",
      updated: "Última actualización: 15 de septiembre de 2026",
      sections: [
        ["Uso del servicio", "TraderTab ofrece contenido y herramientas informativas. El usuario es responsable de las decisiones tomadas a partir de la información del sitio."],
        ["Sin garantía de resultados", "Las cuotas, clasificaciones, filtros, estadísticas y otros indicadores pueden cambiar, retrasarse o no estar disponibles. Nada constituye una promesa de beneficio ni asesoramiento financiero."],
        ["Cuenta y seguridad", "El usuario es responsable de mantener seguro el acceso a su cuenta y de proporcionar información veraz al registrarse."],
        ["Propiedad y uso", "La interfaz, marca, textos y funciones de TraderTab no pueden copiarse o redistribuirse de forma que infrinja derechos aplicables o perjudique el servicio."],
        ["Publicidad", "El sitio puede mostrar publicidad de terceros. Los anuncios no representan el respaldo de TraderTab y deben permanecer separados de las herramientas y los datos del producto."],
        ["Cambios", "Estos términos pueden actualizarse por cambios legales, técnicos o de producto. La versión publicada en esta página es la vigente."],
      ],
    },
    responsible: {
      icon: ShieldCheck,
      title: "Juego Responsable",
      updated: "Contenido destinado a mayores de 18 años",
      sections: [
        ["Apostar no es invertir", "TraderTab es una herramienta de análisis. Las apuestas deportivas implican un riesgo real de pérdida y no deben tratarse como ingresos garantizados o inversión."],
        ["Define límites", "Utiliza solo dinero que no afecte gastos esenciales. Establece límites de tiempo y dinero y evita aumentar la exposición para recuperar pérdidas."],
        ["Haz pausas", "Si deja de ser entretenimiento o causa ansiedad, conflictos o pérdida de control, detén la actividad y busca ayuda profesional adecuada."],
        ["Protección de menores", "El contenido y las herramientas relacionadas con apuestas son exclusivamente para adultos. Los menores de 18 años no deben utilizar herramientas orientadas a apuestas."],
      ],
    },
  },
};

pages["pt-PT"] = {
  about: { ...pages.pt.about, title: "Sobre o TraderTab", sections: pages.pt.about.sections.map(([a,b]) => [localizePtPT(a), localizePtPT(b)]) },
  terms: { ...pages.pt.terms, title: "Termos de Utilização", sections: pages.pt.terms.sections.map(([a,b]) => [localizePtPT(a), localizePtPT(b)]) },
  responsible: { ...pages.pt.responsible, title: "Jogo Responsável", sections: pages.pt.responsible.sections.map(([a,b]) => [localizePtPT(a), localizePtPT(b)]) },
};

export default function LegalPage({ language, page }) {
  const t = pages[language]?.[page] || pages.pt[page];
  const Icon = t?.icon || CircleHelp;

  return (
    <main className="privacy-page legal-page">
      <div className="privacy-shell">
        <header className="privacy-header">
          <span><Icon size={28} /></span>
          <div><small>TraderTab</small><h1>{t.title}</h1><p>{t.updated}</p></div>
        </header>
        {t.sections.map(([title, text]) => (
          <section key={title}>
            <h2>{title}</h2>
            <p>{text}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
