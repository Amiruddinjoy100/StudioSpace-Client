"use client";

import {
  useEffect,
  useState,
  createContext,
  useContext
} from "react";

import { Toaster, toast } from "sonner";
import { authClient } from "@/lib/auth";
import { api } from "@/lib/api";

export const AppContext = createContext({
  theme: "light",
  toggle: () => {},
  authReady: false
});

export function useApp() {
  return useContext(AppContext);
}

export default function Providers({ children }) {
  const [theme, setTheme] = useState("light");
  const [authReady, setAuthReady] = useState(false);

  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    const saved = localStorage.getItem("studiospace-theme");
    setTheme(saved === "dark" ? "dark" : "light");
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("studiospace-theme", theme);
  }, [theme]);

  useEffect(() => {
    let cancelled = false;

    if (isPending) {
      setAuthReady(false);
      return () => {
        cancelled = true;
      };
    }

    if (!session?.user) {
      setAuthReady(true);
      return () => {
        cancelled = true;
      };
    }

    setAuthReady(false);

    api("/security/token", {
      method: "POST"
    })
      .then(() => {
        if (!cancelled) {
          setAuthReady(true);
        }
      })
      .catch(async (error) => {
        if (cancelled) return;

        // "Not signed in" errors are expected right after registering,
        // because the register page signs the user out straight away.
        const notSignedIn =
          error?.status === 401 ||
          /sign in/i.test(error?.message || "");

        if (notSignedIn) {
          // Wait a moment, then check if the user is really signed in.
          await new Promise((resolve) => setTimeout(resolve, 800));

          if (cancelled) return;

          const { data } = await authClient.getSession();

          if (cancelled) return;

          if (!data?.user) {
            setAuthReady(true);
            return;
          }
        }

        console.error(
          "[Auth] API session initialization failed:",
          error
        );

        setAuthReady(false);

        toast.error(
          "Secure session initialization failed. Please refresh the page and try again."
        );
      });

    return () => {
      cancelled = true;
    };
  }, [isPending, session?.user?.id]);

  return (
    <AppContext.Provider
      value={{
        theme,
        toggle: () =>
          setTheme((current) =>
            current === "light" ? "dark" : "light"
          ),
        authReady: !isPending && authReady
      }}
    >
      {children}
      <Toaster position="top-right" richColors closeButton />
    </AppContext.Provider>
  );
}