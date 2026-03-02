import { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import Image from "next/image";

export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <span className="ls-nav-brand">
        <span className="ls-nav-brand-logo" aria-hidden>
          <Image
            src="/learnsol-logo.png"
            alt="learn.sol mark"
            width={30}
            height={30}
            className="ls-nav-brand-logo-img"
          />
        </span>
        <span className="ls-nav-brand-text">learn.sol</span>
      </span>
    ),
  },
};
