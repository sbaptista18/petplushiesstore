import { useState, useEffect } from "react";
import {
  generateSessionKey,
  setSessionInLocalStorage,
  getSessionDataFromLocalStorage,
} from "helpers";

const CreateCartKey = (token) => {
  const [sessionData, setSessionData] = useState(null);
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  useEffect(() => {
    const storedSessionData = getSessionDataFromLocalStorage(isLoggedIn);

    if (storedSessionData != null) {
      //to check if the data retrived is a temp session
      if (!isLoggedIn) {
        const { key, timestamp } = storedSessionData;
        const currentTime = new Date().getTime();
        const elapsedTime = currentTime - timestamp;

        if (elapsedTime < 60 * 60 * 1000) {
          setSessionData(key);
        } else {
          localStorage.removeItem("tempCart");
          const newSessionKey = generateSessionKey();
          setSessionData(newSessionKey);
          setSessionInLocalStorage(newSessionKey);
        }
      } else {
        const { key } = storedSessionData;
        setSessionData(key);
      }
    } else {
      const newSessionKey = generateSessionKey();
      setSessionData(newSessionKey);
      setSessionInLocalStorage(newSessionKey, isLoggedIn);
    }
  }, [token]);

  return sessionData;
};

export default CreateCartKey;
