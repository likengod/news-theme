import { createStart, createMiddleware, createCsrfMiddleware } from "@tanstack/react-start";
import { isRedirect, isNotFound } from "@tanstack/react-router";

import { renderErrorPage } from "./lib/error-page";
import { attachAuth } from "@/lib/auth-attacher";

const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === "serverFn",
});

const errorMiddleware = createMiddleware().server(async ({ next, ...rest }: any) => {
  try {
    return await next();
  } catch (error: any) {
    if (
      isRedirect(error) ||
      isNotFound(error) ||
      error instanceof Response ||
      (error != null &&
        typeof error === "object" &&
        ("statusCode" in error ||
          "status" in error ||
          "isRedirect" in error ||
          "isNotFound" in error ||
          "headers" in error))
    ) {
      throw error;
    }

    const handlerType = rest?.handlerType;
    const request = rest?.request;
    const url = request?.url || "";
    const isServerFn =
      handlerType === "serverFn" ||
      url.includes("/_serverFn") ||
      url.includes("_serverFn=") ||
      request?.headers?.get("x-tss-server-function") != null;

    if (isServerFn) {
      console.error("[Start Error Middleware: serverFn error]", error);
      throw error;
    }

    console.error("[Start Error Middleware]", error);
    return new Response(renderErrorPage(error?.message), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

export const startInstance = createStart(() => ({
  functionMiddleware: [attachAuth],
  requestMiddleware: [csrfMiddleware, errorMiddleware],
}));
