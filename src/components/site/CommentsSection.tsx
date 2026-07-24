import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { MessageSquare, Loader2, Calendar } from "lucide-react";
import { toast } from "sonner";
import { getArticleComments, postArticleComment } from "@/lib/comments.functions";
import { authClient as supabase } from "@/lib/auth-client";
import { trackComment } from "@/lib/user-actions-tracker";

type Comment = {
  id: number;
  user: string;
  email: string;
  body: string;
  date: string;
};

const SITE_NAME = "News Theme";
const MIN_CHARACTERS = 81;

// Detect URLs, domains, emails, html/script tags, and common obfuscations like "example [dot] com"
const URL_PATTERNS: RegExp[] = [
  /https?:\/\//i,
  /\bwww\./i,
  /<\s*\/?\s*[a-z]+/i, // any html tag
  /<\s*script/i,
  /javascript:/i,
  /on\w+\s*=/i, // onclick=, onerror=, etc.
  /\b[\w.-]+\s*(?:\.|\[\s*dot\s*\]|\(\s*dot\s*\)|\s+dot\s+)\s*(?:com|net|org|io|co|in|gov|edu|info|biz|app|dev|xyz|me|us|uk)\b/i,
  /[\w.+-]+@[\w-]+\.[\w.-]+/i, // emails
];

function containsLinkOrScript(s: string) {
  return URL_PATTERNS.some((re) => re.test(s));
}

function hasExcessiveWordRepetition(s: string): boolean {
  const words = s.toLowerCase().trim().split(/\s+/).filter((w) => w.length > 2); // check words > 2 chars
  const counts: Record<string, number> = {};
  for (const w of words) {
    const cleanWord = w.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
    if (!cleanWord) continue;
    counts[cleanWord] = (counts[cleanWord] || 0) + 1;
    if (counts[cleanWord] > 5) {
      return true;
    }
  }
  return false;
}

export function CommentsSection({ articleSlug, articleTitle }: { articleSlug: string; articleTitle: string }) {
  const getCommentsFn = useServerFn(getArticleComments);
  const postCommentFn = useServerFn(postArticleComment);

  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [draft, setDraft] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        setUserId(data.session.user.id);
      }
    });
  }, []);

  const loadComments = async () => {
    try {
      setLoading(true);
      const res = await getCommentsFn({ data: articleSlug });
      setComments(res.map((r: any) => ({
        id: r.id,
        user: r.user,
        email: r.email,
        body: r.body,
        date: r.date,
      })));
    } catch (err: any) {
      console.error("Failed to load comments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (articleSlug) {
      loadComments();
    }
  }, [articleSlug]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = draft.trim();
    const authorName = name.trim();
    const authorEmail = email.trim();

    if (!body || !authorName || !authorEmail) {
      toast.error("Please fill in all fields (Name, Email, and Comment).");
      return;
    }

    if (containsLinkOrScript(body)) {
      toast(`YOU CAN'T POST THIS COMMENT, BECAUSE OUR ${SITE_NAME.toUpperCase()} DISABLED THIS FEATURE TO PROTECT FOR SCAMER SPAM AND PROMOTION.`);
      return;
    }

    if (body.length < MIN_CHARACTERS) {
      toast(`Please ${authorName}, your comment is too short — it must be at least ${MIN_CHARACTERS} characters (currently ${body.length} characters).`);
      return;
    }

    if (hasExcessiveWordRepetition(body)) {
      toast(`Please ${authorName}, your comment has been flagged. A single word cannot be repeated more than 5 times. Please submit a genuine comment.`);
      return;
    }

    try {
      setSubmitting(true);
      await postCommentFn({
        data: {
          articleSlug,
          articleTitle,
          name: authorName,
          email: authorEmail,
          body,
        }
      });
      if (userId) {
        trackComment(userId, articleSlug);
      }
      toast.success("Comment submitted! It is pending administrator approval before appearing here.");
      setDraft("");
      setName("");
      setEmail("");
      setShowForm(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to submit comment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-10 border-t border-border pt-6">
      <div className="flex items-center justify-between gap-3">
        <h3 className="headline font-serif text-2xl font-bold text-primary flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Comments ({comments.length})
        </h3>
        <button
          type="button"
          onClick={() => setShowForm((s) => !s)}
          className="bg-foreground px-4 py-2 text-xs font-bold uppercase tracking-widest text-background hover:opacity-90 transition-opacity"
        >
          {showForm ? "Cancel" : "Post Comment"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="mt-5 space-y-4 rounded-lg border border-border bg-card p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Your Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Your Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. john@example.com"
                className="w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Comment
            </label>
            <textarea
              required
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Write your comment... (minimum 81 characters, links are automatically blocked)"
              rows={4}
              maxLength={1000}
              className="w-full border border-border bg-background p-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {draft.length}/{MIN_CHARACTERS} min characters ({draft.length} total)
            </span>
            <button
              type="submit"
              disabled={submitting || !draft.trim() || !name.trim() || !email.trim()}
              className="bg-foreground px-5 py-2 text-xs font-bold uppercase tracking-widest text-background hover:opacity-90 disabled:opacity-40 transition-opacity inline-flex items-center gap-1.5"
            >
              {submitting && <Loader2 className="h-3 w-3 animate-spin" />}
              Submit Comment
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-8 text-slate-400">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          <span className="text-sm">Loading comments...</span>
        </div>
      ) : (
        <ul className="mt-6 space-y-5">
          {comments.map((c) => (
            <li key={c.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
              <div className="flex items-start justify-between gap-3">
                <div className="text-sm font-semibold text-foreground">
                  {c.user}
                  <span className="ml-2 text-xs font-normal text-muted-foreground inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3 inline" /> {c.date}
                  </span>
                </div>
              </div>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{c.body}</p>
            </li>
          ))}
          {comments.length === 0 && (
            <li className="py-8 text-center text-sm text-muted-foreground border border-dashed border-border rounded-lg bg-card/50">
              No approved comments yet. Be the first to comment!
            </li>
          )}
        </ul>
      )}
    </section>
  );
}

export default CommentsSection;
