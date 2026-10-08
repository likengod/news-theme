import React, { type ReactNode } from "react";
import { HeadContent, Scripts } from "@tanstack/react-router";
import { themeInitScript } from "@/lib/theme";

export const chunkRecoveryScript = `(function(){function h(e){try{var m=(e&&(e.message||(e.reason&&e.reason.message)||String(e.reason||e)))||'';if(/failed to fetch dynamically imported module/i.test(m)||/importing a module script failed/i.test(m)||/loading chunk/i.test(m)||/does not provide an export named/i.test(m)||/The requested module/i.test(m)||/ChunkLoadError/i.test(m)||/SyntaxError/i.test(m)||/Unexpected (?:end of input|token)/i.test(m)||/error #418/i.test(m)||/error #423/i.test(m)||/error #425/i.test(m)){var k='chunk_reload_ts',l=Number(sessionStorage.getItem(k)||0),n=Date.now();if(n-l>5000){sessionStorage.setItem(k,String(n));if('caches' in window){caches.keys().then(function(ks){for(var i=0;i<ks.length;i++)caches.delete(ks[i])}).catch(function(){});}window.location.reload();}}}catch(x){}}window.addEventListener('vite:preloadError',function(ev){try{if(ev&&ev.preventDefault)ev.preventDefault();var k='chunk_reload_ts',l=Number(sessionStorage.getItem(k)||0),n=Date.now();if(n-l>5000){sessionStorage.setItem(k,String(n));window.location.reload();}}catch(x){}});window.addEventListener('error',h);window.addEventListener('unhandledrejection',h);})();`;

export function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="overflow-x-clip max-w-full">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script dangerouslySetInnerHTML={{ __html: chunkRecoveryScript }} />
        <HeadContent />
      </head>
      <body className="overflow-x-clip max-w-full min-h-screen">
        {children}
        <Scripts />
      </body>
    </html>
  );
}
