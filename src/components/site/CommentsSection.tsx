import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { MessageSquare, Loader2, Calendar, Reply, ChevronDown } from "lucide-react";
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
  parentId: number | null;
};

const SITE_NAME = "News Theme";
const MIN_CHARACTERS = 81;
const PAGE_SIZE = 6;

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
  const words = s
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 2); // check words > 2 chars
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

export function CommentsSection({
  articleSlug,
  articleTitle,
}: {
  articleSlug: string;
  articleTitle: string;
}) {
  const getCommentsFn = useServerFn(getArticleComments);
  const postCommentFn = useServerFn(postArticleComment);

  const [allComments, setAllComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [replyingTo, setReplyingTo] = useState<{ id: number; name: string } | null>(null);

  // Reply form state (no name/email — auto from session)
  const [replyDraft, setReplyDraft] = useState("");
  const [replySubmitting, setReplySubmitting] = useState(false);

  // Main form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [draft, setDraft] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userDisplayName, setUserDisplayName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        const u = data.session.user;
        setUserId(u.id);
        setUserEmail(u.email ?? null);
        // Try to get display name from user metadata
        setUserDisplayName(u.user_metadata?.display_name || u.user_metadata?.full_name || u.email?.split("@")[0] || "User");
      }
    });
  }, []);

  const loadComments = async () => {
    try {
      setLoading(true);
      const res = await getCommentsFn({ data: articleSlug });
      setAllComments(res.map((r: any) => ({
        id: r.id,
        user: r.user,
        email: r.email,
        body: r.body,
        date: r.date,
        parentId: r.parentId ?? null,
      })));
    } catch (err: any) {
      console.error("Failed to load comments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (articleSlug) loadComments(); }, [articleSlug]);

  const submitComment = async (e: React.FormEvent, parentId?: number | null) => {
    e.preventDefault();
    const isReply = !!parentId;
    const body = (isReply ? replyDraft : draft).trim();
    const minChars = isReply ? 15 : MIN_CHARACTERS;

    // For replies, use auto-detected session user
    const authorName = isReply ? (userDisplayName || "") : name.trim();
    const authorEmail = isReply ? (userEmail || "") : email.trim();

    if (!body || !authorName || !authorEmail) { toast.error(isReply ? "Please login to reply." : "Please fill in all fields."); return; }
    if (containsLinkOrScript(body)) {
      toast(`YOU CAN'T POST THIS COMMENT, BECAUSE OUR ${SITE_NAME.toUpperCase()} DISABLED THIS FEATURE TO PROTECT FOR SCAMER SPAM AND PROMOTION.`);
      return;
    }
    if (body.length < minChars) {
      toast(`Reply must be at least ${minChars} characters (currently ${body.length}).`);
      return;
    }
    if (!isReply && hasExcessiveWordRepetition(body)) {
      toast(`Please ${authorName}, your comment has been flagged. A single word cannot be repeated more than 5 times.`);
      return;
    }

    try {
      isReply ? setReplySubmitting(true) : setSubmitting(true);
      await postCommentFn({ data: { articleSlug, articleTitle, name: authorName, email: authorEmail, body, parentId: parentId ?? null } });
      if (userId) trackComment(userId, articleSlug);
      toast.success(isReply ? "Reply submitted! Pending approval." : "Comment submitted! It is pending administrator approval before appearing here.");
      if (isReply) { setReplyDraft(""); setReplyingTo(null); }
      else { setDraft(""); setName(""); setEmail(""); setShowForm(false); }
      loadComments();
    } catch (err: any) {
      toast.error(err.message || "Failed to submit comment");
    } finally {
      isReply ? setReplySubmitting(false) : setSubmitting(false);
    }
  };

  const topLevel = allComments.filter((c) => !c.parentId);
  const getReplies = (parentId: number) => allComments.filter((c) => c.parentId === parentId);
  const visibleTopLevel = topLevel.slice(0, visibleCount);
  const hasMore = visibleCount < topLevel.length;

  const commentFormFields = (
    isReply: boolean,
    n: string, setN: (v:string)=>void,
    em: string, setEm: (v:string)=>void,
    dr: string, setDr: (v:string)=>void,
    sub: boolean,
    onSubmit: (e: React.FormEvent) => void,
    onCancel?: () => void,
    replyToName?: string,
  ) => (
    <form onSubmit={onSubmit} className={`space-y-4 rounded-lg border border-border bg-card p-4 ${isReply ? "ml-8 mt-3 border-l-4 border-l-primary/30" : "mt-5"}`}>
      {replyToName && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
            <Reply className="h-3 w-3" /> Replying to <strong>{replyToName}</strong>
          </p>
          {isReply && userDisplayName && (
            <p className="text-xs text-muted-foreground">
              Replying as <strong>{userDisplayName}</strong>
            </p>
          )}
        </div>
      )}
      {!isReply && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Your Name</label>
            <input type="text" required value={n} onChange={(e) => setN(e.target.value)} placeholder="e.g. John Doe"
              className="w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Your Email</label>
            <input type="email" required value={em} onChange={(e) => setEm(e.target.value)} placeholder="e.g. john@example.com"
              className="w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground" />
          </div>
        </div>
      )}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
          {isReply ? "Your Reply" : "Comment"}
        </label>
        <textarea required value={dr} onChange={(e) => setDr(e.target.value)}
          placeholder={isReply ? "Write your reply... (minimum 15 characters)" : "Write your comment... (minimum 81 characters, links are automatically blocked)"}
          rows={isReply ? 3 : 4} maxLength={1000}
          className="w-full border border-border bg-background p-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground" />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {dr.length}/{isReply ? 15 : MIN_CHARACTERS} min characters ({dr.length} total)
        </span>
        <div className="flex gap-2">
          {onCancel && (
            <button type="button" onClick={onCancel}
              className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
              Cancel
            </button>
          )}
          <button type="submit"
            disabled={sub || !dr.trim() || (!isReply && (!n.trim() || !em.trim()))}
            className="bg-foreground px-5 py-2 text-xs font-bold uppercase tracking-widest text-background hover:opacity-90 disabled:opacity-40 transition-opacity inline-flex items-center gap-1.5">
            {sub && <Loader2 className="h-3 w-3 animate-spin" />}
            {isReply ? "Submit Reply" : "Submit Comment"}
          </button>
        </div>
      </div>
    </form>
  );

  return (
    <section className="mt-10 border-t border-border pt-6">
      <div className="flex items-center justify-between gap-3">
        <h3 className="headline font-serif text-2xl font-bold text-primary flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Comments ({topLevel.length})
        </h3>
        <button type="button" onClick={() => setShowForm((s) => !s)}
          className="bg-foreground px-4 py-2 text-xs font-bold uppercase tracking-widest text-background hover:opacity-90 transition-opacity">
          {showForm ? "Cancel" : "Post Comment"}
        </button>
      </div>

      {showForm && commentFormFields(false, name, setName, email, setEmail, draft, setDraft, submitting,
        (e) => submitComment(e, null), () => setShowForm(false))}

      {loading ? (
        <div className="flex items-center justify-center py-8 text-slate-400">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          <span className="text-sm">Loading comments...</span>
        </div>
      ) : (
        <ul className="mt-6 space-y-5">
          {visibleTopLevel.map((c) => {
            const replies = getReplies(c.id);
            const isReplyingThis = replyingTo?.id === c.id;
            return (
              <li key={c.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="text-sm font-semibold text-foreground">
                    {c.user}
                    <span className="ml-2 text-xs font-normal text-muted-foreground inline-flex items-center gap-1">
                      <Calendar className="h-3 w-3 inline" /> {c.date}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      if (!userId) { toast.error("Please login to reply."); return; }
                      setReplyingTo(isReplyingThis ? null : { id: c.id, name: c.user });
                      setReplyDraft("");
                    }}
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors shrink-0"
                  >
                    <Reply className="h-3.5 w-3.5" /> Reply
                  </button>
                </div>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{c.body}</p>

                {replies.length > 0 && (
                  <ul className="mt-3 ml-6 space-y-3 border-l-2 border-border pl-4">
                    {replies.map((r) => (
                      <li key={r.id} className="pt-2">
                        <div className="text-sm font-semibold text-foreground">
                          {r.user}
                          <span className="ml-2 text-xs font-normal text-muted-foreground inline-flex items-center gap-1">
                            <Calendar className="h-3 w-3 inline" /> {r.date}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{r.body}</p>
                      </li>
                    ))}
                  </ul>
                )}

                {isReplyingThis && commentFormFields(true, "", () => {}, "", () => {}, replyDraft, setReplyDraft, replySubmitting,
                  (e) => submitComment(e, c.id), () => setReplyingTo(null), c.user)}
              </li>
            );
          })}

          {topLevel.length === 0 && (
            <li className="py-8 text-center text-sm text-muted-foreground border border-dashed border-border rounded-lg bg-card/50">
              No approved comments yet. Be the first to comment!
            </li>
          )}
        </ul>
      )}

      {hasMore && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
            className="inline-flex items-center gap-2 border border-border px-6 py-2.5 text-sm font-semibold text-foreground hover:bg-card transition-colors"
          >
            <ChevronDown className="h-4 w-4" />
            Load More Comments ({topLevel.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </section>
  );
}

export default CommentsSection;
