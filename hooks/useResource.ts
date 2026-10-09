import { Dispatch, SetStateAction, useCallback, useRef, useState } from "react";
import { useFocusEffect } from "expo-router";
import { useToast } from "@/components/ui/Toast";
import { errorMessage } from "@/utils/errors";

type Status = "loading" | "ready" | "error";

export type Resource<T> = {
  data: T | null;
  setData: Dispatch<SetStateAction<T | null>>;
  status: Status;
  error: string | null;
  refreshing: boolean;
  /** Pull-to-refresh : garde les données affichées pendant le rechargement. */
  refresh: () => Promise<void>;
  /** Après une erreur bloquante : relance un chargement complet. */
  retry: () => Promise<void>;
};

/**
 * Charge une ressource et la recharge silencieusement à chaque retour sur l'écran,
 * pour que les données restent à jour (ex. une carte modifiée puis retour au board).
 * `fetcher` doit être mémoïsé (useCallback) par l'appelant.
 */
export function useResource<T>(fetcher: () => Promise<T>, fallbackError: string): Resource<T> {
  const toast = useToast();
  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const loaded = useRef(false);
  const latestRequest = useRef(0);

  const load = useCallback(
    async (mode: "initial" | "refresh" | "silent") => {
      const request = ++latestRequest.current;
      if (mode === "initial") setStatus("loading");
      if (mode === "refresh") setRefreshing(true);

      try {
        const result = await fetcher();
        if (request !== latestRequest.current) return; // une requête plus récente a pris le relais
        loaded.current = true;
        setData(result);
        setError(null);
        setStatus("ready");
      } catch (e) {
        if (request !== latestRequest.current) return;
        const message = errorMessage(e, fallbackError);
        if (loaded.current) {
          // Des données sont déjà affichées : on les garde et on prévient sans bloquer l'écran.
          if (mode === "refresh") toast.error(message);
        } else {
          setError(message);
          setStatus("error");
        }
      } finally {
        if (mode === "refresh" && request === latestRequest.current) setRefreshing(false);
      }
    },
    [fetcher, fallbackError, toast],
  );

  useFocusEffect(
    useCallback(() => {
      load(loaded.current ? "silent" : "initial");
    }, [load]),
  );

  const refresh = useCallback(() => load("refresh"), [load]);
  const retry = useCallback(() => load("initial"), [load]);

  return { data, setData, status, error, refreshing, refresh, retry };
}
