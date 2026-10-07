/**
 * Formats user initials and greeting first name safely from session user metadata.
 */
export function getAdminUserDisplayInfo(user: any) {
  const email: string = user?.email ?? "admin@northeast.com";
  const initials: string = email.slice(0, 2).toUpperCase();

  const rawName: string | undefined =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.name ||
    user?.display_name;

  if (rawName && typeof rawName === "string" && rawName.trim()) {
    return {
      email,
      initials,
      firstName: rawName.trim().split(" ")[0],
    };
  }

  if (email && email.includes("@")) {
    const local = email
      .split("@")[0]
      .replace(/[._0-9-]/g, " ")
      .trim();
    const first = local.split(" ")[0];
    if (first) {
      return {
        email,
        initials,
        firstName: first.charAt(0).toUpperCase() + first.slice(1),
      };
    }
  }

  return {
    email,
    initials,
    firstName: "Admin",
  };
}
