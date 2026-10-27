import { useState, useEffect } from "react";
import { ThumbsUp } from "lucide-react";
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
      toast.info("You've already liked this story 👍");
      return;
    }

    setLoading(true);
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
        toast.info("You already liked this story 👍");
      } else if (res?.success) {
        if (typeof res.likes === "number") setLikes(res.likes);
        toast.success("Thank you for liking! 👍");
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
      className={`inline-flex items-center gap-1.5 py-1 px-1.5 text-xs font-semibold transition-colors rounded ${
        isLiked
          ? "text-[#1877F2] dark:text-[#3a8fff]"
          : "text-slate-600 hover:text-[#1877F2] dark:text-slate-400 dark:hover:text-[#3a8fff]"
      }`}
    >
      <ThumbsUp
        className={`h-4 w-4 ${
          isLiked
            ? "fill-[#1877F2] text-[#1877F2] dark:fill-[#3a8fff] dark:text-[#3a8fff]"
            : "text-current"
        }`}
      />
      <span className="tabular-nums">
        {likes > 0 ? likes.toLocaleString("en-IN") : "Like"}
      </span>
    </button>
  );
}
