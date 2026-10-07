import React, { type ReactNode } from "react";
import { HeadContent, Scripts } from "@tanstack/react-router";
import { themeInitScript } from "@/lib/theme";

export const chunkRecoveryScript = `
(function() {
  function handleChunkError(err) {
    try {
      var msg = (err && (err.message || (err.reason && err.reason.message) || String(err.reason || err))) || '';
      if (/failed to fetch dynamically imported module/i.test(msg) || 
          /importing a module script failed/i.test(msg) || 
          /loading chunk/i.test(msg) || 
          /error #418/i.test(msg) ||
          /error #423/i.test(msg) ||
          /error #425/i.test(msg)) {
        var key = 'chunk_reload_ts';
        var last = Number(sessionStorage.getItem(key) || 0);
        var now = Date.now();
        if (now - last > 10000) {
          sessionStorage.setItem(key, String(now));
          window.location.reload();
        }
      }
    } catch(e) {}
  }
  window.addEventListener('vite:preloadError', function(event) {
    try {
      if (event && event.preventDefault) event.preventDefault();
      var key = 'chunk_reload_ts';
      var last = Number(sessionStorage.getItem(key) || 0);
      var now = Date.now();
      if (now - last > 10000) {
        sessionStorage.setItem(key, String(now));
        window.location.reload();
      }
    } catch(e) {}
  });
  window.addEventListener('error', handleChunkError);
  window.addEventListener('unhandledrejection', handleChunkError);
})();
`;

export function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="overflow-x-clip max-w-full">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <HeadContent />
      </head>
      <body className="overflow-x-clip max-w-full min-h-screen">
        {children}
        <script dangerouslySetInnerHTML={{ __html: chunkRecoveryScript }} />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var ls=document.querySelectorAll('link[media="print"]');for(var i=0;i<ls.length;i++){ls[i].media='all';}})();`,
          }}
        />
        <Scripts />
      </body>
    </html>
  );
}
