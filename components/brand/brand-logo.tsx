import Image from "next/image";

import { brand } from "@/lib/brand";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  variant?: "wordmark" | "mark" | "text";
};

const assetConfig = {
  wordmark: {
    src: brand.assets.wordmark,
    alt: `${brand.name} wordmark`,
    width: 808,
    height: 276,
  },
  mark: {
    src: brand.assets.mark,
    alt: `${brand.name} mark`,
    width: 530,
    height: 530,
  },
  text: {
    src: brand.assets.text,
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
