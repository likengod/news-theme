import { createFileRoute } from "@tanstack/react-router";
import { executeGetGitStatusCore, executeGitPullCore } from "@/lib/deploy.server";
import { query } from "@/lib/db.server";

async function isAuthorizedAdmin(req: Request): Promise<boolean> {
  const secretHeader = req.headers.get("x-update-secret") || "";
  if (process.env.UPDATE_SECRET && secretHeader === process.env.UPDATE_SECRET) {
    return true;
  }

  let token = "";
  const authHeader = req.headers.get("authorization") || "";
  if (authHeader.startsWith("Bearer ")) {
    token = authHeader.replace("Bearer ", "").trim();
  } else {
    const cookieHeader = req.headers.get("cookie") || "";
    const match = cookieHeader.match(/(?:^|;\s*)(?:nt_session|session_token|access_token)=([^;]+)/);
    if (match) {
      token = decodeURIComponent(match[1]);
    }
  }

  if (!token) return false;

  try {
    const sessions = await query(
      `SELECT s.id FROM sessions s
         JOIN user_roles r ON s.user_id = r.user_id
         WHERE s.id = ? AND s.expires_at > NOW() AND r.role IN ('admin', 'editor')`,
      [token],
    );
    return Array.isArray(sessions) && sessions.length > 0;
  } catch {
    return false;
  }
}

export const Route = createFileRoute("/api/update")({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        if (!(await isAuthorizedAdmin(request))) {
          return new Response(JSON.stringify({ error: "Unauthorized: Admin privileges required" }), {
            status: 401,
            headers: { "content-type": "application/json; charset=utf-8" },
          });
        }

        try {
          const status = await executeGetGitStatusCore(true);
          return new Response(JSON.stringify(status), {
            headers: {
              "content-type": "application/json; charset=utf-8",
              "cache-control": "no-store",
            },
          });
        } catch (err: any) {
          const errPayload = {
            error: err?.message || "Failed to get git status",
            success: false,
            updated: false,
          };
          return new Response(JSON.stringify(errPayload), {
            status: 500,
            headers: { "content-type": "application/json; charset=utf-8" },
          });
        }
      },
      POST: async ({ request }: { request: Request }) => {
        if (!(await isAuthorizedAdmin(request))) {
          return new Response(JSON.stringify({ error: "Unauthorized: Admin privileges required" }), {
            status: 401,
            headers: { "content-type": "application/json; charset=utf-8" },
          });
        }

        try {
          const pullResult = await executeGitPullCore();
          return new Response(JSON.stringify(pullResult), {
            headers: {
              "content-type": "application/json; charset=utf-8",
              "cache-control": "no-store",
            },
          });
        } catch (err: any) {
          const errPayload = {
            error: err?.message || "Failed to execute git pull and update",
            success: false,
            updated: false,
          };
          return new Response(JSON.stringify(errPayload), {
            status: 500,
            headers: { "content-type": "application/json; charset=utf-8" },
          });
        }
      },
    },
  },
});
