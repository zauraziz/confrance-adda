"use client";
import { useEffect } from "react";

export default function Recaptcha() {
  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    if (!siteKey) return;
    if (document.getElementById("recaptcha-script")) return;

    const script = document.createElement("script");
    script.id = "recaptcha-script";
    script.src = "https://www.google.com/recaptcha/api.js?render=" + siteKey;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      const badge = document.querySelector(".grecaptcha-badge");
      if (badge) badge.style.visibility = "hidden";
    };
  }, []);

  return null;
}

export async function getRecaptchaToken(action = "submit") {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if (!siteKey) return null;
  if (typeof window === "undefined" || !window.grecaptcha) return null;
  try {
    return await new Promise((resolve, reject) => {
      window.grecaptcha.ready(() => {
        window.grecaptcha.execute(siteKey, { action }).then(resolve).catch(reject);
      });
    });
  } catch (e) {
    console.error("reCAPTCHA error:", e);
    return null;
  }
}
