import { useState, useEffect } from "react";

const CreateLocalStorageKey = () => {
  const [sessionData, setSessionData] = useState(null);

  const generateSessionKey = () => {
    return Math.random().toString(36).substring(7);
  };

  const setSessionInLocalStorage = (key) => {
    const currentTime = new Date().getTime();
    const sessionData = {
      key,
      timestamp: currentTime,
    };
    localStorage.setItem("sessionData", JSON.stringify(sessionData));
  };

  useEffect(() => {
    const storedSessionData = localStorage.getItem("sessionData");

    if (storedSessionData) {
      const { key, timestamp } = JSON.parse(storedSessionData);
      const currentTime = new Date().getTime();
      const elapsedTime = currentTime - timestamp;

      if (elapsedTime < 60 * 60 * 1000) {
        // Session key is still valid
        setSessionData(key);
      } else {
        // Session key has expired, clear localStorage
        localStorage.removeItem("sessionData");
        const newSessionKey = generateSessionKey();
        setSessionData(newSessionKey);
        setSessionInLocalStorage(newSessionKey);
      }
    } else {
      const newSessionKey = generateSessionKey();
      setSessionData(newSessionKey);
      setSessionInLocalStorage(newSessionKey);
    }
  }, []);

  return sessionData;
};

export default CreateLocalStorageKey;
