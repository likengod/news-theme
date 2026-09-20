//#region src/lib/error-capture.ts
var lastCapturedError;
var TTL_MS = 5e3;
function record(error) {
	lastCapturedError = {
		error,
		at: Date.now()
	};
}
if (typeof globalThis.addEventListener === "function") {
	globalThis.addEventListener("error", (event) => record(event.error ?? event));
	globalThis.addEventListener("unhandledrejection", (event) => record(event.reason));
}
function consumeLastCapturedError() {
	if (!lastCapturedError) return void 0;
	if (Date.now() - lastCapturedError.at > TTL_MS) {
		lastCapturedError = void 0;
		return;
	}
	const { error } = lastCapturedError;
	lastCapturedError = void 0;
	return error;
}
//#endregion
//#region src/lib/error-page.ts
function renderErrorPage(detail) {
	const safeDetail = detail ? detail.replace(/</g, "&lt;").replace(/>/g, "&gt;") : "";
	return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Connecting to Site...</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: #fafafa; color: #111; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2rem; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 0.75rem; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05); }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; font-weight: 600; }
      p { color: #4b5563; margin: 0 0 1.5rem; font-size: 0.925rem; }
      .countdown { display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 9999px; background: #e0e7ff; color: #3730a3; font-weight: 700; font-size: 12px; margin: 0 4px; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.5rem 1.25rem; border-radius: 0.375rem; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; font-size: 0.875rem; font-weight: 500; }
      .primary { background: #111827; color: #fff; }
      .primary:hover { background: #1f2937; }
      .secondary { background: #fff; color: #111827; border-color: #d1d5db; }
      .secondary:hover { background: #f9fafb; }
      .details { margin-top: 1rem; text-align: left; background: #fef2f2; border: 1px solid #fee2e2; color: #991b1b; padding: 0.75rem; border-radius: 0.375rem; font-size: 0.75rem; word-break: break-all; font-family: monospace; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1 id="title">Reconnecting to site</h1>
      <p id="subtext">The system is updating or restarting services. Reconnecting in <span class="countdown" id="timer">3</span>s...</p>
      ${safeDetail ? `<div class="details">${safeDetail}</div>` : ""}
      <div class="actions" style="margin-top: 1.25rem;">
        <button class="primary" onclick="sessionStorage.removeItem('err_retry_count'); location.reload()">Reload Now</button>
        <a class="secondary" href="/">Homepage</a>
      </div>
    </div>
    <script>
      (function() {
        var KEY = 'err_retry_count';
        var attempts = Number(sessionStorage.getItem(KEY) || 0);
        var timerEl = document.getElementById('timer');
        var subtext = document.getElementById('subtext');
        var title = document.getElementById('title');

        if (attempts < 3) {
          sessionStorage.setItem(KEY, String(attempts + 1));
          var remaining = 3;
          var interval = setInterval(function() {
            remaining--;
            if (timerEl) timerEl.textContent = String(remaining);
            if (remaining <= 0) {
              clearInterval(interval);
              location.reload();
            }
          }, 1000);
        } else {
          sessionStorage.removeItem(KEY);
          if (title) title.textContent = "This page didn't load";
          if (subtext) subtext.textContent = "Something went wrong while connecting to the server. You can try reloading or head back home.";
        }
      })();
    <\/script>
  </body>
</html>`;
}
//#endregion
//#region src/server.ts
var serverEntryPromise;
async function getServerEntry() {
	if (!serverEntryPromise) serverEntryPromise = import("./assets/server-CjBK_27J.js").then((m) => m.default ?? m);
	return serverEntryPromise;
}
async function normalizeCatastrophicSsrResponse(request, response) {
	const url = request.url || "";
	if (url.includes("/_serverFn") || url.includes("_serverFn=") || url.includes("/api/") || request.headers.get("x-tss-server-function") != null || (request.headers.get("accept") ?? "").includes("application/json")) {
		if ((response.headers.get("content-type") ?? "").includes("text/html")) {
			const errPayload = {
				error: `Not Found or Server Error (${response.status})`,
				success: false,
				updated: false
			};
			return new Response(JSON.stringify({
				...errPayload,
				data: errPayload,
				result: errPayload
			}), {
				status: response.status >= 400 ? response.status : 500,
				headers: { "content-type": "application/json" }
			});
		}
		return response;
	}
	if (response.status < 500) return response;
	if (!(response.headers.get("content-type") ?? "").includes("application/json")) return response;
	const body = await response.clone().text();
	if (!body.includes("\"unhandled\":true") || !body.includes("\"message\":\"HTTPError\"")) return response;
	console.error(consumeLastCapturedError() ?? /* @__PURE__ */ new Error(`h3 swallowed SSR error: ${body}`));
	return new Response(renderErrorPage(), {
		status: 500,
		headers: { "content-type": "text/html; charset=utf-8" }
	});
}
var server_default = { async fetch(request, env, ctx) {
	try {
		return await normalizeCatastrophicSsrResponse(request, await (await getServerEntry()).fetch(request, env, ctx));
	} catch (error) {
		console.error(error);
		const url = request.url || "";
		if (url.includes("/_serverFn") || url.includes("_serverFn=") || url.includes("/api/") || request.headers.get("x-tss-server-function") != null || (request.headers.get("accept") ?? "").includes("application/json")) return new Response(JSON.stringify({ error: error?.message || "Internal Server Error" }), {
			status: 500,
			headers: { "content-type": "application/json" }
		});
		return new Response(renderErrorPage(), {
			status: 500,
			headers: { "content-type": "text/html; charset=utf-8" }
		});
	}
} };
//#endregion
export { server_default as default, renderErrorPage as t };

//# sourceMappingURL=server.js.map