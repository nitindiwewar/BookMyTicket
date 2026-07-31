/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { sendOtpApi, verifyOtpApi, completeProfileApi, loginApi, registerApi, getCurrentUserApi } from "../api/authApi.js";

const AUTH_KEY = "movieticket-auth";
const USER_KEY = "movieticket-user";
const TOKEN_KEY = "movieticket-auth-token";

export const AuthContext = createContext({
  isLoggedIn: false,
  userData: null,
  isLoginModalOpen: false,
  openLoginModal: () => {},
  closeLoginModal: () => {},
  sendOtp: async () => {},
  verifyOtp: async () => {},
  completeProfile: async () => {},
  login: async () => {},
  register: async () => {},
  logout: () => {},
  setUserData: () => {},
});

function getInitialAuth() {
  try {
    return localStorage.getItem(AUTH_KEY) === "1" && Boolean(localStorage.getItem(TOKEN_KEY));
  } catch {
    return false;
  }
}

function getInitialUserData() {
  try {
    if (localStorage.getItem(AUTH_KEY) !== "1" || !localStorage.getItem(TOKEN_KEY)) {
      return null;
    }
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(getInitialAuth);
  const [userData, setUserDataState] = useState(getInitialUserData);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openLoginModal = useCallback(() => setIsLoginModalOpen(true), []);
  const closeLoginModal = useCallback(() => setIsLoginModalOpen(false), []);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token && isLoggedIn) {
      getCurrentUserApi()
        .then((user) => {
          if (user) {
            setUserDataState({
              id: user.id,
              name: user.name,
              email: user.email,
              mobile: user.mobile,
              countryCode: user.countryCode || "+91",
              dob: user.dob,
              age: user.age,
              gender: user.gender,
            });
          }
        })
        .catch(() => {
          setIsLoggedIn(false);
          setUserDataState(null);
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          localStorage.setItem(AUTH_KEY, "0");
        });
    }
  }, [isLoggedIn]);

  useEffect(() => {
    try {
      localStorage.setItem(AUTH_KEY, isLoggedIn ? "1" : "0");
    } catch {
      // ignore
    }
  }, [isLoggedIn]);

  useEffect(() => {
    try {
      if (userData) {
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
      } else {
        localStorage.removeItem(USER_KEY);
      }
    } catch {
      // ignore
    }
  }, [userData]);

  const sendOtp = useCallback(async (mobile, countryCode = "+91") => {
    return await sendOtpApi(mobile, countryCode);
  }, []);

  const verifyOtp = useCallback(async (mobile, countryCode = "+91", otp) => {
    const res = await verifyOtpApi(mobile, countryCode, otp);
    const user = {
      id: res.id,
      name: res.name,
      email: res.email,
      mobile: res.mobile,
      countryCode: res.countryCode,
      dob: res.dob,
      age: res.age,
      gender: res.gender,
    };
    const isNew = res.isNewUser || res.newUser || !res.name || res.name.startsWith("User_") || !res.email;
    if (!isNew) {
      setIsLoggedIn(true);
      setUserDataState(user);
    }
    return res;
  }, []);

  const completeProfile = useCallback(async (profileData) => {
    const res = await completeProfileApi(profileData);
    const user = {
      id: res.id,
      name: res.name,
      email: res.email,
      mobile: res.mobile,
      countryCode: res.countryCode,
      dob: res.dob,
      age: res.age,
      gender: res.gender,
    };
    setIsLoggedIn(true);
    setUserDataState(user);
    return user;
  }, []);

  const login = useCallback(async (emailOrData, password) => {
    if (typeof emailOrData === "object" && emailOrData !== null) {
      setIsLoggedIn(true);
      setUserDataState(emailOrData);
      return emailOrData;
    }
    const res = await loginApi(emailOrData, password);
    const user = {
      id: res.id,
      name: res.name,
      email: res.email,
      mobile: res.mobile,
      countryCode: res.countryCode,
      dob: res.dob,
      age: res.age,
      gender: res.gender,
    };
    setIsLoggedIn(true);
    setUserDataState(user);
    return user;
  }, []);

  const register = useCallback(async (registerData) => {
    const res = await registerApi(registerData);
    const user = {
      id: res.id,
      name: res.name,
      email: res.email,
      mobile: res.mobile,
      countryCode: res.countryCode,
      dob: res.dob,
      age: res.age,
      gender: res.gender,
    };
    setIsLoggedIn(true);
    setUserDataState(user);
    return user;
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUserDataState(null);
    try {
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.setItem(AUTH_KEY, "0");
    } catch {
      // ignore
    }
  }, []);

  const setUserData = useCallback((data) => {
    setUserDataState(data);
  }, []);

  const value = useMemo(
    () => ({
      isLoggedIn,
      userData,
      isLoginModalOpen,
      openLoginModal,
      closeLoginModal,
      sendOtp,
      verifyOtp,
      completeProfile,
      login,
      register,
      logout,
      setUserData,
    }),
    [isLoggedIn, userData, isLoginModalOpen, openLoginModal, closeLoginModal, sendOtp, verifyOtp, completeProfile, login, register, logout, setUserData]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
