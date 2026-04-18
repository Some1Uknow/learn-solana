import { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import Image from "next/image";

import { brand } from "@/lib/brand";

export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <span className="ls-nav-brand">
        <span className="ls-nav-brand-logo" aria-hidden>
          <Image
            src={brand.assets.mark}
            alt={`${brand.name} mark`}
            width={34}
            height={34}
            className="ls-nav-brand-logo-img"
          />
        </span>
        <span className="ls-nav-brand-text">{brand.name}</span>
      </span>
    ),
  },
};
