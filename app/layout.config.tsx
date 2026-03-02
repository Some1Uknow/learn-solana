import { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import Image from "next/image";

export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <span className="ls-nav-brand">
        <span className="ls-nav-brand-logo" aria-hidden>
          <Image
            src="/apple-touch-icon.png"
            alt="learn.sol mark"
            width={34}
            height={34}
            className="ls-nav-brand-logo-img"
          />
        </span>
        <span className="ls-nav-brand-text">learn.sol</span>
      </span>
    ),
  },
};
