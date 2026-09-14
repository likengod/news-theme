import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { MessageSquare, Loader2, Reply, ChevronDown, Feather } from "lucide-react";
import { toast } from "sonner";
import { getArticleComments, postArticleComment } from "@/lib/comments.functions";
import { authClient } from "@/lib/auth-client";
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
const MIN_CHARACTERS = 30;
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
    authClient.auth.getSession().then(({ data }) => {
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
      toast(`${isReply ? "Reply" : "Comment"} must be at least ${minChars} characters (currently ${body.length}).`);
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
  ) => isReply ? (
    /* ── Reply form: compact, inline, minimal space ── */
    <form onSubmit={onSubmit} className="mt-2 ml-3 pl-2.5 border-l-2 border-indigo-500/40">
      {/* Header: who is replying */}
      <div className="flex items-center gap-1.5 mb-1.5 text-xs text-indigo-700">
        <Reply className="h-3 w-3 text-indigo-600" />
        <span className="text-[11px]">Replying to <strong className="font-semibold text-indigo-950">{replyToName}</strong></span>
        {userDisplayName && (
          <>
            <span className="text-indigo-400">·</span>
            <span className="text-[11px] text-indigo-700">as <strong className="font-semibold text-indigo-950">{userDisplayName}</strong></span>
          </>
        )}
      </div>
      {/* Textarea with feather pen icon */}
      <div className="flex gap-2 items-start bg-indigo-50/40 border border-indigo-100 rounded-lg p-2">
        <div className="flex items-center justify-center shrink-0 mt-0.5 text-indigo-600">
          <Feather className="h-3.5 w-3.5" />
        </div>
        <div className="flex-1">
          <textarea
            required
            value={dr}
            onChange={(e) => setDr(e.target.value)}
            placeholder="Write your reply... (min. 15 characters)"
            rows={2}
            maxLength={500}
            autoFocus
            className="w-full resize-none border-0 bg-transparent p-0 text-xs text-[#141414] placeholder:text-muted-foreground/60 focus:outline-none transition-colors"
          />
          <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-indigo-100">
            <span className="text-[10px] text-muted-foreground">
              {dr.length}/500 {dr.length < 15 && dr.length > 0 && <span className="text-amber-600 font-medium">(min 15)</span>}
            </span>
            <div className="flex items-center gap-1.5">
              {onCancel && (
                <button type="button" onClick={onCancel}
                  className="text-[11px] text-muted-foreground hover:text-indigo-700 transition-colors px-2 py-0.5 font-medium">
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={sub || dr.trim().length < 15}
                className="inline-flex items-center gap-1 rounded-full bg-indigo-600 px-3 py-1 text-[11px] font-semibold text-white hover:bg-indigo-700 disabled:opacity-30 transition-opacity"
              >
                {sub && <Loader2 className="h-3 w-3 animate-spin text-white" />}
                Reply
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  ) : (
    /* ── Main comment form: compact card ── */
    <form onSubmit={onSubmit} className="mt-3 space-y-3 rounded-lg border border-border/70 bg-card/60 p-3.5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Your Name</label>
          <input type="text" required value={n} onChange={(e) => setN(e.target.value)} placeholder="e.g. John Doe"
            className="w-full rounded border border-border bg-background px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-foreground" />
        </div>
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Your Email</label>
          <input type="email" required value={em} onChange={(e) => setEm(e.target.value)} placeholder="e.g. john@example.com"
            className="w-full rounded border border-border bg-background px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-foreground" />
        </div>
      </div>
      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Comment</label>
        <textarea required value={dr} onChange={(e) => setDr(e.target.value)}
          placeholder="Write your comment... (minimum 30 characters, links are automatically blocked)"
          rows={3} maxLength={1000}
          className="w-full rounded border border-border bg-background p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-foreground" />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground">{dr.length}/{MIN_CHARACTERS} min characters ({dr.length} total)</span>
        <div className="flex gap-2">
          {onCancel && (
            <button type="button" onClick={onCancel}
              className="px-3 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
              Cancel
            </button>
          )}
          <button type="submit"
            disabled={sub || !dr.trim() || !n.trim() || !em.trim()}
            className="rounded-full bg-[#141414] px-4 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-40 transition-opacity inline-flex items-center gap-1.5">
            {sub && <Loader2 className="h-3 w-3 animate-spin text-white" />}
            Submit Comment
          </button>
        </div>
      </div>
    </form>
  );

  return (
    <section className="mt-8 border-t border-border pt-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-border">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-foreground" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
            Comments <span className="text-xs font-medium text-muted-foreground ml-0.5">({topLevel.length})</span>
          </h3>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((s) => !s)}
          className="rounded-full bg-[#141414] px-3.5 py-1 text-xs font-semibold text-white hover:bg-[#141414]/90 transition-opacity"
        >
          {showForm ? "Cancel" : "Post Comment"}
        </button>
      </div>

      {showForm && commentFormFields(false, name, setName, email, setEmail, draft, setDraft, submitting,
        (e) => submitComment(e, null), () => setShowForm(false))}

      {loading ? (
        <div className="flex items-center justify-center py-6 text-slate-400">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          <span className="text-xs">Loading comments...</span>
        </div>
      ) : (
        <ul className="divide-y divide-border/50">
          {visibleTopLevel.map((c) => {
            const replies = getReplies(c.id);
            const isReplyingThis = replyingTo?.id === c.id;
            return (
              <li key={c.id} className="py-2.5 first:pt-2 last:pb-0">
                {/* Author Info */}
                <div className="text-xs font-semibold text-[#141414] tracking-tight">
                  {c.user}
                </div>

                {/* Comment Body - reduced text size with comfortable reading */}
                <p className="mt-1 text-[13px] text-[#222222] leading-snug whitespace-pre-line">
                  {c.body}
                </p>

                {/* Action Button */}
                <div className="mt-1 flex items-center">
                  <button
                    onClick={() => {
                      if (!userId) { toast.error("Please login to reply."); return; }
                      setReplyingTo(isReplyingThis ? null : { id: c.id, name: c.user });
                      setReplyDraft("");
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors py-0.5"
                  >
                    <Reply className="h-3 w-3 text-indigo-600" />
                    <span>{isReplyingThis ? "Cancel" : "Reply"}</span>
                  </button>
                </div>

                {/* Nested Replies */}
                {replies.length > 0 && (
                  <ul className="mt-2 ml-3 space-y-1.5 border-l-2 border-slate-200 pl-3">
                    {replies.map((r) => (
                      <li key={r.id} className="bg-slate-50/70 border border-slate-100 rounded-md px-2.5 py-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-bold text-[#141414]">{r.user}</span>
                          {r.user.toLowerCase() === "admin" && (
                            <span className="bg-slate-900 text-white text-[9px] font-bold uppercase px-1 py-0.2 rounded tracking-wide">Staff</span>
                          )}
                        </div>
                        <p className="mt-0.5 text-xs text-[#2b2b2b] leading-relaxed whitespace-pre-line">{r.body}</p>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Reply Form */}
                {isReplyingThis && commentFormFields(true, "", () => {}, "", () => {}, replyDraft, setReplyDraft, replySubmitting,
                  (e) => submitComment(e, c.id), () => setReplyingTo(null), c.user)}
              </li>
            );
          })}

          {topLevel.length === 0 && (
            <li className="py-6 text-center text-xs text-muted-foreground border border-dashed border-border rounded-lg bg-card/40 mt-3">
              No approved comments yet. Be the first to comment!
            </li>
          )}
        </ul>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-background px-4 py-1.5 text-xs font-semibold text-[#141414] hover:bg-slate-50 transition-colors shadow-xs"
          >
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Load More Comments ({topLevel.length - visibleCount} remaining)</span>
          </button>
        </div>
      )}
    </section>
  );
}

export default CommentsSection;
