import ReactMarkdown from 'react-markdown';
import React from 'react';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypeHighlight from 'rehype-highlight';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';
import 'highlight.js/styles/atom-one-dark.css'; // Import a dark theme for code highlighting
import 'katex/dist/katex.min.css'; // Import KaTeX styles for math rendering

interface MarkdownProps {
  children: string;
  className?: string;
}

type CodeProps = {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
};

export function Markdown({ children, className }: MarkdownProps) {
  return (
    <div className={cn('markdown-container', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[
          rehypeRaw, 
          rehypeSanitize, 
          rehypeKatex,
          [rehypeHighlight, { detect: true, ignoreMissing: true }]
        ]}
        components={{
          // Override default components for more custom styling
          div: ({ className, children, ...props }) => (
            <div 
              {...props} 
              className={cn(
                'prose prose-invert max-w-none',
                // Links
                'prose-a:text-[#14F195] prose-a:no-underline hover:prose-a:underline',
                // Inline code
                'prose-code:bg-white/10 prose-code:rounded prose-code:px-1.5 prose-code:py-0.5 prose-code:font-normal prose-code:before:content-none prose-code:after:content-none',
                // Code blocks - removing specific styling here as we'll handle in the pre component
                'prose-pre:p-0 prose-pre:bg-transparent prose-pre:my-4',
                // Lists
                'prose-ul:my-4 prose-li:my-1.5',
                // Custom spacing - INCREASED line height and margins
                'prose-p:my-4 prose-p:leading-relaxed prose-headings:mb-5 prose-headings:mt-6',
                // Blockquotes
                'prose-blockquote:border-l-[#14F195] prose-blockquote:bg-white/5 prose-blockquote:rounded-r-lg prose-blockquote:py-1',
                className
              )}
            >
              {children}
            </div>
          ),
          a: ({ href, children, ...props }) => {
            const isExternal = href?.startsWith('http');
            return (
              <a 
                href={href} 
                target={isExternal ? "_blank" : undefined} 
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="inline-flex items-center gap-1 hover:underline"
                {...props}
              >
                {children}
                {isExternal && <ExternalLink className="h-3.5 w-3.5" />}
              </a>
            );
          },
          // Make sure paragraphs don't contain block elements
          p: ({ children, ...props }) => {
            // Check if children contain block elements
            const hasBlockElements = React.Children.toArray(children).some(
              child => typeof child === 'object' && React.isValidElement(child) && 
              ['div', 'pre', 'ul', 'ol', 'table'].includes((child.type as any)?.name || child.type as string)
            );

            // If paragraph contains block elements, render children directly
            if (hasBlockElements) {
              return <>{children}</>;
            }

            // Otherwise render as normal paragraph
            return (
              <p className="break-words" {...props}>
                {children}
              </p>
            );
          },
          pre: ({ children }) => {
            // The pre component just acts as a container, but we want
            // the header and code content to be handled by the code component
            return <>{children}</>;
          },
          code: ({ node, inline, className, children, ...props }: CodeProps) => {
            const [copied, setCopied] = useState(false);
            
            const match = /language-(\w+)/.exec(className || '');
            const lang = match ? match[1] : '';
            const codeString = String(children).replace(/\n$/, '');
            
            const copyToClipboard = () => {
              navigator.clipboard.writeText(codeString);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            };
            
            if (inline) {
              return (
                <code className={cn("bg-white/10 rounded px-1.5 py-0.5 font-normal", className)} {...props}>
                  {children}
                </code>
              );
            }
            
            return (
              <div className="not-prose rounded-lg overflow-hidden bg-[#1e1e2e] border border-white/10 my-4">
                {/* Code header with language and copy button - now at the very top */}
                <div className="flex items-center justify-between px-4 py-2 bg-[#252538] border-b border-white/10 text-sm">
                  <span className="font-mono text-white/70">{lang || 'code'}</span>
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-1 text-white/60 hover:text-white transition-colors"
                    aria-label={copied ? "Copied" : "Copy code"}
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        <span className="text-xs">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span className="text-xs">Copy</span>
                      </>
                    )}
                  </button>
                </div>
                
                {/* Code content */}
                <div className="overflow-x-auto p-4 bg-[#1e1e2e] text-white/90">
                  <code className={cn(
                    "text-sm font-mono whitespace-pre", 
                    className
                  )} {...props}>
                    {children}
                  </code>
                </div>
              </div>
            );
          },
          // Enhance tables with responsive container
          table: ({ children, ...props }) => (
            <div className="overflow-x-auto w-full my-6">
              <table className="w-full border-collapse" {...props}>
                {children}
              </table>
            </div>
          ),
          // Add image width control and ensure they're responsive
          img: ({ src, alt, ...props }) => (
            <img 
              src={src} 
              alt={alt || ""} 
              className="rounded-md max-w-full h-auto my-4" 
              loading="lazy"
              {...props} 
            />
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}