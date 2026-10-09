import axios, { isAxiosError } from "axios";
import { router } from "expo-router";
import { authOptions, clearCredentials, getCredentials } from "./credentials";

export const TRELLO_API_URL = "https://api.trello.com/1";

const api = axios.create({
  baseURL: TRELLO_API_URL,
  timeout: 15000,
});

api.interceptors.request.use(async (config) => {
  const credentials = await getCredentials();
  if (!credentials) return config;

  const { headers, params } = authOptions(credentials);
  if (headers) Object.entries(headers).forEach(([name, value]) => config.headers.set(name, value));
  if (params) config.params = { ...config.params, ...params };
  return config;
});

let redirecting = false;

api.interceptors.response.use(undefined, async (error) => {
  // Trello répond 401 + "invalid token" / "expired token" quand le token n'est plus valide.
  // Un 401 "unauthorized permission requested" signifie seulement un manque de droits : on ne déconnecte pas.
  const data = isAxiosError(error) ? error.response?.data : undefined;
  const tokenRejected =
    isAxiosError(error) && error.response?.status === 401 && typeof data === "string" && /token/i.test(data);

  if (tokenRejected && !redirecting) {
    redirecting = true;
    await clearCredentials();
    router.replace({ pathname: "/onboarding/token", params: { expired: "1" } });
    setTimeout(() => {
      redirecting = false;
    }, 1000);
  }
  return Promise.reject(error);
});

export default api;
