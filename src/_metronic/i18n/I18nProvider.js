import React from "react";
import { useSelector } from "react-redux";
import { addLocaleData, IntlProvider } from "react-intl";

import * as en from "react-intl/locale-data/en";
import * as es from "react-intl/locale-data/es";
import * as ru from "react-intl/locale-data/ru";
import * as it from "react-intl/locale-data/it";

import enMessages from "./messages/en";
import esMessages from "./messages/es";
import ruMessages from "./messages/ru";
import itMessages from "./messages/it";
const allMessages = {
  en: enMessages,
  es: esMessages,
  ru: ruMessages,
  it: itMessages
};

addLocaleData([...en, ...es, ...ru,...it]);

export default function I18nProvider({ children }) {
  const locale = useSelector(({ i18n }) => i18n.lang);
  const messages = allMessages[locale];
  console.log(locale)
  return (
      <IntlProvider locale={locale} messages={messages}>
        {children}
      </IntlProvider>
  );
}
