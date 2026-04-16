"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef } from "react";
import type { BeforeMount, EditorProps, Monaco, OnMount } from "@monaco-editor/react";

const MonacoEditorComponent = dynamic(
  () => import("@monaco-editor/react").then((module) => module.default),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-0 items-center justify-center border border-white/10 bg-black/30 text-xs text-zinc-500">
        Loading editor...
      </div>
    ),
  }
);

const MONACO_THEME = "learnsol-dark";
const FONT_FAMILY =
  "var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";

const RUST_LANGUAGE_CONFIGURATION = {
  comments: {
    lineComment: "//",
    blockComment: ["/*", "*/"],
  },
  brackets: [
    ["{", "}"],
    ["[", "]"],
    ["(", ")"],
  ],
  autoClosingPairs: [
    { open: "[", close: "]" },
    { open: "{", close: "}" },
    { open: "(", close: ")" },
    { open: '"', close: '"', notIn: ["string"] },
  ],
  surroundingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
  ],
  folding: {
    markers: {
      start: /^\s*#pragma\s+region\b/,
      end: /^\s*#pragma\s+endregion\b/,
    },
  },
};

const RUST_MONARCH_LANGUAGE = {
  tokenPostfix: ".rust",
  defaultToken: "invalid",
  keywords: [
    "as",
    "async",
    "await",
    "box",
    "break",
    "const",
    "continue",
    "crate",
    "dyn",
    "else",
    "enum",
    "extern",
    "false",
    "fn",
    "for",
    "if",
    "impl",
    "in",
    "let",
    "loop",
    "match",
    "mod",
    "move",
    "mut",
    "pub",
    "ref",
    "return",
    "self",
    "static",
    "struct",
    "super",
    "trait",
    "true",
    "try",
    "type",
    "unsafe",
    "use",
    "where",
    "while",
    "catch",
    "default",
    "union",
    "abstract",
    "alignof",
    "become",
    "do",
    "final",
    "macro",
    "offsetof",
    "override",
    "priv",
    "proc",
    "pure",
    "sizeof",
    "typeof",
    "unsized",
    "virtual",
    "yield",
  ],
  typeKeywords: [
    "Self",
    "m32",
    "m64",
    "m128",
    "f80",
    "f16",
    "f128",
    "int",
    "uint",
    "float",
    "char",
    "bool",
    "u8",
    "u16",
    "u32",
    "u64",
    "f32",
    "f64",
    "i8",
    "i16",
    "i32",
    "i64",
    "str",
    "Option",
    "Either",
    "c_float",
    "c_double",
    "c_void",
    "FILE",
    "fpos_t",
    "DIR",
    "dirent",
    "c_char",
    "c_schar",
    "c_uchar",
    "c_short",
    "c_ushort",
    "c_int",
    "c_uint",
    "c_long",
    "c_ulong",
    "size_t",
    "ptrdiff_t",
    "clock_t",
    "time_t",
    "c_longlong",
    "c_ulonglong",
    "intptr_t",
    "uintptr_t",
    "off_t",
    "dev_t",
    "ino_t",
    "pid_t",
    "mode_t",
    "ssize_t",
  ],
  constants: ["true", "false", "Some", "None", "Left", "Right", "Ok", "Err"],
  supportConstants: [
    "EXIT_FAILURE",
    "EXIT_SUCCESS",
    "RAND_MAX",
    "EOF",
    "SEEK_SET",
    "SEEK_CUR",
    "SEEK_END",
    "_IOFBF",
    "_IONBF",
    "_IOLBF",
    "BUFSIZ",
    "FOPEN_MAX",
    "FILENAME_MAX",
    "L_tmpnam",
    "TMP_MAX",
    "O_RDONLY",
    "O_WRONLY",
    "O_RDWR",
    "O_APPEND",
    "O_CREAT",
    "O_EXCL",
    "O_TRUNC",
    "S_IFIFO",
    "S_IFCHR",
    "S_IFBLK",
    "S_IFDIR",
    "S_IFREG",
    "S_IFMT",
    "S_IEXEC",
    "S_IWRITE",
    "S_IREAD",
    "S_IRWXU",
    "S_IXUSR",
    "S_IWUSR",
    "S_IRUSR",
    "F_OK",
    "R_OK",
    "W_OK",
    "X_OK",
    "STDIN_FILENO",
    "STDOUT_FILENO",
    "STDERR_FILENO",
  ],
  supportMacros: [
    "format!",
    "print!",
    "println!",
    "panic!",
    "format_args!",
    "unreachable!",
    "write!",
    "writeln!",
  ],
  operators: [
    "!",
    "!=",
    "%",
    "%=",
    "&",
    "&=",
    "&&",
    "*",
    "*=",
    "+",
    "+=",
    "-",
    "-=",
    "->",
    ".",
    "..",
    "...",
    "/",
    "/=",
    ":",
    ";",
    "<<",
    "<<=",
    "<",
    "<=",
    "=",
    "==",
    "=>",
    ">",
    ">=",
    ">>",
    ">>=",
    "@",
    "^",
    "^=",
    "|",
    "|=",
    "||",
    "_",
    "?",
    "#",
  ],
  escapes: /\\([nrt0"'\u0027\\]|x\h{2}|u\{\h{1,6}\})/,
  delimiters: /[,]/,
  symbols: /[\#\!\%\&\*\+\-\.\/\:\;\<\=\>\@\^\|_\?]+/,
  intSuffixes: /[iu](8|16|32|64|128|size)/,
  floatSuffixes: /f(32|64)/,
  tokenizer: {
    root: [
      [/r(#*)"/, { token: "string.quote", bracket: "@open", next: "@stringraw.$1" }],
      [
        /[a-zA-Z][a-zA-Z0-9_]*!?|_[a-zA-Z0-9_]+/,
        {
          cases: {
            "@typeKeywords": "keyword.type",
            "@keywords": "keyword",
            "@supportConstants": "keyword",
            "@supportMacros": "keyword",
            "@constants": "keyword",
            "@default": "identifier",
          },
        },
      ],
      [/\$/, "identifier"],
      [/'[a-zA-Z_][a-zA-Z0-9_]*(?=[^\'])/, "identifier"],
      [/'(\S|@escapes)'/, "string.byteliteral"],
      [/"/, { token: "string.quote", bracket: "@open", next: "@string" }],
      { include: "@numbers" },
      { include: "@whitespace" },
      [
        /@delimiters/,
        {
          cases: {
            "@keywords": "keyword",
            "@default": "delimiter",
          },
        },
      ],
      [/[{}()\[\]<>]/, "@brackets"],
      [/@symbols/, { cases: { "@operators": "operator", "@default": "" } }],
    ],
    whitespace: [
      [/[ \t\r\n]+/, "white"],
      [/\/\*/, "comment", "@comment"],
      [/\/\/.*$/, "comment"],
    ],
    comment: [
      [/[^\/*]+/, "comment"],
      [/\/\*/, "comment", "@push"],
      ["\\*/", "comment", "@pop"],
      [/[\/*]/, "comment"],
    ],
    string: [
      [/[^\\"]+/, "string"],
      [/@escapes/, "string.escape"],
      [/\\./, "string.escape.invalid"],
      [/"/, { token: "string.quote", bracket: "@close", next: "@pop" }],
    ],
    stringraw: [
      [/[^"#]+/, { token: "string" }],
      [
        /"(#*)/,
        {
          cases: {
            "$1==$S2": { token: "string.quote", bracket: "@close", next: "@pop" },
            "@default": { token: "string" },
          },
        },
      ],
      [/["#]/, { token: "string" }],
    ],
    numbers: [
      [/(0o[0-7_]+)(@intSuffixes)?/, { token: "number" }],
      [/(0b[0-1_]+)(@intSuffixes)?/, { token: "number" }],
      [/[\d][\d_]*(\.[\d][\d_]*)?[eE][+-][\d_]+(@floatSuffixes)?/, { token: "number" }],
      [/\b(\d\.?[\d_]*)(@floatSuffixes)?\b/, { token: "number" }],
      [/(0x[\da-fA-F]+)_?(@intSuffixes)?/, { token: "number" }],
      [/[\d][\d_]*(@intSuffixes?)?/, { token: "number" }],
    ],
  },
} as const;

const MONACO_OPTIONS: EditorProps["options"] = {
  automaticLayout: true,
  fontFamily: FONT_FAMILY,
  fontLigatures: true,
  fontSize: 13,
  lineHeight: 20,
  tabSize: 4,
  insertSpaces: true,
  detectIndentation: false,
  trimAutoWhitespace: true,
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  smoothScrolling: true,
  cursorBlinking: "smooth",
  cursorSmoothCaretAnimation: "on",
  renderLineHighlight: "all",
  renderLineHighlightOnlyWhenFocus: true,
  glyphMargin: false,
  folding: true,
  overviewRulerBorder: false,
  hideCursorInOverviewRuler: true,
  lineDecorationsWidth: 12,
  lineNumbersMinChars: 3,
  guides: {
    indentation: true,
    bracketPairs: true,
    highlightActiveIndentation: true,
  },
  bracketPairColorization: {
    enabled: true,
  },
  quickSuggestions: true,
  suggestOnTriggerCharacters: true,
  parameterHints: { enabled: true },
  wordWrap: "off",
  scrollbar: {
    verticalScrollbarSize: 8,
    horizontalScrollbarSize: 8,
    useShadows: false,
  },
  padding: { top: 14, bottom: 14 },
  overviewRulerLanes: 0,
  contextmenu: true,
  fixedOverflowWidgets: true,
  occurrencesHighlight: "singleFile",
  selectionHighlight: true,
  codeLens: false,
  dragAndDrop: true,
  inlayHints: { enabled: "off" },
  renderWhitespace: "selection",
  unicodeHighlight: {
    nonBasicASCII: false,
    invisibleCharacters: false,
    ambiguousCharacters: false,
  },
  accessibilitySupport: "auto",
};

type Props = {
  value: string;
  onChange: (nextValue: string) => void;
  onRun: () => void;
  height: number | string;
};

export function RustMonacoEditor({ value, onChange, onRun, height }: Props) {
  const runRef = useRef(onRun);

  useEffect(() => {
    runRef.current = onRun;
  }, [onRun]);

  const handleBeforeMount = useCallback<BeforeMount>((monaco: Monaco) => {
    if (!monaco.languages.getLanguages().some((language) => language.id === "rust")) {
      monaco.languages.register({ id: "rust" });
    }

    monaco.languages.setLanguageConfiguration("rust", RUST_LANGUAGE_CONFIGURATION);
    monaco.languages.setMonarchTokensProvider("rust", RUST_MONARCH_LANGUAGE);
    monaco.editor.defineTheme(MONACO_THEME, {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "7a8475", fontStyle: "italic" },
        { token: "keyword", foreground: "a9ff2f" },
        { token: "string", foreground: "c9f3a0" },
        { token: "number", foreground: "9adfef" },
        { token: "type", foreground: "f6d98d" },
        { token: "identifier", foreground: "f3f4f6" },
      ],
      colors: {
        "editor.background": "#050505",
        "editor.foreground": "#f5f5f5",
        "editorLineNumber.foreground": "#4a4a4a",
        "editorLineNumber.activeForeground": "#b4ff58",
        "editorCursor.foreground": "#22d3ee",
        "editor.selectionBackground": "#2d4a1e",
        "editor.inactiveSelectionBackground": "#1d2d14",
        "editor.lineHighlightBackground": "#0f1410",
        "editor.lineHighlightBorder": "#00000000",
        "editorIndentGuide.background1": "#1d241b",
        "editorIndentGuide.activeBackground1": "#405132",
        "editorWhitespace.foreground": "#233023",
        "editorBracketMatch.background": "#1c2a11",
        "editorBracketMatch.border": "#4c7c20",
        "scrollbar.shadow": "#00000000",
        "scrollbarSlider.background": "#ffffff14",
        "scrollbarSlider.hoverBackground": "#ffffff24",
        "scrollbarSlider.activeBackground": "#ffffff32",
        "editorOverviewRuler.border": "#00000000",
        "editorSuggestWidget.background": "#090909",
        "editorSuggestWidget.border": "#1f1f1f",
      },
    });
  }, []);

  const handleMount = useCallback<OnMount>((editor, monaco) => {
    editor.addAction({
      id: "run-challenge",
      label: "Run challenge",
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
      contextMenuGroupId: "navigation",
      contextMenuOrder: 1,
      run: () => {
        runRef.current();
      },
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, (e) => {
      e?.preventDefault?.();
      runRef.current();
    });
  }, []);

  const editorLoading = useMemo(
    () => (
      <div className="flex h-full min-h-0 items-center justify-center border border-white/10 bg-black/30 text-xs text-zinc-500">
        Loading editor...
      </div>
    ),
    []
  );

  return (
    <div className="h-full min-h-0 overflow-hidden rounded-b-none border border-white/10 bg-black/35">
      <MonacoEditorComponent
        value={value}
        onChange={(next) => onChange(next ?? "")}
        beforeMount={handleBeforeMount}
        onMount={handleMount}
        theme={MONACO_THEME}
        language="rust"
        defaultLanguage="rust"
        options={MONACO_OPTIONS}
        loading={editorLoading}
        height={typeof height === "number" ? `${height}px` : height}
        width="100%"
      />
    </div>
  );
}
