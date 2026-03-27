import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { Children, isValidElement } from 'react';
import { Alert } from '@/components/ui/alert';
import { InteractiveButton } from '@/components/learn/interactive-mdx-wrapper';
import { CodeBlock, Pre } from 'fumadocs-ui/components/codeblock';
import { Mermaid } from '@/components/fumadocs/mermaid';
import { MermaidWithZoom } from '@/components/fumadocs/mermaid-with-zoom';
import * as TabsComponents from 'fumadocs-ui/components/tabs';
// Phase 6: Premium learning components
import { Callout, InfoCallout, WarningCallout, TipCallout, DeepDive } from '@/components/learn/callouts';
import { QuickCheck } from '@/components/learn/quick-check';
import { ConceptCard, ConceptCardGrid, ConceptCards } from '@/components/learn/concept-card';
import { UpNextCard } from '@/components/learn/up-next';

function extractMermaidChart(children: unknown): string | null {
  const nodes = Children.toArray(children);
  const codeNode = nodes.find((node) => isValidElement(node));
  if (!codeNode || !isValidElement(codeNode)) return null;

  const className =
    typeof codeNode.props.className === 'string' ? codeNode.props.className : '';
  if (!className.includes('language-mermaid')) return null;

  const raw = codeNode.props.children;
  if (typeof raw === 'string') return raw.trim();

  if (Array.isArray(raw)) {
    const text = raw.filter((part): part is string => typeof part === 'string').join('');
    return text.trim() || null;
  }

  return null;
}

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Mermaid,
    MermaidWithZoom,
    Alert,
    TabsComponents,
    InteractiveButton,
    // Phase 6: Premium learning components
    Callout,
    InfoCallout,
    WarningCallout,
    TipCallout,
    DeepDive,
    QuickCheck,
    ConceptCard,
    ConceptCardGrid,
    ConceptCards,
    UpNextCard,
    pre: ({ ref: _ref, ...props }) => {
      const chart = extractMermaidChart(props.children);

      if (chart) {
        return <Mermaid chart={chart} />;
      }

      return (
        <CodeBlock {...props}>
          <Pre>{props.children}</Pre>
        </CodeBlock>
      );
    },
    ...components,
  };
}
