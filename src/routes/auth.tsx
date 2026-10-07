import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { authClient as supabase } from "@/lib/auth-client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in or create an account — News Theme" },
      { name: "description", content: "Sign in to your News Theme account or create a new one." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"signin" | "signup">("signin");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/" });
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white px-4 py-12">
      <div className="mx-auto w-full max-w-md">
        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as "signin" | "signup")}
          className="w-full"
        >
          <TabsList className="grid h-11 w-full grid-cols-2 rounded-md bg-muted p-1">
            <TabsTrigger
              value="signin"
              className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              Sign In
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <LoginForm onSwitchToSignup={() => setTab("signup")} />
          </TabsContent>

          <TabsContent value="signup">
            <RegisterForm onSwitchToSignin={() => setTab("signin")} />
          </TabsContent>
        </Tabs>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          <Link to="/" className="hover:underline">
            ← Back to home
          </Link>
        </p>
        <p className="mt-2.5 text-center text-xs text-muted-foreground">
          Built by{" "}
          <a
            href="https://gorillatechsolution.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 hover:underline"
          >
            Gorilla Tech Solution
          </a>
        </p>
      </div>
    </div>
  );
}
