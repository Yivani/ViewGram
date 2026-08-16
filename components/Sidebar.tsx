// created by Yivani yivani.dev
"use client";

import {
  Home,
  Search,
  Compass,
  Send,
  Heart,
  PlusSquare,
  User,
  Menu,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="group fixed left-0 top-0 h-screen w-16 hover:w-64 flex flex-col items-center py-4 border-r border-instagram-border bg-instagram-bg transition-all duration-300 z-50 overflow-hidden">
      <div className="mb-8">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          className="text-instagram-text"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
        </svg>
      </div>
      
      <nav className="flex flex-col gap-6 w-full">
        <button className="flex items-center justify-center group-hover:justify-start gap-4 group-hover:px-4 text-instagram-text hover:opacity-70 transition-opacity w-full">
          <Home size={24} />
          <span className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Home</span>
        </button>
        <button className="flex items-center justify-center group-hover:justify-start gap-4 group-hover:px-4 text-instagram-text hover:opacity-70 transition-opacity w-full">
          <Search size={24} />
          <span className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Search</span>
        </button>
        <button className="flex items-center justify-center group-hover:justify-start gap-4 group-hover:px-4 text-instagram-text hover:opacity-70 transition-opacity w-full">
          <Compass size={24} />
          <span className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Explore</span>
        </button>
        <button className="flex items-center justify-center group-hover:justify-start gap-4 group-hover:px-4 text-instagram-text hover:opacity-70 transition-opacity w-full">
          <Send size={24} />
          <span className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Messages</span>
        </button>
        <button className="flex items-center justify-center group-hover:justify-start gap-4 group-hover:px-4 text-instagram-text hover:opacity-70 transition-opacity w-full">
          <Heart size={24} />
          <span className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Notifications</span>
        </button>
        <button className="flex items-center justify-center group-hover:justify-start gap-4 group-hover:px-4 text-instagram-text hover:opacity-70 transition-opacity w-full">
          <PlusSquare size={24} />
          <span className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Create</span>
        </button>
        <button className="flex items-center justify-center group-hover:justify-start gap-4 group-hover:px-4 text-instagram-text hover:opacity-70 transition-opacity w-full">
          <User size={24} />
          <span className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Profile</span>
        </button>
      </nav>

      <div className="mt-auto flex flex-col gap-6 w-full">
        <button className="flex items-center justify-center group-hover:justify-start gap-4 group-hover:px-4 text-instagram-text hover:opacity-70 transition-opacity w-full">
          <Menu size={24} />
          <span className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">More</span>
        </button>
      </div>
    </aside>
  );
}

