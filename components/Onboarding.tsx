// created by Yivani yivani.dev
"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Heart,
  Shield,
  Smartphone,
  LayoutGrid,
  UserRound,
  Upload,
  Move,
  Eye,
  Sparkles,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

interface OnboardingProps {
  onComplete: () => void;
}

const steps = [
  {
    icon: <Sparkles size={20} />,
    title: "Welcome to ViewGram",
    description: "Plan, preview, and perfect your Instagram profile before you post.",
    note: "ViewGram is not affiliated with or endorsed by Instagram. We do not post, schedule, or manage your account — this is a visual planner only.",
  },
  {
    icon: <UserRound size={20} />,
    title: "Build your profile",
    description: "Tap Edit Page to set your username, bio, profile picture, and stats. Everything you change updates instantly in the preview.",
  },
  {
    icon: <Upload size={20} />,
    title: "Add your posts",
    description: "Upload images or paste URLs to fill your grid. Add captions and likes to make the preview feel real.",
  },
  {
    icon: <Move size={20} />,
    title: "Arrange your grid",
    description: "Drag and drop posts to find the perfect layout. Reorder anytime until your feed looks just right.",
  },
  {
    icon: <Eye size={20} />,
    title: "Preview everything",
    description: "Switch to the mobile view to see exactly how your profile will look. Tap any post to edit its details.",
  },
  {
    icon: <Heart size={20} />,
    title: "You're all set",
    description: "No account needed, no data leaves your browser. Start planning your next posts with confidence.",
  },
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const totalSteps = steps.length;

  const isFirst = step === 0;
  const isLast = step === totalSteps - 1;

  const handleNext = () => {
    if (isLast) {
      onComplete();
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(0, prev - 1));
  };

  const current = steps[step];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-instagram-bg/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-8 shadow-2xl text-center">
        {isFirst && (
          <div className="w-16 h-16 mx-auto mb-6 relative rounded-full overflow-hidden border border-zinc-700">
            <Image src="/logo.png" alt="ViewGram Logo" fill className="object-cover" />
          </div>
        )}

        {!isFirst && (
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
            {current.icon}
          </div>
        )}

        <h1 className="text-2xl font-bold text-instagram-text mb-3">{current.title}</h1>
        <p className="text-zinc-400 text-sm mb-4">{current.description}</p>

        {current.note && (
          <p className="text-zinc-500 text-xs mb-8">{current.note}</p>
        )}

        {isFirst && (
          <div className="space-y-3 text-left mb-8">
            {[
              { icon: <Shield size={18} />, text: "Everything stays in your browser" },
              { icon: <LayoutGrid size={18} />, text: "Drag & drop your grid" },
              { icon: <Smartphone size={18} />, text: "See the mobile preview live" },
              { icon: <Heart size={18} />, text: "No account needed — completely free" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900 border border-zinc-800"
              >
                <div className="text-zinc-300">{item.icon}</div>
                <span className="text-sm text-zinc-300">{item.text}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-center gap-2 mb-6">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setStep(index)}
              className={`h-2 rounded-full transition-all ${
                index === step ? "w-6 bg-white" : "w-2 bg-zinc-700 hover:bg-zinc-600"
              }`}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>

        <p className="text-xs text-zinc-500 mb-6">
          Step {step + 1} of {totalSteps}
        </p>

        <div className="flex gap-3">
          {!isFirst && (
            <button
              onClick={handleBack}
              className="flex-1 py-3 bg-zinc-900 text-instagram-text rounded-xl font-semibold hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
            >
              <ChevronLeft size={18} />
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            className={`flex-1 py-3 bg-white text-black rounded-xl font-semibold hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 ${
              isFirst ? "w-full" : ""
            }`}
          >
            {isLast ? "Start Planning" : "Next"}
            {!isLast && <ChevronRight size={18} />}
          </button>
        </div>

        <p className="text-[10px] text-zinc-500 mt-4">
          Your data is saved locally via your browser&apos;s storage.
        </p>
      </div>
    </div>
  );
}
