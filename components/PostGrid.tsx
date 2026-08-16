// created by Yivani yivani.dev
"use client";

import { useState, useRef } from "react";
import { Plus, X, Upload, Link as LinkIcon, Image as ImageIcon, Layers, Heart, MessageCircle } from "lucide-react";
import Image from "next/image";
import type { Post } from "@/types";
import { compressImage } from "@/utils/compressImage";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface PostGridProps {
  posts: Post[];
  onPostClick: (post: Post) => void;
  onPostsChange: (posts: Post[]) => void;
}

function SortablePost({ post, onClick }: { post: Post; onClick: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: post.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="aspect-[241.833/322.433] relative overflow-hidden bg-instagram-secondary group touch-none"
    >
      <button onClick={onClick} className="w-full h-full">
        {post.imageUrl ? (
          <>
            <Image
              src={post.imageUrl}
              alt={post.caption || "Post"}
              fill
              className="object-cover"
              unoptimized
              draggable={false}
            />
            {post.images && post.images.length > 1 && (
              <div className="absolute top-2 right-2">
                <div className="bg-instagram-bg/50 backdrop-blur-sm rounded-full p-1.5 flex items-center justify-center">
                  <Layers size={16} className="text-instagram-text" strokeWidth={2.5} />
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-5 text-instagram-text pointer-events-none">
              <div className="flex items-center gap-1.5 font-semibold text-sm">
                <Heart size={20} fill="currentColor" /> {post.likes}
              </div>
              <div className="flex items-center gap-1.5 font-semibold text-sm">
                <MessageCircle size={20} fill="currentColor" /> {post.comments?.length || 0}
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full bg-instagram-secondary flex items-center justify-center">
            <ImageIcon size={24} className="text-instagram-textSecondary" />
          </div>
        )}
      </button>
    </div>
  );
}

export default function PostGrid({ posts, onPostClick, onPostsChange }: PostGridProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPostUrl, setNewPostUrl] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [uploadType, setUploadType] = useState<"url" | "file">("url");
  const [isDraggingFiles, setIsDraggingFiles] = useState(false);
  const dragCounter = useRef(0);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = posts.findIndex((p) => p.id === active.id);
      const newIndex = posts.findIndex((p) => p.id === over.id);
      onPostsChange(arrayMove(posts, oldIndex, newIndex));
    }

    setActiveId(null);
  };

  const processAndAddPosts = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const baseTimestamp = Date.now();

    try {
      const compressionPromises = fileArray.map(async (file, index) => {
        try {
          const base64String = await compressImage(file, 1920, 1920, 0.8);
          return {
            post: {
              id: `post-${baseTimestamp}-${index}`,
              imageUrl: base64String,
              images: [base64String],
              caption: "",
              likes: 0,
              date: "Just now",
            } as Post,
            index,
          };
        } catch (error) {
          console.error(`Error processing file ${index}:`, error);
          return null;
        }
      });

      const results = await Promise.all(compressionPromises);

      const newPosts = results
        .filter((result): result is { post: Post; index: number } => result !== null)
        .sort((a, b) => a.index - b.index)
        .map(({ post }) => post);

      if (newPosts.length > 0) {
        onPostsChange([...posts, ...newPosts]);
      }
    } catch (error) {
      console.error("Error processing files:", error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await processAndAddPosts(e.target.files);
    setShowAddModal(false);
    e.target.value = "";
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    if (e.dataTransfer.types.includes("Files")) {
      setIsDraggingFiles(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) {
      setIsDraggingFiles(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    setIsDraggingFiles(false);
    await processAndAddPosts(e.dataTransfer.files);
  };

  const handleAddPost = (urlOverride?: string) => {
    const urlToUse = urlOverride || newPostUrl;
    if (!urlToUse.trim()) return;

    const newPost: Post = {
      id: `post-${Date.now()}`,
      imageUrl: urlToUse,
      caption: "",
      likes: 0,
      date: "Just now",
    };

    onPostsChange([...posts, newPost]);
    setNewPostUrl("");
    setShowAddModal(false);
  };

  const activePost = posts.find((p) => p.id === activeId);

  return (
    <>
      <div
        className="relative w-full max-w-[1456px] mx-auto md:px-4 pb-8"
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div>
          <div className="flex justify-center items-center h-11">
            <button className="flex items-center justify-center h-full px-4 border-b-[1px] border-white text-instagram-text">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
              </svg>
            </button>
          </div>
        </div>

        {isDraggingFiles && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-instagram-bg/80 backdrop-blur-sm border-2 border-dashed border-instagram-text/30 rounded-xl m-2 md:m-4">
            <Upload size={48} className="text-instagram-text/70 mb-4" />
            <h3 className="text-xl font-bold text-instagram-text">Drop images here</h3>
            <p className="text-sm text-instagram-textSecondary mt-1">
              Drag multiple images to create posts at once
            </p>
          </div>
        )}

        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex flex-col items-center gap-4 group"
            >
              <div className="w-24 h-24 rounded-full border-2 border-instagram-text flex items-center justify-center group-hover:bg-instagram-secondary transition-colors">
                <Plus size={48} className="text-instagram-text" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-instagram-text">Add Posts</h3>
                <p className="text-sm text-instagram-textSecondary mt-1">Start building your profile by adding images to preview your posts.</p>
                <span className="text-blue-500 text-sm font-semibold mt-3 block hover:text-blue-400">Add your first post</span>
              </div>
            </button>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={posts.map((p) => p.id)} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-px">
                {posts.map((post) => (
                  <SortablePost
                    key={post.id}
                    post={post}
                    onClick={() => onPostClick(post)}
                  />
                ))}
                <button
                  onClick={() => setShowAddModal(true)}
                  className="aspect-[241.833/322.433] bg-instagram-secondary border border-instagram-border flex items-center justify-center hover:bg-white/5 transition-colors"
                >
                  <Plus size={32} className="text-instagram-textSecondary" />
                </button>
              </div>
            </SortableContext>
            <DragOverlay>
              {activePost ? (
                <div className="aspect-[241.833/322.433] relative overflow-hidden bg-instagram-secondary opacity-80">
                  {activePost.imageUrl ? (
                    <Image
                      src={activePost.imageUrl}
                      alt="Dragging"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : null}
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>

      {showAddModal && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-instagram-bg/90 backdrop-blur-sm p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAddModal(false);
              setNewPostUrl("");
            }
          }}
        >
          <div className="bg-instagram-bg border border-white/10 w-full max-w-md overflow-hidden shadow-2xl transform transition-all">
            <div className="border-b border-white/10 px-6 py-5 flex items-center justify-between bg-instagram-bg/80 backdrop-blur-md">
              <div>
                <h3 className="text-lg font-bold text-instagram-text tracking-tight">Create Post</h3>
                <p className="text-xs text-instagram-text/40 font-mono mt-1">ADD NEW CONTENT</p>
              </div>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewPostUrl("");
                }}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/20 text-instagram-text/60 hover:text-instagram-text transition-all"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="p-8">
              <div className="flex gap-2 mb-6 p-1 bg-white/5 rounded-lg border border-white/5">
                <button
                  onClick={() => setUploadType("url")}
                  className={`flex-1 py-2 text-[10px] font-medium rounded transition-colors flex items-center justify-center gap-1.5 ${
                    uploadType === "url"
                      ? "bg-white/10 text-instagram-text shadow-sm"
                      : "text-instagram-text/40 hover:text-instagram-text/60"
                  }`}
                >
                  <LinkIcon size={12} /> URL
                </button>
                <button
                  onClick={() => setUploadType("file")}
                  className={`flex-1 py-2 text-[10px] font-medium rounded transition-colors flex items-center justify-center gap-1.5 ${
                    uploadType === "file"
                      ? "bg-white/10 text-instagram-text shadow-sm"
                      : "text-instagram-text/40 hover:text-instagram-text/60"
                  }`}
                >
                  <Upload size={12} /> Upload
                </button>
              </div>

              {uploadType === "url" ? (
                <div className="space-y-5">
                  <div className="group">
                    <label className="block text-[10px] font-bold text-instagram-text/40 mb-2 uppercase tracking-wider group-focus-within:text-instagram-text/80 transition-colors">Image URL</label>
                    <input
                      type="text"
                      value={newPostUrl}
                      onChange={(e) => setNewPostUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-lg text-instagram-text placeholder:text-instagram-text/20 focus:outline-none focus:bg-white/10 focus:border-white/20 transition-all font-mono text-xs"
                      autoFocus
                    />
                  </div>
                  <button
                    onClick={() => handleAddPost()}
                    disabled={!newPostUrl.trim()}
                    className="w-full py-3 bg-white text-black font-bold text-xs uppercase tracking-wide hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Post
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="group">
                    <label className="block text-[10px] font-bold text-instagram-text/40 mb-2 uppercase tracking-wider group-focus-within:text-instagram-text/80 transition-colors">Upload Images</label>
                    <label
                      className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-white/10 rounded-lg cursor-pointer hover:bg-white/5 hover:border-white/20 transition-colors group"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        await processAndAddPosts(e.dataTransfer.files);
                        setShowAddModal(false);
                      }}
                    >
                      <div className="flex flex-col items-center justify-center pointer-events-none">
                        <Upload size={40} className="text-instagram-text/30 mb-3 group-hover:text-instagram-text/50" />
                        <p className="text-xs text-instagram-text/60 font-medium mb-1">
                          <span className="font-semibold text-instagram-text">Tap to upload</span> or drag and drop
                        </p>
                        <p className="text-[10px] text-instagram-text/30">Select multiple photos at once</p>
                        <p className="text-[10px] text-instagram-text/30 mt-1">Works on phone too</p>
                      </div>
                      <input
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept="image/*"
                        multiple
                        onChange={handleFileUpload}
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
