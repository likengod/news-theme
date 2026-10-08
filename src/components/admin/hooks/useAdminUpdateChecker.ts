import { useState, useEffect } from "react";
import { getGitStatus } from "@/lib/deploy.functions";
import { APP_VERSION } from "@/lib/version";

export interface AdminUpdateStatus {
  hasUpdate: boolean;
  currentVersion?: string;
  latestVersion?: string;
  checked: boolean;
}

export function useAdminUpdateChecker(pathname: string) {
  const [updateStatus, setUpdateStatus] = useState<AdminUpdateStatus>({
    hasUpdate: false,
    checked: false,
  });

  const [dismissed, setDismissed] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return (
        sessionStorage.getItem("admin_update_dismissed") === "1" ||
        localStorage.getItem("admin_update_dismissed") === "1"
      );
    }
    return false;
  });

  const handleDismiss = () => {
    setDismissed(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("admin_update_dismissed", "1");
      localStorage.setItem("admin_update_dismissed", "1");
    }
  };

  useEffect(() => {
    let mounted = true;

    const syncFromSession = () => {
      if (typeof window !== "undefined") {
        try {
          const cached = sessionStorage.getItem("admin_update_status");
          if (cached) {
            const parsed = JSON.parse(cached);
            if (
              parsed.currentVersion &&
              parsed.latestVersion &&
              parsed.currentVersion === parsed.latestVersion &&
              (!parsed.behind || parsed.behind <= 0)
            ) {
              parsed.hasUpdate = false;
            }
            setUpdateStatus(parsed);
          }
        } catch {}
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("admin_update_synced", syncFromSession);
    }

    // Check if cached update status exists in this session
    if (typeof window !== "undefined") {
      const lastCheck = sessionStorage.getItem("admin_update_check_time");
      const cachedStatus = sessionStorage.getItem("admin_update_status");
      // Only trust cache if checked recently and NOT on the updates page
      if (
        lastCheck &&
        cachedStatus &&
        Date.now() - parseInt(lastCheck) < 3 * 60 * 1000 &&
        pathname !== "/admin/updates"
      ) {
        try {
          const parsed = JSON.parse(cachedStatus);
          if (
            parsed.currentVersion &&
            parsed.latestVersion &&
            parsed.currentVersion === parsed.latestVersion &&
            (!parsed.behind || parsed.behind <= 0)
          ) {
            parsed.hasUpdate = false;
          }
          setUpdateStatus(parsed);
          return () => {
            mounted = false;
            if (typeof window !== "undefined") {
              window.removeEventListener("admin_update_synced", syncFromSession);
            }
          };
        } catch {}
      }
    }

    getGitStatus({ data: { forceRefresh: pathname === "/admin/updates" } })
      .then((res) => {
        if (!mounted) return;
        const cur = res?.version || APP_VERSION;
        const latest = res?.latestVersion || cur;
        const isSimulated =
          typeof window !== "undefined" &&
          (new URLSearchParams(window.location.search).get("test_update") === "1" ||
            localStorage.getItem("force_update_lock") === "1");
        const hasUpdate =
          isSimulated ||
          (cur !== latest &&
            Boolean(res?.hasNewVersion || (res?.behind && res.behind > 0)));
        const statusObj: AdminUpdateStatus = {
          hasUpdate,
          currentVersion: cur,
          latestVersion: isSimulated
            ? res?.latestVersion && res.latestVersion !== cur
              ? res.latestVersion
              : "v2.0.0"
            : latest,
          checked: true,
        };
        setUpdateStatus(statusObj);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("admin_update_status", JSON.stringify(statusObj));
          sessionStorage.setItem("admin_update_check_time", Date.now().toString());
        }
      })
      .catch((e) => {
        console.error("Version check notice:", e);
      });

    return () => {
      mounted = false;
      if (typeof window !== "undefined") {
        window.removeEventListener("admin_update_synced", syncFromSession);
      }
    };
  }, [pathname]);

  return {
    updateStatus,
    dismissed,
    setDismissed: handleDismiss,
  };
}
