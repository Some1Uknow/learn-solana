"use client";

import { FC } from "react";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";

// MDX components with our styling
const components = {
  h1: (props: any) => <h1 className="text-3xl font-bold text-white mb-4 mt-6" {...props} />,
  h2: (props: any) => <h2 className="text-2xl font-semibold text-white mb-3 mt-6" {...props} />,
  h3: (props: any) => <h3 className="text-xl font-semibold text-white mb-2 mt-4" {...props} />,
  p: (props: any) => <p className="text-white/80 mb-4" {...props} />,
  ul: (props: any) => <ul className="text-white/80 mb-4 list-disc ml-6" {...props} />,
  ol: (props: any) => <ol className="text-white/80 mb-4 list-decimal ml-6" {...props} />,
  li: (props: any) => <li className="mb-2" {...props} />,
  code: (props: any) => (
    <code className="bg-white/10 rounded px-1 py-0.5 font-mono text-sm" {...props} />
  ),
  pre: (props: any) => (
    <pre className="bg-black/50 backdrop-blur-md border border-white/10 rounded-lg p-4 overflow-x-auto my-4 font-mono text-sm text-white/90">
      {props.children}
    </pre>
  ),
};

interface MDXContentProps {
  source: MDXRemoteSerializeResult;
}

const MDXContent: FC<MDXContentProps> = ({ source }) => {
  return (
    <div className="prose prose-invert max-w-none">
      {source ? (
        <MDXRemote {...source} components={components} />
      ) : (
        <div className="text-white/60 animate-pulse">Loading content...</div>
      )}
    </div>
  );
};

export default MDXContent;
