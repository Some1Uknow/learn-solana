import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Module } from "./types";

interface ModuleNavigationProps {
  previousModule: Module | null;
  nextModule: Module | null;
  onPreviousClick: () => void;
  onNextClick: () => void;
}

export const ModuleNavigation = ({
  previousModule,
  nextModule,
  onPreviousClick,
  onNextClick,
}: ModuleNavigationProps) => {
  return (
    <div className="mt-12 flex justify-between items-center w-4/5 mx-auto">
      {previousModule ? (
        <Button
          variant="outline"
          className="bg-white/5 backdrop-blur-md border border-white/20 text-white hover:bg-white/10 hover:border-white/30 flex-col items-start p-4 h-auto"
          onClick={onPreviousClick}
        >
          <div className="flex items-center mb-1">
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span className="text-sm">Previous Module</span>
          </div>
          <span className="text-xs text-white/60 truncate max-w-48">
            {previousModule.title}
          </span>
        </Button>
      ) : (
        <div className="flex-1" />
      )}

      {nextModule ? (
        <Button 
          className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/15 hover:border-white/30 flex-col items-end p-4 h-auto"
          onClick={onNextClick}
        >
          <div className="flex items-center mb-1">
            <span className="text-sm">Next Module</span>
            <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
          </div>
          <span className="text-xs text-white/60 truncate max-w-48">
            {nextModule.title}
          </span>
        </Button>
      ) : (
        <div className="flex-1" />
      )}
    </div>
  );
};
