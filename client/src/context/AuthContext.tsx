/* eslint-disable react-hooks/immutability */
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { AuthUser } from "@/lib/auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const REFRESH_BEFORE_MS = 30 * 1000;

interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  ready: boolean;
}

interface AuthContextValue extends AuthState {
  setAuth: (token: string, user: AuthUser, expiresIn: number) => void;
  clearAuth: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuthState] = useState<AuthState>({
    accessToken: null,
    user: null,
    ready: false,
  });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const clearAuth = useCallback(() => {
    clearTimer();
    setAuthState({ accessToken: null, user: null, ready: true });
    fetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    }).catch(() => {});
  }, []);

  const doRefresh = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        setAuthState({ accessToken: null, user: null, ready: true });
        return;
      }
      const { accessToken, expiresIn, user } = await res.json();
      setAuthState({ accessToken, user, ready: true });

      clearTimer();

      timerRef.current = setTimeout(
        doRefresh,
        expiresIn * 1000 - REFRESH_BEFORE_MS,
      );
    } catch {
      setAuthState({ accessToken: null, user: null, ready: true });
    }
  }, []);

  const setAuth = useCallback(
    (token: string, user: AuthUser, expiresIn: number) => {
      setAuthState({ accessToken: token, user, ready: true });
      clearTimer();
      timerRef.current = setTimeout(
        doRefresh,
        expiresIn * 1000 - REFRESH_BEFORE_MS,
      );
    },
    [doRefresh],
  );

  // Restore session on mount
  useEffect(() => {
    doRefresh();
    return clearTimer;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AuthContext.Provider value={{ ...auth, setAuth, clearAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
