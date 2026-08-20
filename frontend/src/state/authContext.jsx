/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { sendOtpApi, verifyOtpApi, completeProfileApi, loginApi, registerApi, googleLoginApi, updateProfileApi, sendEmailOtpApi, verifyEmailOtpApi, getCurrentUserApi } from "../api/authApi.js";

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
  updateProfile: async () => {},
  sendEmailOtp: async () => {},
  verifyEmailOtp: async () => {},
  login: async () => {},
  register: async () => {},
  googleLogin: async () => {},
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

function mapUserFromResponse(res, fallbackRole = "ROLE_USER") {
  if (!res) return null;
  return {
    id: res.id,
    name: res.name,
    email: res.email,
    mobile: res.mobile,
    countryCode: res.countryCode || "+91",
    dob: res.dob,
    age: res.age,
    gender: res.gender,
    role: res.role || fallbackRole,
    emailVerified: Boolean(res.emailVerified),
    mobileVerified: Boolean(res.mobileVerified),
  };
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
            setUserDataState(mapUserFromResponse(user));
          }
        })
        .catch((err) => {
          console.warn("Session check notice:", err?.message);
          const msg = (err?.message || "").toLowerCase();
          if (msg.includes("401") || msg.includes("unauthorized") || msg.includes("forbidden") || msg.includes("invalid token")) {
            setIsLoggedIn(false);
            setUserDataState(null);
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
            localStorage.setItem(AUTH_KEY, "0");
          }
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
    const user = mapUserFromResponse(res);
    if (user) user.mobileVerified = true;
    const isNew = res.isNewUser || res.newUser || !res.name || res.name.startsWith("User_") || !res.email;
    if (!isNew) {
      setIsLoggedIn(true);
      setUserDataState(user);
    }
    return res;
  }, []);

  const completeProfile = useCallback(async (profileData) => {
    const res = await completeProfileApi(profileData);
    const user = mapUserFromResponse(res);
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
    const user = mapUserFromResponse(res);
    setIsLoggedIn(true);
    setUserDataState(user);
    return user;
  }, []);

  const register = useCallback(async (registerData) => {
    const res = await registerApi(registerData);
    const user = mapUserFromResponse(res);
    setIsLoggedIn(true);
    setUserDataState(user);
    return user;
  }, []);

  const googleLogin = useCallback(async (googleData) => {
    const res = await googleLoginApi(googleData);
    const user = mapUserFromResponse(res);
    if (user && res.emailVerified !== undefined) {
      user.emailVerified = res.emailVerified;
    }
    setIsLoggedIn(true);
    setUserDataState(user);
    return user;
  }, []);

  const updateProfile = useCallback(async (profileData) => {
    const res = await updateProfileApi(profileData);
    const user = mapUserFromResponse(res, userData?.role || "ROLE_USER");
    setUserDataState(user);
    return user;
  }, [userData]);

  const sendEmailOtp = useCallback(async (email) => {
    return await sendEmailOtpApi(email);
  }, []);

  const verifyEmailOtp = useCallback(async (email, otp) => {
    const res = await verifyEmailOtpApi(email, otp);
    const user = mapUserFromResponse(res, userData?.role || "ROLE_USER");
    if (user) user.emailVerified = true;
    setUserDataState(user);
    return user;
  }, [userData]);

  const sendMobileOtp = useCallback(async (mobile, countryCode) => {
    return await sendMobileOtpApi(mobile, countryCode);
  }, []);

  const verifyMobileOtp = useCallback(async (mobile, otp) => {
    const res = await verifyMobileOtpApi(mobile, otp);
    const user = mapUserFromResponse(res, userData?.role || "ROLE_USER");
    if (user) user.mobileVerified = true;
    setUserDataState(user);
    return user;
  }, [userData]);

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
      updateProfile,
      sendEmailOtp,
      verifyEmailOtp,
      sendMobileOtp,
      verifyMobileOtp,
      login,
      register,
      googleLogin,
      logout,
      setUserData,
    }),
    [isLoggedIn, userData, isLoginModalOpen, openLoginModal, closeLoginModal, sendOtp, verifyOtp, completeProfile, updateProfile, sendEmailOtp, verifyEmailOtp, sendMobileOtp, verifyMobileOtp, login, register, googleLogin, logout, setUserData]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
