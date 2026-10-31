import { t as __exportAll } from "./rolldown-runtime-D70C1uOS.js";
import { C as _getRenderedMatches, D as isNotFound, E as rootRouteId, O as renderRouterToStream, P as RouterProvider, S as waitForReason, T as isRedirect, _ as getStylesheetHref, a as stripSsrResponseBody, b as isDangerousProtocol, c as createRawStreamRPCPlugin, d as makeSerovalPlugin, f as isPromise, g as getScriptPreloadAttrs, h as createSerializationAdapter, i as normalizeSsrResponse, k as defineHandlerCallback, l as defaultSerovalDeserializerPlugins, m as parseRedirect, n as disposeSsrResponse, o as attachRouterServerSsrUtils, p as isRedirect$1, r as isSsrResponse, s as getNormalizedURL, t as bindSsrResponseToRequest, u as mergeHeaders, v as resolveManifestAssetLink, w as invariant, x as isPromise$1, y as resolveManifestCssLink } from "./vendor-tanstack-router-Bd4EQ_Hv.js";
import "react";
import { createServerHistory } from "@tanstack/history";
import { fromJSON, toCrossJSONAsync, toCrossJSONStream } from "seroval";
import { jsx } from "react/jsx-runtime";
import { parseSetCookie, splitSetCookieString } from "cookie-es";
import { AsyncLocalStorage } from "node:async_hooks";
// node_modules/@tanstack/react-start-server/dist/esm/StartServer.js
function StartServer(props) {
	return /* @__PURE__ */ jsx(RouterProvider, { router: props.router });
}
// node_modules/@tanstack/react-start-server/dist/esm/defaultStreamHandler.js
var defaultStreamHandler = defineHandlerCallback(({ request, router, responseHeaders }) => renderRouterToStream({
	request,
	router,
	responseHeaders,
	children: /* @__PURE__ */ jsx(StartServer, { router })
}));
// node_modules/@tanstack/start-server-core/dist/esm/headers.js
function getSetCookieValues(headers) {
	const headersWithSetCookie = headers;
	if (typeof headersWithSetCookie.getSetCookie === "function") return headersWithSetCookie.getSetCookie();
	const value = headers.get("set-cookie");
	return value ? splitSetCookieString(value) : [];
}
// node_modules/@tanstack/start-server-core/dist/esm/internal-request-response.js
var GLOBAL_EVENT_STORAGE_KEY = Symbol.for("tanstack-start:event-storage");
var globalObj$1 = globalThis;
if (!globalObj$1[GLOBAL_EVENT_STORAGE_KEY]) globalObj$1[GLOBAL_EVENT_STORAGE_KEY] = new AsyncLocalStorage();
var eventStorage = globalObj$1[GLOBAL_EVENT_STORAGE_KEY];
var PROTECTED_RESPONSE_HEADERS = Symbol.for("tanstack-start:protected-response-headers");
function getProtectedResponseHeaders(response) {
	return response[PROTECTED_RESPONSE_HEADERS];
}
function installProtectedResponseHeaders(response, headers) {
	Object.defineProperty(response, PROTECTED_RESPONSE_HEADERS, {
		value: headers,
		configurable: true
	});
}
/** Transport requirements belong to the encoded body, not its wrapper. */
function transferResponseProtocol(source, target) {
	const protectedHeaders = getProtectedResponseHeaders(source);
	if (protectedHeaders && getProtectedResponseHeaders(target) !== protectedHeaders) installProtectedResponseHeaders(target, protectedHeaders);
}
/** Preserve metadata when Start reconstructs an existing response. */
function transferResponseMetadata(source, target) {
	transferResponseProtocol(source, target);
	const event = eventStorage.getStore();
	const appliedHeaderAppends = event?.responseHeaderAppends?.get(source);
	if (appliedHeaderAppends) event.responseHeaderAppends.set(target, appliedHeaderAppends);
}
function sanitizeStatusMessage(statusMessage) {
	return statusMessage.replace(/[^\t\x20-\x7e]/g, "");
}
function sanitizeStatusCode(statusCode) {
	const code = typeof statusCode === "string" ? Number(statusCode) : statusCode;
	if (code === void 0 || !Number.isInteger(code) || code < 200 || code > 599) return;
	return code;
}
function getObjectProperty(value, key) {
	if (typeof value === "object" && value || typeof value === "function") return value[key];
}
function getStatusCodeProperty(value, key) {
	const property = getObjectProperty(value, key);
	if (typeof property === "string" || typeof property === "number") return property;
}
function getErrorStatus(error) {
	const cause = getObjectProperty(error, "cause");
	return sanitizeStatusCode(getStatusCodeProperty(error, "status") ?? getStatusCodeProperty(error, "statusCode") ?? getStatusCodeProperty(cause, "status") ?? getStatusCodeProperty(cause, "statusCode"));
}
function getErrorStatusText(error) {
	const cause = getObjectProperty(error, "cause");
	const statusText = getObjectProperty(error, "statusText") ?? getObjectProperty(error, "statusMessage") ?? getObjectProperty(cause, "statusText") ?? getObjectProperty(cause, "statusMessage");
	if (typeof statusText === "string") return sanitizeStatusMessage(statusText);
}
var GENERATED_BODY_EXCLUDED_HEADERS = /* @__PURE__ */ new Set([
	"connection",
	"content-encoding",
	"content-length",
	"keep-alive",
	"proxy-connection",
	"te",
	"trailer",
	"transfer-encoding"
]);
function isResponse(value) {
	return value instanceof Response || Object.prototype.toString.call(value) === "[object Response]";
}
function getErrorHeaders(error) {
	let init = getObjectProperty(error, "headers");
	if (!init) {
		const cause = getObjectProperty(error, "cause");
		if (isResponse(cause)) return;
		init = getObjectProperty(cause, "headers");
	}
	if (!init) return;
	let headers;
	try {
		headers = new Headers(init);
	} catch {
		return;
	}
	for (const name of GENERATED_BODY_EXCLUDED_HEADERS) headers.delete(name);
	return headers;
}
function getDistinctCookieKey(name, options, defaultPath = "") {
	return [
		name,
		options.domain || "",
		options.path ?? defaultPath
	].join(";");
}
function getDistinctCookieKeyFromHeader(cookie) {
	const parsed = parseSetCookie(cookie);
	return parsed ? getDistinctCookieKey(parsed.name, parsed) : `\0${cookie}`;
}
function replaceSetCookieValues(headers, cookies) {
	headers.delete("set-cookie");
	for (const cookie of cookies) headers.append("set-cookie", cookie);
}
function getCookieKey(state, cookie) {
	const keys = state.setCookieKeys ||= /* @__PURE__ */ new Map();
	let key = keys.get(cookie);
	if (key === void 0) {
		key = getDistinctCookieKeyFromHeader(cookie);
		keys.set(cookie, key);
	}
	return key;
}
function getMergedSetCookieValues(state, currentCookies, cookiesToMerge) {
	if (currentCookies.length === 0) return cookiesToMerge;
	const cookieKeysToMerge = /* @__PURE__ */ new Set();
	for (const cookie of cookiesToMerge) cookieKeysToMerge.add(getCookieKey(state, cookie));
	return currentCookies.filter((cookie) => !cookieKeysToMerge.has(getCookieKey(state, cookie))).concat(cookiesToMerge);
}
function hasProtectedHeaderChanges(response, protectedHeaders) {
	const headers = response.headers;
	for (const [name, value] of protectedHeaders) if (headers.get(name) !== value) return true;
	return false;
}
function applyProtectedHeaders(protectedHeaders, headers) {
	for (const [name, value] of protectedHeaders) if (value === null) headers.delete(name);
	else headers.set(name, value);
}
function applyHeaderState(target, state, generatedBody, protectedHeaders, appliedHeaderAppends) {
	let headers = target;
	const mutableHeaders = () => {
		if (headers === target) headers = new Headers(target);
		return headers;
	};
	if (state.clearHeaders) {
		for (const name of Array.from(target.keys())) if (!protectedHeaders?.has(name)) mutableHeaders().delete(name);
	}
	if (!state.clearHeaders && state.removedHeaders) {
		for (const name of state.removedHeaders) if (!protectedHeaders?.has(name) && headers.has(name)) mutableHeaders().delete(name);
	}
	for (const [name, value] of state.headers) if (name !== "set-cookie" && !protectedHeaders?.has(name) && !(generatedBody && GENERATED_BODY_EXCLUDED_HEADERS.has(name))) {
		let append = state.headerAppends?.get(name);
		if (!append) {
			if (headers.get(name) !== value) mutableHeaders().set(name, value);
			continue;
		}
		const applied = appliedHeaderAppends?.get(name);
		const pending = [];
		while (append && append !== applied) {
			pending.push(append.value);
			append = append.previous;
		}
		for (let index = pending.length - 1; index >= 0; index--) mutableHeaders().append(name, pending[index]);
	}
	if (state.setCookieBehavior && !protectedHeaders?.has("set-cookie")) {
		const eventSetCookies = getSetCookieValues(state.headers);
		const currentCookies = getSetCookieValues(headers);
		const cookies = state.setCookieBehavior === "replace" ? eventSetCookies : getMergedSetCookieValues(state, currentCookies, eventSetCookies);
		if (cookies.length !== currentCookies.length || cookies.some((cookie, index) => cookie !== currentCookies[index])) replaceSetCookieValues(mutableHeaders(), cookies);
	}
	return headers;
}
function canHaveBody(method, status) {
	return method !== "HEAD" && status !== 204 && status !== 205 && status !== 304;
}
/** A protected content type marks a Start-serialized body the client decodes. */
function isSerializedResponse(protectedHeaders) {
	return typeof protectedHeaders?.get("content-type") === "string";
}
/**
* A helper status that forbids a body never applies to a serialized
* server-function reply, because the client must decode it. Only a HEAD request
* drops its body.
*/
function getHelperStatus(state, serialized) {
	const status = state?.status;
	if (!serialized || status === void 0 || canHaveBody("GET", status)) return status;
}
/** Helper status text describes the helper status and is ignored with it. */
function getHelperStatusText(state, helperStatus) {
	return helperStatus === state?.status ? state?.statusText : void 0;
}
function cancelDroppedBody(response, reason) {
	try {
		response.body?.cancel(reason).catch(() => {});
	} catch {}
}
function createReconciledResponse(body, status, statusText, headers) {
	try {
		return new Response(body, {
			status,
			statusText,
			headers
		});
	} catch (cause) {
		throw new Error("Unable to reconcile response because its body has already been consumed or locked.", { cause });
	}
}
/** Apply helper state to a response that leaves Start. */
function finalizeResponse(response, event) {
	return applyResponseState(response, event, event.request.method);
}
/**
* Apply helper state with the body rules of `method`. Request middleware still
* reads a HEAD response's body, so the pipeline applies GET rules and strips a
* HEAD body only when the response leaves it.
*/
function applyResponseState(response, event, method, disposeBody) {
	const protectedHeaders = getProtectedResponseHeaders(response);
	const serialized = isSerializedResponse(protectedHeaders);
	let helperStatus = getHelperStatus(event.responseState, serialized);
	const mustDropBody = !canHaveBody(method, helperStatus ?? response.status) && response.body !== null;
	if (mustDropBody) {
		const reason = method === "HEAD" ? "HEAD body stripped" : "Response body dropped by Start reconciliation";
		if (disposeBody) disposeBody(reason);
		else cancelDroppedBody(response, reason);
		helperStatus = getHelperStatus(event.responseState, serialized);
	}
	const state = event.responseState;
	if (!state && !mustDropBody) {
		event.currentResponse = response;
		return response;
	}
	const status = helperStatus ?? response.status;
	const statusText = getHelperStatusText(state, helperStatus) ?? response.statusText;
	const statusChanged = status !== response.status;
	const statusTextChanged = statusText !== response.statusText;
	const headers = state ? applyHeaderState(response.headers, state, serialized, protectedHeaders, event.responseHeaderAppends?.get(response)) : response.headers;
	const reconciled = statusChanged || statusTextChanged || mustDropBody || headers !== response.headers ? createReconciledResponse(mustDropBody ? null : response.body, status, statusText, headers) : response;
	if (protectedHeaders && reconciled !== response) installProtectedResponseHeaders(reconciled, protectedHeaders);
	return publishResponse(reconciled, event);
}
function publishResponse(response, event) {
	const headerAppends = event.responseState?.headerAppends;
	if (headerAppends?.size) (event.responseHeaderAppends ||= /* @__PURE__ */ new WeakMap()).set(response, new Map(headerAppends));
	event.currentResponse = response;
	return response;
}
function getHttpErrorStatus(status) {
	return status !== void 0 && status >= 400 ? status : void 0;
}
/**
* Status for a response built from an uncaught error. Only an error status
* (400-599) from a helper or from error metadata describes the failure, so a
* success or redirect status set before the throw cannot hide it. The error is
* logged unless its own metadata marks it as an HTTP error. Reporting runs
* before helper state is read, so hooks that write helpers are included.
*/
function resolveErrorStatus(error, event) {
	const metadataStatus = getErrorStatus(error);
	const errorStatus = getHttpErrorStatus(metadataStatus);
	if (errorStatus === void 0) console.error(error);
	const state = event?.responseState;
	const helperStatus = getHttpErrorStatus(state?.status);
	const status = helperStatus ?? errorStatus ?? 500;
	const statusText = getHelperStatusText(state, helperStatus) ?? (status === errorStatus || metadataStatus === void 0 ? getErrorStatusText(error) : void 0) ?? "";
	if (state && state.status !== helperStatus) {
		state.status = void 0;
		state.statusText = void 0;
	}
	return {
		status,
		statusText
	};
}
/**
* Internal: status and status text for a serialized server-function error.
* Logs the error and discards a non-error helper status, like any error
* response Start builds.
*/
function resolveErrorResponseStatus(error) {
	return resolveErrorStatus(error, eventStorage.getStore());
}
function createErrorResponse(error, event) {
	let headers = getErrorHeaders(error) ?? new Headers();
	const { status, statusText } = resolveErrorStatus(error, event);
	const state = event.responseState;
	const body = canHaveBody(event.request.method, status) ? JSON.stringify({
		status,
		statusText,
		unhandled: true,
		message: "HTTPError"
	}) : null;
	if (!headers.has("content-type")) headers.set("content-type", "application/json");
	if (state) headers = applyHeaderState(headers, state, true);
	return publishResponse(new Response(body !== null && !headers.has("content-type") ? new TextEncoder().encode(body) : body, {
		status,
		statusText,
		headers
	}), event);
}
function finalizeError(error, event) {
	if (error instanceof Response) return finalizeResponse(error, event);
	return createErrorResponse(error, event);
}
function handleStartError(error) {
	const event = eventStorage.getStore();
	if (event) return finalizeError(error, event);
	if (error instanceof Response) return error;
	const request = new Request("http://localhost");
	return createErrorResponse(error, {
		request,
		requestUrl: new URL(request.url)
	});
}
/** Apply helper state to a response inside the request middleware pipeline. */
function reconcileResponse(response, event, disposeBody) {
	if (!event.responseState && (response === event.currentResponse || canHaveBody("GET", response.status)) || isRedirect(response)) {
		event.currentResponse = response;
		return response;
	}
	return applyResponseState(response, event, "GET", disposeBody);
}
/**
* Restore protocol headers that middleware changed directly on the response.
* Start does this once, when the response leaves the request middleware
* pipeline; helper writes never override them.
*/
function restoreResponseProtocol(response, event) {
	const protectedHeaders = getProtectedResponseHeaders(response);
	if (!protectedHeaders || !hasProtectedHeaderChanges(response, protectedHeaders)) return response;
	const headers = new Headers(response.headers);
	applyProtectedHeaders(protectedHeaders, headers);
	const restored = createReconciledResponse(response.body, response.status, response.statusText, headers);
	transferResponseMetadata(response, restored);
	event.currentResponse = restored;
	return restored;
}
/**
* Build a Start-owned serialized reply with already normalized protocol
* headers. A bodyless helper status never applies to it; only a HEAD request
* drops its body.
*/
function createFinalizedResponse(body, headers, protectedHeaders, event) {
	const state = event.responseState;
	let status = 200;
	let statusText = "";
	if (state) {
		const helperStatus = getHelperStatus(state, true);
		status = helperStatus ?? 200;
		statusText = getHelperStatusText(state, helperStatus) ?? "";
		headers = applyHeaderState(headers, state, true, protectedHeaders);
	}
	const response = new Response(canHaveBody(event.request.method, status) ? body : null, {
		status,
		statusText,
		headers
	});
	installProtectedResponseHeaders(response, protectedHeaders);
	return publishResponse(response, event);
}
function protectResponseHeaders(response, headers) {
	const previous = getProtectedResponseHeaders(response);
	if (previous === headers) return;
	if (previous) {
		const merged = new Map(previous);
		for (const [name, value] of headers) merged.set(name, value);
		headers = merged;
	}
	installProtectedResponseHeaders(response, headers);
}
/**
* Set and protect transport headers on a new response. Reuse the body stream
* without cloning or teeing it; callers transfer ownership to the result.
*/
function setProtectedResponseHeaders(response, headers) {
	let next;
	try {
		next = new Response(response.body, response);
		applyProtectedHeaders(headers, next.headers);
	} catch (cause) {
		throw new Error("Unable to set response header because its body has already been consumed or locked.", { cause });
	}
	transferResponseMetadata(response, next);
	protectResponseHeaders(next, headers);
	return next;
}
function decodePathname(pathname) {
	try {
		return decodeURI(pathname);
	} catch (error) {
		if (error instanceof URIError) return;
		throw error;
	}
}
function runInStartRequest(request, requestOpts, handler) {
	let requestUrl;
	try {
		requestUrl = new URL(request.url);
	} catch (error) {
		if (error instanceof TypeError) return new Response(null, {
			status: 400,
			statusText: "Bad Request"
		});
		throw error;
	}
	const pathname = requestUrl.pathname;
	if (pathname.includes("%") && decodePathname(pathname) === void 0) return new Response(null, {
		status: 400,
		statusText: "Bad Request"
	});
	const event = {
		request,
		requestUrl
	};
	return eventStorage.run(event, handler, request, requestOpts, event);
}
/**
* Keep the complete server entry, including custom error handling, inside one
* request scope. A custom returned response is used as-is; call handleStartError
* in a custom catch to preserve Start's response helper state.
*/
function createServerEntry$1(entry) {
	return { fetch: withStartRequest(async (request, requestOpts) => {
		try {
			return await entry.fetch(request, requestOpts);
		} catch (error) {
			return handleStartError(error);
		}
	}) };
}
/**
* Establish request scope; the response pipeline owns reconciliation. A nested
* handler delegating the same request participates in its scope. Independent
* fetch invocations and different requests get a fresh event.
*/
function withStartRequest(handler) {
	return (request, requestOpts) => {
		const event = eventStorage.getStore();
		if (event?.request === request) return handler(request, requestOpts, event);
		return runInStartRequest(request, requestOpts, handler);
	};
}
function getStartEvent() {
	const event = eventStorage.getStore();
	if (!event) throw new Error(`No StartEvent found in AsyncLocalStorage. Make sure you are using the function within the server runtime.`);
	return event;
}
/**
* Internal: returns the per-request parsed URL for `request`, memoized on the
* Start event so the framework parses each request URL only once. Falls back
* to parsing when called outside a Start event (e.g. in unit tests) or for a
* foreign request. Callers MUST NOT mutate the returned URL.
*/
function getParsedRequestUrl(request) {
	const event = eventStorage.getStore();
	if (event && event.request === request) return event.requestUrl;
	return new URL(request.url);
}
function getRequest() {
	return getStartEvent().request;
}
/**
* Internal: helper status state for a serialized server-function reply.
* Bodyless statuses never apply to it and are omitted with their status text.
*/
function getSerializedResponseState() {
	const state = getStartEvent().responseState;
	const status = getHelperStatus(state, true);
	return {
		status,
		statusText: getHelperStatusText(state, status)
	};
}
// node_modules/@tanstack/start-server-core/dist/esm/constants.js
var HEADERS = { TSS_SHELL: "X-TSS_SHELL" };
// node_modules/@tanstack/start-server-core/dist/esm/router-manifest.js
/**
* @description Returns the router manifest data that should be sent to the client.
* This includes only the assets and preloads for the current route and any
* special assets that are needed for the client. It does not include relationships
* between routes or any other data that is not needed for the client.
*
* @param matchedRoutes - In dev mode, the matched routes are used to build
* the dev styles URL for route-scoped CSS collection.
*/
async function getStartManifest(matchedRoutes) {
	const { tsrStartManifest } = await import("./_tanstack-start-manifest_v-CUVTYKUg.js");
	const startManifest = tsrStartManifest();
	let routes = startManifest.routes;
	routes[rootRouteId];
	const manifestRoutes = {};
	for (const k in routes) {
		const v = routes[k];
		const result = {};
		if (v.preloads && v.preloads.length > 0) result.preloads = v.preloads;
		if (v.scripts && v.scripts.length > 0) result.scripts = v.scripts;
		if (v.css?.length) result.css = v.css;
		if (result.preloads || result.scripts || result.css) manifestRoutes[k] = result;
	}
	return {
		...startManifest.scriptFormat ? { scriptFormat: startManifest.scriptFormat } : {},
		...startManifest.inlineCss ? { inlineCss: startManifest.inlineCss } : {},
		routes: manifestRoutes
	};
}
// \0%23tanstack-start-server-fn-resolver
var manifest = {
	"02dd087da9491aa68558b9de13a4861735f8ea28b497ce2394d9627b9f16bee4": {
		functionName: "getReelsConfigServer_createServerFn_handler",
		importer: () => import("./reels-config-DOU7A4Ch.js")
	},
	"038d145f9e0f2fc7deb5d774c689275e369c15a619a4098bc7ba48b9425491b3": {
		functionName: "deleteJournalist_createServerFn_handler",
		importer: () => import("./journalist.functions-DMO-ku1n.js")
	},
	"03e56af06bac9556b433ca2c960715be210a02a6e76a33dd5ea6f6d79c24f055": {
		functionName: "getCategories_createServerFn_handler",
		importer: () => import("./taxonomy.functions-BKVVv79a.js")
	},
	"04344fe1d3ab2fd1861f88f715beb7ef2db30b44e66ca36f7ba3e8404a815be0": {
		functionName: "generateBackupServer_createServerFn_handler",
		importer: () => import("./backup.functions-Dc6qVlnB.js")
	},
	"069cbb24882dfa4dfd6a2737fc931ba8108762e6eece4c0c926b3aba2a060164": {
		functionName: "initializeGitRepo_createServerFn_handler",
		importer: () => import("./deploy.functions-DF2hHpJ5.js")
	},
	"0d3e907d8ae66780e1453f78ed08c9c482ba98198c822ff82e6767a06b7a2599": {
		functionName: "getTopTags_createServerFn_handler",
		importer: () => import("./taxonomy.functions-BKVVv79a.js")
	},
	"0da83c6ba72d428ef4d313202f748761bb822abb6fd298a5d991a8378d21bf96": {
		functionName: "getCategoryData_createServerFn_handler",
		importer: () => import("./taxonomy.functions-BKVVv79a.js")
	},
	"0f76d5daec30f22ed2b4abe100480ff9f820fe0691e971349d3d5b31af064c95": {
		functionName: "regeneratePublicUserId_createServerFn_handler",
		importer: () => import("./admin-users.functions-D8qlrCYO.js")
	},
	"132f222d6e1935b3f6006155b9fd26c2f4d9a8e0a1ac6a60d42ff35bbfcc5575": {
		functionName: "deleteComment_createServerFn_handler",
		importer: () => import("./comments.functions-u2jsCxVX.js")
	},
	"16ce89c2eb2fca21f96b4f6bba1222693de042ef4995a45331af6ff4fb932aae": {
		functionName: "submitWorkWithUs_createServerFn_handler",
		importer: () => import("./inbox.functions-DHv0wcSM.js")
	},
	"17ad32ca11729c5f8dffda03c1b99d6a512f4d059ddd194f58f3eef91d3a6485": {
		functionName: "clearAllCachesServer_createServerFn_handler",
		importer: () => import("./server-cache-XYkSyFus.js")
	},
	"193c637c04726fc8af0270a2acd76449d25527e0405be5a6b8ae2f6e31db82b5": {
		functionName: "saveAdminArticle_createServerFn_handler",
		importer: () => import("./articles.functions-BXKoEoqf.js")
	},
	"1ed9c4a97893eb88d8297b68440263087530e9a8bd8d5c2c63a6725dd1a7f7b6": {
		functionName: "getAdminArticles_createServerFn_handler",
		importer: () => import("./articles.functions-BXKoEoqf.js")
	},
	"1ef32f84e1de0f5e22e29eb24ba235da8be53f367660995e70160ae1013b1e13": {
		functionName: "adminApproveJournalistApplication_createServerFn_handler",
		importer: () => import("./inbox.functions-DHv0wcSM.js")
	},
	"1f78d7f578a6afa4f03a2d2bc26fcf60e865cac4f78ccc0a2b5d02cfe41e0c1c": {
		functionName: "fixBrokenLinkServer_createServerFn_handler",
		importer: () => import("./redirect-rules-Ddg4_Y6H.js")
	},
	"242f7a281f1bd9c0156e0defdfa248b20daa2720f35e430daac740ec37792361": {
		functionName: "toggleAdminUserBan_createServerFn_handler",
		importer: () => import("./admin-users.functions-D8qlrCYO.js")
	},
	"24447a496b4203edad77dddc199b354801d3d9814aa37d1e40581c39d1bdb3db": {
		functionName: "requestPasswordResetServer_createServerFn_handler",
		importer: () => import("./auth.functions-TFa5vleB.js")
	},
	"2480919bc2e170d233713b1c2830944913d8799c4dcb5c1adeca1e419a19f7a6": {
		functionName: "getPendingClaimsServer_createServerFn_handler",
		importer: () => import("./pending-claims-CjfQGIAJ.js")
	},
	"2728870d1d2a6ca869b49740daab9a7138ab559359a7149922ab6ef7fdee087e": {
		functionName: "importTags_createServerFn_handler",
		importer: () => import("./taxonomy.functions-BKVVv79a.js")
	},
	"2a539a1f2abfb0faa00e3c69f05d6961a00be0f490e8ac4a1e983afb2cea8b08": {
		functionName: "deletePermanentlyAdminArticle_createServerFn_handler",
		importer: () => import("./articles.functions-BXKoEoqf.js")
	},
	"2b528109ae68caadb520b78d8504c061898b4465ebb34cde90c52d157753bde0": {
		functionName: "saveRedirectRulesServer_createServerFn_handler",
		importer: () => import("./redirect-rules-Ddg4_Y6H.js")
	},
	"2c0b0242c5348aaf049db4f8d306cbd4e7bd491678e5a4656209a7b52c9c8038": {
		functionName: "adminDeleteInboxRequest_createServerFn_handler",
		importer: () => import("./inbox.functions-DHv0wcSM.js")
	},
	"2c151724b9e12bfe1f5632766d7139f5833bcb85e798dee1a9c1a6e64280f110": {
		functionName: "fetchRemoteImageForVerification_createServerFn_handler",
		importer: () => import("./verify-image.functions-DSF_jenN.js")
	},
	"2d84dc33d0d55e73323d721355f17c3b57fbabc53b5cbd8b1444ceaea4227d14": {
		functionName: "uploadMediaServer_createServerFn_handler",
		importer: () => import("./media.functions-C7iSjn_T.js")
	},
	"2fbc4bc91a8b91f84dda5db092625db5003a98c6e7237acd1fb15e7efc1d8420": {
		functionName: "requestCurrentUserAccountDeletion_createServerFn_handler",
		importer: () => import("./auth.functions-TFa5vleB.js")
	},
	"30e470d9ce75c446d32d1443078c1a42c7b9fcddbe926b6e51d4512c60207ae8": {
		functionName: "generateArticleContentServer_createServerFn_handler",
		importer: () => import("./ai.functions-0o4E0Vij.js")
	},
	"315817cf7049c35693ab4ae90f01139b3471377a5fba02601046ce0bfe6b9d72": {
		functionName: "getFontConfigServer_createServerFn_handler",
		importer: () => import("./font-config-BsaE9OI3.js")
	},
	"3557b9ece7703e953e66289bb9ad0f4391b8d47ff6fdc4d5652e508a58f71699": {
		functionName: "getRecentArticlesForCommentsFn_createServerFn_handler",
		importer: () => import("./comments.functions-u2jsCxVX.js")
	},
	"35a302f18de1d0793e7e730eeef2831b0cc516d86513b175f171d21a439cfea8": {
		functionName: "saveJournalistRanksServer_createServerFn_handler",
		importer: () => import("./journalist-ranks-BRc4IA6V.js")
	},
	"3680d7ceec851db2d9971fd03a526ac19102d718a3bfc6d25320ac29524d8bdc": {
		functionName: "saveRewardsServer_createServerFn_handler",
		importer: () => import("./rewards-DhYp7Gw6.js")
	},
	"36d3e819f19ad290ee03e8f40f4d538efa60e4d071740ffcd196f321ea09dbac": {
		functionName: "deleteAdminUsersBulk_createServerFn_handler",
		importer: () => import("./admin-users.functions-D8qlrCYO.js")
	},
	"39a765bff09432b08654ad197bb7c4ff2cace5fec784cae9e7166ef73e28b0ba": {
		functionName: "getAdminDashboardStats_createServerFn_handler",
		importer: () => import("./articles.functions-BXKoEoqf.js")
	},
	"3a38e185b3779aeaabf8e39bee398139af011d9319629d9d39100c41c4bc0595": {
		functionName: "restoreBackupServer_createServerFn_handler",
		importer: () => import("./backup.functions-Dc6qVlnB.js")
	},
	"3b48b6e744f1a5c5ddc8bb4f3d6872f7099a6a2da7ab09a9160e985265508366": {
		functionName: "getCurrentUserRole_createServerFn_handler",
		importer: () => import("./auth.functions-TFa5vleB.js")
	},
	"3c25065a9854b8f41b454c04f5082fc4b0279d108c26242fe4b00da52ce9d501": {
		functionName: "adminApproveAccountDeletion_createServerFn_handler",
		importer: () => import("./inbox.functions-DHv0wcSM.js")
	},
	"3cfc9da0c530c5885b434a93a6cfd05899b6dc10d8625ddd679755011d2eaf88": {
		functionName: "generatePageSeoServer_createServerFn_handler",
		importer: () => import("./ai.functions-0o4E0Vij.js")
	},
	"3f45f09c0a8c44c2e7fec139cc3fdb27d935e1757387119c458a56c601a5a3f0": {
		functionName: "generateDummyCommentsFn_createServerFn_handler",
		importer: () => import("./comments.ai-DXUV1TPC.js")
	},
	"424c41ecfd6de125add850459642fbb101dfbf9443245c9923f618fb115e3edc": {
		functionName: "executeSetup_createServerFn_handler",
		importer: () => import("./setup.functions-CVZRUi2B.js")
	},
	"42d18b0048bef3538026b6b696082858a6292614c8fa6484b80029a80eefcd00": {
		functionName: "checkArticleLikedServer_createServerFn_handler",
		importer: () => import("./articles.functions-BXKoEoqf.js")
	},
	"44648476b52f75748fa9e061f78c31dfe57f35f10cdf3043e81e50dfae452846": {
		functionName: "createAdminUser_createServerFn_handler",
		importer: () => import("./admin-users.functions-D8qlrCYO.js")
	},
	"44c2b244a154cd9bc6306696fd578a3756f03ae68ae423ffb59681668e80655c": {
		functionName: "getRolesServer_createServerFn_handler",
		importer: () => import("./roles-BDc_3nc3.js")
	},
	"456a04395d91d0c6af478600bc3d2d7698126db44c195a057c14f79bc2f06e8d": {
		functionName: "deleteTag_createServerFn_handler",
		importer: () => import("./taxonomy.functions-BKVVv79a.js")
	},
	"476e6c8da3355fb484a63ca04ee5ea1bbcacbd52a31c6a14fa17a22de2226ba3": {
		functionName: "searchPublicArticles_createServerFn_handler",
		importer: () => import("./articles.functions-BXKoEoqf.js")
	},
	"47f3e98dfa8065a7eb67b3c8ebe13819fd9ecf8a2128a4f73e1c19d4c3cd5508": {
		functionName: "trashAdminArticle_createServerFn_handler",
		importer: () => import("./articles.functions-BXKoEoqf.js")
	},
	"48fe8cb020169719d3cd57f8962b6b1845ce528dab34e360f2be0bef0c3d06bc": {
		functionName: "importAdminUsers_createServerFn_handler",
		importer: () => import("./admin-users.functions-D8qlrCYO.js")
	},
	"494a2753d65953536e1f3934b3921e0f62393deb0838cc47539f0ea3de769dbd": {
		functionName: "deleteMediaServer_createServerFn_handler",
		importer: () => import("./media.functions-C7iSjn_T.js")
	},
	"4ef4526c7851016d95d34a2a71feba58eb4669c50021f14c2f9649d2bf686d9d": {
		functionName: "getSessionServer_createServerFn_handler",
		importer: () => import("./auth.functions-TFa5vleB.js")
	},
	"4f060819d3520f81ab864fe370ef176de6c7d786ba07ef7cb5f8964d28bed07f": {
		functionName: "getAdminAuthorProfiles_createServerFn_handler",
		importer: () => import("./articles.functions-BXKoEoqf.js")
	},
	"4fa6f5bc37fef053d73e12215a610604a3727a81c4d2685fff68092276b1b89b": {
		functionName: "getRewardsServer_createServerFn_handler",
		importer: () => import("./rewards-DhYp7Gw6.js")
	},
	"509b385316e86899d89a791a829c18940efbe7f30a57fc190b3d7737b627a870": {
		functionName: "purgeEdgeCdnServer_createServerFn_handler",
		importer: () => import("./cdn.functions-D0s9o_jB.js")
	},
	"5151c19d6b0b56b114207c0daadb9bbd57477b58a7fb7b274ec51e2680278e65": {
		functionName: "likeArticleServer_createServerFn_handler",
		importer: () => import("./articles.functions-BXKoEoqf.js")
	},
	"5171cfe7a5eb72c85b80892422db2c978d7f6ca631e43682141b0447064c407b": {
		functionName: "getMediaListServer_createServerFn_handler",
		importer: () => import("./media.functions-C7iSjn_T.js")
	},
	"54425a5416a220839e30a32e3d0173b5b44626cb9bacd7b67d8e4fe08ad48a44": {
		functionName: "checkSetupStatus_createServerFn_handler",
		importer: () => import("./setup.functions-CVZRUi2B.js")
	},
	"5654329e34be191256640c8957e4eaed33fcb574dfccb4b513f44c828b16863f": {
		functionName: "getRequestOrigin_createServerFn_handler",
		importer: () => import("./origin.functions-dzWR0kUE.js")
	},
	"5793221b7208fe5998cf899cbabb3dc0129a36e9333df1fd20efee344b372c3a": {
		functionName: "deletePermanentlyAdminArticlesBulk_createServerFn_handler",
		importer: () => import("./articles.functions-BXKoEoqf.js")
	},
	"5c8cf393ab6d7dc22b596958c14fc70206128b2d1b8f92272c11ce262e738bcb": {
		functionName: "saveRolesServer_createServerFn_handler",
		importer: () => import("./roles-BDc_3nc3.js")
	},
	"5e45b55e814da1ee45b2c220ed8509e0fc09d858adfa040131700cfd9259dc45": {
		functionName: "saveTag_createServerFn_handler",
		importer: () => import("./taxonomy.functions-BKVVv79a.js")
	},
	"6060beafa123a3a81700b8cc4762dc17289432a963ce287cdd68e0b4630d7931": {
		functionName: "generateSectionHtmlServer_createServerFn_handler",
		importer: () => import("./ai.functions-0o4E0Vij.js")
	},
	"6329335e43e59c703022ecded4636f3342709f33f8890f22cc106cb8e99ae796": {
		functionName: "replaceMediaFileServer_createServerFn_handler",
		importer: () => import("./media.functions-C7iSjn_T.js")
	},
	"64074aae210bf06c1f6dd880c1ceb389e454c17f09dc8077502ecd8f6d3d97f2": {
		functionName: "scanBrokenLinksServer_createServerFn_handler",
		importer: () => import("./redirect-rules-Ddg4_Y6H.js")
	},
	"64423d826bbc714ede86951c9f1916f7f0b77d8d1a2f932f86789450e9b7f8b6": {
		functionName: "deleteAdminUser_createServerFn_handler",
		importer: () => import("./admin-users.functions-D8qlrCYO.js")
	},
	"65600bf083ec71d5df1045a46b6e8e2965c827f1fa1a8b147499ee9ddedc3bbe": {
		functionName: "setJournalistActive_createServerFn_handler",
		importer: () => import("./journalist.functions-DMO-ku1n.js")
	},
	"692ea2f55d4ecec9ef0a88eea92718428ba0af1975105119862bde2e25106d67": {
		functionName: "getCustomPagesServer_createServerFn_handler",
		importer: () => import("./custom-pages-DRlwkILy.js")
	},
	"69521f1e7392e34389c335e12d6c56785c32af5c1bcf47157ef32029c1829db4": {
		functionName: "updateAdminUserPassword_createServerFn_handler",
		importer: () => import("./admin-users.functions-D8qlrCYO.js")
	},
	"6c259ade959c851cd70340313263eb8505cc9ec3b200d13ef96c63eff4e5a00f": {
		functionName: "submitEventRegistration_createServerFn_handler",
		importer: () => import("./inbox.functions-DHv0wcSM.js")
	},
	"6ee862fc9a6e094cb784d2759dd3f559deb4caabd5b844a6255c1e2f7a255d25": {
		functionName: "upsertJournalist_createServerFn_handler",
		importer: () => import("./journalist.functions-DMO-ku1n.js")
	},
	"702655ca1b3fca4307cb686a091790c96919c26dd8288220df2010c9f93b5cd8": {
		functionName: "saveReelsConfigServer_createServerFn_handler",
		importer: () => import("./reels-config-DOU7A4Ch.js")
	},
	"7179a38770baf2cdf7e3286c4ecc116948c0125097a3a5e488afd664b1e90777": {
		functionName: "saveCustomPageServer_createServerFn_handler",
		importer: () => import("./custom-pages-DRlwkILy.js")
	},
	"7236ee6b389af833d155a187ac4a91b3d68811b03e1a40085dd07cc06936564e": {
		functionName: "getPublicArchiveArticles_createServerFn_handler",
		importer: () => import("./articles.functions-BXKoEoqf.js")
	},
	"7338eb5a2878ffa1f7b6e110ac13a130cb2ca3445d5a5fa61817aeaa8b5c131c": {
		functionName: "updateCommentStatus_createServerFn_handler",
		importer: () => import("./comments.functions-u2jsCxVX.js")
	},
	"73da229e9bba97b2e3b47fcf9f861a6b89c3ec72511b4c8964a3e5c9e092b53d": {
		functionName: "deleteCategory_createServerFn_handler",
		importer: () => import("./taxonomy.functions-BKVVv79a.js")
	},
	"75c16329e4ea959e4c4bf240a428d8dffbff669bab981b5ad419e945345cddfb": {
		functionName: "resolveYouTubeServer_createServerFn_handler",
		importer: () => import("./homepage-config-COFrx2x0.js")
	},
	"77058d8bdc7833b6d17a992ddb7ca497890e6aa535436b00ec867be38d365b44": {
		functionName: "postArticleComment_createServerFn_handler",
		importer: () => import("./comments.functions-u2jsCxVX.js")
	},
	"7767b80dfc8a05617da49ed7b2fff2ef4cf1d9172125810f5a1bb8fe9159ac0f": {
		functionName: "signInServer_createServerFn_handler",
		importer: () => import("./auth.functions-TFa5vleB.js")
	},
	"77b55eb13ad368fb1b0873c8c532ac23b5668348efc4c34ac3c3e0915a03f702": {
		functionName: "getAdminComments_createServerFn_handler",
		importer: () => import("./comments.functions-u2jsCxVX.js")
	},
	"78f4c911acbdaabc3934ef25173a7247b252784ce0cec0a0d21a5c58599140db": {
		functionName: "getAllCommentsFn_createServerFn_handler",
		importer: () => import("./comments.functions-u2jsCxVX.js")
	},
	"7ae569f1f945df118a54485d2422ff53e4ee9dccc16c5867fc1b42c7b0cdcf34": {
		functionName: "submitDeleteAccountRequest_createServerFn_handler",
		importer: () => import("./inbox.functions-DHv0wcSM.js")
	},
	"7b186d766aa8c796c848f3fedb34e6679caf6d5177470f7bbe3fd7316adcf994": {
		functionName: "getCurrentUserProfile_createServerFn_handler",
		importer: () => import("./auth.functions-TFa5vleB.js")
	},
	"7bd773403e6cf1738bce63ecdf682bbfa435a41a857b4c398d398e6df9980a14": {
		functionName: "testDatabaseConnection_createServerFn_handler",
		importer: () => import("./setup.functions-CVZRUi2B.js")
	},
	"7cbf675c7bd7c9ee224e699588bfa7a4d7b38ac86b77a40ade5d857819ebe6a7": {
		functionName: "getRedirectRulesServer_createServerFn_handler",
		importer: () => import("./redirect-rules-Ddg4_Y6H.js")
	},
	"7df5206812c5eb96c69bf01f4466216c73e5df24362927076561735849872a91": {
		functionName: "batchUpdateAltTextServer_createServerFn_handler",
		importer: () => import("./media.functions-C7iSjn_T.js")
	},
	"7f3705a23943e0d335f1e588bc9def784ae013d70f854e527352bbe3e91d7b6c": {
		functionName: "setUserPoints_createServerFn_handler",
		importer: () => import("./admin-users.functions-D8qlrCYO.js")
	},
	"81db0087bd1cbae6f062c40d636a90261aeee5fe44b493c6eaaa70ed8f0a148e": {
		functionName: "deleteMultipleMediaServer_createServerFn_handler",
		importer: () => import("./media.functions-C7iSjn_T.js")
	},
	"8582d48d00b8ab9f107f617c3221dc7d52eab78da86619d0241671b46381f893": {
		functionName: "saveHomepageConfigServer_createServerFn_handler",
		importer: () => import("./homepage-config-COFrx2x0.js")
	},
	"85a69b0fa82aba24f7f596912ea912b9ee983194c4b1169716362810332f93cd": {
		functionName: "searchJournalists_createServerFn_handler",
		importer: () => import("./journalist.functions-DMO-ku1n.js")
	},
	"867751394f3b0a32d0e5596bca686f87633494837852fe31aadabda10cc1fb52": {
		functionName: "saveAdConfigurationServer_createServerFn_handler",
		importer: () => import("./ads-storage-B6eW9K7n.js")
	},
	"867f8fd34f32acecfe9ec627f5b33ef8762a5eabab40b2b297e14b09e6fd5382": {
		functionName: "getJournalistRanksServer_createServerFn_handler",
		importer: () => import("./journalist-ranks-BRc4IA6V.js")
	},
	"89382b2939ddbd1aa77145d368669ee82e1eceec29261bf47fd3c8be059eb039": {
		functionName: "fetchCloudBackupServer_createServerFn_handler",
		importer: () => import("./backup.functions-Dc6qVlnB.js")
	},
	"89fc6e633758384ac3ff1727b979f26efdb0707b0620698d8e1b69bf02cbe1d3": {
		functionName: "trashAdminArticlesBulk_createServerFn_handler",
		importer: () => import("./articles.functions-BXKoEoqf.js")
	},
	"8a1c5ef143a372c0240b9c8c466dad42d616ff503a5362ba972f6f98c5b19b6e": {
		functionName: "getGitStatus_createServerFn_handler",
		importer: () => import("./deploy.functions-DF2hHpJ5.js")
	},
	"8cbf44811f6ded593a27491aea934cc2f47fef1266c9ae58a6c768bbcf37183b": {
		functionName: "patchDependencies_createServerFn_handler",
		importer: () => import("./deploy.functions-DF2hHpJ5.js")
	},
	"8cea322cbc4f6bcc495d4f79eecafc364597765e92569763076616465537f853": {
		functionName: "listJournalists_createServerFn_handler",
		importer: () => import("./journalist.functions-DMO-ku1n.js")
	},
	"8db4491881a2542e7ca906cd944acb38f7c8686c7b09435d2c0689601728de06": {
		functionName: "importAdminArticles_createServerFn_handler",
		importer: () => import("./articles.functions-BXKoEoqf.js")
	},
	"968a5e6c0bad24556a003ac0f243bd5bf1d248350fbf3ecbe82fe2ab52b5bcb6": {
		functionName: "deleteCommentsBulk_createServerFn_handler",
		importer: () => import("./comments.functions-u2jsCxVX.js")
	},
	"99fd2ba85784973fe0dd16ad799222be69351f8453511656d1545a65df4b8e79": {
		functionName: "getQuickSearchPreview_createServerFn_handler",
		importer: () => import("./search.functions-BZUmHE-L.js")
	},
	"a11c92cd0221f09684c9d38d6e88a3645d06872fc73a4b7193f07e754240b401": {
		functionName: "getArticleComments_createServerFn_handler",
		importer: () => import("./comments.functions-u2jsCxVX.js")
	},
	"a2cd0096acae8fe7ede91a9dbfb5402cdc97389227b6119619b8779199a18708": {
		functionName: "adminGetInboxSummary_createServerFn_handler",
		importer: () => import("./inbox.functions-DHv0wcSM.js")
	},
	"a2ce65b73cdceb218f08412d4b04448d9996eaefcdb48ef0511661fe6b7d9c60": {
		functionName: "checkNewsFactServer_createServerFn_handler",
		importer: () => import("./fact-check.functions-BFT3RkYz.js")
	},
	"a5ad24c30f372a03151c7dc3f1f8332cdb02d7e67e7bc64a72c494b6ce88400e": {
		functionName: "getDeployLog_createServerFn_handler",
		importer: () => import("./deploy.functions-DF2hHpJ5.js")
	},
	"a6002267c4d192ba76a3c675b580d90351bd78a0e67a36f81933b37bd786cf2e": {
		functionName: "awardJournalistPoints_createServerFn_handler",
		importer: () => import("./journalist.functions-DMO-ku1n.js")
	},
	"a747fffbbe483f1e7dd71777de6f5a0b47369156a453a555650c7cf2bb6719ef": {
		functionName: "buildProject_createServerFn_handler",
		importer: () => import("./deploy.functions-DF2hHpJ5.js")
	},
	"a76ed6fe6d9e768c9b491e3918e54e2f3edbe342884378d0c60678bcca5b54fe": {
		functionName: "deleteAdStaticFilesServer_createServerFn_handler",
		importer: () => import("./ads-storage-B6eW9K7n.js")
	},
	"a9524f219d84d7feedeb9446b2f236f589c9b507df590a19a028c57c50e8eddb": {
		functionName: "saveFontConfigServer_createServerFn_handler",
		importer: () => import("./font-config-BsaE9OI3.js")
	},
	"aae3045fa12508107196bec8b35c12823003d4de5f5ee5ab44551e208a987c23": {
		functionName: "submitJournalistApplication_createServerFn_handler",
		importer: () => import("./inbox.functions-DHv0wcSM.js")
	},
	"ad53ffbc7f3e951a8895f462145a88a54053d1cabb34053c5e5ae2e5ec97de6f": {
		functionName: "getArticleWriteBehindStatsServer_createServerFn_handler",
		importer: () => import("./articles.functions-BXKoEoqf.js")
	},
	"afb7555d6a34adc5b0e662eb11f4a7f6971738589c83e37b63b29ef9bf924cb1": {
		functionName: "upgradeToPremiumServer_createServerFn_handler",
		importer: () => import("./roles-BDc_3nc3.js")
	},
	"b02cb49386409bee03f8c061d0bf58236d31bbf6ca53bde383d23e308b130fab": {
		functionName: "updateCommentsBulkStatus_createServerFn_handler",
		importer: () => import("./comments.functions-u2jsCxVX.js")
	},
	"b1b7c2049f9fd39ff484d5780be121d634dec8fc9387b4af69c0fc546d841511": {
		functionName: "submitWithdrawRequest_createServerFn_handler",
		importer: () => import("./inbox.functions-DHv0wcSM.js")
	},
	"b3095e70e29c64e8fdcdde5fbc447132d5211556bec99ac668eb0ff2de5657aa": {
		functionName: "saveCategory_createServerFn_handler",
		importer: () => import("./taxonomy.functions-BKVVv79a.js")
	},
	"b5112734f93085547420b85a9164457598dbdbca42f9bad3acc9fdd652a1ce7f": {
		functionName: "adminGetInboxRequests_createServerFn_handler",
		importer: () => import("./inbox.functions-DHv0wcSM.js")
	},
	"b51eb31b9d36ce8ad6724bbbef81a5b0b5f0ee5403bd22eeb33f98d43c91fcfb": {
		functionName: "getTags_createServerFn_handler",
		importer: () => import("./taxonomy.functions-BKVVv79a.js")
	},
	"b5d698999d02b005eeeb606cbdbd6f6d4fd0b8f52dd673d424fc0e7d35d91a8f": {
		functionName: "getUserServer_createServerFn_handler",
		importer: () => import("./auth.functions-TFa5vleB.js")
	},
	"b6036d0bc738454474507449abce75eb56abbf37fec319140f402be356cf4f37": {
		functionName: "getAllAdminUsers_createServerFn_handler",
		importer: () => import("./admin-users.functions-D8qlrCYO.js")
	},
	"b875846417bf76c2373ddaf3772e07ddd0648482764372fe11e47cddb10df762": {
		functionName: "getPublicArticleBySlug_createServerFn_handler",
		importer: () => import("./articles.functions-BXKoEoqf.js")
	},
	"ba730ab7529c25c3f6ecd56d5e41e85a92653f22b92925befe98d3ae9a58e52c": {
		functionName: "setAdminUserRole_createServerFn_handler",
		importer: () => import("./admin-users.functions-D8qlrCYO.js")
	},
	"bd28439ed241bc6457c20970b10c64e134f15e3bf56e42a335137a2728b7d7f2": {
		functionName: "getHomepageConfigServer_createServerFn_handler",
		importer: () => import("./homepage-config-COFrx2x0.js")
	},
	"be945b3b1850d06957e0c1f1206a296f68186767b6bc3e5f7332ebab888698a4": {
		functionName: "getJournalistPrivateStats_createServerFn_handler",
		importer: () => import("./journalist.functions-DMO-ku1n.js")
	},
	"c197567c90b8a1cde5691024f8c8cba20ff2582a13a5bad48a45cbc91f16fc6d": {
		functionName: "getProfileServer_createServerFn_handler",
		importer: () => import("./auth.functions-TFa5vleB.js")
	},
	"c1d937c34a7fb32d17695c2e775aa0d34df5549df8dda2ac848c787668183790": {
		functionName: "bulkToggleAdminUserBan_createServerFn_handler",
		importer: () => import("./admin-users.functions-D8qlrCYO.js")
	},
	"c45cee029994ab43bbe6ad2c83b81e99d5008c5b979f02b4994e34820d8fb69d": {
		functionName: "getDeployHistory_createServerFn_handler",
		importer: () => import("./deploy.functions-DF2hHpJ5.js")
	},
	"c57cf768f00d2d98b4493cfc9864c3854c188071e1099484f44c676f99ce2cb2": {
		functionName: "emptyTrashAdminArticles_createServerFn_handler",
		importer: () => import("./articles.functions-BXKoEoqf.js")
	},
	"c69cb5377cccba9eb185d48034cd36b39b797aad2b84bf3751285f58d3cdbcc7": {
		functionName: "getHomepageArticles_createServerFn_handler",
		importer: () => import("./articles.functions-BXKoEoqf.js")
	},
	"c74c43aca09bd4ab35cb549fc9dd0b4b72af2f5002be44cbebcff373c6340867": {
		functionName: "getPublicRelatedArticles_createServerFn_handler",
		importer: () => import("./articles.functions-BXKoEoqf.js")
	},
	"c78294774cd3e4bb1c4a1b90ba325c5a3e4378da96a7efd13255241950559fc2": {
		functionName: "getSiteSettingsServer_createServerFn_handler",
		importer: () => import("./site-settings-CFft4TED.js")
	},
	"c8f150db49105e8920ef4f4b599173f2209d60195550f302cc89ed3133ecf7b6": {
		functionName: "adminUpdateInboxStatus_createServerFn_handler",
		importer: () => import("./inbox.functions-DHv0wcSM.js")
	},
	"cb6b8bf70884edd100e4ea383f633fbb54f6556775a50e424c5efbc73a7ba76d": {
		functionName: "deleteAllCommentsFn_createServerFn_handler",
		importer: () => import("./comments.functions-u2jsCxVX.js")
	},
	"cc59c9c287ab31b02d5dd933dfcae74b25340d1c5e5cf66e469416924854aa55": {
		functionName: "updateClaimStatusServer_createServerFn_handler",
		importer: () => import("./pending-claims-CjfQGIAJ.js")
	},
	"ce1125864efa76115c34ea2a60564fcb9d798efd40778bdc464f77843b17ea5a": {
		functionName: "gitPull_createServerFn_handler",
		importer: () => import("./deploy.functions-DF2hHpJ5.js")
	},
	"d11f8218e1bc2394af4f78dca0f87578d9aed581749b5a90533c8ba434f6b8d8": {
		functionName: "lookupJournalist_createServerFn_handler",
		importer: () => import("./journalist.functions-DMO-ku1n.js")
	},
	"d14c976fc9d27f7cba055065c2d8be0c91411a65384e1cee39634635f87cd1cc": {
		functionName: "restoreAdminArticle_createServerFn_handler",
		importer: () => import("./articles.functions-BXKoEoqf.js")
	},
	"d296691172b6166ca20eee958357a08c2f40f1de3af5b5b23c9ab00dd920d54e": {
		functionName: "submitContactMessage_createServerFn_handler",
		importer: () => import("./inbox.functions-DHv0wcSM.js")
	},
	"d40db31842ef69c32ee11b885c847a349426926025e989432dc9f235693a7f8f": {
		functionName: "generateCategoryDescriptionServer_createServerFn_handler",
		importer: () => import("./ai.functions-0o4E0Vij.js")
	},
	"d488038ced2e73b8f6cd9e5f3ea1b54a60b9ea67015257a80b813215d13ee50a": {
		functionName: "searchUnifiedPublic_createServerFn_handler",
		importer: () => import("./search.functions-BZUmHE-L.js")
	},
	"d5830d251ab2f9747dda53ce45f1285e09274b9a75417b75378eaeb555e1b2f2": {
		functionName: "saveSiteSettingsServer_createServerFn_handler",
		importer: () => import("./site-settings-CFft4TED.js")
	},
	"d5a9474dac158835730ec1660c29a33bc39e42dbf22db6c74184a5837442ce3c": {
		functionName: "restoreAdminArticlesBulk_createServerFn_handler",
		importer: () => import("./articles.functions-BXKoEoqf.js")
	},
	"d6fff43b8c882c22c23d05f462c3d8a1e8d63e06f94d1c05315b49b296cd751b": {
		functionName: "updateAdminUserDetails_createServerFn_handler",
		importer: () => import("./admin-users.functions-D8qlrCYO.js")
	},
	"df8b16c859c7fd668587be4aacb40208f4cc4b6c8458c7a094215fd98e8e361f": {
		functionName: "signUpServer_createServerFn_handler",
		importer: () => import("./auth.functions-TFa5vleB.js")
	},
	"dfcb04800cdeb31e774b458dd497514b9ddeaa58e171298b91f1907be9a8c7b2": {
		functionName: "importCommentsFn_createServerFn_handler",
		importer: () => import("./comments.functions-u2jsCxVX.js")
	},
	"e10c1724b54a5d0e4ddc7f147e00f08845b00a2e41a59862625f5831cfba8629": {
		functionName: "getAdConfigurationServer_createServerFn_handler",
		importer: () => import("./ads-storage-B6eW9K7n.js")
	},
	"e2f69f0542cf632edc163e1724bec5f208985dacb09a88cc9ae9e5807b50ece0": {
		functionName: "updateCurrentUserProfile_createServerFn_handler",
		importer: () => import("./auth.functions-TFa5vleB.js")
	},
	"e30b47418872d7ca1fb2d3af3e86d8b52c3f8a1c070269d6763789d0886ee8f4": {
		functionName: "updateMediaServer_createServerFn_handler",
		importer: () => import("./media.functions-C7iSjn_T.js")
	},
	"e3e3d3d1e25a2df540963a5960e082801c0920dfc74b6fb332b8a471307562ab": {
		functionName: "changeMyPassword_createServerFn_handler",
		importer: () => import("./auth.functions-TFa5vleB.js")
	},
	"e4f613da354b95ded8ce2081279082f37e586523eb22e7ba9403d1ead85e95f2": {
		functionName: "listAdminUsers_createServerFn_handler",
		importer: () => import("./admin-users.functions-D8qlrCYO.js")
	},
	"e5bfa53b8bb05306086be3399e030e1e91d57b9aade854e12065b2e1beea5725": {
		functionName: "bulkDeleteAdminUsers_createServerFn_handler",
		importer: () => import("./admin-users.functions-D8qlrCYO.js")
	},
	"e64b37bc9940d0ba56463e85ceb4d39ddccd5b5b564bb2e6480503d612b429d3": {
		functionName: "getAllAdminArticles_createServerFn_handler",
		importer: () => import("./articles.functions-BXKoEoqf.js")
	},
	"ea95d7a78753f255e229f0ab8bcfcbe50478660db4ce742569cf640edc33c4d2": {
		functionName: "lookupArticleByUrlOrSlugFn_createServerFn_handler",
		importer: () => import("./comments.functions-u2jsCxVX.js")
	},
	"f25c48cd4e4d94c147d7ade851599e0cd33ed9edb0ee54e803f0cf7416080ee7": {
		functionName: "getMyJournalistApplicationStatus_createServerFn_handler",
		importer: () => import("./inbox.functions-DHv0wcSM.js")
	},
	"f2b55fcbc61de640bdc246a756afade094af300f815b713c633816f7f0b40536": {
		functionName: "importCategories_createServerFn_handler",
		importer: () => import("./taxonomy.functions-BKVVv79a.js")
	},
	"f74d25128cb65249eb9cd4c8c2bb7864f753953899ec42f1d96073ca0a4d1354": {
		functionName: "getAdminArticleById_createServerFn_handler",
		importer: () => import("./articles.functions-BXKoEoqf.js")
	},
	"f8f7c94053b6df65dd311c004de419a04972d1da2641bd4652225fe862ccc09f": {
		functionName: "signOutServer_createServerFn_handler",
		importer: () => import("./auth.functions-TFa5vleB.js")
	},
	"fc9dae9aa403f9bc644d51588c7c5f5b486d759eecd1cfd041e553d794565167": {
		functionName: "incrementRedirectHitServer_createServerFn_handler",
		importer: () => import("./redirect-rules-Ddg4_Y6H.js")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ??= await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
// node_modules/@tanstack/start-client-core/dist/esm/constants.js
var TSS_FORMDATA_CONTEXT = "__TSS_CONTEXT";
var TSS_SERVER_FUNCTION = Symbol.for("TSS_SERVER_FUNCTION");
var TSS_SERVER_FUNCTION_FACTORY = Symbol.for("TSS_SERVER_FUNCTION_FACTORY");
var X_TSS_SERIALIZED = "x-tss-serialized";
var X_TSS_RAW_RESPONSE = "x-tss-raw";
/** Content-Type for multiplexed framed responses (RawStream support) */
var TSS_CONTENT_TYPE_FRAMED = "application/x-tss-framed";
/** Largest payload accepted by one framed-protocol record. */
var MAX_FRAME_PAYLOAD_SIZE = 16777216;
/** Largest number of raw streams accepted in one framed response. */
var MAX_FRAMED_STREAMS = 1024;
/** Full Content-Type header value with version parameter */
var TSS_CONTENT_TYPE_FRAMED_VERSIONED = `${TSS_CONTENT_TYPE_FRAMED}; v=1`;
// node_modules/@tanstack/start-storage-context/dist/esm/async-local-storage.js
var GLOBAL_STORAGE_KEY = Symbol.for("tanstack-start:start-storage-context");
var globalObj = globalThis;
if (!globalObj[GLOBAL_STORAGE_KEY]) globalObj[GLOBAL_STORAGE_KEY] = new AsyncLocalStorage();
var startStorage = globalObj[GLOBAL_STORAGE_KEY];
function runWithStartContext(context, fn) {
	return startStorage.run(context, fn);
}
function getStartContext(opts) {
	const context = startStorage.getStore();
	if (!context && opts?.throwIfNotFound !== false) throw new Error(`No Start context found in AsyncLocalStorage. Make sure you are using the function within the server runtime.`);
	return context;
}
// node_modules/@tanstack/start-client-core/dist/esm/getStartOptions.js
var getStartOptions = () => getStartContext().startOptions;
// node_modules/@tanstack/start-client-core/dist/esm/getDefaultSerovalPlugins.js
/** Start's serialization adapters followed by `routerPlugins`. */
function getSerovalPlugins(routerPlugins) {
	return [...(getStartOptions()?.serializationAdapters)?.map(makeSerovalPlugin) ?? [], ...routerPlugins];
}
// node_modules/@tanstack/start-server-core/dist/esm/frame-protocol.js
/**
* Binary frame protocol for multiplexing JSON and raw streams over HTTP.
*
* Frame format: [type:1][streamId:4][length:4][payload:length]
* - type: 1 byte - frame type (JSON, CHUNK, END, ERROR)
* - streamId: 4 bytes big-endian uint32 - stream identifier
* - length: 4 bytes big-endian uint32 - payload length
* - payload: variable length bytes
*/
/** Cached TextEncoder for frame encoding */
var textEncoder$1 = new TextEncoder();
/** Shared empty payload for END frames - avoids allocation per call */
var EMPTY_PAYLOAD = /* @__PURE__ */ new Uint8Array(0);
var MAX_ERROR_MESSAGE_CODE_UNITS = 4096;
/**
* Encodes a single frame with header and payload.
*/
function encodeFrame(type, streamId, payload) {
	if (payload.byteLength > 16777216) throw new RangeError(`Frame payload exceeds ${MAX_FRAME_PAYLOAD_SIZE} bytes`);
	const frame = new Uint8Array(9 + payload.length);
	frame[0] = type;
	frame[1] = streamId >>> 24 & 255;
	frame[2] = streamId >>> 16 & 255;
	frame[3] = streamId >>> 8 & 255;
	frame[4] = streamId & 255;
	frame[5] = payload.length >>> 24 & 255;
	frame[6] = payload.length >>> 16 & 255;
	frame[7] = payload.length >>> 8 & 255;
	frame[8] = payload.length & 255;
	frame.set(payload, 9);
	return frame;
}
/** Encodes an error message payload, truncated to a bounded length. */
function encodeErrorPayload(error) {
	const originalMessage = error instanceof Error ? error.message : String(error ?? "Unknown error");
	const message = originalMessage.length > MAX_ERROR_MESSAGE_CODE_UNITS ? `${originalMessage.slice(0, MAX_ERROR_MESSAGE_CODE_UNITS)}…` : originalMessage;
	return textEncoder$1.encode(message);
}
/**
* Creates a multiplexed ReadableStream from serialized response records.
*
* A record's JSON frame is admitted before any raw stream referenced by that
* record starts. Raw streams from admitted records are pumped concurrently.
* The caller bounds the stream count before records reach this function.
*/
function createMultiplexedStream(recordStream, options = {}) {
	let controller;
	let stopped = false;
	let activePumps = 0;
	let wakeDemand;
	let admission;
	const readers = /* @__PURE__ */ new Set();
	const pendingRawStreams = /* @__PURE__ */ new Set();
	const abortOutput = () => errorOutput(options.signal?.reason);
	const wakeAdmission = () => {
		const wake = wakeDemand;
		wakeDemand = void 0;
		wake?.();
	};
	const cancelReader = (reader, reason) => {
		reader.cancel(reason).catch(() => {});
	};
	const cancelStream = (stream, reason) => {
		stream.cancel(reason).catch(() => {});
	};
	const stop = (reason) => {
		if (stopped) return false;
		stopped = [reason];
		options.signal?.removeEventListener("abort", abortOutput);
		wakeAdmission();
		for (const reader of readers) cancelReader(reader, reason);
		for (const stream of pendingRawStreams) cancelStream(stream, reason);
		pendingRawStreams.clear();
		return true;
	};
	const errorOutput = (error) => {
		if (!stop(error)) return;
		try {
			controller.error(error);
		} catch {}
	};
	const waitForDemand = async () => {
		while (!stopped && (controller.desiredSize ?? 0) <= 0) await new Promise((resolve) => {
			wakeDemand = resolve;
		});
		return !stopped;
	};
	const admitFrame = (type, streamId, payload) => {
		if (stopped) return false;
		if (!admission && (controller.desiredSize ?? 0) > 0) {
			controller.enqueue(encodeFrame(type, streamId, payload));
			return true;
		}
		const runAdmission = async () => {
			if (!await waitForDemand()) return false;
			controller.enqueue(encodeFrame(type, streamId, payload));
			return true;
		};
		const result = admission ? admission.then(runAdmission) : runAdmission();
		const clearAdmission = () => {
			if (admission === tail) admission = void 0;
		};
		const tail = result.then(clearAdmission, clearAdmission);
		admission = tail;
		return result;
	};
	const maybeClose = () => {
		if (activePumps !== 0 || !stop()) return;
		try {
			controller.close();
		} catch {}
	};
	const startPump = (pump) => {
		activePumps++;
		pump().then(() => {
			activePumps--;
			maybeClose();
		}, (error) => {
			activePumps--;
			errorOutput(error);
		});
	};
	async function pumpRawStream(streamId, stream) {
		const reader = stream.getReader();
		readers.add(reader);
		try {
			while (!stopped) {
				const { done, value } = await reader.read();
				if (stopped) return;
				if (done) {
					const frameAdmission = admitFrame(2, streamId, EMPTY_PAYLOAD);
					if (frameAdmission !== true) await frameAdmission;
					return;
				}
				if (!(value instanceof Uint8Array)) throw new TypeError("RawStream chunks must be Uint8Array");
				let offset = 0;
				do {
					const chunk = value.byteLength <= 16777216 ? value : value.subarray(offset, offset + MAX_FRAME_PAYLOAD_SIZE);
					const frameAdmission = admitFrame(1, streamId, chunk);
					if (frameAdmission !== true && (frameAdmission === false || !await frameAdmission)) return;
					offset += MAX_FRAME_PAYLOAD_SIZE;
				} while (offset < value.byteLength);
			}
		} catch (error) {
			if (!stopped) {
				const frameAdmission = admitFrame(3, streamId, encodeErrorPayload(error));
				if (frameAdmission !== true) await frameAdmission;
			}
		} finally {
			readers.delete(reader);
			reader.releaseLock();
		}
	}
	async function pumpRecords() {
		const reader = recordStream.getReader();
		readers.add(reader);
		try {
			while (!stopped) {
				const { done, value } = await reader.read();
				if (stopped) {
					if (!done) for (const registration of value.rawStreams) cancelStream(registration.stream, stopped[0]);
					return;
				}
				if (done) return;
				for (const registration of value.rawStreams) pendingRawStreams.add(registration.stream);
				const frameAdmission = admitFrame(0, 0, value.json);
				if (frameAdmission !== true && (frameAdmission === false || !await frameAdmission)) return;
				for (const registration of value.rawStreams) {
					pendingRawStreams.delete(registration.stream);
					startPump(pumpRawStream.bind(void 0, registration.id, registration.stream));
				}
			}
		} catch (error) {
			if (!stopped) errorOutput(error);
		} finally {
			readers.delete(reader);
			reader.releaseLock();
		}
	}
	return new ReadableStream({
		start(ctrl) {
			controller = ctrl;
			if (options.signal?.aborted) {
				cancelStream(recordStream, options.signal.reason);
				errorOutput(options.signal.reason);
				return;
			}
			options.signal?.addEventListener("abort", abortOutput, { once: true });
			startPump(pumpRecords);
		},
		pull() {
			wakeAdmission();
		},
		cancel(reason) {
			if (stop(reason)) options.onCancel?.(reason);
		}
	});
}
// node_modules/@tanstack/start-client-core/dist/esm/safeObjectMerge.js
function isSafeKey(key) {
	return key !== "__proto__" && key !== "constructor" && key !== "prototype";
}
/**
* Merge target and source into a new null-proto object, filtering dangerous keys.
*/
function safeObjectMerge(target, source) {
	const result = Object.create(null);
	if (target) {
		const keys = Object.keys(target);
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			if (isSafeKey(key)) result[key] = target[key];
		}
	}
	if (source && typeof source === "object") {
		const keys = Object.keys(source);
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			if (isSafeKey(key)) result[key] = source[key];
		}
	}
	return result;
}
/**
* Create a null-prototype object, optionally copying from source.
*/
function createNullProtoObject(source) {
	return source ? safeObjectMerge(source, void 0) : Object.create(null);
}
// node_modules/@tanstack/start-client-core/dist/esm/getStartContextServerOnly.js
var getStartContextServerOnly = getStartContext;
// node_modules/@tanstack/start-client-core/dist/esm/createServerFn.js
var createServerFn = (options, __opts) => {
	const resolvedOptions = __opts || options || {};
	if (typeof resolvedOptions.method === "undefined") resolvedOptions.method = "GET";
	const res = {
		options: resolvedOptions,
		middleware: (middleware) => {
			const newMiddleware = [...resolvedOptions.middleware || []];
			middleware.forEach((item) => {
				if (TSS_SERVER_FUNCTION_FACTORY in item) {
					if (item.options.middleware) newMiddleware.push(...item.options.middleware);
				} else newMiddleware.push(item);
			});
			const res = createServerFn(void 0, {
				...resolvedOptions,
				middleware: newMiddleware
			});
			res[TSS_SERVER_FUNCTION_FACTORY] = true;
			return res;
		},
		validator: (validator) => {
			return createServerFn(void 0, {
				...resolvedOptions,
				validator
			});
		},
		handler: (...args) => {
			const [extractedFn, serverFn] = args;
			const newOptions = {
				...resolvedOptions,
				extractedFn,
				serverFn
			};
			const resolvedMiddleware = [...newOptions.middleware || [], serverFnBaseToMiddleware(newOptions)];
			extractedFn.method = resolvedOptions.method;
			return Object.assign(async (opts) => {
				const result = await executeMiddleware$1(resolvedMiddleware, "client", {
					...extractedFn,
					...newOptions,
					data: opts?.data,
					headers: opts?.headers,
					signal: opts?.signal,
					fetch: opts?.fetch,
					context: createNullProtoObject()
				});
				if ("error" in result) throw parseRedirect(result.error) ?? result.error;
				return result.result;
			}, {
				...extractedFn,
				method: resolvedOptions.method,
				__executeServer: async (opts) => {
					const startContext = getStartContextServerOnly();
					const serverContextAfterGlobalMiddlewares = startContext.contextAfterGlobalMiddlewares;
					const ctx = {
						...extractedFn,
						data: opts.data,
						method: opts.method ?? resolvedOptions.method,
						serverFnMeta: extractedFn.serverFnMeta,
						context: safeObjectMerge(opts.context, serverContextAfterGlobalMiddlewares),
						request: startContext.request
					};
					const result = await executeMiddleware$1(resolvedMiddleware, "server", ctx);
					if ("error" in result) return { error: result.error };
					return result.sendContext === void 0 ? { result: result.result } : {
						result: result.result,
						context: result.sendContext
					};
				}
			});
		}
	};
	const fun = (options) => {
		return createServerFn(void 0, {
			...resolvedOptions,
			...options
		});
	};
	return Object.assign(fun, res);
};
function mergeOptionalSendContext(target, source) {
	return target === void 0 && source === void 0 ? void 0 : safeObjectMerge(target, source);
}
function mergeOptionalHeaders(target, source) {
	return target || source ? mergeHeaders(target, source) : void 0;
}
async function executeMiddleware$1(middlewares, env, opts) {
	const flattenedMiddlewares = flattenMiddlewares((getStartOptions()?.functionMiddleware || []).concat(middlewares), void 0, env === "server" ? new Set(getStartContextServerOnly({ throwIfNotFound: false })?.executedRequestMiddlewares) : void 0);
	let index = 0;
	const callNextMiddleware = async (callerCtx, userCtx) => {
		let ctx = callerCtx;
		if (userCtx !== void 0) {
			ctx = {
				...callerCtx,
				...userCtx
			};
			ctx.context = safeObjectMerge(callerCtx.context, userCtx.context);
			ctx.sendContext = mergeOptionalSendContext(callerCtx.sendContext, userCtx.sendContext);
			ctx.headers = mergeOptionalHeaders(callerCtx.headers, userCtx.headers);
			ctx._callSiteFetch = callerCtx._callSiteFetch;
			ctx.fetch = callerCtx._callSiteFetch ?? userCtx.fetch ?? callerCtx.fetch;
			ctx.result = userCtx.result !== void 0 ? userCtx.result : userCtx instanceof Response ? userCtx : callerCtx.result;
		}
		let result = ctx;
		while (index < flattenedMiddlewares.length) {
			const options = flattenedMiddlewares[index++].options;
			const validator = options.validator;
			if (validator && env === "server") ctx.data = await execValidator(validator, ctx.data);
			const middlewareFn = env === "client" ? options.client : options.server;
			if (middlewareFn) {
				result = await middlewareFn({
					...ctx,
					next: (nextCtx = {}) => callNextMiddleware(ctx, nextCtx)
				});
				if (result instanceof Response) {
					if (isRedirect$1(result)) throw result;
					result = {
						...ctx,
						result
					};
				} else if (!result) throw new Error("User middleware returned undefined. You must call next() or return a result in your middlewares.");
				break;
			}
		}
		if ("error" in result) throw result.error;
		return result;
	};
	const initialCtx = {
		...opts,
		headers: opts.headers || (env === "client" ? {} : void 0),
		sendContext: opts.sendContext,
		context: opts.context || createNullProtoObject(),
		_callSiteFetch: opts.fetch
	};
	if (initialCtx.sendContext !== void 0) initialCtx.sendContext ||= {};
	try {
		return await callNextMiddleware(initialCtx);
	} catch (error) {
		return {
			...initialCtx,
			error
		};
	}
}
function flattenMiddlewares(middlewares, maxDepth = 100, seen = /* @__PURE__ */ new Set()) {
	const flattened = [];
	const recurse = (middleware, depth) => {
		if (depth > maxDepth) throw new Error(`Middleware nesting depth exceeded maximum of ${maxDepth}. Check for circular references.`);
		middleware.forEach((m) => {
			if (m.options.middleware) recurse(m.options.middleware, depth + 1);
			if (!seen.has(m)) {
				seen.add(m);
				flattened.push(m);
			}
		});
	};
	recurse(middlewares, 0);
	return flattened;
}
async function execValidator(validator, input) {
	if (validator == null) return {};
	if ("~standard" in validator) {
		const result = await validator["~standard"].validate(input);
		if (result.issues) throw new Error(JSON.stringify(result.issues, void 0, 2));
		return result.value;
	}
	if ("parse" in validator) return validator.parse(input);
	if (typeof validator === "function") return validator(input);
	throw new Error("Invalid validator type!");
}
function serverFnBaseToMiddleware(options) {
	return {
		"~types": void 0,
		options: {
			validator: options.validator,
			client: async ({ next, sendContext, fetch, ...ctx }) => {
				const payload = {
					...ctx,
					context: sendContext,
					fetch
				};
				return next(await options.extractedFn?.(payload));
			},
			server: async ({ next: _next, ...ctx }) => {
				const result = await options.serverFn?.(ctx);
				return {
					...ctx,
					result
				};
			}
		}
	};
}
// node_modules/@tanstack/start-client-core/dist/esm/createMiddleware.js
var createMiddleware = (options, __opts) => {
	const resolvedOptions = {
		type: "request",
		...__opts || options
	};
	return {
		options: resolvedOptions,
		middleware: (middleware) => {
			return createMiddleware({}, Object.assign(resolvedOptions, { middleware }));
		},
		validator: (validator) => {
			return createMiddleware({}, Object.assign(resolvedOptions, { validator }));
		},
		client: (client) => {
			return createMiddleware({}, Object.assign(resolvedOptions, { client }));
		},
		server: (server) => {
			return createMiddleware({}, Object.assign(resolvedOptions, { server }));
		}
	};
};
// node_modules/@tanstack/start-client-core/dist/esm/createCsrfMiddleware.js
var innerCreateCsrfMiddleware = (opts = {}) => {
	const continueRequest = (result, ctx) => {
		return isValidationResultAllowed(result, opts) ? ctx.next() : getFailureResponse(opts, ctx);
	};
	const validateRequest = (ctx) => {
		const result = validateCsrfRequest(opts, ctx);
		if (isPromise(result)) return result.then((result) => continueRequest(result, ctx));
		return continueRequest(result, ctx);
	};
	return createMiddleware().server((ctx) => {
		const csrfCtx = ctx;
		try {
			if (opts.filter) {
				const shouldValidate = opts.filter(csrfCtx);
				if (isPromise(shouldValidate)) return shouldValidate.then((shouldValidate) => shouldValidate ? validateRequest(csrfCtx) : ctx.next());
				if (!shouldValidate) return ctx.next();
			}
			return validateRequest(csrfCtx);
		} catch (error) {
			return Promise.reject(error);
		}
	});
};
var createCsrfMiddleware = innerCreateCsrfMiddleware;
function isValidationResultAllowed(result, opts) {
	return result === true || result === void 0 && opts.allowRequestsWithoutOriginCheck === true;
}
function validateCsrfRequest(opts, ctx) {
	const fetchSite = ctx.request.headers.get("Sec-Fetch-Site");
	if (fetchSite !== null) return matchValue(opts.secFetchSite ?? "same-origin", fetchSite, ctx);
	const origin = ctx.request.headers.get("Origin");
	if (origin !== null) {
		if (opts.origin) return matchValue(opts.origin, origin, ctx);
		return origin === new URL(ctx.request.url).origin;
	}
	const referer = ctx.request.headers.get("Referer");
	if (referer === null || opts.referer === false) return;
	if (typeof opts.referer === "function") return opts.referer(referer, ctx);
	if (opts.origin) {
		const refererOrigin = getOriginFromUrl(referer);
		return refererOrigin !== void 0 && matchValue(opts.origin, refererOrigin, ctx);
	}
	return isRefererSameOrigin(referer, new URL(ctx.request.url).origin);
}
function matchValue(matcher, value, ctx) {
	if (typeof matcher === "function") return matcher(value, ctx);
	if (Array.isArray(matcher)) return matcher.includes(value);
	return value === matcher;
}
function getOriginFromUrl(url) {
	try {
		return new URL(url).origin;
	} catch {
		return;
	}
}
function isRefererSameOrigin(referer, requestOrigin) {
	if (referer === requestOrigin) return true;
	if (!referer.startsWith(requestOrigin)) return false;
	if (referer.length === requestOrigin.length) return true;
	const code = referer.charCodeAt(requestOrigin.length);
	return code === 47 || code === 63 || code === 35;
}
function getFailureResponse(opts, ctx) {
	if (typeof opts.failureResponse === "function") return opts.failureResponse(ctx);
	return opts.failureResponse?.clone() ?? new Response("Forbidden", { status: 403 });
}
// node_modules/@tanstack/start-server-core/dist/esm/server-functions-handler.js
var SERIALIZED_JSON_HEADERS = /* @__PURE__ */ new Map([
	["content-type", "application/json"],
	[X_TSS_SERIALIZED, "true"],
	[X_TSS_RAW_RESPONSE, null],
	["location", null]
]);
var SERIALIZED_JSON_HEADER_INIT = new Headers({
	"content-type": "application/json",
	[X_TSS_SERIALIZED]: "true"
});
/** Completed bytes own no stream until the request pipeline accepts them. */
var DeferredResponse = class {
	constructor(body) {
		this.body = body;
	}
	createResponse(event) {
		return createFinalizedResponse(this.body, SERIALIZED_JSON_HEADER_INIT, SERIALIZED_JSON_HEADERS, event);
	}
};
var SERIALIZED_FRAMED_HEADERS = /* @__PURE__ */ new Map([
	["content-type", TSS_CONTENT_TYPE_FRAMED_VERSIONED],
	[X_TSS_SERIALIZED, "true"],
	[X_TSS_RAW_RESPONSE, null],
	["location", null]
]);
var NOT_FOUND_HEADERS = /* @__PURE__ */ new Map([
	["content-type", "application/json"],
	[X_TSS_SERIALIZED, null],
	[X_TSS_RAW_RESPONSE, null],
	["location", null]
]);
var RAW_RESPONSE_HEADERS = /* @__PURE__ */ new Map([[X_TSS_RAW_RESPONSE, "true"]]);
var THROWN_RESPONSE_HEADERS = /* @__PURE__ */ new Map([[X_TSS_RAW_RESPONSE, "thrown"]]);
var MAX_PAYLOAD_SIZE = 1e6;
var MAX_PENDING_SERIALIZATION_RECORDS = 1024;
var MAX_PENDING_SERIALIZATION_BYTES = 33554432;
var textEncoder = new TextEncoder();
function encodeSerializationRecord(value) {
	return textEncoder.encode(JSON.stringify(value));
}
function exceedsPendingSerializationLimit(record, recordCount, pendingBytes) {
	return recordCount >= MAX_PENDING_SERIALIZATION_RECORDS || pendingBytes + record.byteLength > MAX_PENDING_SERIALIZATION_BYTES;
}
function runSerializationCleanup(dispose) {
	try {
		dispose();
	} catch {}
}
function cancelRawStream(stream, reason) {
	stream.cancel(reason).catch(() => {});
}
/**
* Marks a Response thrown during a server-function request so the client
* rejects the call with it. Redirects keep their own protocol.
*/
function toThrownServerFnResponse(response) {
	return isRedirect(response) ? response : setProtectedResponseHeaders(response, THROWN_RESPONSE_HEADERS);
}
/**
* Builds the reply for a server-function request that failed outside the
* function, such as in request middleware. Like a failed call, it carries
* only the thrown value under an `error` key, so the client rethrows it.
*/
async function createServerFnErrorResponse(error, serovalPlugins) {
	if (isNotFound(error)) return isNotFoundResponse(error);
	const headers = getErrorHeaders(error) ?? new Headers();
	const { status, statusText } = resolveErrorResponseStatus(error);
	headers.set("Content-Type", "application/json");
	headers.set(X_TSS_SERIALIZED, "true");
	headers.delete(X_TSS_RAW_RESPONSE);
	headers.delete("location");
	const plugins = serovalPlugins ?? getSerovalPlugins(defaultSerovalDeserializerPlugins);
	let serializedError;
	try {
		serializedError = JSON.stringify(await toCrossJSONAsync({ error }, {
			refs: /* @__PURE__ */ new Map(),
			plugins
		}));
	} catch (serializationError) {
		serializedError = JSON.stringify(await toCrossJSONAsync({ error: serializationError }, {
			refs: /* @__PURE__ */ new Map(),
			plugins
		}));
	}
	const errorResponse = new Response(serializedError, {
		status,
		statusText,
		headers
	});
	protectResponseHeaders(errorResponse, SERIALIZED_JSON_HEADERS);
	return errorResponse;
}
var handleServerAction = async ({ request, serverFnId }) => {
	const methodUpper = request.method.toUpperCase();
	const action = await getServerFnById(serverFnId, { origin: "client" });
	if (action.method && methodUpper !== action.method) return new Response(`expected ${action.method} method. Got ${methodUpper}`, {
		status: 405,
		headers: { Allow: action.method }
	});
	const headers = request.headers;
	const isServerFn = headers.get("x-tsr-serverfn") === "true";
	let serovalPlugins;
	const getRequestSerovalPlugins = () => {
		return serovalPlugins ??= getSerovalPlugins(defaultSerovalDeserializerPlugins);
	};
	const contentType = headers.get("content-type");
	try {
		let res;
		if (contentType && (contentType.includes("multipart/form-data") || contentType.includes("application/x-www-form-urlencoded"))) {
			if (methodUpper === "GET") invariant();
			const formData = await request.formData();
			const serializedContext = formData.get(TSS_FORMDATA_CONTEXT);
			formData.delete(TSS_FORMDATA_CONTEXT);
			const params = {
				data: formData,
				method: methodUpper
			};
			if (typeof serializedContext === "string") try {
				const parsedContext = JSON.parse(serializedContext);
				const deserializedContext = fromJSON(parsedContext, { plugins: getRequestSerovalPlugins() });
				if (typeof deserializedContext === "object" && deserializedContext) params.context = deserializedContext;
			} catch (e) {}
			res = await action(params);
		} else {
			let json;
			if (methodUpper === "GET") {
				const payloadParam = getParsedRequestUrl(request).searchParams.get("payload");
				if (payloadParam && payloadParam.length > MAX_PAYLOAD_SIZE) throw new Error("Payload too large");
				json = payloadParam ? JSON.parse(payloadParam) : void 0;
			} else if (contentType?.includes("application/json")) json = await request.json();
			const payload = json === void 0 ? void 0 : fromJSON(json, { plugins: getRequestSerovalPlugins() });
			res = await action({
				data: payload?.data,
				context: payload?.context,
				method: methodUpper
			});
		}
		const failed = "error" in res;
		const unwrapped = failed ? res.error : res.result;
		if (!isServerFn && (unwrapped instanceof Response || unwrapped === null || typeof unwrapped !== "object")) return unwrapped;
		if (unwrapped instanceof Response) {
			if (failed) return toThrownServerFnResponse(unwrapped);
			if (isRedirect(unwrapped)) return unwrapped;
			return setProtectedResponseHeaders(unwrapped, RAW_RESPONSE_HEADERS);
		}
		return serializeResult(res, request, getRequestSerovalPlugins());
	} catch (error) {
		if (error instanceof Response) return error;
		return createServerFnErrorResponse(error, serovalPlugins);
	}
};
/**
* Serializes a server-function result. A result that Seroval completes
* synchronously without RawStreams becomes plain JSON; everything else is a
* framed response whose records and raw streams are multiplexed in order.
*/
function serializeResult(res, request, plugins) {
	const initialRecords = [];
	let initialBytes = 0;
	const pendingRawStreams = [];
	let done = false;
	let initialParsed = false;
	let serializationFailure;
	let disposeSerialization;
	let onParse = (value, initial) => {
		if (serializationFailure) return;
		initialParsed ||= initial;
		const record = encodeSerializationRecord(value);
		if (exceedsPendingSerializationLimit(record, initialRecords.length, initialBytes)) {
			serializationFailure = [/* @__PURE__ */ new Error("Server function serialization exceeded its pending output limit")];
			return;
		}
		initialRecords.push(record);
		initialBytes += record.byteLength;
	};
	let onDone = () => {
		if (initialParsed) done = true;
	};
	let onError = (error) => {
		serializationFailure ??= [error];
	};
	const rawStreamPlugin = createRawStreamRPCPlugin((id, stream) => {
		if (serializationFailure) {
			cancelRawStream(stream, serializationFailure[0]);
			return;
		}
		if (id > 1024) {
			const error = /* @__PURE__ */ new Error(`Too many raw streams in framed response (max ${MAX_FRAMED_STREAMS})`);
			cancelRawStream(stream, error);
			onError(error);
			return;
		}
		pendingRawStreams.push({
			id,
			stream
		});
	});
	const dispose = toCrossJSONStream(res, {
		refs: /* @__PURE__ */ new Map(),
		plugins: [rawStreamPlugin, ...plugins],
		onParse(value, initial) {
			onParse(value, initial);
		},
		onDone() {
			onDone();
		},
		onError: (error) => {
			onError(error);
		}
	});
	if (serializationFailure) {
		runSerializationCleanup(dispose);
		for (const registration of pendingRawStreams) cancelRawStream(registration.stream, serializationFailure[0]);
		throw serializationFailure[0];
	}
	if (!done) disposeSerialization = dispose;
	if (done && pendingRawStreams.length === 0 && initialRecords.length === 1) return new DeferredResponse(initialRecords[0]);
	if (done && initialRecords.length === 1) {
		const json = initialRecords[0];
		if (json.byteLength > 16777216) {
			const error = /* @__PURE__ */ new Error("Server function serialization exceeded its pending output limit");
			for (const registration of pendingRawStreams) cancelRawStream(registration.stream, error);
			throw error;
		}
		const rawStreams = pendingRawStreams.splice(0);
		initialRecords.length = 0;
		return createFramedResponse(new ReadableStream({
			start(controller) {
				controller.enqueue({
					json,
					rawStreams
				});
				controller.close();
			},
			cancel(reason) {
				for (const registration of rawStreams) cancelRawStream(registration.stream, reason);
			}
		}), { signal: request.signal });
	}
	const { readable, writable } = new TransformStream();
	const writer = writable.getWriter();
	const recordAbortController = new AbortController();
	let pendingBytes = 0;
	const pendingRecords = /* @__PURE__ */ new Set();
	const abortRecordStream = (error) => {
		if (serializationFailure) return;
		serializationFailure = [error];
		const disposeCurrentSerialization = disposeSerialization;
		disposeSerialization = void 0;
		for (const registration of pendingRawStreams.splice(0)) cancelRawStream(registration.stream, error);
		for (const record of pendingRecords) for (const registration of record.rawStreams) cancelRawStream(registration.stream, error);
		pendingRecords.clear();
		recordAbortController.abort(error);
		writer.abort(error).catch(() => {});
		if (disposeCurrentSerialization) runSerializationCleanup(disposeCurrentSerialization);
	};
	const writeRecord = (json, rawStreams) => {
		if (serializationFailure) {
			for (const registration of rawStreams) cancelRawStream(registration.stream, serializationFailure[0]);
			return false;
		}
		if (json.byteLength > 16777216 || exceedsPendingSerializationLimit(json, pendingRecords.size, pendingBytes)) {
			const error = /* @__PURE__ */ new Error("Server function serialization exceeded its pending output limit");
			for (const registration of rawStreams) cancelRawStream(registration.stream, error);
			onError(error);
			return false;
		}
		pendingBytes += json.byteLength;
		const record = {
			json,
			rawStreams
		};
		pendingRecords.add(record);
		writer.write(record).then(() => {
			pendingRecords.delete(record);
			pendingBytes -= json.byteLength;
		}, (error) => {
			const stillOwned = pendingRecords.delete(record);
			pendingBytes -= json.byteLength;
			if (stillOwned) for (const registration of rawStreams) cancelRawStream(registration.stream, error);
		});
		return true;
	};
	onParse = (value) => {
		if (serializationFailure) return;
		writeRecord(encodeSerializationRecord(value), pendingRawStreams.splice(0));
	};
	onDone = () => {
		if (serializationFailure) return;
		disposeSerialization = void 0;
		writer.close().catch(() => {});
	};
	onError = (error) => {
		abortRecordStream(error);
	};
	const initialRawStreams = pendingRawStreams.splice(0);
	for (let index = 0; index < initialRecords.length; index++) {
		const isLast = index === initialRecords.length - 1;
		if (!writeRecord(initialRecords[index], isLast ? initialRawStreams : [])) {
			if (!isLast) for (const registration of initialRawStreams) cancelRawStream(registration.stream, serializationFailure[0]);
			initialRecords.length = 0;
			throw serializationFailure[0];
		}
	}
	initialRecords.length = 0;
	if (done) onDone();
	writer.closed.catch((error) => {
		abortRecordStream(error);
	});
	return createFramedResponse(readable, {
		signal: AbortSignal.any([recordAbortController.signal, request.signal]),
		onCancel: abortRecordStream
	});
}
function createFramedResponse(records, options) {
	const multiplexedStream = createMultiplexedStream(records, options);
	const { status, statusText } = getSerializedResponseState();
	try {
		const response = new Response(multiplexedStream, {
			status,
			statusText,
			headers: {
				"Content-Type": TSS_CONTENT_TYPE_FRAMED_VERSIONED,
				[X_TSS_SERIALIZED]: "true"
			}
		});
		protectResponseHeaders(response, SERIALIZED_FRAMED_HEADERS);
		return response;
	} catch (error) {
		cancelRawStream(multiplexedStream, error);
		throw error;
	}
}
function isNotFoundResponse(error) {
	const { headers, ...rest } = error;
	let responseHeaders;
	if (headers) {
		const copiedHeaders = new Headers(headers);
		copiedHeaders.set("Content-Type", "application/json");
		copiedHeaders.delete(X_TSS_SERIALIZED);
		copiedHeaders.delete(X_TSS_RAW_RESPONSE);
		copiedHeaders.delete("location");
		responseHeaders = copiedHeaders;
	} else responseHeaders = { "Content-Type": "application/json" };
	const response = new Response(JSON.stringify(rest), {
		status: 404,
		headers: responseHeaders
	});
	protectResponseHeaders(response, NOT_FOUND_HEADERS);
	return response;
}
// node_modules/@tanstack/start-server-core/dist/esm/early-hints.js
var LINK_PARAM_TOKEN_RE = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;
var PRELOAD_AS_VALUES = /* @__PURE__ */ new Set([
	"fetch",
	"font",
	"image",
	"script",
	"style",
	"track"
]);
function buildLinkParam(name, value) {
	if (value === void 0) return name;
	if (LINK_PARAM_TOKEN_RE.test(value)) return `${name}=${value}`;
	return `${name}=${JSON.stringify(value)}`;
}
function serializeEarlyHint(hint) {
	const parts = [`<${hint.href}>`, buildLinkParam("rel", hint.rel)];
	if (hint.as) parts.push(buildLinkParam("as", hint.as));
	if (hint.crossOrigin !== void 0) parts.push(buildLinkParam("crossorigin", hint.crossOrigin || void 0));
	if (hint.type) parts.push(buildLinkParam("type", hint.type));
	if (hint.integrity) parts.push(buildLinkParam("integrity", hint.integrity));
	if (hint.referrerPolicy) parts.push(buildLinkParam("referrerpolicy", hint.referrerPolicy));
	if (hint.fetchPriority) parts.push(buildLinkParam("fetchpriority", hint.fetchPriority));
	return parts.join("; ");
}
function getStringAttr(attrs, name, fallbackName) {
	const value = attrs?.[name] ?? (fallbackName ? attrs?.[fallbackName] : void 0);
	return typeof value === "string" ? value : void 0;
}
function getPreloadAs(attrs) {
	const as = getStringAttr(attrs, "as");
	return as && PRELOAD_AS_VALUES.has(as) ? as : void 0;
}
function addEarlyHintFetchAttrs(hint, attrs) {
	const crossOrigin = getStringAttr(attrs, "crossOrigin", "crossorigin");
	const type = getStringAttr(attrs, "type");
	const integrity = getStringAttr(attrs, "integrity");
	const referrerPolicy = getStringAttr(attrs, "referrerPolicy", "referrerpolicy");
	const fetchPriority = getStringAttr(attrs, "fetchPriority", "fetchpriority");
	if (crossOrigin !== void 0) hint.crossOrigin = crossOrigin;
	if (type) hint.type = type;
	if (integrity) hint.integrity = integrity;
	if (referrerPolicy) hint.referrerPolicy = referrerPolicy;
	if (fetchPriority) hint.fetchPriority = fetchPriority;
}
function linkAttrsToEarlyHint(attrs) {
	const href = getStringAttr(attrs, "href");
	const rel = getStringAttr(attrs, "rel");
	if (!href || !rel) return void 0;
	const relTokens = rel.split(/\s+/);
	let hintRel;
	let hintAs;
	if (relTokens.includes("modulepreload")) {
		hintRel = "modulepreload";
		hintAs = "script";
	} else if (relTokens.includes("stylesheet")) {
		hintRel = "preload";
		hintAs = "style";
	} else if (relTokens.includes("preload")) {
		hintAs = getPreloadAs(attrs);
		if (!hintAs) return void 0;
		hintRel = "preload";
	} else if (relTokens.includes("preconnect")) {
		hintRel = "preconnect";
		hintAs = void 0;
	} else if (relTokens.includes("dns-prefetch")) {
		hintRel = "dns-prefetch";
		hintAs = void 0;
	}
	if (!hintRel) return void 0;
	const hint = {
		href,
		rel: hintRel
	};
	if (hintAs) hint.as = hintAs;
	addEarlyHintFetchAttrs(hint, attrs);
	return hint;
}
function collectStaticHintsFromManifest(manifest, matchedRoutes) {
	const hints = [];
	for (const route of matchedRoutes) {
		const routeManifest = manifest.routes[route.id];
		if (!routeManifest) continue;
		for (const link of routeManifest.preloads ?? []) {
			const attrs = getScriptPreloadAttrs(manifest, link);
			const hint = {
				href: attrs.href,
				rel: attrs.rel,
				as: "script"
			};
			addEarlyHintFetchAttrs(hint, attrs);
			hints.push(hint);
		}
		for (const link of routeManifest.css ?? []) {
			const stylesheetHref = getStylesheetHref(link);
			if (manifest.inlineCss?.styles[stylesheetHref] !== void 0) continue;
			const resolvedLink = resolveManifestCssLink(link);
			const hint = {
				href: stylesheetHref,
				rel: "preload",
				as: "style"
			};
			if (resolvedLink.crossOrigin !== void 0) hint.crossOrigin = resolvedLink.crossOrigin;
			hints.push(hint);
		}
	}
	return hints;
}
function collectDynamicHintsFromMatches(matches) {
	const hints = [];
	for (const match of matches) {
		const links = match.links;
		if (!Array.isArray(links)) continue;
		for (const link of links) {
			const hint = linkAttrsToEarlyHint(link);
			if (hint) hints.push(hint);
		}
	}
	return hints;
}
function createEarlyHintsEvent(opts) {
	const nextHints = [];
	const nextLinks = [];
	for (const hint of opts.hints) {
		const link = serializeEarlyHint(hint);
		if (opts.sentLinks.has(link)) continue;
		opts.sentLinks.add(link);
		opts.sentHints.push(hint);
		nextHints.push(hint);
		nextLinks.push(link);
	}
	if (!nextHints.length && opts.phase !== "dynamic") return void 0;
	return {
		phase: opts.phase,
		hints: nextHints,
		links: nextLinks,
		allHints: opts.sentHints.slice(),
		allLinks: Array.from(opts.sentLinks)
	};
}
function createResponseLinkHeaderEntries(opts) {
	for (const hint of opts.hints) {
		const link = serializeEarlyHint(hint);
		if (opts.sentLinks.has(link)) continue;
		opts.sentLinks.add(link);
		opts.entries.push({
			phase: opts.phase,
			hint,
			link
		});
	}
}
function getResponseLinkHeaderEntries(opts) {
	if (!opts.filter) return opts.entries.map((entry) => entry.link);
	try {
		const links = [];
		for (const entry of opts.entries) if (opts.filter(entry)) links.push(entry.link);
		return links;
	} catch (err) {
		console.error("Error filtering response Link headers:", err);
		return [];
	}
}
function notifyEarlyHints(phase, event, onEarlyHints) {
	try {
		const result = onEarlyHints(event);
		if (result) Promise.resolve(result).catch((err) => {
			console.error(`Error sending ${phase} early hints:`, err);
		});
	} catch (err) {
		console.error(`Error sending ${phase} early hints:`, err);
	}
}
function getResponseLinkHeaderFilter(responseLinkHeader) {
	if (typeof responseLinkHeader !== "object") return;
	return responseLinkHeader.filter;
}
function appendResponseLinkHeaders(opts) {
	for (const link of getResponseLinkHeaderEntries(opts)) opts.responseHeaders.append("Link", link);
}
function collectResponseLinkHeaderEntries(opts) {
	for (let index = 0; index < opts.event.hints.length; index++) opts.entries.push({
		phase: opts.phase,
		hint: opts.event.hints[index],
		link: opts.event.links[index]
	});
}
function collectEarlyHintsPhase(opts) {
	const event = opts.onEarlyHints ? createEarlyHintsEvent({
		phase: opts.phase,
		hints: opts.hints,
		sentLinks: opts.sentLinks,
		sentHints: opts.sentHints
	}) : void 0;
	if (event) notifyEarlyHints(opts.phase, event, opts.onEarlyHints);
	if (!opts.responseLinkHeaderEntries) return;
	if (event) {
		collectResponseLinkHeaderEntries({
			phase: opts.phase,
			event,
			entries: opts.responseLinkHeaderEntries
		});
		return;
	}
	createResponseLinkHeaderEntries({
		phase: opts.phase,
		hints: opts.hints,
		sentLinks: opts.sentLinks,
		entries: opts.responseLinkHeaderEntries
	});
}
function createEarlyHintsCollector(opts) {
	if (!opts?.onEarlyHints && !opts?.responseLinkHeader) return;
	const sentLinks = /* @__PURE__ */ new Set();
	const sentHints = opts.onEarlyHints ? new Array() : void 0;
	const responseLinkHeaderEntries = opts.responseLinkHeader ? new Array() : void 0;
	const responseLinkHeaderFilter = getResponseLinkHeaderFilter(opts.responseLinkHeader);
	return {
		collectStatic: ({ manifest, matchedRoutes }) => {
			if (!matchedRoutes?.length) return;
			collectEarlyHintsPhase({
				phase: "static",
				hints: collectStaticHintsFromManifest(manifest, matchedRoutes),
				sentLinks,
				sentHints,
				onEarlyHints: opts.onEarlyHints,
				responseLinkHeaderEntries
			});
		},
		collectDynamic: (matches) => {
			collectEarlyHintsPhase({
				phase: "dynamic",
				hints: collectDynamicHintsFromMatches(matches),
				sentLinks,
				sentHints,
				onEarlyHints: opts.onEarlyHints,
				responseLinkHeaderEntries
			});
		},
		appendResponseHeaders: (headers) => {
			if (!responseLinkHeaderEntries?.length) return;
			appendResponseLinkHeaders({
				responseHeaders: headers,
				entries: responseLinkHeaderEntries,
				filter: responseLinkHeaderFilter
			});
		}
	};
}
// node_modules/@tanstack/start-server-core/dist/esm/transformAssetUrls.js
function normalizeTransformAssetResult(result) {
	if (typeof result === "string") return { href: result };
	return result;
}
function escapeCssString(value) {
	return value.replace(/\\/g, "\\\\").replace(/"/g, "\\\"").replace(/\n/g, "\\a ").replace(/\r/g, "\\d ").replace(/\f/g, "\\c ");
}
async function transformInlineCssTemplate(options) {
	const { strings, urls } = options.template;
	if (strings.length !== urls.length + 1) throw new Error(`TanStack Start inlineCss template for ${options.stylesheetHref} is invalid`);
	let css = strings[0];
	for (let index = 0; index < urls.length; index++) {
		const transformed = normalizeTransformAssetResult(await options.transformFn({
			kind: "css-url",
			url: urls[index],
			stylesheetHref: options.stylesheetHref
		}));
		css += escapeCssString(transformed.href) + strings[index + 1];
	}
	return css;
}
async function transformInlineCssStyles(inlineCss, transformFn) {
	const transformedStyles = {};
	const transformedEntries = await Promise.all(Object.entries(inlineCss.styles).map(async ([stylesheetHref, css]) => {
		const template = inlineCss.templates?.[stylesheetHref];
		return [stylesheetHref, template ? await transformInlineCssTemplate({
			stylesheetHref,
			template,
			transformFn
		}) : css];
	}));
	for (const [stylesheetHref, css] of transformedEntries) transformedStyles[stylesheetHref] = css;
	return {
		styles: transformedStyles,
		...inlineCss.templates ? { templates: inlineCss.templates } : {}
	};
}
function resolveTransformAssetsCrossOrigin(config, kind) {
	if (!config) return void 0;
	if (typeof config === "string") return config;
	return config[kind];
}
function isObjectShorthand(transform) {
	return "prefix" in transform;
}
function resolveTransformAssetsConfig(transform) {
	if (typeof transform === "string") {
		const prefix = transform;
		return {
			type: "transform",
			transformFn: ({ url }) => ({ href: `${prefix}${url}` }),
			cache: true
		};
	}
	if (typeof transform === "function") return {
		type: "transform",
		transformFn: transform,
		cache: true
	};
	if (isObjectShorthand(transform)) {
		const { prefix, crossOrigin } = transform;
		return {
			type: "transform",
			transformFn: ({ url, kind }) => {
				const href = `${prefix}${url}`;
				if (kind === "css-url") return { href };
				const co = resolveTransformAssetsCrossOrigin(crossOrigin, kind);
				return co ? {
					href,
					crossOrigin: co
				} : { href };
			},
			cache: true
		};
	}
	if ("createTransform" in transform && transform.createTransform) return {
		type: "createTransform",
		createTransform: transform.createTransform,
		cache: transform.cache !== false
	};
	return {
		type: "transform",
		transformFn: typeof transform.transform === "string" ? (({ url }) => ({ href: `${transform.transform}${url}` })) : transform.transform,
		cache: transform.cache !== false
	};
}
function assignManifestLink(link, next) {
	if (typeof link === "string") return next.crossOrigin ? next : next.href;
	const nextLink = {
		...link,
		href: next.href
	};
	if (next.crossOrigin) nextLink.crossOrigin = next.crossOrigin;
	else delete nextLink.crossOrigin;
	return nextLink;
}
async function transformManifestAssets(source, transformFn, _opts) {
	const manifest = structuredClone(source);
	const inlineCssEnabled = _opts?.inlineCss !== false;
	const scriptTransforms = /* @__PURE__ */ new Map();
	const transformScript = (url) => {
		const cached = scriptTransforms.get(url);
		if (cached) return cached;
		const transformed = Promise.resolve(transformFn({
			url,
			kind: "script"
		})).then(normalizeTransformAssetResult);
		scriptTransforms.set(url, transformed);
		return transformed;
	};
	if (!inlineCssEnabled) delete manifest.inlineCss;
	else if (manifest.inlineCss) manifest.inlineCss = await transformInlineCssStyles(manifest.inlineCss, transformFn);
	for (const route of Object.values(manifest.routes)) {
		if (route.preloads?.length) route.preloads = await Promise.all(route.preloads.map(async (link) => {
			const resolved = resolveManifestAssetLink(link);
			const result = await transformScript(resolved.href);
			return assignManifestLink(link, {
				href: result.href,
				crossOrigin: result.crossOrigin
			});
		}));
		if (route.css?.length && !manifest.inlineCss) route.css = await Promise.all(route.css.map(async (link) => {
			const result = normalizeTransformAssetResult(await transformFn({
				url: resolveManifestCssLink(link).href,
				kind: "stylesheet"
			}));
			return assignManifestLink(link, {
				href: result.href,
				crossOrigin: result.crossOrigin
			});
		}));
		if (route.scripts?.length) for (const script of route.scripts) {
			const src = script.attrs?.src;
			if (typeof src !== "string") continue;
			const result = await transformScript(src);
			script.attrs = {
				...script.attrs,
				src: result.href
			};
			if (result.crossOrigin) script.attrs.crossOrigin = result.crossOrigin;
			else delete script.attrs.crossOrigin;
		}
	}
	return manifest;
}
/**
* Builds a final ServerManifest without URL transforms. Used when no
* transformAssets option is provided.
*
* Returns a new manifest object so the cached base manifest is never mutated.
*/
function buildManifest(source, opts) {
	return {
		...source.scriptFormat ? { scriptFormat: source.scriptFormat } : {},
		...opts?.inlineCss !== false && source.inlineCss ? { inlineCss: structuredClone(source.inlineCss) } : {},
		routes: { ...source.routes }
	};
}
// node_modules/@tanstack/start-server-core/dist/esm/inlineCss.js
/**
* The inline-CSS choice that needs no handler callback: a request override
* wins, then a static handler option, then the default. Undefined when a
* handler callback has to decide.
*/
function getStaticInlineCss(requestInlineCss, handlerInlineCss) {
	if (requestInlineCss !== void 0) return requestInlineCss;
	if (typeof handlerInlineCss === "function") return;
	return handlerInlineCss ?? true;
}
async function resolveInlineCssForRequest(opts) {
	const inlineCss = getStaticInlineCss(opts.requestInlineCss, opts.handlerInlineCss);
	if (inlineCss !== void 0) return inlineCss;
	return await opts.handlerInlineCss({ request: opts.request });
}
// node_modules/@tanstack/start-server-core/dist/esm/finalManifest.js
function createCachedBaseManifestLoader(loadBaseManifest) {
	let baseManifestPromise;
	return () => {
		if (!baseManifestPromise) baseManifestPromise = loadBaseManifest().catch((error) => {
			baseManifestPromise = void 0;
			throw error;
		});
		return baseManifestPromise;
	};
}
function createFinalManifestTransformResolver(transformAssets, opts) {
	const transformConfig = transformAssets !== void 0 ? resolveTransformAssetsConfig(transformAssets) : void 0;
	const cache = transformConfig ? transformConfig.cache : true;
	const warmup = !!transformAssets && typeof transformAssets === "object" && "warmup" in transformAssets && transformAssets.warmup === true;
	let cachedCreateTransformPromise;
	const clearCachedCreateTransform = () => {
		cachedCreateTransformPromise = void 0;
	};
	return {
		cache,
		warmup,
		clearCachedCreateTransform,
		getTransformFn: async (ctx) => {
			if (!transformConfig) return void 0;
			if (transformConfig.type !== "createTransform") return transformConfig.transformFn;
			if (!cache || !opts.cacheCreateTransform) return transformConfig.createTransform(ctx);
			if (!cachedCreateTransformPromise) cachedCreateTransformPromise = Promise.resolve(transformConfig.createTransform(ctx)).catch((error) => {
				clearCachedCreateTransform();
				throw error;
			});
			return cachedCreateTransformPromise;
		}
	};
}
function createFinalManifestResolver(opts) {
	const finalManifestCache = /* @__PURE__ */ new Map();
	const transformResolver = createFinalManifestTransformResolver(opts.transformAssets, { cacheCreateTransform: opts.cacheCreateTransform });
	const handlerDefaultInlineCss = getStaticInlineCss(void 0, opts.inlineCss);
	const getRequestManifestOptions = async (requestOpts) => {
		const transformFn = await transformResolver.getTransformFn({
			warmup: false,
			request: requestOpts.request
		});
		const inlineCss = await resolveInlineCssForRequest({
			request: requestOpts.request,
			handlerInlineCss: opts.inlineCss,
			requestInlineCss: requestOpts.requestInlineCss
		});
		return {
			getBaseManifest: requestOpts.getBaseManifest,
			transformFn,
			cache: transformResolver.cache,
			inlineCss
		};
	};
	const resolveRequest = async (requestOpts, cache) => {
		return resolveFinalManifest({
			...await getRequestManifestOptions(requestOpts),
			finalManifestCache: cache
		});
	};
	return {
		warmup: ({ getBaseManifest }) => warmupFinalManifest({
			enabled: transformResolver.warmup,
			handlerDefaultInlineCss,
			cache: transformResolver.cache,
			finalManifestCache,
			getBaseManifest,
			getTransformFn: () => transformResolver.getTransformFn({ warmup: true }),
			onError: transformResolver.clearCachedCreateTransform
		}),
		resolveCached: (requestOpts) => {
			const inlineCss = getStaticInlineCss(requestOpts.requestInlineCss, opts.inlineCss);
			if (transformResolver.cache && inlineCss !== void 0) {
				const cached = finalManifestCache.get(getFinalManifestCacheKey(inlineCss));
				if (cached) return cached;
			}
			return resolveRequest(requestOpts, finalManifestCache);
		},
		resolveUncached: (requestOpts) => resolveRequest(requestOpts, void 0)
	};
}
function getFinalManifestCacheKey(inlineCss) {
	return inlineCss ? "inline-css" : "linked-css";
}
function cacheFinalManifestPromise(finalManifestCache, cacheKey, promise) {
	const cachedPromise = promise.then((manifest) => {
		if (finalManifestCache.get(cacheKey) === cachedPromise) finalManifestCache.set(cacheKey, manifest);
		return manifest;
	}, (error) => {
		if (finalManifestCache.get(cacheKey) === cachedPromise) finalManifestCache.delete(cacheKey);
		throw error;
	});
	finalManifestCache.set(cacheKey, cachedPromise);
	return cachedPromise;
}
function getOrCreateCachedFinalManifest(finalManifestCache, cacheKey, computeFinalManifest) {
	const cached = finalManifestCache.get(cacheKey);
	if (cached) return cached;
	return cacheFinalManifestPromise(finalManifestCache, cacheKey, Promise.resolve().then(computeFinalManifest));
}
async function buildFinalManifest(opts) {
	return opts.transformFn ? await transformManifestAssets(opts.base, opts.transformFn, { inlineCss: opts.inlineCss }) : buildManifest(opts.base, { inlineCss: opts.inlineCss });
}
async function resolveFinalManifest(opts) {
	const computeFinalManifest = async () => {
		return buildFinalManifest({
			base: await opts.getBaseManifest(),
			transformFn: opts.transformFn,
			inlineCss: opts.inlineCss
		});
	};
	if (opts.finalManifestCache && (!opts.transformFn || opts.cache)) return getOrCreateCachedFinalManifest(opts.finalManifestCache, getFinalManifestCacheKey(opts.inlineCss), computeFinalManifest);
	return computeFinalManifest();
}
function warmupFinalManifest(opts) {
	if (!opts.enabled || opts.handlerDefaultInlineCss === void 0 || !opts.cache) return;
	const inlineCss = opts.handlerDefaultInlineCss;
	const warmupPromise = cacheFinalManifestPromise(opts.finalManifestCache, getFinalManifestCacheKey(inlineCss), Promise.resolve().then(async () => {
		const [base, transformFn] = await Promise.all([opts.getBaseManifest(), opts.getTransformFn()]);
		return buildFinalManifest({
			base,
			transformFn,
			inlineCss
		});
	}));
	if (opts.onError) warmupPromise.catch(opts.onError);
	return warmupPromise;
}
// node_modules/@tanstack/start-server-core/dist/esm/serializer/ServerFunctionSerializationAdapter.js
var ServerFunctionSerializationAdapter = createSerializationAdapter({
	key: "$TSS/serverfn",
	test: (v) => {
		if (typeof v !== "function") return false;
		if (!(TSS_SERVER_FUNCTION in v)) return false;
		return !!v[TSS_SERVER_FUNCTION];
	},
	toSerializable: ({ serverFnMeta }) => ({ functionId: serverFnMeta.id }),
	fromSerializable: ({ functionId }) => {
		const fn = async (opts, signal) => {
			const serverFn = await getServerFnById(functionId, { origin: "client" });
			const result = await serverFn({
				data: opts?.data,
				context: opts?.context,
				method: serverFn.method ?? "GET"
			}, signal);
			if ("error" in result) throw result.error;
			return result.result;
		};
		return fn;
	}
});
// node_modules/@tanstack/start-server-core/dist/esm/createStartHandler.js
function getStartResponseHeaders(router) {
	const headers = new Headers({ "content-type": "text/html; charset=utf-8" });
	const matches = _getRenderedMatches(router.stores.matches.get());
	return matches.some((match) => match.headers) ? mergeHeaders(headers, ...matches.map((match) => match.headers)) : headers;
}
var cachedEntries;
var defaultCsrfMiddleware = createCsrfMiddleware({ filter: (ctx) => ctx.handlerType === "serverFn" });
var getCachedBaseManifest = createCachedBaseManifestLoader(() => getStartManifest());
var getProdBaseManifest = () => getCachedBaseManifest();
var getBaseManifest = getProdBaseManifest;
var createEarlyHintsForRequest = createEarlyHintsCollector;
async function loadEntries() {
	const [routerEntry, startEntry, pluginAdapters] = await Promise.all([
		import("./router-WRr58D6C.js").then((n) => n.t),
		import("./start-D2LiVhbd.js"),
		import("./empty-plugin-adapters-CeyhLWeJ.js")
	]);
	return {
		routerEntry,
		startEntry,
		pluginAdapters
	};
}
function getEntries() {
	if (!cachedEntries) cachedEntries = loadEntries().then((entries) => {
		cachedEntries = entries;
		return entries;
	});
	return cachedEntries;
}
var ROUTER_BASEPATH = "/";
var SERVER_FN_BASE = "/_serverFn/";
var IS_PRERENDERING = process.env.TSS_PRERENDERING === "true";
var IS_SHELL_ENV = process.env.TSS_SHELL === "true";
var IS_DEV = false;
var ERR_NO_RESPONSE = IS_DEV ? `It looks like you forgot to return a response from your server route handler. If you want to defer to the app router, make sure to have a component set in this route.` : "Internal Server Error";
var ERR_NO_DEFER = IS_DEV ? `You cannot defer to the app router if there is no component defined on this route.` : "Internal Server Error";
function throwRouteHandlerError() {
	throw new Error(ERR_NO_RESPONSE);
}
function throwIfMayNotDefer() {
	throw new Error(ERR_NO_DEFER);
}
function getResponseFromResult(result) {
	return isSsrResponse(result) || result instanceof Response ? result : result?.response;
}
function disposeResponseResult(result, reason) {
	const response = getResponseFromResult(result);
	if (isSsrResponse(response) || response instanceof Response) disposeSsrResponse(response, reason);
}
/**
* A new body continues the owned one when it is the same stream, or when the
* owned body is already being read, as by a pipe, a tee, or a `Response` that
* copies a body by reading it (Bun, or a wrapped global `Response`). Start
* cannot tell such a reader from one that stops early, so it disposes only an
* unread body. A stream whose reader stops early ends with the request's abort
* or the SSR stream's lifetime limit.
*/
function inheritsResponseOwnership(ownership, body) {
	const ownedBody = ownership.response.body;
	return body === ownedBody || ownedBody.locked;
}
function disposeResponseOwnership(ownership, reason) {
	const { response, sourceBody, streamResponse } = ownership;
	streamResponse?.dispose(reason);
	if (!streamResponse || response.body !== sourceBody) response.body.cancel(reason).catch(() => {});
}
function getOwnedResponse(ownership) {
	const { response, sourceBody, streamResponse } = ownership;
	if (!streamResponse) return response;
	if (streamResponse.response === response && response.body === sourceBody) return streamResponse;
	if (response.body === sourceBody) return {
		...streamResponse,
		response
	};
	return {
		...streamResponse,
		response,
		dispose(reason) {
			disposeResponseOwnership(ownership, reason);
		}
	};
}
function createLateResponseDisposer(signal) {
	return (result) => disposeResponseResult(result, signal.reason);
}
/**
* Compose middleware around a terminal response handler. With no middleware
* the terminal runs directly.
*/
async function executeMiddleware(middlewares, terminal, ctx, signal, event, terminalNext) {
	let index = -1;
	let responseOwnership;
	let returnedDepth = Infinity;
	const disposeAbandonedResult = createLateResponseDisposer(signal);
	const adoptResponse = (exposed, streamResponse) => {
		const current = responseOwnership;
		const body = exposed instanceof Response ? exposed.body : null;
		const response = exposed;
		if (streamResponse && !body && streamResponse !== current?.streamResponse) streamResponse.dispose("Response body dropped by Start reconciliation");
		if (current && current.response === exposed) current.streamResponse ??= streamResponse;
		else if (current && body && inheritsResponseOwnership(current, body)) {
			if (body === current.response.body) transferResponseProtocol(current.response, response);
			current.response = response;
			current.streamResponse ??= streamResponse;
		} else {
			if (current) {
				responseOwnership = void 0;
				disposeResponseOwnership(current, "middleware response replaced");
			}
			responseOwnership = body ? {
				response,
				sourceBody: body,
				streamResponse
			} : void 0;
		}
		ctx.response = exposed;
	};
	const disposeCurrentBody = (reason) => {
		const current = responseOwnership;
		responseOwnership = void 0;
		if (current) disposeResponseOwnership(current, reason);
	};
	const setResponse = (response, caller) => {
		const owned = response !== void 0 && response === responseOwnership?.response;
		const ssrResponse = !owned && isSsrResponse(response) ? response : void 0;
		const exposed = ssrResponse ? ssrResponse.response : response;
		if (returnedDepth <= caller) {
			if (exposed !== ctx.response) disposeResponseResult(response, "late middleware response");
			return;
		}
		if (!owned) adoptResponse(exposed, ssrResponse?.serverSsrCleanup === "stream" ? ssrResponse : void 0);
		if (exposed instanceof Response) {
			const reconciled = reconcileResponse(exposed, event, disposeCurrentBody);
			if (reconciled !== exposed) adoptRebuilt(exposed, reconciled);
		}
	};
	const adoptRebuilt = (exposed, rebuilt) => {
		const current = responseOwnership;
		if (current?.response === exposed && rebuilt.body) {
			current.response = rebuilt;
			ctx.response = rebuilt;
		} else adoptResponse(rebuilt);
	};
	let nextPromise;
	function next(nextCtx) {
		const result = runNext(index, nextCtx);
		nextPromise = result;
		return result;
	}
	async function runNext(caller, nextCtx) {
		signal.throwIfAborted();
		if (nextCtx) {
			if (nextCtx.context) ctx.context = safeObjectMerge(ctx.context, nextCtx.context);
			const keys = Object.keys(nextCtx);
			for (let i = 0; i < keys.length; i++) {
				const key = keys[i];
				if (key === "response") setResponse(nextCtx.response, caller);
				else if (key !== "context") ctx[key] = nextCtx[key];
			}
		}
		const depth = ++index;
		const isTerminal = depth === middlewares.length;
		const middleware = depth < middlewares.length ? middlewares[depth] : isTerminal ? terminal : void 0;
		const middlewareNext = isTerminal && terminalNext ? terminalNext : next;
		if (!middleware) return ctx;
		let result;
		try {
			const pending = middleware({
				...ctx,
				next: middlewareNext
			});
			if (nextPromise && pending === nextPromise) {
				nextPromise = void 0;
				result = await pending;
				signal.throwIfAborted();
			} else if (!isPromise$1(pending)) {
				result = pending;
				signal.throwIfAborted();
			} else result = await waitForReason(pending, signal, disposeAbandonedResult, disposeAbandonedResult);
		} catch (err) {
			if (depth < returnedDepth) returnedDepth = depth;
			if (returnedDepth > caller) adoptResponse(ctx.response);
			if (signal.aborted) {
				if (result !== void 0) disposeAbandonedResult(result);
				if (err !== signal.reason) disposeAbandonedResult(err);
				throw signal.reason;
			}
			if (err instanceof Response) {
				setResponse(ctx.handlerType === "serverFn" ? toThrownServerFnResponse(err) : err, caller);
				return ctx;
			}
			throw err;
		}
		if (depth < returnedDepth) returnedDepth = depth;
		if (isTerminal && terminalNext && !result) throwRouteHandlerError();
		if (isTerminal && !terminalNext && result instanceof DeferredResponse) {
			if (returnedDepth > caller) {
				adoptResponse(void 0);
				adoptResponse(result.createResponse(event));
			}
			return ctx;
		}
		if (result && result !== ctx) {
			const response = getResponseFromResult(result);
			if (response !== void 0) {
				if (ctx.response !== responseOwnership?.response && ctx.response !== response && returnedDepth > caller) adoptResponse(ctx.response);
				setResponse(response, caller);
			} else setResponse(ctx.response, caller);
			if (returnedDepth > caller && response !== result && result.context && result.context !== ctx.context) ctx.context = safeObjectMerge(ctx.context, result.context);
		} else setResponse(ctx.response, caller);
		return ctx;
	}
	try {
		await runNext(-1);
		let response = ctx.response;
		if (!response) throwRouteHandlerError();
		if (signal.aborted) throw signal.reason;
		returnedDepth = -1;
		if (middlewares.length && ctx.handlerType === "serverFn") {
			const restored = restoreResponseProtocol(response, event);
			if (restored !== response) {
				adoptRebuilt(response, restored);
				response = restored;
			}
		}
		return responseOwnership ? getOwnedResponse(responseOwnership) : response;
	} catch (err) {
		returnedDepth = -1;
		if (responseOwnership) disposeResponseOwnership(responseOwnership, signal.aborted ? signal.reason : err);
		throw err;
	}
}
/**
* Creates the TanStack Start request handler.
*
* @example Backwards-compatible usage (handler callback only):
* ```ts
* export default createStartHandler(defaultStreamHandler)
* ```
*
* @example With CDN URL rewriting:
* ```ts
* export default createStartHandler({
*   handler: defaultStreamHandler,
*   transformAssets: 'https://cdn.example.com',
* })
* ```
*
* @example With per-request URL rewriting:
* ```ts
* export default createStartHandler({
*   handler: defaultStreamHandler,
*   transformAssets: {
*     transform: ({ url }) => {
*       const cdnBase = getRequest().headers.get('x-cdn-base') || ''
*       return { href: `${cdnBase}${url}` }
*     },
*     cache: false,
*   },
* })
* ```
*/
function createStartHandler(cbOrOptions) {
	const handlerOptions = typeof cbOrOptions === "function" ? {} : cbOrOptions;
	const cb = typeof cbOrOptions === "function" ? cbOrOptions : cbOrOptions.handler;
	const finalManifestResolver = createFinalManifestResolver({
		...handlerOptions,
		cacheCreateTransform: true
	});
	const resolveManifestForRequest = finalManifestResolver.resolveCached;
	finalManifestResolver.warmup({ getBaseManifest: () => getBaseManifest(void 0) });
	const startRequestResolver = async (request, requestOpts, event) => {
		const signal = request.signal;
		let router;
		let routerPromise;
		let responseOwnsCleanup = false;
		let response;
		try {
			signal.throwIfAborted();
			const requestUrl = event.requestUrl;
			let url = requestUrl;
			const pathname = url.pathname;
			if (!SERVER_FN_BASE || !pathname.startsWith(SERVER_FN_BASE) || pathname.includes("%") || pathname.startsWith("//")) {
				const normalized = getNormalizedURL(requestUrl);
				url = normalized.url;
				if (normalized.handledProtocolRelativeURL) return finalizeResponse(Response.redirect(url, 308), event);
			}
			const pendingEntries = getEntries();
			const entries = isPromise$1(pendingEntries) ? await waitForReason(pendingEntries, signal) : pendingEntries;
			const isServerFnRequest = !!SERVER_FN_BASE && url.pathname.startsWith(SERVER_FN_BASE);
			const startInstance = entries.startEntry.startInstance;
			let startOptions;
			if (startInstance) {
				const pendingStartOptions = startInstance.getOptions();
				startOptions = isPromise$1(pendingStartOptions) ? await waitForReason(pendingStartOptions, signal) : pendingStartOptions;
				signal.throwIfAborted();
			} else startOptions = {};
			const { hasPluginAdapters, pluginSerializationAdapters } = entries.pluginAdapters;
			const serializationAdapters = [
				...startOptions.serializationAdapters || [],
				...hasPluginAdapters ? pluginSerializationAdapters : [],
				ServerFunctionSerializationAdapter
			];
			const requestStartOptions = {
				...startOptions,
				requestMiddleware: startInstance ? startOptions.requestMiddleware : isServerFnRequest ? [defaultCsrfMiddleware] : void 0,
				serializationAdapters
			};
			const requestMiddleware = requestStartOptions.requestMiddleware;
			let executedRequestMiddlewares;
			let flattenedRequestMiddlewares = [];
			if (requestMiddleware?.length) {
				executedRequestMiddlewares = /* @__PURE__ */ new Set();
				flattenedRequestMiddlewares = flattenMiddlewares(requestMiddleware, void 0, executedRequestMiddlewares);
			}
			const getRouter = () => {
				routerPromise ??= (async () => {
					signal.throwIfAborted();
					const routerUrl = url === requestUrl ? getNormalizedURL(url).url : url;
					const pendingRouter = entries.routerEntry.getRouter();
					const requestRouter = isPromise$1(pendingRouter) ? await waitForReason(pendingRouter, signal) : pendingRouter;
					let isShell = IS_SHELL_ENV;
					if (IS_PRERENDERING && !isShell) isShell = request.headers.get(HEADERS.TSS_SHELL) === "true";
					const history = createServerHistory(routerUrl.pathname + routerUrl.search + routerUrl.hash);
					requestRouter.update({
						history,
						isShell,
						isPrerendering: IS_PRERENDERING,
						origin: requestRouter.options.origin ?? routerUrl.origin,
						defaultSsr: requestStartOptions.defaultSsr,
						serializationAdapters: requestRouter.options.serializationAdapters?.length ? [...requestStartOptions.serializationAdapters, ...requestRouter.options.serializationAdapters] : requestStartOptions.serializationAdapters,
						basepath: ROUTER_BASEPATH
					});
					router = requestRouter;
					return requestRouter;
				})();
				return routerPromise;
			};
			const handlerType = isServerFnRequest ? "serverFn" : "router";
			const startContext = {
				getRouter,
				startOptions: requestStartOptions,
				request,
				executedRequestMiddlewares,
				handlerType
			};
			let terminal;
			if (isServerFnRequest) {
				const serverFnId = url.pathname.slice(SERVER_FN_BASE.length).split("/")[0];
				if (!serverFnId) throw new Error("Invalid server action param for serverFnId");
				terminal = ({ context }) => runWithStartContext({
					...startContext,
					contextAfterGlobalMiddlewares: context
				}, () => handleServerAction({
					request,
					serverFnId
				}));
			} else {
				const executeRouter = async (serverContext, matchedRoutes, routerInstance) => {
					if (!/(^|,)\s*(\*\/\*|text\/html)/.test(request.headers.get("Accept") || "*/*")) return normalizeSsrResponse(Response.json({ error: "Only HTML requests are supported here" }, { status: 406 }));
					const pendingManifest = resolveManifestForRequest({
						request,
						requestInlineCss: requestOpts?.inlineCss,
						getBaseManifest: () => getBaseManifest(matchedRoutes)
					});
					const manifest = isPromise$1(pendingManifest) ? await waitForReason(pendingManifest, signal) : pendingManifest;
					const earlyHints = createEarlyHintsForRequest(requestOpts);
					earlyHints?.collectStatic({
						manifest,
						matchedRoutes
					});
					const storedStartContext = getStartContext({ throwIfNotFound: false });
					attachRouterServerSsrUtils({
						router: routerInstance,
						manifest,
						getRequestAssets: () => storedStartContext?.requestAssets
					});
					routerInstance.options.additionalContext = { serverContext };
					await routerInstance.load({
						_signal: signal,
						_skipLocationUpdate: true
					});
					signal.throwIfAborted();
					if (routerInstance._serverResult?.type === "redirect") return normalizeSsrResponse(routerInstance._serverResult.redirect);
					earlyHints?.collectDynamic(_getRenderedMatches(routerInstance.stores.matches.get()));
					await routerInstance.serverSsr.dehydrate({
						requestAssets: storedStartContext?.requestAssets,
						signal
					});
					signal.throwIfAborted();
					const responseHeaders = getStartResponseHeaders(routerInstance);
					earlyHints?.appendResponseHeaders(responseHeaders);
					signal.throwIfAborted();
					return normalizeSsrResponse(await cb({
						request,
						router: routerInstance,
						responseHeaders
					}));
				};
				terminal = ({ context }) => runWithStartContext({
					...startContext,
					contextAfterGlobalMiddlewares: context
				}, () => handleServerRoutes({
					getRouter,
					request,
					executeRouter,
					context,
					executedRequestMiddlewares,
					signal,
					event
				}));
			}
			const middlewareCtx = {
				request,
				pathname: url.pathname,
				handlerType,
				context: createNullProtoObject(requestOpts?.context)
			};
			let middlewareResponse;
			try {
				if (!isServerFnRequest && flattenedRequestMiddlewares.length === 0) middlewareResponse = await terminal(middlewareCtx);
				else middlewareResponse = await executeMiddleware(flattenedRequestMiddlewares.map((d) => d.options.server), terminal, middlewareCtx, signal, event);
			} catch (error) {
				if (signal.aborted) throw error;
				if (error instanceof Response) middlewareResponse = reconcileResponse(error, event);
				else if (!isServerFnRequest) throw error;
				else {
					const disposeLate = createLateResponseDisposer(signal);
					middlewareResponse = await waitForReason(runWithStartContext({
						...startContext,
						contextAfterGlobalMiddlewares: middlewareCtx.context
					}, () => createServerFnErrorResponse(error)), signal, disposeLate, disposeLate);
					middlewareResponse = reconcileResponse(middlewareResponse, event);
				}
			}
			let result;
			try {
				result = normalizeSsrResponse(middlewareResponse);
				if (isRedirect(result.response)) result = await handleRedirectResponse(result, getRouter, signal, isServerFnRequest && request.headers.get("x-tsr-serverFn") === "true", event);
				if (request.method === "HEAD" && result.response.body !== null) {
					const source = result.response;
					result = stripSsrResponseBody(result, "HEAD body stripped");
					transferResponseMetadata(source, result.response);
				}
			} catch (error) {
				disposeResponseResult(middlewareResponse, signal.aborted ? signal.reason : error);
				throw error;
			}
			bindSsrResponseToRequest(router, result, signal);
			signal.throwIfAborted();
			responseOwnsCleanup = result.serverSsrCleanup === "stream";
			response = result.response;
		} finally {
			if (router?.serverSsr && !responseOwnsCleanup) {
				router.serverSsr.cleanup();
				if (response) response = finalizeResponse(response, event);
			}
		}
		return response;
	};
	return withStartRequest(startRequestResolver);
}
var relativeRedirectProtocols = /* @__PURE__ */ new Set();
var SERIALIZED_REDIRECT_HEADERS = /* @__PURE__ */ new Map([
	["content-type", "application/json"],
	["location", null],
	[X_TSS_RAW_RESPONSE, null],
	[X_TSS_SERIALIZED, null]
]);
async function handleRedirectResponse(ssrResponse, getRouter, signal, serializeRedirect, event) {
	signal.throwIfAborted();
	const redirect = ssrResponse.response;
	if (!isRedirect(redirect)) return ssrResponse;
	const opts = redirect.options;
	const href = redirect.headers.get("Location") || opts.href;
	if (!href && opts.to && typeof opts.to === "string" && !opts.to.startsWith("/")) throw new Error(`Server side redirects must use absolute paths via the 'href' or 'to' options. The redirect() method's "to" property accepts an internal path only. Use the "href" property to provide an external URL. Received: ${JSON.stringify(opts)}`);
	if (!href && [
		"params",
		"search",
		"hash"
	].some((d) => typeof opts[d] === "function")) throw new Error(`Server side redirects must use static search, params, and hash values and do not support functional values. Received functional values for: ${Object.keys(opts).filter((d) => typeof opts[d] === "function").map((d) => `"${d}"`).join(", ")}`);
	signal.throwIfAborted();
	if (href && !isDangerousProtocol(href, relativeRedirectProtocols)) {
		opts.href = href;
		redirect.headers.set("Location", href);
	} else {
		const router = await getRouter();
		signal.throwIfAborted();
		router.resolveRedirect(redirect);
	}
	if (serializeRedirect) {
		const redirectOptions = { ...opts };
		delete redirectOptions.headers;
		redirectOptions.isSerializedRedirect = true;
		const responseHeaders = new Headers(redirect.headers);
		responseHeaders.set("content-type", "application/json");
		responseHeaders.delete("location");
		responseHeaders.delete(X_TSS_RAW_RESPONSE);
		responseHeaders.delete(X_TSS_SERIALIZED);
		const body = JSON.stringify(redirectOptions);
		if (body === void 0) throw new TypeError("Value is not JSON serializable");
		disposeSsrResponse(ssrResponse, "redirect response replaced");
		return {
			response: createFinalizedResponse(body, responseHeaders, SERIALIZED_REDIRECT_HEADERS, event),
			serverSsrCleanup: "none"
		};
	}
	ssrResponse.response = finalizeResponse(redirect, event);
	return ssrResponse;
}
function withParsedParams(handler, matchedRoutes) {
	if (!matchedRoutes.some((route) => route.options.params?.parse ?? route.options.parseParams)) return handler;
	return (ctx) => {
		const params = Object.assign(Object.create(null), ctx.params);
		for (const route of matchedRoutes) {
			const parse = route.options.params?.parse ?? route.options.parseParams;
			if (parse) Object.assign(params, parse(params));
		}
		return handler({
			...ctx,
			params
		});
	};
}
async function handleServerRoutes({ getRouter, request, executeRouter, context, executedRequestMiddlewares, signal, event }) {
	const router = await getRouter();
	const { pathname } = router.latestLocation;
	const [matchedRoutes, rawParams, foundRoute] = router.getMatchedRoutes(pathname);
	const isExactMatch = foundRoute && rawParams["**"] === void 0;
	const routeMiddlewares = [];
	let terminalHandler = (ctx) => executeRouter(ctx.context, matchedRoutes, router);
	let terminalNext;
	for (const route of matchedRoutes) {
		const serverMiddleware = route.options.server?.middleware;
		if (serverMiddleware) {
			const flattened = flattenMiddlewares(serverMiddleware);
			for (const m of flattened) if (!executedRequestMiddlewares?.has(m)) routeMiddlewares.push(m.options.server);
		}
	}
	const server = foundRoute?.options.server;
	if (server?.handlers && isExactMatch) {
		const handlers = typeof server.handlers === "function" ? server.handlers({ createHandlers: (d) => d }) : server.handlers;
		const requestMethod = request.method.toUpperCase();
		const handler = requestMethod === "HEAD" ? handlers["HEAD"] ?? handlers["GET"] ?? handlers["ANY"] : handlers[requestMethod] ?? handlers["ANY"];
		if (handler) {
			const mayDefer = !!foundRoute.options.component;
			if (typeof handler !== "function") {
				if (handler.middleware?.length) {
					const handlerMiddlewares = flattenMiddlewares(handler.middleware);
					for (const m of handlerMiddlewares) routeMiddlewares.push(m.options.server);
				}
			}
			const routeHandler = typeof handler === "function" ? handler : handler.handler;
			if (routeHandler) {
				const parsedHandler = withParsedParams(routeHandler, matchedRoutes);
				if (!mayDefer) {
					terminalHandler = parsedHandler;
					terminalNext = throwIfMayNotDefer;
				} else routeMiddlewares.push(parsedHandler);
			}
		}
	}
	const response = await executeMiddleware(routeMiddlewares, terminalHandler, {
		request,
		context,
		params: rawParams,
		pathname,
		handlerType: "router"
	}, signal, event, terminalNext);
	return normalizeSsrResponse(response);
}
// node_modules/@tanstack/react-start/dist/default-entry/esm/server.js
var server_exports = /* @__PURE__ */ __exportAll({
	createServerEntry: () => createServerEntry,
	default: () => server_default
});
var fetch = createStartHandler(defaultStreamHandler);
var createServerEntry = createServerEntry$1;
var server_default = createServerEntry({ fetch });
export { TSS_SERVER_FUNCTION as a, createServerEntry, server_default as default, createServerFn as i, createCsrfMiddleware as n, getServerFnById as o, createMiddleware as r, getRequest as s, server_exports as t };

//# sourceMappingURL=server-BgZ4iWFx.js.map