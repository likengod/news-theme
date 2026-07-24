import { createFileRoute } from "@tanstack/react-router";
import { query, hashPassword } from "@/lib/db.server";
import crypto from "crypto";

export const Route = createFileRoute("/api/public/seed-demo-admin")({
  server: {
    handlers: {
      POST: async () => {
        try {
          const email = "admin@demo.com";
          const password = "Demo@Admin#2026NE";
          const passHash = hashPassword(password);
          const name = "Demo Admin";

          let users = await query("SELECT id FROM users WHERE email = ?", [email]);
          let userId = "";

          if (users.length === 0) {
            userId = crypto.randomUUID();
            await query(
              "INSERT INTO users (id, email, password_hash, display_name) VALUES (?, ?, ?, ?)",
              [userId, email, passHash, name]
            );
          } else {
            userId = users[0].id;
            await query("UPDATE users SET password_hash = ? WHERE id = ?", [passHash, userId]);
          }

          // Ensure role
          await query(
            "INSERT IGNORE INTO user_roles (id, user_id, role) VALUES (?, ?, ?)",
            [crypto.randomUUID(), userId, "admin"]
          );

          // Ensure profile
          const profs = await query("SELECT id FROM profiles WHERE id = ?", [userId]);
          if (profs.length === 0) {
            const publicUserId = "1000000000";
            await query(
              "INSERT INTO profiles (id, public_user_id, display_name, email, active) VALUES (?, ?, ?, ?, ?)",
              [userId, publicUserId, name, email, true]
            );
          }

          return new Response(JSON.stringify({ ok: true, user_id: userId }), {
            headers: { "content-type": "application/json" },
          });
        } catch (err: any) {
          return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { "content-type": "application/json" },
          });
        }
      },
    },
  },
});
