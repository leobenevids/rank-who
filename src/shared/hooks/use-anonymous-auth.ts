"use client";

import { useEffect, useState } from "react";

import { createClient } from "@/shared/lib/supabase/client";

type AuthStatus = "checking" | "ready" | "error";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unexpected authentication error.";
}

export function useAnonymousAuth() {
  const [status, setStatus] = useState<AuthStatus>("checking");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          throw userError;
        }

        if (!user) {
          const { error: signInError } = await supabase.auth.signInAnonymously();

          if (signInError) {
            throw signInError;
          }
        }

        if (!cancelled) {
          setStatus("ready");
        }
      } catch (caughtError) {
        if (!cancelled) {
          setStatus("error");
          setError(getErrorMessage(caughtError));
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    status,
    error,
    isReady: status === "ready",
  };
}
