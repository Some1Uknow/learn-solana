import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { Alert } from '@/components/ui/alert';
import { InteractiveButton } from '@/components/learn/interactive-mdx-wrapper';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Alert,
    InteractiveButton,
    ...components,
  };
}