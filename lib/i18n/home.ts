export const supportedLocales = ["en", "es"] as const;

export type Locale = (typeof supportedLocales)[number];

export type HomeDictionary = {
  services: string;
  caseStudies: string;
  leadForm: string;
  startConversation: string;
  submitLead: string;
};

const dictionaries: Record<Locale, HomeDictionary> = {
  en: {
    services: "Services",
    caseStudies: "Case Studies",
    leadForm: "Tell Me About Your Environment",
    startConversation: "Start conversation",
    submitLead: "Send details",
  },
  es: {
    services: "Servicios",
    caseStudies: "Casos de Estudio",
    leadForm: "Cuentame Sobre Tu Entorno",
    startConversation: "Iniciar conversacion",
    submitLead: "Enviar detalles",
  },
};

export function resolveLocale(value?: string | null): Locale {
  if (!value) return "en";
  const normalized = value.toLowerCase();
  return (supportedLocales as readonly string[]).includes(normalized)
    ? (normalized as Locale)
    : "en";
}

export function getHomeDictionary(locale: Locale): HomeDictionary {
  return dictionaries[locale] ?? dictionaries.en;
}
