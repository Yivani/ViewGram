// created by Yivani yivani.dev
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export interface TourStep {
  title: string;
  content: string;
  target?: string | null;
  placement?: "top" | "bottom" | "left" | "right";
}

interface TourGuideProps {
  steps: TourStep[];
  isOpen: boolean;
  onComplete: () => void;
  onStepChange?: (step: number) => void;
}

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

const PADDING = 10;
const TOOLTIP_WIDTH = 320;
const TOOLTIP_MARGIN = 16;
const MOBILE_BREAKPOINT = 640;

export default function TourGuide({ steps, isOpen, onComplete, onStepChange }: TourGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<Rect | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number } | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const activeStep = steps[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;

  const updatePositions = useCallback(() => {
    if (!isOpen) return;

    const mobile = window.innerWidth < MOBILE_BREAKPOINT;
    setIsMobile(mobile);

    if (!activeStep.target || mobile) {
      setTargetRect(null);
      setTooltipPos(null);
      return;
    }

    const element = document.querySelector(activeStep.target) as HTMLElement | null;
    if (!element) {
      setTargetRect(null);
      setTooltipPos(null);
      return;
    }

    element.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });

    const rect = element.getBoundingClientRect();
    const pos: Rect = {
      top: rect.top - PADDING,
      left: rect.left - PADDING,
      width: rect.width + PADDING * 2,
      height: rect.height + PADDING * 2,
    };
    setTargetRect(pos);

    const tooltipEl = tooltipRef.current;
    const tooltipHeight = tooltipEl?.offsetHeight ?? 180;
    const placement = activeStep.placement;

    const fitHorizontal = (x: number) => {
      return Math.max(TOOLTIP_MARGIN, Math.min(x, window.innerWidth - TOOLTIP_WIDTH - TOOLTIP_MARGIN));
    };

    let top = 0;
    let left = 0;

    const canPlaceLeft = rect.left - TOOLTIP_WIDTH - TOOLTIP_MARGIN > TOOLTIP_MARGIN;
    const canPlaceRight = rect.right + TOOLTIP_WIDTH + TOOLTIP_MARGIN < window.innerWidth - TOOLTIP_MARGIN;

    if (placement === "left" && canPlaceLeft) {
      top = rect.top + rect.height / 2 - tooltipHeight / 2;
      left = rect.left - TOOLTIP_WIDTH - TOOLTIP_MARGIN;
    } else if (placement === "right" && canPlaceRight) {
      top = rect.top + rect.height / 2 - tooltipHeight / 2;
      left = rect.right + TOOLTIP_MARGIN;
    } else if (placement === "top") {
      top = rect.top - tooltipHeight - TOOLTIP_MARGIN;
      left = fitHorizontal(rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2);
    } else {
      top = rect.bottom + TOOLTIP_MARGIN;
      left = fitHorizontal(rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2);
    }

    if (top < TOOLTIP_MARGIN) {
      top = rect.bottom + TOOLTIP_MARGIN;
    } else if (top + tooltipHeight > window.innerHeight - TOOLTIP_MARGIN) {
      top = rect.top - tooltipHeight - TOOLTIP_MARGIN;
    }

    top = Math.max(TOOLTIP_MARGIN, Math.min(top, window.innerHeight - tooltipHeight - TOOLTIP_MARGIN));

    setTooltipPos({ top, left });
  }, [isOpen, activeStep]);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      return;
    }

    updatePositions();

    const timer = setTimeout(updatePositions, 400);
    return () => clearTimeout(timer);
  }, [isOpen, currentStep, updatePositions]);

  useEffect(() => {
    if (!isOpen) return;

    const handleResize = () => updatePositions();
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleResize, true);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleResize, true);
    };
  }, [isOpen, updatePositions]);

  useEffect(() => {
    onStepChange?.(currentStep);
  }, [currentStep, onStepChange]);

  const handleNext = () => {
    if (isLast) {
      onComplete();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleSkip = () => {
    onComplete();
  };

  if (!isOpen) return null;

  const centered = !activeStep.target || isMobile;

  return (
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 bg-black/25 pointer-events-auto" />

      {targetRect && (
        <div
          className="absolute rounded-xl pointer-events-none"
          style={{
            top: targetRect.top,
            left: targetRect.left,
            width: targetRect.width,
            height: targetRect.height,
            boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.25)",
          }}
        >
          <div className="absolute -inset-1 rounded-xl border-2 border-white/70 shadow-[0_0_20px_rgba(255,255,255,0.25)]" />
        </div>
      )}

      <div
        ref={tooltipRef}
        className={`absolute bg-zinc-950 border border-zinc-700 rounded-2xl p-6 shadow-2xl text-left transition-all duration-300 ease-out will-change-transform ${
          centered
            ? "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(90vw,320px)]"
            : "w-80"
        }`}
        style={
          !centered && tooltipPos
            ? { top: tooltipPos.top, left: tooltipPos.left }
            : undefined
        }
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-lg font-bold text-instagram-text leading-tight">{activeStep.title}</h3>
          <button
            onClick={handleSkip}
            className="text-zinc-500 hover:text-zinc-300 transition-colors"
            aria-label="Skip tour"
          >
            <X size={18} />
          </button>
        </div>

        <p className="text-sm text-zinc-300 mb-6">{activeStep.content}</p>

        <div className="flex items-center justify-center gap-1.5 mb-5">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`h-1.5 rounded-full transition-all ${
                index === currentStep ? "w-5 bg-white" : "w-1.5 bg-zinc-600 hover:bg-zinc-500"
              }`}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>

        <p className="text-[10px] text-zinc-400 text-center mb-4">
          Step {currentStep + 1} of {steps.length}
        </p>

        <div className="flex gap-3">
          {!isFirst && (
            <button
              onClick={handleBack}
              className="flex-1 py-2.5 bg-zinc-900 text-instagram-text rounded-xl font-semibold hover:bg-zinc-800 transition-colors flex items-center justify-center gap-1"
            >
              <ChevronLeft size={16} />
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            className={`flex-1 py-2.5 bg-white text-black rounded-xl font-semibold hover:bg-zinc-200 transition-colors flex items-center justify-center gap-1 ${
              isFirst ? "w-full" : ""
            }`}
          >
            {isLast ? "Get Started" : "Next"}
            {!isLast && <ChevronRight size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
