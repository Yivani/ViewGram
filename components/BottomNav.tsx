// created by Yivani yivani.dev
"use client";

export default function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-instagram-border bg-instagram-bg flex justify-center gap-12 py-3 z-40">
      <button className="flex flex-col items-center gap-1">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-instagram-text">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
        </svg>
        <div className="w-1 h-1 rounded-full bg-instagram-text" />
      </button>
      <button className="flex flex-col items-center gap-1">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-instagram-textSecondary">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </button>
    </div>
  );
}

