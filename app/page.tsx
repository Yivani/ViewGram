// created by Yivani yivani.dev
"use client";

import { useState, useEffect } from "react";
import { Edit3 } from "lucide-react";
import ProfileHeader from "@/components/ProfileHeader";
import PostGrid from "@/components/PostGrid";
import PostModal from "@/components/PostModal";
import EditorPanel from "@/components/EditorPanel";
import TourGuide from "@/components/TourGuide";
import type { TourStep } from "@/components/TourGuide";
import Footer from "@/components/Footer";
import type { ProfileData, Post } from "@/types";

const STORAGE_KEYS = {
  PROFILE: "instagram-previewer-profile",
  POSTS: "instagram-previewer-posts",
  EDITOR_COLLAPSED: "instagram-previewer-editor-collapsed",
  ONBOARDING: "instagram-previewer-onboarding",
};

const initialProfile: ProfileData = {
  username: "",
  displayName: "",
  bio: "",
  externalLink: "",
  profileImage: "",
  stats: {
    posts: 0,
    followers: 0,
    following: 0,
  },
};

const initialPosts: Post[] = [];

const tourSteps: TourStep[] = [
  {
    title: "Welcome to ViewGram",
    content:
      "Plan, preview, and perfect your Instagram profile before you post. ViewGram is not affiliated with Instagram — it's a visual planner only.",
  },
  {
    title: "Open the editor",
    content: "Click this button anytime to open the editor and customize your profile or posts.",
    target: "#edit-page-button",
    placement: "left",
  },
  {
    title: "Editor panel",
    content: "This side panel is where you control everything about your profile preview.",
    target: "#editor-panel",
    placement: "left",
  },
  {
    title: "Profile details",
    content: "Set your username, display name, bio, profile picture, link, and follower stats here.",
    target: "#profile-details-section",
    placement: "left",
  },
  {
    title: "Manage content",
    content: "Paste an image URL and click Add, or upload files to build your grid quickly.",
    target: "#manage-content-section",
    placement: "left",
  },
  {
    title: "Your grid",
    content: "All your posts appear here. Drag and drop them to arrange your perfect feed layout.",
    target: "#post-grid",
    placement: "top",
  },
  {
    title: "Live preview",
    content: "Everything you edit updates instantly in the profile preview above your grid.",
    target: "#profile-header",
    placement: "bottom",
  },
  {
    title: "You're ready",
    content:
      "No account needed and nothing leaves your browser. Start planning your next posts with confidence.",
  },
];

export default function Home() {
  const [profile, setProfile] = useState<ProfileData>(initialProfile);
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isEditorCollapsed, setIsEditorCollapsed] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);
      const savedPosts = localStorage.getItem(STORAGE_KEYS.POSTS);
      const savedEditorState = localStorage.getItem(STORAGE_KEYS.EDITOR_COLLAPSED);

      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);
        setProfile(parsedProfile);
      }

      if (savedPosts) {
        const parsedPosts = JSON.parse(savedPosts);
        setPosts(parsedPosts);
      }

      if (savedEditorState) {
        setIsEditorCollapsed(JSON.parse(savedEditorState));
      }

      const onboardingSeen = localStorage.getItem(STORAGE_KEYS.ONBOARDING);
      if (!onboardingSeen) {
        setShowTour(true);
      }
    } catch (error) {
      console.error("Error loading from localStorage:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (error) {
      console.error("Error saving profile to localStorage:", error);
    }
  }, [profile, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      const postsJson = JSON.stringify(posts);
      localStorage.setItem(STORAGE_KEYS.POSTS, postsJson);
    } catch (error: any) {
      console.error("Error saving posts to localStorage:", error);
      if (error.name === 'QuotaExceededError' || error.code === 22) {
        try {
          const postsWithoutImages = posts.map(post => ({
            ...post,
            imageUrl: post.imageUrl.startsWith('data:') ? '[IMAGE_DATA]' : post.imageUrl
          }));
          localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(postsWithoutImages));
          alert('Storage quota exceeded. Some images could not be saved. Please remove some posts or use external image URLs instead.');
        } catch (fallbackError) {
          alert('Storage quota exceeded. Please clear some data or use external image URLs instead of uploading files.');
        }
      }
    }
  }, [posts, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.EDITOR_COLLAPSED, JSON.stringify(isEditorCollapsed));
    } catch (error) {
      console.error("Error saving editor state to localStorage:", error);
    }
  }, [isEditorCollapsed, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    setProfile((prev) => ({
      ...prev,
      stats: { ...prev.stats, posts: posts.length },
    }));
  }, [posts.length, isLoaded]);

  const handleTourComplete = () => {
    try {
      localStorage.setItem(STORAGE_KEYS.ONBOARDING, "true");
    } catch (error) {
      console.error("Error saving onboarding state:", error);
    }
    setShowTour(false);
  };

  const handleTourStepChange = (step: number) => {
    if (step >= 2 && step <= 4) {
      setIsEditorCollapsed(false);
    } else {
      setIsEditorCollapsed(true);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-instagram-bg text-instagram-text">
      <main className="flex-1">
        <div className="md:hidden sticky top-0 z-40 bg-instagram-bg border-b border-white/10 flex items-center justify-center px-4 h-14">
          <div className="font-bold text-lg">{profile.username}</div>
        </div>

        <div className="max-w-screen-2xl mx-auto transition-all duration-300">
          <div id="profile-header">
            <ProfileHeader profile={profile} />
          </div>
          <div id="post-grid">
            <PostGrid posts={posts} onPostClick={setSelectedPost} onPostsChange={setPosts} />
          </div>
        </div>
      </main>

      <Footer />

      <div id="editor-panel" className={`fixed top-0 right-0 h-screen w-[400px] transition-transform duration-300 z-50 ${isEditorCollapsed ? 'translate-x-full' : 'translate-x-0'}`}>
        <EditorPanel
          profile={profile}
          posts={posts}
          onProfileChange={setProfile}
          onPostsChange={setPosts}
          isCollapsed={false}
          onToggleCollapse={() => setIsEditorCollapsed(true)}
        />
      </div>

      {isEditorCollapsed && (
        <button
          id="edit-page-button"
          onClick={() => setIsEditorCollapsed(false)}
          className="fixed bottom-6 right-6 px-6 py-3 bg-white/10 hover:bg-white/20 text-instagram-text font-medium rounded-full backdrop-blur-md border border-white/10 shadow-lg transition-all flex items-center gap-2 z-40 group"
        >
          <Edit3 size={18} />
          <span>Edit Page</span>
        </button>
      )}

      {selectedPost && (
        <PostModal
          post={selectedPost}
          username={profile.username}
          profileImage={profile.profileImage}
          posts={posts}
          onPostsChange={setPosts}
          onClose={() => setSelectedPost(null)}
        />
      )}

      {isLoaded && showTour && (
        <TourGuide
          steps={tourSteps}
          isOpen={showTour}
          onComplete={handleTourComplete}
          onStepChange={handleTourStepChange}
        />
      )}
    </div>
  );
}
