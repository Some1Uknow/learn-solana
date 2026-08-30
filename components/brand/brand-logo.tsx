import Image from "next/image";

import { brand } from "@/lib/brand";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  variant?: "wordmark" | "mark" | "text" | "textBlack";
};

const assetConfig = {
  wordmark: {
    src: brand.assets.wordmarkOptimized,
    alt: `${brand.name} wordmark`,
    width: 404,
    height: 138,
  },
  mark: {
    src: brand.assets.markOptimized,
    alt: `${brand.name} mark`,
    width: 64,
    height: 64,
  },
  text: {
    src: brand.assets.text,
    alt: brand.name,
    width: 790,
    height: 160,
  },
  textBlack: {
    src: brand.assets.textBlackSource,
    alt: brand.name,
    width: 790,
    height: 160,
  },
} as const;

export function BrandLogo({
  className,
  imageClassName,
  priority = false,
  variant = "wordmark",
}: BrandLogoProps) {
  const asset = assetConfig[variant];

  return (
    <span className={cn("inline-flex items-center", className)}>
      <Image
        src={asset.src}
        alt={asset.alt}
        width={asset.width}
        height={asset.height}
        priority={priority}
        className={cn("h-auto w-full object-contain", imageClassName)}
      />
    </span>
  );
}
