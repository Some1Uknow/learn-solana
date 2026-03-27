'use client';

import { use, useEffect, useId, useState } from 'react';
import { useTheme } from 'next-themes';

export function Mermaid({ chart }: { chart: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return <MermaidContent chart={chart} />;
}

const cache = new Map<string, Promise<unknown>>();

function cachePromise<T>(
  key: string,
  setPromise: () => Promise<T>,
): Promise<T> {
  const cached = cache.get(key);
  if (cached) return cached as Promise<T>;

  const promise = setPromise();
  cache.set(key, promise);
  return promise;
}

function MermaidContent({ chart }: { chart: string }) {
  const id = useId();
  const { resolvedTheme } = useTheme();
  const { default: mermaid } = use(
    cachePromise('mermaid', () => import('mermaid')),
  );
  const isDark = resolvedTheme === 'dark';

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'loose',
    fontFamily: 'inherit',
    theme: 'base',
    themeVariables: {
      darkMode: isDark,
      background: 'transparent',
      fontFamily: 'inherit',
      fontSize: '14px',
      primaryColor: isDark ? '#101215' : '#ffffff',
      primaryTextColor: isDark ? '#ededed' : '#111111',
      primaryBorderColor: isDark ? '#2f353d' : '#d4d4d8',
      secondaryColor: isDark ? '#15181d' : '#f5f5f5',
      secondaryTextColor: isDark ? '#d4d4d8' : '#27272a',
      secondaryBorderColor: isDark ? '#363d46' : '#d4d4d8',
      tertiaryColor: isDark ? '#0d0f12' : '#fafafa',
      tertiaryTextColor: isDark ? '#ededed' : '#111111',
      tertiaryBorderColor: isDark ? '#2a3139' : '#e4e4e7',
      lineColor: isDark ? '#6b7280' : '#71717a',
      textColor: isDark ? '#ededed' : '#18181b',
      mainBkg: isDark ? '#101215' : '#ffffff',
      secondBkg: isDark ? '#15181d' : '#f5f5f5',
      tertiaryBkg: isDark ? '#0d0f12' : '#fafafa',
      clusterBkg: isDark ? '#0b0d10' : '#fafafa',
      clusterBorder: isDark ? '#30363f' : '#d4d4d8',
      defaultLinkColor: isDark ? '#6b7280' : '#71717a',
      edgeLabelBackground: isDark ? '#09090b' : '#ffffff',
      labelBoxBkgColor: isDark ? '#09090b' : '#ffffff',
      labelBoxBorderColor: isDark ? '#30363f' : '#d4d4d8',
      noteBkgColor: isDark ? '#111418' : '#fafafa',
      noteBorderColor: isDark ? '#30363f' : '#d4d4d8',
      noteTextColor: isDark ? '#d4d4d8' : '#27272a',
      actorBkg: isDark ? '#101215' : '#ffffff',
      actorBorder: isDark ? '#30363f' : '#d4d4d8',
      actorTextColor: isDark ? '#ededed' : '#111111',
      signalColor: isDark ? '#6b7280' : '#71717a',
      signalTextColor: isDark ? '#d4d4d8' : '#27272a',
      activationBorderColor: isDark ? '#30363f' : '#d4d4d8',
      sectionBkgColor: isDark ? '#101215' : '#ffffff',
      altSectionBkgColor: isDark ? '#15181d' : '#f5f5f5',
      sectionBkgColor2: isDark ? '#15181d' : '#f5f5f5',
      gridColor: isDark ? '#2f353d' : '#d4d4d8',
      cScale0: isDark ? '#101215' : '#ffffff',
      cScale1: isDark ? '#15181d' : '#f5f5f5',
      cScale2: isDark ? '#101215' : '#ffffff',
      cScale3: isDark ? '#15181d' : '#f5f5f5',
    },
    themeCSS: `
      svg {
        margin: 0 auto;
      }

      .nodeLabel,
      .nodeLabel p,
      .nodeLabel span,
      .edgeLabel,
      .edgeLabel p,
      .edgeLabel span,
      .label,
      .label p,
      .label span {
        font-size: 14px;
        line-height: 1.35;
      }

      .cluster rect,
      .node rect,
      .node circle,
      .node ellipse,
      .node polygon,
      .node path,
      .actor,
      .labelBox,
      .note {
        filter: none;
      }

      .cluster rect {
        rx: 16px;
        ry: 16px;
      }

      .node rect,
      .node circle,
      .node ellipse,
      .node polygon,
      .node path,
      .actor,
      .labelBox,
      .note,
      .pieOuterCircle {
        stroke-width: 1px;
      }

      .edgeLabel rect,
      .labelBkg {
        rx: 8px;
        ry: 8px;
      }
    `,
  });

  const { svg, bindFunctions } = use(
    cachePromise(`${chart}-${resolvedTheme}`, () => {
      return mermaid.render(id, chart.replaceAll('\\n', '\n'));
    }),
  );
  const intrinsicWidth = svg.match(/style="max-width:\s*([0-9.]+)px;?"/)?.[1];
  const widthLockedSvg = intrinsicWidth
    ? svg.replace('width="100%"', `width="${intrinsicWidth}px"`)
    : svg;
  const renderedSvg = widthLockedSvg
    .replaceAll(
      'display: table-cell; white-space: nowrap; line-height: 1.5; max-width: 200px; text-align: center;',
      'display: table-cell; white-space: nowrap; line-height: 1.3; max-width: 200px; text-align: center; font-size: 13px;',
    )
    .replaceAll(
      '<p>',
      '<p style="margin: 0; font-size: 13px; line-height: 1.3;">',
    );

  return (
    <div className="ls-mermaid-shell">
      <div
        className="ls-mermaid-frame"
        ref={(container) => {
          if (container) bindFunctions?.(container);
        }}
      >
        <div
          className="ls-mermaid-diagram"
          dangerouslySetInnerHTML={{ __html: renderedSvg }}
        />
      </div>
    </div>
  );
}
