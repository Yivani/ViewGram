// created by Yivani yivani.dev
"use client";

import { useState } from "react";
import {
  X,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import type { Post, Comment } from "@/types";

interface PostModalProps {
  post: Post | null;
  username: string;
  profileImage: string;
  posts: Post[];
  onPostsChange: (posts: Post[]) => void;
  onClose: () => void;
}

const RANDOM_NAMES = [
  "Alex", "Jordan", "Taylor", "Morgan", "Casey", "Jamie", "Riley", "Avery", "Sam", "Drew",
  "Quinn", "Skyler", "Charlie", "Peyton", "Hayden",
];

const RANDOM_COMMENTS = [
  "🔥",
  "Nice shot!",
  "Love this 😍",
  "So cool!",
  "Great vibe",
  "Amazing",
  "This is fire",
  "Beautiful",
  "Wow!",
  "Incredible",
  "Absolutely stunning",
  "Where is this?",
];

function randomAvatar(name: string) {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
}

function formatTextWithHashtags(text: string) {
  const parts = text.split(/(#[\w\u00C0-\u024F]+)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("#")) {
      return (
        <span key={idx} style={{ color: "#708dff" }}>
          {part}
        </span>
      );
    }
    return <span key={idx}>{part}</span>;
  });
}

function Avatar({ src, alt }: { src?: string; alt: string }) {
  return (
    <div className="w-8 h-8 rounded-full overflow-hidden bg-instagram-secondary flex-shrink-0">
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-instagram-textSecondary">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
      )}
    </div>
  );
}

export default function PostModal({
  post,
  username,
  profileImage,
  posts,
  onPostsChange,
  onClose,
}: PostModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  if (!post) return null;

  const images = post.images && post.images.length > 0 ? post.images : [post.imageUrl];
  const currentImage = images[currentImageIndex];
  const comments = post.comments || [];

  const updatePost = (updates: Partial<Post>) => {
    const idx = posts.findIndex((p) => p.id === post.id);
    if (idx === -1) return;
    const newPosts = [...posts];
    newPosts[idx] = { ...newPosts[idx], ...updates };
    onPostsChange(newPosts);
  };

  const nextImage = () => {
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex((i) => i + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex((i) => i - 1);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const comment: Comment = {
      id: `comment-${Date.now()}`,
      username,
      profileImage,
      text: newComment.trim(),
      replies: [],
    };
    updatePost({ comments: [...comments, comment] });
    setNewComment("");
  };

  const handleAddReply = (commentId: string) => {
    if (!replyText.trim()) return;
    const reply: Comment = {
      id: `reply-${Date.now()}`,
      username,
      profileImage,
      text: replyText.trim(),
    };

    const addReplyRecursive = (items: Comment[]): Comment[] => {
      return items.map((item) => {
        if (item.id === commentId) {
          return { ...item, replies: [...(item.replies || []), reply] };
        }
        if (item.replies && item.replies.length > 0) {
          return { ...item, replies: addReplyRecursive(item.replies) };
        }
        return item;
      });
    };

    updatePost({ comments: addReplyRecursive(comments) });
    setReplyText("");
    setReplyTo(null);
  };

  const handleRandomComments = () => {
    const count = Math.floor(Math.random() * 3) + 2;
    const generated: Comment[] = Array.from({ length: count }).map((_, i) => {
      const name = RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)];
      const text = RANDOM_COMMENTS[Math.floor(Math.random() * RANDOM_COMMENTS.length)];
      return {
        id: `random-comment-${Date.now()}-${i}`,
        username: name,
        profileImage: randomAvatar(name),
        text,
        replies: [],
      };
    });
    updatePost({ comments: [...comments, ...generated] });
  };

  const renderComment = (comment: Comment, isReply = false) => (
    <div key={comment.id} className={`flex gap-3 ${isReply ? "ml-11 mt-3" : "mb-4"}`}>
      <Avatar src={comment.profileImage} alt={comment.username} />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-instagram-text leading-relaxed">
          <span className="font-semibold mr-1.5">{comment.username}</span>
          {formatTextWithHashtags(comment.text)}
        </p>
        <div className="flex items-center gap-4 mt-1">
          <span className="text-[10px] text-instagram-textSecondary">Just now</span>
          {!isReply && (
            <button
              onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
              className="text-[10px] text-instagram-textSecondary hover:text-instagram-text font-semibold transition-colors"
            >
              Reply
            </button>
          )}
        </div>

        {!isReply && replyTo === comment.id && (
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Reply to ${comment.username}...`}
              className="flex-1 bg-transparent border-b border-instagram-border outline-none text-instagram-text text-sm placeholder-instagram-textSecondary py-1"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddReply(comment.id);
              }}
            />
            <button
              onClick={() => handleAddReply(comment.id)}
              disabled={!replyText.trim()}
              className="text-blue-500 text-sm font-semibold hover:opacity-70 transition-opacity disabled:opacity-50"
            >
              Post
            </button>
          </div>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2">{comment.replies.map((reply) => renderComment(reply, true))}</div>
        )}
      </div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-instagram-bg bg-opacity-75"
      onClick={handleBackdropClick}
    >
      <div
        className="relative w-full max-w-5xl h-[90vh] bg-instagram-bg flex"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-4 right-4 z-10 text-instagram-text hover:opacity-70 transition-opacity bg-instagram-bg/50 rounded-full p-1.5"
        >
          <X size={24} />
        </button>

        <div className="flex-1 relative bg-instagram-bg flex items-center justify-center group">
          {currentImage ? (
            <Image
              src={currentImage}
              alt={post.caption || "Post"}
              fill
              className="object-contain"
              unoptimized
            />
          ) : (
            <div className="w-full h-full bg-instagram-secondary" />
          )}

          {images.length > 1 && (
            <>
              {currentImageIndex > 0 && (
                <button
                  onClick={prevImage}
                  className="absolute left-4 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-black hover:bg-white transition-colors z-20 opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft size={20} />
                </button>
              )}
              {currentImageIndex < images.length - 1 && (
                <button
                  onClick={nextImage}
                  className="absolute right-4 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-black hover:bg-white transition-colors z-20 opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight size={20} />
                </button>
              )}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                {images.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      idx === currentImageIndex ? "bg-white" : "bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="w-96 border-l border-instagram-border bg-instagram-bg flex flex-col hidden md:flex">
          <div className="p-4 border-b border-instagram-border">
            <div className="flex items-center gap-3 mb-2">
              <Avatar src={profileImage} alt={username} />
              <span className="text-instagram-text font-semibold text-sm">{username}</span>
            </div>
            {post.location && (
              <div className="text-instagram-text text-sm ml-11">{post.location}</div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="mb-4">
              <div className="flex items-center gap-3 mb-2">
                <Avatar src={profileImage} alt={username} />
                <span className="text-instagram-text font-semibold text-sm">{username}</span>
              </div>
              <p className="text-instagram-text text-sm ml-11 leading-relaxed">
                {formatTextWithHashtags(post.caption)}
              </p>
              {post.hashtags && post.hashtags.length > 0 && (
                <div className="ml-11 mt-2">
                  {post.hashtags.map((tag, idx) => (
                    <span key={idx} style={{ color: "#708dff" }} className="text-sm mr-2">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="text-instagram-textSecondary text-xs ml-11 mb-4">{post.date}</div>

            {comments.length > 0 && (
              <div className="border-t border-instagram-border pt-4 mb-4">
                {comments.map((comment) => renderComment(comment))}
              </div>
            )}

            <button
              onClick={handleRandomComments}
              className="flex items-center gap-2 text-xs text-instagram-textSecondary hover:text-instagram-text transition-colors mb-2"
            >
              <Sparkles size={14} />
              Add random comments
            </button>
          </div>

          <div className="border-t border-instagram-border p-4">
            <div className="flex items-center gap-4 mb-4">
              <button className="text-instagram-text hover:opacity-70 transition-opacity">
                <Heart size={24} />
              </button>
              <button className="text-instagram-text hover:opacity-70 transition-opacity">
                <MessageCircle size={24} />
              </button>
              <button className="text-instagram-text hover:opacity-70 transition-opacity">
                <Send size={24} />
              </button>
              <div className="flex-1" />
              <button className="text-instagram-text hover:opacity-70 transition-opacity">
                <Bookmark size={24} />
              </button>
            </div>
            <div className="text-instagram-text text-sm font-semibold mb-2">
              {post.likes} {post.likes === 1 ? "like" : "likes"}
            </div>
            <div className="text-instagram-textSecondary text-xs mb-4">{post.date}</div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 bg-transparent border-none outline-none text-instagram-text text-sm placeholder-instagram-textSecondary"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddComment();
                }}
              />
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="text-blue-500 text-sm font-semibold hover:opacity-70 transition-opacity disabled:opacity-50"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
