import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 60 seconds memory cache
        gcTime: 10 * 60 * 1000, // 10 minutes garbage collection
        refetchOnWindowFocus: false, // Prevents sudden refetches when switching browser tabs
      },
    },
  });

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreload: false,
    defaultPreloadDelay: 200,
    defaultPreloadStaleTime: 60 * 1000,
  });

  return router;
};
