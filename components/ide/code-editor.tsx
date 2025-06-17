"use client";

import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";

const sampleCode = `
// Let the magic weave! Rust, Anchor, and Solana are your tools of choice :)
`;

export default function CodeEditor({ code, onChange }: { code?: string; onChange?: (value: string) => void }) {
  const [value, setValue] = useState(code || sampleCode);
  const [mounted, setMounted] = useState(false);

  // Update value when code prop changes
  useEffect(() => {
    if (code) {
      setValue(code);
    }
  }, [code]);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) {
    return <div className="h-full w-full bg-black/40 animate-pulse" />;
  }

  return (
    <div className="h-full w-full relative">
      <Editor
        defaultLanguage="rust"
        defaultValue={sampleCode}
        value={value}
        onChange={(value) => {
          setValue(value ?? "");
          onChange?.(value ?? "");
        }}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 4,
          formatOnPaste: true,
          formatOnType: true,
        }}
        className="h-full w-full absolute inset-0"
      />
    </div>
  );
}
