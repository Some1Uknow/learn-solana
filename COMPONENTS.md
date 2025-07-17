# How to Add Custom Components to MDX

This guide explains how to add new React components to your MDX files, enabling you to extend your content with custom functionality and styling. The process involves creating the component, registering it, and then using it in your MDX documents.

## Step 1: Create Your Component

First, create a new `.tsx` file for your component inside the `components` directory. For example, let's create a simple `Callout` component.

**File:** `components/ui/callout.tsx`

```tsx
import React from 'react';

interface CalloutProps {
  children: React.ReactNode;
  type?: 'info' | 'warning' | 'danger';
}

const typeClasses = {
  info: 'bg-blue-100 border-blue-500 text-blue-700',
  warning: 'bg-yellow-100 border-yellow-500 text-yellow-700',
  danger: 'bg-red-100 border-red-500 text-red-700',
};

export function Callout({ children, type = 'info' }: CalloutProps) {
  return (
    <div className={`border-l-4 p-4 ${typeClasses[type]}`}>
      {children}
    </div>
  );
}
```

### Handling Interactive Components

If your component requires interactivity (e.g., event handlers like `onClick`, or hooks like `useState`), you **must** declare it as a Client Component by adding `'use client'` at the top of the file.

**File:** `components/interactive-button.tsx`

```tsx
'use client';

import React from 'react';

export function InteractiveButton() {
  const handleClick = () => {
    alert('Button clicked!');
  };

  return <button onClick={handleClick}>Click Me</button>;
}
```

## Step 2: Register the Component

Next, you need to make the component available to your MDX files by registering it in `mdx-components.tsx`.

1.  **Import** your new component.
2.  **Add** it to the object returned by the `getMDXComponents` function.

**File:** `mdx-components.tsx`

```tsx
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { InteractiveButton } from '@/components/learn/interactive-mdx-wrapper';

// 1. Import your new component
import { Callout } from '@/components/ui/callout';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Alert,
    InteractiveButton,

    // 2. Add your component here
    Callout,

    ...components,
  };
}
```

## Step 3: Use the Component in MDX

Once registered, you can use your component directly in any `.mdx` file.

**File:** `content/part-0/example.mdx`

```mdx
---
title: Example MDX File
---

# Using Custom Components

Here is our new `Callout` component in action:

<Callout type="warning">
  This is a warning callout. Pay attention!
</Callout>

And here is an interactive button:

<InteractiveButton />
```

By following these steps, you can easily extend your MDX content with any React component you need.
