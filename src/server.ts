import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(request: Request, response: Response): Promise<Response> {
  const url = request.url || "";
  const isServerFnOrApi =
    url.includes("/_serverFn") ||
    url.includes("_serverFn=") ||
    url.includes("/api/") ||
    request.headers.get("x-tss-server-function") != null ||
    (request.headers.get("accept") ?? "").includes("application/json");

  // NEVER return HTML for a server function or JSON API call!
  if (isServerFnOrApi) {
    const contentType = response.headers.get("content-type") ?? "";
    if (contentType.includes("text/html")) {
      const errPayload = {
        error: `Not Found or Server Error (${response.status})`,
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
          status: response.status >= 400 ? response.status : 500,
          headers: { "content-type": "application/json" },
        },
      );
    }
    return response;
  }

  if (response.status < 500) return response;

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!body.includes('"unhandled":true') || !body.includes('"message":"HTTPError"')) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(request, response);
    } catch (error) {
      console.error(error);
      const url = request.url || "";
      const isServerFnOrApi =
        url.includes("/_serverFn") ||
        url.includes("_serverFn=") ||
        url.includes("/api/") ||
        request.headers.get("x-tss-server-function") != null ||
        (request.headers.get("accept") ?? "").includes("application/json");

      if (isServerFnOrApi) {
        return new Response(
          JSON.stringify({ error: (error as any)?.message || "Internal Server Error" }),
          {
            status: 500,
            headers: { "content-type": "application/json" },
          },
        );
      }

      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
