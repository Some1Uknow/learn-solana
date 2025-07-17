'use client';

import { Button } from '@/components/ui/button';
import React from 'react';

export function InteractiveButton() {
  return (
    <Button onClick={() => alert('MDX Button Clicked!')}>Click Me</Button>
  );
}
