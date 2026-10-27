import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { likeArticleServer, checkArticleLikedServer } from "@/lib/articles.functions";

function getOrCreateClientToken(): string {
  if (typeof window === "undefined") return "";
  try {
    let token = localStorage.getItem("nt_client_like_token");
    if (!token) {
      token = "clk_" + Math.random().toString(36).substring(2, 15) + "_" + Date.now().toString(36);
      localStorage.setItem("nt_client_like_token", token);
    }
    return token;
  } catch {
    return "guest_client";
  }
}

interface ArticleLikeButtonProps {
  articleId?: number;
  initialLikes?: number;
}

export function ArticleLikeButton({ articleId, initialLikes = 0 }: ArticleLikeButtonProps) {
  const [likes, setLikes] = useState<number>(initialLikes);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [bumping, setBumping] = useState<boolean>(false);

  useEffect(() => {
    setLikes(initialLikes);
  }, [initialLikes]);

  useEffect(() => {
    if (!articleId || articleId <= 0) return;
    const clientToken = getOrCreateClientToken();
    if (!clientToken) return;

    checkArticleLikedServer({ data: { articleId, clientToken } })
      .then((res) => {
        if (res?.liked) {
          setIsLiked(true);
        }
      })
      .catch(() => {});
  }, [articleId]);

  const handleLike = async () => {
    if (!articleId || articleId <= 0) {
      toast.info("Article is still indexing, please try again in a moment.");
      return;
    }

    if (isLiked) {
      toast.info("You've already appreciated this story ❤️");
      return;
    }

    setLoading(true);
    setBumping(true);
    setTimeout(() => setBumping(false), 400);

    const clientToken = getOrCreateClientToken();

    // Optimistic UI update
    setIsLiked(true);
    setLikes((prev) => prev + 1);

    try {
      const res = await likeArticleServer({
        data: {
          articleId,
          clientToken,
        },
      });

      if (res?.alreadyLiked) {
        setIsLiked(true);
        if (typeof res.likes === "number") setLikes(res.likes);
        toast.info("You already liked this story ❤️");
      } else if (res?.success) {
        if (typeof res.likes === "number") setLikes(res.likes);
        toast.success("Thank you for liking! ❤️");
      }
    } catch (err: any) {
      // Revert optimistic update on rate limit or error
      setIsLiked(false);
      setLikes((prev) => Math.max(0, prev - 1));
      toast.error(err?.message || "Could not record like. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLike}
      disabled={loading}
      title={isLiked ? "You liked this article" : "Like this article"}
      aria-label="Like article"
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border ${
        isLiked
          ? "bg-red-50 text-red-600 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/60 shadow-sm"
          : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
      } ${bumping ? "scale-110" : "scale-100"} active:scale-95`}
    >
      <Heart
        className={`h-3.5 w-3.5 transition-colors ${
          isLiked ? "fill-red-500 text-red-500" : "text-slate-500 dark:text-slate-400"
        } ${bumping ? "animate-bounce" : ""}`}
      />
      <span className="tabular-nums">
        {likes > 0 ? likes.toLocaleString("en-IN") : "Like"}
      </span>
    </button>
  );
}
