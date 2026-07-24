import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async () => {
  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
  const email = "admin@demo.com";
  const password = "Demo@Admin#2026NE";

  const { data: list } = await admin.auth.admin.listUsers();
  let user = list.users.find((u) => u.email === email);

  if (!user) {
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { display_name: "Demo Admin", username: "admin", first_name: "Demo", last_name: "Admin" },
    });
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    user = data.user!;
  } else {
    await admin.auth.admin.updateUserById(user.id, { password, email_confirm: true });
  }

  await admin.from("user_roles").upsert({ user_id: user.id, role: "admin" }, { onConflict: "user_id,role" });

  return new Response(JSON.stringify({ ok: true, user_id: user.id }), {
    headers: { "content-type": "application/json" },
  });
});