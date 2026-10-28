const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const apiUrl = configuredApiUrl
  ? /^https?:\/\//i.test(configuredApiUrl)
    ? configuredApiUrl
    : `https://${configuredApiUrl}`
  : undefined;

export const API_URL = apiUrl?.replace(/\/+$/, "") ?? "http://localhost:5178";