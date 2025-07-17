"use client";

import { useState } from "react";
import { Topic } from "@/types/learning";
import { Card } from "@/components/ui/card";
import { Mic } from "lucide-react";

interface TopicSidebarProps {
  moduleId: string;
  currentTopicId: string;
  topics: Topic[];
}

export default function TopicSidebar({
  moduleId,
  currentTopicId,
  topics,
}: TopicSidebarProps) {
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  return (
    <Card
      className={`
      backdrop-blur-xl text-white h-screen lg:h-[calc(100vh-64px)] sticky top-0 lg:top-16 
      animate-in slide-in-from-right transition-all duration-700 ease-out
      ${
        isInitialized
          ? "bg-blue-500/20 lg:bg-blue-500/15 border-blue-400/30"
          : "bg-black/80 lg:bg-white/10 border-white/20"
      }
    `}
    >
      {/* Empty content area */}
      <div className="h-full relative">
        {" "}
        {/* Voice wave animation */}
        <div className="absolute bottom-40 left-1/2 transform -translate-x-1/2">
          <div className="flex items-end justify-center space-x-2 h-20">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className={`rounded-sm transition-all duration-300 ${
                  isVoiceActive && isInitialized ? "animate-pulse" : ""
                } ${
                  !isInitialized
                    ? "bg-white/20"
                    : isInitialized
                    ? "bg-blue-400/70"
                    : "bg-white/60"
                }`}
                style={{
                  width: "6px",
                  height:
                    isVoiceActive && isInitialized
                      ? `${Math.random() * 50 + 25}px`
                      : "12px",
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        </div>
        {/* Mic icon in bottom middle */}
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2">
          <button
            onClick={() => {
              if (isInitialized) {
                setIsVoiceActive(!isVoiceActive);
              }
            }}
            disabled={!isInitialized}
            title={
              !isInitialized
                ? "Initialize voice mode first"
                : isVoiceActive
                ? "Stop voice recording"
                : "Start voice recording"
            }
            aria-label={
              !isInitialized
                ? "Initialize voice mode first"
                : isVoiceActive
                ? "Stop voice recording"
                : "Start voice recording"
            }
            className={`
              p-4 rounded-full border-2 backdrop-blur-md
              transition-all duration-300 
              ${
                !isInitialized
                  ? "cursor-not-allowed opacity-50"
                  : "hover:scale-110 cursor-pointer"
              }
              ${
                isVoiceActive && isInitialized
                  ? "bg-red-500/80 border-red-400/50 shadow-lg shadow-red-500/30"
                  : isInitialized
                  ? "bg-blue-500/20 border-blue-400/40 hover:bg-blue-500/30"
                  : "bg-white/10 border-white/30"
              }
            `}
          >
            <Mic
              className={`h-6 w-6 transition-colors duration-300 ${
                !isInitialized
                  ? "text-white/30"
                  : isVoiceActive
                  ? "text-white"
                  : "text-blue-300"
              }`}
            />
          </button>
        </div>
        {/* Futuristic Toggle Switch at bottom left */}
        <div className="absolute bottom-6 left-6">
          <div className="flex flex-col items-start space-y-2">
            <span
              className={`text-xs font-medium transition-colors duration-300 ${
                isInitialized ? "text-blue-300" : "text-white/70"
              }`}
            >
              Initialize
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              {" "}
              <input
                type="checkbox"
                className="sr-only peer"
                title="Initialize voice mode"
                aria-label="Initialize voice mode"
                checked={isInitialized}
                onChange={(e) => {
                  setIsInitialized(e.target.checked);
                  if (!e.target.checked) {
                    setIsVoiceActive(false); // Reset voice when disabling
                  }
                }}
              />
              <div
                className={`
                w-14 h-7 rounded-md border-2 transition-all duration-500 ease-out
                peer-focus:outline-hidden peer-focus:ring-2 peer-focus:ring-blue-400/50
                ${
                  isInitialized
                    ? "bg-blue-500/30 border-blue-400/60 shadow-lg shadow-blue-500/20"
                    : "bg-white/10 border-white/30"
                }
                peer-checked:after:translate-x-7 after:content-[''] after:absolute 
                after:top-[2px] after:left-[2px] after:rounded-sm after:h-5 after:w-5 
                after:transition-all after:duration-300 after:shadow-md
                ${
                  isInitialized
                    ? "after:bg-blue-400 after:shadow-blue-400/50"
                    : "after:bg-white"
                }
              `}
              >
                <div
                  className={`
                  absolute inset-0 rounded-md transition-all duration-500
                  ${
                    isInitialized
                      ? "bg-linear-to-r from-blue-500/20 to-blue-400/20"
                      : ""
                  }
                `}
                />
              </div>
            </label>
          </div>
        </div>
      </div>
    </Card>
  );
}
