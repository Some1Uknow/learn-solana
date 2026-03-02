import { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { TerminalSquare } from "lucide-react";

export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <span className="ls-nav-brand">
        <span className="ls-nav-brand-icon" aria-hidden>
          <TerminalSquare className="size-4" />
        </span>
        <span className="ls-nav-brand-text">learn.sol</span>
      </span>
    ),
  },
};
