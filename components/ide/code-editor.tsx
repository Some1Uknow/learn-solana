"use client";

import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";

const sampleCode = `// Import anchor libraries
use anchor_lang::prelude::*;

// Declare program ID
declare_id!("your_program_id_here");

// Define the program's struct
#[program]
pub mod basic_anchor {
    use super::*;

    // Initialize function
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        // Get the account
        let counter = &mut ctx.accounts.counter;
        
        // Set initial value
        counter.count = 0;
        msg!("Counter initialized!");
        
        Ok(())
    }

    // Increment function
    pub fn increment(ctx: Context<Increment>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count += 1;
        msg!("Counter value: {}", counter.count);
        
        Ok(())
    }
}

// Account struct to store the counter
#[account]
pub struct Counter {
    pub count: u64,
}

// Context for Initialize instruction
#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 8 + 8)]
    pub counter: Account<'info, Counter>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

// Context for Increment instruction
#[derive(Accounts)]
pub struct Increment<'info> {
    #[account(mut)]
    pub counter: Account<'info, Counter>,
}`;

export default function CodeEditor({code}: {code?: string}) {
  const [value, setValue] = useState(code || sampleCode);
  const [mounted, setMounted] = useState(false);

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
        value={code}
        onChange={(value) => setValue(value ?? "")}
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