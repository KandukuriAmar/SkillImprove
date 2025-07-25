import { createContext, useState, useEffect } from "react";
import axios from "axios";
import base64 from 'base-64';
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

const defaultMeta = {
  token: "",
  fullname: "",
  isLoggedIn: false,
  goal: "",
  mode: "light",
  isLoggedInAdmin: false,
  roadmap: "",
  quizData: {},
};

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(defaultMeta);

  useEffect(() => {
    const refreshDataToken = localStorage.getItem("metadataToken");
    if (refreshDataToken) {
      try {
        const decodedBase64 = base64.decode(refreshDataToken);
        const decodedTokenData = jwtDecode(decodedBase64);
        const refreshedData = decodedTokenData.userData;

        setUserData((prev) => ({
          ...prev,      
          ...refreshedData
        }));

        console.log("Restored from localStorage:", refreshedData);
      } catch (err) {
        console.log("Error decoding metadata token:", err.message);
      }
    }
  }, []);

  const fetchMetadata = async (customData = null) => {
  try {
    const dataToSend = customData || userData;
    console.log("Sending metadata to backend: ", dataToSend);
    
    const resp = await axios.post(
      "http://localhost:9000/api/getcookie",
      dataToSend,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      }
    );

    if (resp.status === 200) {
      const tokenBase64 = resp.data.dataToken;
      localStorage.setItem("metadataToken", tokenBase64);

      const decodedBase64 = base64.decode(tokenBase64);
      const decodedTokenData = jwtDecode(decodedBase64);
      const refreshedData = decodedTokenData.userData;

      setUserData((prev) => ({
        ...prev,
        ...refreshedData
      }));

      console.log("Fetched & updated metadata:", refreshedData);
    }
  } catch (err) {
    console.log("Failed to fetch metadata:", err.message);
  }
};

  const loginUser = (updates, shouldRefresh = false) => {
    const mergedData = { ...userData, ...updates };
    setUserData(mergedData);
    console.log("user data saved by login: ", mergedData);

    if (shouldRefresh) fetchMetadata(mergedData);
  };

  const logoutUser = () => {
    setUserData(defaultMeta);
    localStorage.removeItem("metadataToken");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ userData, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};