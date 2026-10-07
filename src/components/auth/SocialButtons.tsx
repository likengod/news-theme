import { toast } from "sonner";

export function GoogleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export function FacebookIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#1877F2"
        d="M24 12a12 12 0 1 0-13.9 11.9v-8.4H7.1V12h3V9.4c0-3 1.8-4.6 4.5-4.6 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9V12h3.3l-.5 3.5h-2.8v8.4A12 12 0 0 0 24 12z"
      />
    </svg>
  );
}

export function LinkedInIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#0A66C2"
        d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
      />
    </svg>
  );
}

export function SocialDivider() {
  return (
    <div className="my-6 flex items-center gap-3">
      <div className="h-px flex-1 bg-border" />
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Or continue with
      </span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

export function SocialRow({
  onGoogle,
  onFacebook,
  onLinkedIn,
}: {
  onGoogle?: () => void;
  onFacebook?: () => void;
  onLinkedIn?: () => void;
}) {
  const handleGoogle = onGoogle || (async () => {
    toast.info("Google OAuth login can be configured in Admin -> Site Settings -> Login Providers");
  });

  const handleFacebook = onFacebook || (() => {
    toast.info("Facebook sign-in is coming soon");
  });

  const handleLinkedIn = onLinkedIn || (() => {
    toast.info("LinkedIn sign-in is coming soon");
  });

  const base = "flex h-12 w-12 items-center justify-center rounded-full transition hover:bg-muted";
  return (
    <div className="flex justify-center gap-6">
      <button type="button" onClick={handleGoogle} aria-label="Continue with Google" className={base}>
        <GoogleIcon />
      </button>
      <button
        type="button"
        onClick={handleFacebook}
        aria-label="Continue with Facebook"
        className={base}
      >
        <FacebookIcon />
      </button>
      <button
        type="button"
        onClick={handleLinkedIn}
        aria-label="Continue with LinkedIn"
        className={base}
      >
        <LinkedInIcon />
      </button>
    </div>
  );
}
