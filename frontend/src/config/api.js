const rawApiUrl = import.meta.env.VITE_API_URL;

const normalizedApiUrl =
  typeof rawApiUrl === "string" ? rawApiUrl.trim().replace(/\/$/, "") : "";

export const API_BASE =
  normalizedApiUrl ||
  (typeof window !== "undefined" ? window.location.origin : "");