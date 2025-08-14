import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { Alert } from '@/components/ui/alert';
import { InteractiveButton } from '@/components/learn/interactive-mdx-wrapper';
import { CodeBlock, Pre } from 'fumadocs-ui/components/codeblock';
import { Mermaid } from '@/components/fumadocs/mermaid';
import { MermaidWithZoom } from '@/components/fumadocs/mermaid-with-zoom';
import * as TabsComponents from 'fumadocs-ui/components/tabs';


export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Mermaid,
    MermaidWithZoom,
    Alert,
    TabsComponents,
    InteractiveButton,
    pre: ({ ref: _ref, ...props }) => (
      <CodeBlock {...props}>
        <Pre>{props.children}</Pre>
      </CodeBlock>
    ),
    ...components,
  };
}