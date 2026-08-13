/**
 * Anonymous session id for listening analytics. No personal data — just a
 * random opaque id stored locally so play events can be de-duplicated per
 * browser without identifying the user.
 */
const KEY = "huda-session-id";

export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let id = localStorage.getItem(KEY);
    if (!id) {
      id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `sess-${Math.random().toString(36).slice(2)}-${Date.now()}`;
      localStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    return "anonymous";
  }
}
