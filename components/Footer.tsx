// created by Yivani yivani.dev
"use client";

import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-instagram-bg py-8">
      <div className="max-w-screen-2xl mx-auto px-4 flex flex-col items-center gap-3 text-center">
        <p className="text-sm text-zinc-300 flex items-center gap-1.5">
          Built with <Heart size={14} className="text-red-500 fill-red-500" /> by{" "}
          <a
            href="https://yivani.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-instagram-text hover:underline"
          >
            Yivani
          </a>
        </p>
        <p className="text-xs text-zinc-500">
          © {new Date().getFullYear()} ViewGram. All rights reserved. Not affiliated with Instagram.
        </p>
        <p className="text-[10px] text-zinc-600">
          All data is stored locally in your browser. Nothing is uploaded.
        </p>
      </div>
    </footer>
  );
}
