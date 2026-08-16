// created by Yivani yivani.dev
"use client";

import { Link2, Circle } from "lucide-react";
import Image from "next/image";
import type { ProfileData } from "@/types";
import { formatNumber } from "@/utils/formatNumber";

interface ProfileHeaderProps {
  profile: ProfileData;
}

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
  const normalizeUrl = (url: string): string => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    return `https://${url}`;
  };

  const getDisplayUrl = (url: string): string => {
    return url.replace(/^https?:\/\//, "");
  };

  return (
    <>
      <div className="hidden md:flex w-full max-w-[1456px] mx-auto px-4 py-8 justify-center">
        <div className="flex gap-6 items-start w-full max-w-4xl md:pl-48">
          <div className="relative">
            <div className="w-[150px] h-[150px] rounded-full overflow-hidden border border-instagram-border bg-instagram-secondary">
              {profile.profileImage ? (
                <Image
                  src={profile.profileImage}
                  alt={profile.username || "Profile"}
                  width={150}
                  height={150}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full bg-instagram-secondary flex items-center justify-center">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-instagram-textSecondary">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1">
            <div className="mb-1">
              <h1 className="text-xl font-bold text-instagram-text">
                {profile.username || "username"}
              </h1>
            </div>

            <div className="mb-3">
              <h2 className="text-instagram-text font-normal">
                {profile.displayName || "Full Name"}
              </h2>
            </div>

            <div className="flex gap-8 mb-4 text-sm">
              <span className="text-instagram-text">
                <strong className="font-semibold">{formatNumber(profile.stats.posts)}</strong> posts
              </span>
              <span className="text-instagram-text">
                <strong className="font-semibold">{formatNumber(profile.stats.followers)}</strong> followers
              </span>
              <span className="text-instagram-text">
                <strong className="font-semibold">{formatNumber(profile.stats.following)}</strong> following
              </span>
            </div>

            <div className="mb-2 whitespace-pre-line text-instagram-text text-sm">
              {profile.bio || "Bio description goes here"}
            </div>

            <div className="flex items-center gap-1.5 mb-4" style={{ color: '#85a1ff' }}>
              <Link2 size={12} className="rotate-[-45deg]" />
              {profile.externalLink ? (
                <a
                  href={normalizeUrl(profile.externalLink)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:underline"
                >
                  {getDisplayUrl(profile.externalLink)}
                </a>
              ) : (
                <span className="text-sm">website.com</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="md:hidden w-full px-4 py-4">
        <div className="flex items-center gap-6 mb-4">
          <div className="w-[77px] h-[77px] rounded-full overflow-hidden p-[2px] bg-[#262626] flex-shrink-0">
            <div className="w-full h-full rounded-full overflow-hidden border border-black bg-instagram-secondary">
              {profile.profileImage ? (
                <Image
                  src={profile.profileImage}
                  alt={profile.username || "Profile"}
                  width={77}
                  height={77}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full bg-instagram-secondary flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-instagram-textSecondary">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-col gap-1 flex-1">
            <h2 className="text-instagram-text font-bold text-base leading-none mb-3">{profile.username || "username"}</h2>
            <div className="flex items-center gap-8">
              <div className="flex flex-col">
                <span className="text-[15px] font-bold text-instagram-text leading-none">{formatNumber(profile.stats.posts)}</span>
                <span className="text-[13px] text-instagram-text leading-tight">posts</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-bold text-instagram-text leading-none">{formatNumber(profile.stats.followers)}</span>
                <span className="text-[13px] text-instagram-text leading-tight">followers</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-bold text-instagram-text leading-none">{formatNumber(profile.stats.following)}</span>
                <span className="text-[13px] text-instagram-text leading-tight">following</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-0.5">
          <div className="font-bold text-instagram-text text-sm">{profile.displayName || "Full Name"}</div>
          <div className="text-instagram-text text-sm whitespace-pre-line">{profile.bio || "Bio description goes here"}</div>
          <div className="flex items-center gap-1 mt-1" style={{ color: '#85a1ff' }}>
            <Link2 size={12} className="rotate-[-45deg]" />
            {profile.externalLink ? (
              <a
                href={normalizeUrl(profile.externalLink)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:underline"
              >
                {getDisplayUrl(profile.externalLink)}
              </a>
            ) : (
              <span className="text-sm">website.com</span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
