'use client';

import { useEffect, useId, useState, useRef, useCallback } from 'react';
import { useTheme } from 'next-themes';
import { Expand, X, ZoomIn, ZoomOut, RotateCcw, Move } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

export function MermaidWithZoom({ chart, title }: { chart: string; title?: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative group">
      {/* Regular sized diagram */}
      <div className="relative overflow-hidden rounded-lg border bg-card">
        <MermaidContent chart={chart} className="max-h-96" />
        
        {/* Zoom trigger button */}
        <Dialog>
          <DialogTrigger asChild>
            <button
              className={cn(
                "absolute top-2 right-2 p-2 rounded-md",
                "bg-background/80 backdrop-blur-sm border border-border/50",
                "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                "hover:bg-accent hover:text-accent-foreground",
                "focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring"
              )}
              title="View larger diagram"
            >
              <Expand className="h-4 w-4" />
              <span className="sr-only">Expand diagram</span>
            </button>
          </DialogTrigger>
          
          <DialogContent className="max-w-[95vw] max-h-[95vh] w-[95vw] h-[95vh] overflow-hidden p-0">
            <div className="sr-only">
              <DialogTitle>{title || "Mermaid Diagram - Expanded View"}</DialogTitle>
              <DialogDescription>
                An expanded view of the Mermaid diagram with zoom and pan functionality for detailed exploration.
              </DialogDescription>
            </div>
            
            {/* Interactive diagram with zoom and pan */}
            <InteractiveMermaidViewer chart={chart} title={title} />
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Optional title below diagram */}
      {title && (
        <p className="text-sm text-muted-foreground text-center mt-2 font-medium">
          {title}
        </p>
      )}
    </div>
  );
}

function InteractiveMermaidViewer({ chart, title }: { chart: string; title?: string }) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isInitialized, setIsInitialized] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Auto-fit to container width on first load
  useEffect(() => {
    if (!isInitialized && containerRef.current && contentRef.current) {
      const container = containerRef.current;
      const content = contentRef.current;
      
      // Wait a bit for mermaid to render
      const timer = setTimeout(() => {
        const svgElement = content.querySelector('svg');
        if (svgElement && container) {
          const containerWidth = container.clientWidth - 40; // Some padding
          const containerHeight = container.clientHeight - 40;
          const svgWidth = svgElement.getBoundingClientRect().width;
          const svgHeight = svgElement.getBoundingClientRect().height;
          
          // Calculate scale to fit width, but also consider height
          const scaleToFitWidth = containerWidth / svgWidth;
          const scaleToFitHeight = containerHeight / svgHeight;
          const optimalScale = Math.min(scaleToFitWidth, scaleToFitHeight, 2); // Cap at 200% for readability
          
          setScale(Math.max(optimalScale, 0.5)); // Minimum 50% to ensure it's not too small
          setIsInitialized(true);
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isInitialized]);

  const zoomIn = useCallback(() => {
    setScale(prev => Math.min(prev * 1.3, 10)); // Allow up to 1000% zoom
  }, []);

  const zoomOut = useCallback(() => {
    setScale(prev => Math.max(prev / 1.3, 0.05)); // Allow down to 5% zoom
  }, []);

  const resetView = useCallback(() => {
    if (containerRef.current && contentRef.current) {
      const container = containerRef.current;
      const content = contentRef.current;
      const svgElement = content.querySelector('svg');
      
      if (svgElement) {
        const containerWidth = container.clientWidth - 40;
        const containerHeight = container.clientHeight - 40;
        const svgWidth = svgElement.getBoundingClientRect().width / scale; // Get original size
        const svgHeight = svgElement.getBoundingClientRect().height / scale;
        
        const scaleToFitWidth = containerWidth / svgWidth;
        const scaleToFitHeight = containerHeight / svgHeight;
        const optimalScale = Math.min(scaleToFitWidth, scaleToFitHeight, 2);
        
        setScale(Math.max(optimalScale, 0.5));
        setPosition({ x: 0, y: 0 });
      } else {
        setScale(1);
        setPosition({ x: 0, y: 0 });
      }
    }
  }, [scale]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) { // Left mouse button
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  }, [position]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale(prev => Math.max(0.05, Math.min(10, prev * delta)));
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target !== document.body) return;
      
      switch (e.key) {
        case '+':
        case '=':
          e.preventDefault();
          zoomIn();
          break;
        case '-':
          e.preventDefault();
          zoomOut();
          break;
        case '0':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            resetView();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [zoomIn, zoomOut, resetView]);

  return (
    <div className="flex flex-col h-full">
      {/* Header with title and controls */}
      <div className="flex items-center justify-between p-4 border-b bg-background/50 backdrop-blur-sm pr-16">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Move className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium truncate">
            {title || "Interactive Diagram"}
          </span>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {Math.round(scale * 100)}%
          </span>
        </div>
        
        {/* Zoom controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={zoomOut}
            className={cn(
              "p-2 rounded-md hover:bg-accent hover:text-accent-foreground",
              "focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
            )}
            title="Zoom out (- key)"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          
          <button
            onClick={resetView}
            className={cn(
              "p-2 rounded-md hover:bg-accent hover:text-accent-foreground",
              "focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
            )}
            title="Reset view (Ctrl+0)"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          
          <button
            onClick={zoomIn}
            className={cn(
              "p-2 rounded-md hover:bg-accent hover:text-accent-foreground",
              "focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
            )}
            title="Zoom in (+ key)"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Interactive diagram area */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-hidden relative bg-background"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <div
          ref={contentRef}
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.1s ease-out',
          }}
        >
          <MermaidContent 
            chart={chart} 
            className="max-w-none w-auto h-auto select-none" 
          />
        </div>
      </div>

      {/* Footer with instructions */}
      <div className="p-3 border-t bg-muted/30 text-xs text-muted-foreground">
        <div className="flex flex-wrap gap-4 justify-center">
          <span>🖱️ Drag to pan</span>
          <span>🖲️ Scroll to zoom</span>
          <span>⌨️ +/- to zoom</span>
          <span>⌨️ Ctrl+0 to reset</span>
        </div>
      </div>
    </div>
  );
}

function MermaidContent({ chart, className }: { chart: string; className?: string }) {
  const id = useId();
  const { resolvedTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<MutationObserver | null>(null);
  const [mermaid, setMermaid] = useState<any>(null);
  const [svg, setSvg] = useState<string>('');
  const [bindFunctions, setBindFunctions] = useState<any>(null);

  // Load mermaid library
  useEffect(() => {
    import('mermaid').then((mermaidModule) => {
      setMermaid(mermaidModule.default);
    });
  }, []);

  // Initialize mermaid and render SVG
  useEffect(() => {
    if (!mermaid) return;

    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'loose',
      fontFamily: 'inherit',
      theme: resolvedTheme === 'dark' ? 'dark' : 'default',
    });

    const renderChart = async () => {
      try {
        const result = await mermaid.render(`${id}-${resolvedTheme}-${Date.now()}`, chart.replaceAll('\\n', '\n'));
        setSvg(result.svg);
        setBindFunctions(() => result.bindFunctions);
      } catch (error) {
        console.error('Mermaid render error:', error);
        setSvg('<p>Error rendering diagram</p>');
      }
    };

    renderChart();
  }, [mermaid, chart, resolvedTheme, id]);

  // Clean up function
  const cleanup = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
  }, []);

  // Aggressive dark mode fix function
  const forceDarkMode = useCallback((container: HTMLElement) => {
    if (resolvedTheme !== 'dark') {
      cleanup();
      return;
    }
    
    const fixElement = (element: Element) => {
      // Force all rect, circle, ellipse elements to have dark background
      if (['rect', 'circle', 'ellipse', 'polygon', 'path'].includes(element.tagName.toLowerCase())) {
        (element as HTMLElement).style.setProperty('fill', '#334155', 'important');
        (element as HTMLElement).style.setProperty('stroke', '#64748b', 'important');
      }
      
      // Force all text elements to have light color
      if (element.tagName.toLowerCase() === 'text') {
        (element as HTMLElement).style.setProperty('fill', '#f8fafc', 'important');
        (element as HTMLElement).style.setProperty('color', '#f8fafc', 'important');
      }
      
      // Remove problematic fill attributes completely and replace
      if (element.hasAttribute('fill')) {
        const currentFill = element.getAttribute('fill')?.toLowerCase();
        if (currentFill && 
            ['#ffffff', 'white', '#fff', '#f0f0f0', '#e0e0e0', '#d0d0d0', '#c0c0c0', 'rgb(255,255,255)', 'rgb(255, 255, 255)'].includes(currentFill)) {
          element.removeAttribute('fill');
          (element as HTMLElement).style.setProperty('fill', '#334155', 'important');
        }
        if (currentFill && element.tagName.toLowerCase() === 'text' &&
            ['#000000', 'black', '#000', 'rgb(0,0,0)', 'rgb(0, 0, 0)'].includes(currentFill)) {
          element.removeAttribute('fill');
          (element as HTMLElement).style.setProperty('fill', '#f8fafc', 'important');
        }
      }
    };

    // Clean up any existing observer
    cleanup();

    // Process all elements immediately
    const allElements = container.querySelectorAll('*');
    allElements.forEach(fixElement);
    
    // Set up MutationObserver for dynamic changes
    observerRef.current = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              fixElement(element);
              element.querySelectorAll('*').forEach(fixElement);
            }
          });
        }
        if (mutation.type === 'attributes' && mutation.attributeName === 'fill') {
          fixElement(mutation.target as Element);
        }
      });
    });
    
    observerRef.current.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['fill', 'style']
    });
  }, [resolvedTheme, cleanup]);

  // Clean up light mode styles
  const cleanLightMode = useCallback((container: HTMLElement) => {
    if (resolvedTheme === 'dark') return;
    
    cleanup();
    
    // Remove any forced dark mode styles
    const allElements = container.querySelectorAll('*');
    allElements.forEach((element: Element) => {
      const htmlElement = element as HTMLElement;
      htmlElement.style.removeProperty('fill');
      htmlElement.style.removeProperty('color');
      htmlElement.style.removeProperty('stroke');
    });
  }, [resolvedTheme, cleanup]);

  useEffect(() => {
    if (containerRef.current && svg) {
      if (resolvedTheme === 'dark') {
        const timer = setTimeout(() => {
          if (containerRef.current) {
            forceDarkMode(containerRef.current);
          }
        }, 100);
        
        return () => {
          clearTimeout(timer);
          cleanup();
        };
      } else {
        cleanLightMode(containerRef.current);
      }
    }
    
    return cleanup;
  }, [forceDarkMode, cleanLightMode, resolvedTheme, cleanup, svg]);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  if (!mermaid || !svg) {
    return <div className={cn("mermaid-container animate-pulse bg-muted rounded", className)}>Loading diagram...</div>;
  }

  return (
    <div
      ref={(container) => {
        if (container) {
          containerRef.current = container;
          bindFunctions?.(container);
          
          // Apply theme-specific fixes immediately after setting innerHTML
          if (resolvedTheme === 'dark') {
            setTimeout(() => forceDarkMode(container), 0);
          } else {
            setTimeout(() => cleanLightMode(container), 0);
          }
        }
      }}
      className={cn("mermaid-container", className)}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
