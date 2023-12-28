const storedUserData = localStorage.getItem("user");
let storedSessionData;

export const generateSessionKey = () => {
  return Math.random().toString(36).substring(2, 17);
};

export const setSessionInLocalStorage = (key, loggedIn) => {
  // console.log("is logged in (set):", isLoggedIn);
  if (loggedIn) {
    const username = JSON.parse(storedUserData).user_login;
    const sessionData = {
      key: username,
    };
    localStorage.setItem("userCart", JSON.stringify(sessionData));
    localStorage.removeItem("tempCart");
  } else {
    const currentTime = new Date().getTime();
    const sessionData = {
      key,
      timestamp: currentTime,
    };
    localStorage.setItem("tempCart", JSON.stringify(sessionData));
    localStorage.removeItem("userCart");
  }
};

export const getSessionDataFromLocalStorage = (loggedIn) => {
  if (loggedIn) {
    localStorage.removeItem("tempCart");
    storedSessionData = localStorage.getItem("userCart");
  } else {
    localStorage.removeItem("userCart");
    storedSessionData = localStorage.getItem("tempCart");
  }

  return storedSessionData ? JSON.parse(storedSessionData) : null;
};
