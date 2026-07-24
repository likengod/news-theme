import { createMiddleware } from "@tanstack/react-start";

const SESSION_KEY = "nt:mysql_session:v1";

/**
 * Middleware that attaches the MySQL session token to outgoing server function requests.
 */
export const attachAuth = createMiddleware({ type: "function" }).client(
  async ({ next }) => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(SESSION_KEY);
        if (raw) {
          const session = JSON.parse(raw);
          if (session?.access_token) {
            return next({
              headers: {
                Authorization: `Bearer ${session.access_token}`,
              },
            });
          }
        }
      } catch {}
    }
    return next();
  }
);
