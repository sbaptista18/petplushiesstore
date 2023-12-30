import { useTranslation } from "react-i18next";

export const MainMenuItems = () => {
  const { t } = useTranslation();

  const data = [
    {
      key: 1,
      label: t("sobreNos"),
      path: "sobre-nos",
    },
    {
      key: 2,
      label: t("loja"),
      path: "loja",
    },
    {
      key: 3,
      label: t("blog"),
      path: "blog",
    },
    {
      key: 4,
      label: t("contactos"),
      path: "contactos",
    },
  ];

  return data;
};

export const SecondaryMenuItems = () => {
  const { t } = useTranslation();

  const data = [
    {
      key: 1,
      label: t("seguirEncomenda"),
      path: "seguir-encomenda",
    },
    {
      key: 2,
      label: t("perguntasFrequentes"),
      path: "perguntas-frequentes",
    },
  ];

  return data;
};

export const LegalMenuItems = () => {
  const { t } = useTranslation();

  const data = [
    {
      key: 1,
      label: t("politicaPrivacidade"),
      path: "politica-de-privacidade",
    },
    {
      key: 2,
      label: t("termosCondicoes"),
      path: "termos-e-condicoes",
    },
    {
      key: 3,
      label: t("enviosDevolucoes"),
      path: "envios-e-devolucoes",
    },
  ];

  return data;
};
