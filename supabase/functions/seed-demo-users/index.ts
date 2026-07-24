import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const FIRST = ["Aarav","Vivaan","Aditya","Arjun","Ishaan","Kabir","Reyansh","Rohan","Sai","Vihaan","Ananya","Diya","Isha","Kiara","Meera","Nisha","Priya","Riya","Saanvi","Zara","Kunal","Manish","Neel","Ojas","Parth","Rahul","Siddharth","Tanish","Uday","Yash","Anika","Bhavya","Charvi","Devika","Ela","Falak","Gauri","Hansa","Ira","Jaya","Karan","Lakshay","Mohit","Naveen","Piyush","Quasim","Ravi","Suraj","Tarun","Utkarsh","Varun","Wasim","Xander","Yuvraj","Zayan","Aisha","Bina","Chaya","Damini","Esha","Farah","Gita","Heer","Indu","Jhanvi"];
const LAST = ["Sharma","Verma","Gupta","Iyer","Reddy","Mehta","Kapoor","Chopra","Malhotra","Bose","Das","Roy","Banerjee","Chatterjee","Mukherjee","Nair","Pillai","Rao","Sen","Singh","Kaur","Ahluwalia","Bakshi","Chauhan","Dutta","Ganguly","Hegde","Jain","Khanna","Lal","Mishra","Nanda","Oberoi","Patel","Qureshi","Rana","Saxena","Trivedi","Upadhyay","Yadav"];

const rand = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

Deno.serve(async () => {
  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const created: { id: string; email: string; role: string }[] = [];
  const skipped: string[] = [];

  const makeUser = async (i: number, kind: "reader" | "journalist") => {
    const first = rand(FIRST);
    const last = rand(LAST);
    const suffix = kind === "journalist" ? `j${i}` : `u${i}`;
    const email = `${first.toLowerCase()}.${last.toLowerCase()}.${suffix}@demo.northeasttimeline.test`;
    const username = `${first.toLowerCase()}_${last.toLowerCase()}_${suffix}`;
    const password = "Demo@Pass#2026";

    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        display_name: `${first} ${last}`,
        first_name: first,
        last_name: last,
        username,
      },
    });
    if (error) { skipped.push(`${email}: ${error.message}`); return; }
    const uid = data.user!.id;

    if (kind === "journalist") {
      await admin.from("user_roles").upsert(
        { user_id: uid, role: "journalist" },
        { onConflict: "user_id,role" },
      );
      const { data: jRow } = await admin
        .from("profiles")
        .select("journalist_id")
        .eq("id", uid)
        .single();
      const patch: Record<string, unknown> = { points: Math.floor(Math.random() * 500) };
      if (!jRow?.journalist_id) {
        const { data: gen } = await admin.rpc("generate_journalist_id" as never);
        if (gen) patch.journalist_id = gen as unknown as string;
      }
      await admin.from("profiles").update(patch).eq("id", uid);
    } else {
      await admin.from("profiles").update({
        points: Math.floor(Math.random() * 200),
      }).eq("id", uid);
    }

    created.push({ id: uid, email, role: kind });
  };

  for (let i = 1; i <= 42; i++) await makeUser(i, "reader");
  for (let i = 1; i <= 22; i++) await makeUser(i, "journalist");

  return new Response(JSON.stringify({ created_count: created.length, skipped_count: skipped.length, skipped }), {
    headers: { "content-type": "application/json" },
  });
});