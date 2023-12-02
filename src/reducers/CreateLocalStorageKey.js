import { useState, useEffect } from "react";
import {
  generateSessionKey,
  setSessionInLocalStorage,
  getSessionDataFromLocalStorage,
} from "helpers";

const CreateCartKey = () => {
  const [sessionData, setSessionData] = useState(null);

  useEffect(() => {
    const storedSessionData = getSessionDataFromLocalStorage();

    if (storedSessionData) {
      if (storedSessionData.timestamp) {
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
      setSessionInLocalStorage(newSessionKey);
    }
  }, []);

  return sessionData;
};

export default CreateCartKey;
