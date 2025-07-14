import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";

interface ErrorStateProps {
  error?: Error;
}

export const ErrorState = ({ error }: ErrorStateProps) => {
  return (
    <div className="bg-black min-h-screen relative overflow-hidden">
      <ShootingStars className="z-0" />
      <StarsBackground className="z-0" />
      <div className="min-h-screen flex items-center justify-center relative z-10 px-6 md:px-12">
        <div className="text-center text-white bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8 shadow-xl max-w-md">
          <h1 className="text-2xl font-bold mb-4">Error loading module</h1>
          <p className="mb-6">Failed to load module data. Please try again.</p>
          <Link href="/learn">
            <Button
              variant="outline"
              className="bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 hover:border-white/20"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Learning
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
