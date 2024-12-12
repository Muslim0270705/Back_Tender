import i18next from "i18next";
import Backend from "i18next-node-fs-backend";
import middleware from "i18next-http-middleware";

import commonTranslationRU from "../locales/ru/translation.json";
import commonTranslationKG from "../locales/kg/translation.json";

const resources = {
  ru: {
    translation: commonTranslationRU,
  },
  kg: {
    translation: commonTranslationKG,
  },
};

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    resources,
    defaultNS: "translation",
    detection: {
      order: ["querystring", "cookie"],
      cache: ["cookie"],
      lookupQuerystring: "lang",
      lookupCookie: "lang",
    },
    fallbackLng: ["ru", "kg", "ky"],
    preload: ["ru"],
  });

const translator = middleware.handle(i18next);

export default translator;
