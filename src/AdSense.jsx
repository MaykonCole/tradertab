import { useEffect } from "react";

const CLIENT_ID = String(import.meta.env.VITE_ADSENSE_CLIENT || "").trim();
const VALID_CLIENT = /^ca-pub-\d+$/.test(CLIENT_ID);

export const adsenseConfigured = VALID_CLIENT;

export default function AdSenseLoader() {
  useEffect(() => {
    if (!VALID_CLIENT || typeof document === "undefined") return undefined;
    if (document.querySelector('script[data-tradertab-adsense="true"]')) return undefined;

    const script = document.createElement("script");
    script.async = true;
    script.crossOrigin = "anonymous";
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(CLIENT_ID)}`;
    script.dataset.tradertabAdsense = "true";
    document.head.appendChild(script);

    return undefined;
  }, []);

  return null;
}
