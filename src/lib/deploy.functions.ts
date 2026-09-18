import { createServerFn } from "@tanstack/react-start";
import {
  executeGetGitStatusCore,
  executeGitPullCore,
  executeBuildProjectCore,
  executeGetDeployHistoryCore,
  executeGetDeployLogCore,
  executeInitializeGitRepoCore,
} from "./deploy.server";

export const getGitStatus = createServerFn({ method: "GET" })
  .validator((d?: { forceRefresh?: boolean }) => d)
  .handler(async ({ data }) => {
    return await executeGetGitStatusCore(data?.forceRefresh);
  });

export const gitPull = createServerFn({ method: "POST" }).handler(async () => {
  return await executeGitPullCore();
});

export const buildProject = createServerFn({ method: "POST" }).handler(async () => {
  return await executeBuildProjectCore();
});

export const getDeployHistory = createServerFn({ method: "GET" }).handler(async () => {
  return await executeGetDeployHistoryCore();
});

export const getDeployLog = createServerFn({ method: "GET" })
  .validator((id: number) => id)
  .handler(async ({ data: id }) => {
    return await executeGetDeployLogCore(id);
  });

export const initializeGitRepo = createServerFn({ method: "POST" }).handler(async () => {
  return await executeInitializeGitRepoCore();
});
