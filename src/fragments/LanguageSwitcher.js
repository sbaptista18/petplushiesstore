import i18n from "fragments/Translations"; // Your i18n configuration file

export const changeLanguage = (language) => {
  i18n.changeLanguage(language);
};

// Use this function to change the language, e.g., onClick={() => changeLanguage('pt')}
