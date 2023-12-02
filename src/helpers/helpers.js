const storedUserData = localStorage.getItem("user");
let storedSessionData;

export const generateSessionKey = () => {
  return Math.random().toString(36).substring(2, 17);
};

export const setSessionInLocalStorage = (key) => {
  if (storedUserData) {
    const username = JSON.parse(storedUserData).user_login;
    const sessionData = {
      key: username,
    };
    localStorage.setItem("userCart", JSON.stringify(sessionData));
  } else {
    const currentTime = new Date().getTime();
    const sessionData = {
      key,
      timestamp: currentTime,
    };
    localStorage.setItem("tempCart", JSON.stringify(sessionData));
  }
};

export const getSessionDataFromLocalStorage = () => {
  if (storedUserData) storedSessionData = localStorage.getItem("userCart");
  else storedSessionData = localStorage.getItem("tempCart");

  return storedSessionData ? JSON.parse(storedSessionData) : null;
};
