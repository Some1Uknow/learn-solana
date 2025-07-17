import { ArrowRight } from "lucide-react";
import { ComponentPropsWithoutRef, ReactNode } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  className?: string;
}

interface BentoCardProps extends ComponentPropsWithoutRef<"div"> {
  name: string;
  className: string;
  background: ReactNode;
  Icon: React.ElementType;
  description: string;
  href: string;
  cta: string;
  topicsCount?: number;
  moduleId?: string;
  hoverImage?: string;
  progress?: number;
}

const BentoGrid = ({ children, className, ...props }: BentoGridProps) => {
  return (
    <div
      className={cn(
        "grid w-full gap-4",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
  topicsCount,
  moduleId,
  hoverImage,
  progress = 0,
  ...props
}: BentoCardProps) => (<div
    key={name}
    className={cn(
      "group relative overflow-hidden rounded-2xl",
      "border transition-all duration-300",
      "flex flex-col justify-end p-6 min-h-full h-full",
      className,
    )}
    {...props}
  >    {background}      {/* Hover Image Background - perfectly fitted with spacing from all sides */}
    {hoverImage && (
      <div 
        className="absolute top-6 left-6 right-6 bottom-6 bg-contain bg-no-repeat bg-center opacity-20 group-hover:opacity-70 transition-all duration-500 z-0 rounded-lg"
        style={{ backgroundImage: `url(${hoverImage})` }}
      />
    )}
    
    {/* Dark overlay for readability */}
    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-opacity duration-500 z-1" />
      {/* Top section for icon and module info */}
    <div className="absolute top-6 left-6 right-6 z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-xs flex items-center justify-center group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300">
            <Icon className="w-5 h-5 text-white" />
          </div>
          {moduleId && (
            <span className="text-xs font-medium text-neutral-400 group-hover:text-neutral-300 uppercase tracking-wider transition-colors duration-300">
              {moduleId.replace('-', ' ')}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Progress Badge */}
          {progress !== undefined && (
            <span className={`text-xs px-2 py-1 rounded-full backdrop-blur-xs transition-all duration-300 ${
              progress === 100 
                ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                : progress > 0 
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  : 'bg-neutral-600/20 text-neutral-400 border border-neutral-600/30'
            }`}>
              {progress === 100 ? '✓ Complete' : progress > 0 ? `${progress}%` : 'Start'}
            </span>
          )}
          {topicsCount && (
            <span className="text-xs bg-white/10 group-hover:bg-white/20 px-2 py-1 rounded-full text-white/70 group-hover:text-white/90 backdrop-blur-xs transition-all duration-300">
              {topicsCount} topics
            </span>
          )}
        </div>
      </div>
      
      {/* Progress Bar */}
      {progress !== undefined && progress > 0 && (
        <div className="mt-3">
          <div className="w-full bg-neutral-800/50 rounded-full h-1.5 overflow-hidden backdrop-blur-xs">
            <div 
              className={`h-full rounded-full transition-all duration-500 ease-out ${
                progress === 100 
                  ? 'bg-linear-to-r from-green-400 to-green-500' 
                  : 'bg-linear-to-r from-blue-400 to-blue-500'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
    
    {/* Bottom-left content */}
    <div className="relative z-10 flex flex-col justify-end">      
      {/* Title and description at bottom-left */}
      <div className="mb-4">
        <h3 className="text-lg lg:text-xl font-semibold text-white mb-3 leading-tight group-hover:text-white transition-colors duration-300">
          {name}
        </h3>
        <p className="text-sm text-neutral-300 leading-relaxed group-hover:text-neutral-200 transition-colors duration-300">
          {description}
        </p>
      </div>      {/* CTA button */}
      <div className="opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
        <Button variant="ghost" asChild size="sm" className="text-white border-white/20 hover:bg-white/20 hover:border-white/40 backdrop-blur-xs group-hover:bg-white/10">
          <Link href={href}>
            {cta}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
    
    {/* Subtle hover overlay */}
    <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-white/2" />
  </div>
);

export { BentoCard, BentoGrid };
