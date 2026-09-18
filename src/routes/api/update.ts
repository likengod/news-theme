import { createFileRoute } from "@tanstack/react-router";
import { executeGetGitStatusCore, executeGitPullCore } from "@/lib/deploy.server";

export const Route = createFileRoute("/api/update")({
  server: {
    handlers: {
      GET: async () => {
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
          return new Response(
            JSON.stringify({
              ...errPayload,
              data: errPayload,
              result: errPayload,
            }),
            {
              status: 500,
              headers: { "content-type": "application/json; charset=utf-8" },
            },
          );
        }
      },
      POST: async () => {
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
          return new Response(
            JSON.stringify({
              ...errPayload,
              data: errPayload,
              result: errPayload,
            }),
            {
              status: 500,
              headers: { "content-type": "application/json; charset=utf-8" },
            },
          );
        }
      },
    },
  },
});
