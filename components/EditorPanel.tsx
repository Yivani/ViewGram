// created by Yivani yivani.dev
"use client";

import { useState, useRef, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Upload,
  Link as LinkIcon,
  Image as ImageIcon,
  Plus,
} from "lucide-react";
import type { ProfileData, Post } from "@/types";
import { formatNumber } from "@/utils/formatNumber";
import { compressImage } from "@/utils/compressImage";

interface EditorPanelProps {
  profile: ProfileData;
  posts: Post[];
  onProfileChange: (profile: ProfileData) => void;
  onPostsChange: (posts: Post[]) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function EditorPanel({
  profile,
  posts,
  onProfileChange,
  onPostsChange,
  isCollapsed,
  onToggleCollapse,
}: EditorPanelProps) {
  const [newPostUrl, setNewPostUrl] = useState("");
  const [profileImageUploadType, setProfileImageUploadType] = useState<"url" | "file">("url");
  const [profileImageUrl, setProfileImageUrl] = useState(profile.profileImage);
  const profileImageFileInputRef = useRef<HTMLInputElement>(null);
  const postImageFileInputRef = useRef<HTMLInputElement>(null);
  const [activePostIdForUpload, setActivePostIdForUpload] = useState<string | null>(null);

  const [rawStats, setRawStats] = useState({
    followers: String(profile.stats.followers),
    following: String(profile.stats.following),
  });

  useEffect(() => {
    setRawStats((prev) => ({
      followers:
        document.activeElement?.getAttribute("data-stat") === "followers"
          ? prev.followers
          : String(profile.stats.followers),
      following:
        document.activeElement?.getAttribute("data-stat") === "following"
          ? prev.following
          : String(profile.stats.following),
    }));
  }, [profile.stats.followers, profile.stats.following]);

  const updateProfile = (updates: Partial<ProfileData>) => {
    onProfileChange({ ...profile, ...updates });
  };

  const updateStats = (updates: Partial<ProfileData["stats"]>) => {
    onProfileChange({
      ...profile,
      stats: { ...profile.stats, ...updates },
    });
  };

  const handleAddPost = () => {
    if (!newPostUrl.trim()) return;

    const newPost: Post = {
      id: `post-${Date.now()}`,
      imageUrl: newPostUrl,
      images: [newPostUrl],
      caption: "",
      likes: 0,
      date: "Just now",
    };

    onPostsChange([...posts, newPost]);
    setNewPostUrl("");
  };

  const handleAddImageToPost = (postId: string, imageUrl: string) => {
    const updatedPosts = posts.map((p) => {
      if (p.id === postId) {
        const currentImages = p.images || [p.imageUrl];
        return { ...p, images: [...currentImages, imageUrl] };
      }
      return p;
    });
    onPostsChange(updatedPosts);
  };

  const handlePostImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && activePostIdForUpload) {
      const file = files[0];
      try {
        const base64String = await compressImage(file, 1920, 1920, 0.8);
        handleAddImageToPost(activePostIdForUpload, base64String);
      } catch (error) {
        console.error("Error processing post image:", error);
      }
      if (postImageFileInputRef.current) {
        postImageFileInputRef.current.value = "";
      }
      setActivePostIdForUpload(null);
    }
  };

  const triggerPostImageUpload = (postId: string) => {
    setActivePostIdForUpload(postId);
    if (postImageFileInputRef.current) {
      postImageFileInputRef.current.click();
    }
  };

  const handleDeletePost = (postId: string) => {
    onPostsChange(posts.filter((p) => p.id !== postId));
  };

  const handleMovePost = (postId: string, direction: "left" | "right") => {
    const currentIndex = posts.findIndex((p) => p.id === postId);
    if (currentIndex === -1) return;

    const newIndex = direction === "left" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= posts.length) return;

    const newPosts = [...posts];
    [newPosts[currentIndex], newPosts[newIndex]] = [newPosts[newIndex], newPosts[currentIndex]];
    onPostsChange(newPosts);
  };

  const handleProfileImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64String = await compressImage(file, 800, 800, 0.85);
        updateProfile({ profileImage: base64String });
        setProfileImageUrl(base64String);
      } catch (error) {
        console.error("Error compressing profile image:", error);
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          updateProfile({ profileImage: base64String });
          setProfileImageUrl(base64String);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleProfileImageUrlChange = (url: string) => {
    setProfileImageUrl(url);
    updateProfile({ profileImage: url });
  };

  useEffect(() => {
    setProfileImageUrl(profile.profileImage);
  }, [profile.profileImage]);

  if (isCollapsed) {
    return null;
  }

  return (
    <div className="h-full w-[400px] bg-zinc-950 border-l border-zinc-800 shadow-2xl overflow-y-auto">
      <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-5 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur">
        <div>
          <h2 className="text-lg font-bold text-instagram-text">Editor</h2>
          <p className="text-xs text-zinc-500 mt-0.5">Customize your profile</p>
        </div>
        <button
          onClick={onToggleCollapse}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-instagram-text transition-colors"
          title="Close Editor"
        >
          <X size={18} />
        </button>
      </div>

      <div className="p-6 space-y-10">
        <section id="profile-details-section">
          <SectionTitle>Profile Details</SectionTitle>

          <div className="space-y-5">
            <Field label="Username">
              <input
                type="text"
                value={profile.username}
                onChange={(e) => updateProfile({ username: e.target.value })}
                className="input-field"
                placeholder="@username"
              />
            </Field>

            <Field label="Display Name">
              <input
                type="text"
                value={profile.displayName}
                onChange={(e) => updateProfile({ displayName: e.target.value })}
                className="input-field"
                placeholder="Your Name"
              />
            </Field>

            <Field label="Profile Picture">
              <div className="flex gap-1 p-1 bg-zinc-900 rounded-lg border border-zinc-800">
                <ToggleButton
                  active={profileImageUploadType === "url"}
                  onClick={() => setProfileImageUploadType("url")}
                  icon={<LinkIcon size={14} />}
                >
                  URL
                </ToggleButton>
                <ToggleButton
                  active={profileImageUploadType === "file"}
                  onClick={() => setProfileImageUploadType("file")}
                  icon={<Upload size={14} />}
                >
                  Upload
                </ToggleButton>
              </div>

              {profileImageUploadType === "url" ? (
                <div className="flex gap-3 mt-3">
                  <input
                    type="text"
                    value={profileImageUrl}
                    onChange={(e) => handleProfileImageUrlChange(e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    className="input-field"
                  />
                  <div className="w-14 h-14 rounded-full bg-zinc-900 border border-zinc-800 overflow-hidden flex-shrink-0">
                    {profileImageUrl ? (
                      <img src={profileImageUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon size={22} className="text-zinc-600" />
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-3 mt-3">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-zinc-700 rounded-xl cursor-pointer bg-zinc-900 hover:bg-zinc-900/70 hover:border-zinc-500 transition-colors">
                    <Upload size={28} className="text-zinc-500 mb-2" />
                    <p className="text-sm text-zinc-300 font-medium">Click to upload</p>
                    <p className="text-xs text-zinc-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      ref={profileImageFileInputRef}
                      onChange={handleProfileImageFileUpload}
                    />
                  </label>

                  {profileImageUrl && (
                    <div className="flex items-center gap-3 p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                      <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-zinc-800">
                        <img src={profileImageUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-zinc-300 truncate">Image loaded</p>
                        <button
                          onClick={() => {
                            handleProfileImageUrlChange("");
                            if (profileImageFileInputRef.current) {
                              profileImageFileInputRef.current.value = "";
                            }
                          }}
                          className="text-xs text-zinc-500 hover:text-red-400 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Field>

            <Field label="Bio">
              <textarea
                value={profile.bio}
                onChange={(e) => updateProfile({ bio: e.target.value })}
                rows={4}
                className="input-field resize-none leading-relaxed"
                placeholder="Tell your story..."
              />
            </Field>

            <Field label="Link">
              <div className="relative">
                <LinkIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  value={profile.externalLink}
                  onChange={(e) => updateProfile({ externalLink: e.target.value })}
                  placeholder="yivani.dev"
                  className="input-field pl-10"
                />
              </div>
            </Field>

            <div className="grid grid-cols-2 gap-3 pt-1">
              {[
                { label: "Followers", key: "followers" as const },
                { label: "Following", key: "following" as const },
              ].map((stat) => (
                <div
                  key={stat.key}
                  className="text-center p-3 bg-zinc-900 rounded-xl border border-zinc-800"
                >
                  <label className="block text-[10px] font-semibold text-zinc-500 mb-2 uppercase tracking-wider">
                    {stat.label}
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    data-stat={stat.key}
                    value={rawStats[stat.key]}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      setRawStats((prev) => ({ ...prev, [stat.key]: val }));
                    }}
                    onBlur={() => {
                      const num = parseInt(rawStats[stat.key], 10) || 0;
                      updateStats({ [stat.key]: num });
                      setRawStats((prev) => ({ ...prev, [stat.key]: String(num) }));
                    }}
                    className="w-full bg-transparent text-center text-instagram-text font-semibold text-base focus:outline-none"
                  />
                  <p className="text-[10px] text-zinc-500 mt-1">
                    {formatNumber(profile.stats[stat.key])}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="manage-content-section">
          <SectionTitle>Manage Content</SectionTitle>

          <input
            type="file"
            className="hidden"
            accept="image/*"
            ref={postImageFileInputRef}
            onChange={handlePostImageFileUpload}
          />

          <div className="space-y-5">
            <Field label="Quick Add">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPostUrl}
                  onChange={(e) => setNewPostUrl(e.target.value)}
                  placeholder="Image URL..."
                  className="input-field"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddPost();
                  }}
                />
                <button
                  onClick={handleAddPost}
                  className="px-4 bg-white text-black rounded-xl font-semibold hover:bg-zinc-200 transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  <Plus size={18} />
                  <span className="hidden sm:inline">Add</span>
                </button>
              </div>
            </Field>

            <div className="space-y-3">
              {posts.map((post, index) => (
                <div
                  key={post.id}
                  className="flex items-center gap-3 p-3 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-colors"
                >
                  <div className="flex flex-col gap-1">
                    <IconButton
                      onClick={() => handleMovePost(post.id, "left")}
                      disabled={index === 0}
                      title="Move left"
                    >
                      <ChevronLeft size={14} />
                    </IconButton>
                    <IconButton
                      onClick={() => handleMovePost(post.id, "right")}
                      disabled={index === posts.length - 1}
                      title="Move right"
                    >
                      <ChevronRight size={14} />
                    </IconButton>
                  </div>

                  <div className="w-16 h-16 rounded-lg border border-zinc-800 bg-zinc-950 overflow-hidden flex-shrink-0 relative">
                    {post.imageUrl ? (
                      <img src={post.imageUrl} alt="Post" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon size={20} className="text-zinc-600" />
                      </div>
                    )}
                    {post.images && post.images.length > 1 && (
                      <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-instagram-bg/70 rounded text-[10px] text-instagram-text font-bold">
                        {post.images.length}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider mb-0.5">
                      ID: {post.id.slice(-6)}
                    </p>
                    <p className="text-xs text-zinc-400 truncate font-mono" title={post.imageUrl}>
                      {post.imageUrl || "No image URL"}
                    </p>
                    <button
                      onClick={() => triggerPostImageUpload(post.id)}
                      className="text-xs text-blue-400 hover:text-blue-300 mt-1.5 flex items-center gap-1 transition-colors"
                    >
                      <Plus size={12} /> Add Slide
                    </button>
                  </div>

                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                    title="Delete post"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}

              {posts.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-zinc-800 rounded-xl bg-zinc-900/50">
                  <ImageIcon size={32} className="text-zinc-600 mx-auto mb-3" />
                  <p className="text-zinc-400 text-sm font-medium">No posts yet</p>
                  <p className="text-zinc-500 text-xs mt-1">Add an image URL to get started</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="h-px flex-1 bg-zinc-800" />
      <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">{children}</h3>
      <div className="h-px flex-1 bg-zinc-800" />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="group">
      <label className="block text-[11px] font-bold text-zinc-500 mb-2 uppercase tracking-wider">
        {label}
      </label>
      {children}
    </div>
  );
}

function ToggleButton({
  active,
  onClick,
  children,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-all ${
        active
          ? "bg-zinc-700 text-instagram-text shadow-sm"
          : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function IconButton({
  onClick,
  disabled,
  children,
  title,
}: {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="w-7 h-7 flex items-center justify-center rounded-md bg-zinc-950 text-zinc-400 hover:text-instagram-text hover:bg-zinc-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
}
