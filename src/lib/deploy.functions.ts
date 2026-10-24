import { createServerFn } from "@tanstack/react-start";
import {
  executeGetGitStatusCore,
  executeGitPullCore,
  executeBuildProjectCore,
  executePatchDependenciesCore,
  executeGetDeployHistoryCore,
  executeGetDeployLogCore,
  executeInitializeGitRepoCore,
} from "./deploy.server";
import { requireAdmin } from "./auth-middleware";
import { attachAuth } from "./auth-attacher";

export const patchDependencies = createServerFn({ method: "POST" })
  .middleware([attachAuth, requireAdmin])
  .handler(async () => {
    return await executePatchDependenciesCore();
  });

export const getGitStatus = createServerFn({ method: "GET" })
  .middleware([attachAuth, requireAdmin])
  .validator((d?: { forceRefresh?: boolean }) => d)
  .handler(async ({ data }) => {
    return await executeGetGitStatusCore(data?.forceRefresh);
  });

export const gitPull = createServerFn({ method: "POST" })
  .middleware([attachAuth, requireAdmin])
  .handler(async () => {
    return await executeGitPullCore();
  });

export const buildProject = createServerFn({ method: "POST" })
  .middleware([attachAuth, requireAdmin])
  .handler(async () => {
    return await executeBuildProjectCore();
  });

export const getDeployHistory = createServerFn({ method: "GET" })
  .middleware([attachAuth, requireAdmin])
  .handler(async () => {
    return await executeGetDeployHistoryCore();
  });

export const getDeployLog = createServerFn({ method: "GET" })
  .middleware([attachAuth, requireAdmin])
  .validator((id: number) => id)
  .handler(async ({ data: id }) => {
    return await executeGetDeployLogCore(id);
  });

export const initializeGitRepo = createServerFn({ method: "POST" })
  .middleware([attachAuth, requireAdmin])
  .handler(async () => {
    return await executeInitializeGitRepoCore();
  });
