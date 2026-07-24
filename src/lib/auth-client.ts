/**
 * Client-side MySQL Authentication Manager.
 * Communicates directly with backend MySQL server functions.
 */
import {
  signInServer,
  signUpServer,
  signOutServer,
  getSessionServer,
  getUserServer,
  getProfileServer,
} from "@/lib/auth.functions";

const SESSION_KEY = "nt:mysql_session:v1";

type AuthListener = (event: string, session: any) => void;
const listeners = new Set<AuthListener>();

function notify(event: string, session: any) {
  for (const listener of listeners) {
    try {
      listener(event, session);
    } catch (e) {
      console.error("[Auth] Listener error:", e);
    }
  }
}

export const authClient = {
  auth: {
    async signInWithPassword(credentials: { email: string; password?: string }) {
      try {
        const res = await signInServer({ data: credentials });
        if (typeof window !== "undefined") {
          localStorage.setItem(SESSION_KEY, JSON.stringify(res.session));
        }
        notify("SIGNED_IN", res.session);
        return { data: res, error: null };
      } catch (err: any) {
        return { data: { session: null, user: null }, error: { message: err.message || "Sign in failed" } };
      }
    },

    async signUp(credentials: { email: string; password?: string; options?: { data?: { display_name?: string } } }) {
      try {
        const res = await signUpServer({
          data: {
            email: credentials.email,
            password: credentials.password,
            displayName: credentials.options?.data?.display_name,
          },
        });
        if (typeof window !== "undefined") {
          localStorage.setItem(SESSION_KEY, JSON.stringify(res.session));
        }
        notify("SIGNED_IN", res.session);
        return { data: res, error: null };
      } catch (err: any) {
        return { data: { session: null, user: null }, error: { message: err.message || "Sign up failed" } };
      }
    },

    async signOut() {
      try {
        if (typeof window !== "undefined") {
          const raw = localStorage.getItem(SESSION_KEY);
          if (raw) {
            const session = JSON.parse(raw);
            if (session?.access_token) {
              await signOutServer({ data: { token: session.access_token } });
            }
          }
          localStorage.removeItem(SESSION_KEY);
        }
        notify("SIGNED_OUT", null);
        return { error: null };
      } catch (err: any) {
        if (typeof window !== "undefined") localStorage.removeItem(SESSION_KEY);
        notify("SIGNED_OUT", null);
        return { error: null };
      }
    },

    async getSession() {
      if (typeof window === "undefined") return { data: { session: null }, error: null };
      try {
        const raw = localStorage.getItem(SESSION_KEY);
        if (!raw) return { data: { session: null }, error: null };

        const local = JSON.parse(raw);
        if (!local?.access_token) return { data: { session: null }, error: null };

        const res = await getSessionServer({ data: local.access_token });
        if (!res.session) {
          localStorage.removeItem(SESSION_KEY);
          return { data: { session: null }, error: null };
        }
        return { data: { session: res.session }, error: null };
      } catch (err: any) {
        return { data: { session: null }, error: null };
      }
    },

    async getUser() {
      if (typeof window === "undefined") return { data: { user: null }, error: null };
      try {
        const raw = localStorage.getItem(SESSION_KEY);
        if (!raw) return { data: { user: null }, error: null };
        const local = JSON.parse(raw);
        if (!local?.access_token) return { data: { user: null }, error: null };

        const res = await getUserServer({ data: local.access_token });
        return { data: { user: res.user || null }, error: null };
      } catch (err: any) {
        return { data: { user: null }, error: null };
      }
    },

    onAuthStateChange(callback: AuthListener) {
      listeners.add(callback);
      return {
        data: {
          subscription: {
            unsubscribe() {
              listeners.delete(callback);
            },
          },
        },
      };
    },

    async resetPasswordForEmail(_email: string) {
      return { data: {}, error: null };
    },

    async updateUser(_attributes: any) {
      return { data: {}, error: null };
    },
  },
};

// Export alias for seamless compatibility
export const supabase = authClient;
