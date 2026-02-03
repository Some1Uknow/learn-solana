"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  type Connection,
  type ReactFlowInstance,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Viewport,
} from "reactflow";
import "reactflow/dist/style.css";
import { nanoid } from "nanoid";

import {
  BLOCKS_BY_GROUP,
  BLOCK_GROUP_ORDER,
  createNodeFromBlock,
  createStarterGraph,
  getBlockDefinition,
} from "@/lib/visual-builder/blocks";
import type { BlockKind, BlockDefinition } from "@/lib/visual-builder/blocks";
import type { VisualBuilderGraph, VisualBuilderNode } from "@/lib/visual-builder/schema";
import { BlockNode } from "@/components/visual-builder/block-node";
import { clearGraph, loadGraph, saveGraph } from "@/lib/visual-builder/storage";
import { exportAnchorProgram } from "@/lib/visual-builder/export-anchor";
import {
  VISUAL_BUILDER_TEMPLATES,
  type TemplateStep,
} from "@/lib/visual-builder/templates";

const nodeTypes = {
  block: BlockNode,
};

const defaultEdgeOptions = {
  style: { stroke: "#14f195", strokeWidth: 1.2 },
  animated: false,
};

function useVisualBuilderState() {
  const [nodes, setNodes, onNodesChange] = useNodesState<VisualBuilderNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [viewport, setViewport] = useState<Viewport | undefined>(undefined);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = loadGraph();
    if (stored) {
      setNodes(stored.nodes);
      setEdges(stored.edges);
      setViewport(stored.viewport);
      setHydrated(true);
      return;
    }

    const starter = createStarterGraph();
    setNodes(starter.nodes);
    setEdges(starter.edges);
    setHydrated(true);
  }, [setEdges, setNodes]);

  useEffect(() => {
    if (!hydrated) return;
    const graph: VisualBuilderGraph = { version: 1, nodes, edges, viewport };
    saveGraph(graph);
  }, [edges, hydrated, nodes, viewport]);

  return {
    nodes,
    setNodes,
    onNodesChange,
    edges,
    setEdges,
    onEdgesChange,
    viewport,
    setViewport,
  };
}

function VisualBuilderCanvas({ fullscreen = false }: { fullscreen?: boolean }) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [instance, setInstance] = useState<ReactFlowInstance | null>(null);
  const [selectedNode, setSelectedNode] = useState<VisualBuilderNode | null>(null);
  const [hoveredBlock, setHoveredBlock] = useState<BlockDefinition | null>(null);
  const [exportWarnings, setExportWarnings] = useState<string[]>([]);
  const [activeTemplateId, setActiveTemplateId] = useState(
    VISUAL_BUILDER_TEMPLATES[0]?.id ?? "quickstart"
  );
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const {
    nodes,
    setNodes,
    onNodesChange,
    edges,
    setEdges,
    onEdgesChange,
    viewport,
    setViewport,
  } = useVisualBuilderState();

  const { screenToFlowPosition } = useReactFlow();

  const activeTemplate = useMemo(
    () =>
      VISUAL_BUILDER_TEMPLATES.find((template) => template.id === activeTemplateId) ??
      VISUAL_BUILDER_TEMPLATES[0],
    [activeTemplateId]
  );

  const nodeKindById = useMemo(() => {
    const map = new Map<string, BlockKind>();
    nodes.forEach((node) => map.set(node.id, node.data.kind));
    return map;
  }, [nodes]);

  const kindCounts = useMemo(() => {
    const map = new Map<BlockKind, number>();
    nodes.forEach((node) => {
      map.set(node.data.kind, (map.get(node.data.kind) ?? 0) + 1);
    });
    return map;
  }, [nodes]);

  const hasEdgeBetweenKinds = useCallback(
    (from: BlockKind, to: BlockKind) => {
      return edges.some((edge) => {
        const sourceKind = nodeKindById.get(edge.source);
        const targetKind = nodeKindById.get(edge.target);
        if (!sourceKind || !targetKind) return false;
        return (
          (sourceKind === from && targetKind === to) ||
          (sourceKind === to && targetKind === from)
        );
      });
    },
    [edges, nodeKindById]
  );

  const isStepComplete = useCallback(
    (step: TemplateStep) => {
      const requires = step.requires;
      if (!requires) return true;
      if (requires.nodeKinds) {
        const missingKind = requires.nodeKinds.find(
          (kind) => (kindCounts.get(kind) ?? 0) === 0
        );
        if (missingKind) return false;
      }
      if (requires.edges) {
        const missingEdge = requires.edges.find(
          (edge) => !hasEdgeBetweenKinds(edge.from, edge.to)
        );
        if (missingEdge) return false;
      }
      return true;
    },
    [hasEdgeBetweenKinds, kindCounts]
  );

  const stepStatuses = useMemo(() => {
    const steps = activeTemplate?.steps ?? [];
    return steps.map((step) => isStepComplete(step));
  }, [activeTemplate?.steps, isStepComplete]);

  useEffect(() => {
    setActiveStepIndex(0);
  }, [activeTemplateId]);

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback(
    (_: ReactMouseEvent, node: VisualBuilderNode) => {
      setSelectedNode(node);
    },
    []
  );

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const createAndInsertNode = useCallback(
    (kind: BlockKind, position?: { x: number; y: number }) => {
      const bounds = reactFlowWrapper.current?.getBoundingClientRect();
      const center = bounds
        ? { x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 2 }
        : { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      const fallbackPosition = instance
        ? instance.screenToFlowPosition(center)
        : { x: 200, y: 200 };

      const newNode = createNodeFromBlock(kind, position ?? fallbackPosition);
      setNodes((nds) => [...nds, newNode]);

      const instructionNode =
        selectedNode?.data.kind === "instruction"
          ? selectedNode
          : nodes.find((node) => node.data.kind === "instruction");

      if (kind === "instruction") {
        const programNode = nodes.find((node) => node.data.kind === "program");
        if (programNode) {
          setEdges((eds) => [
            ...eds,
            { id: nanoid(), source: programNode.id, target: newNode.id },
          ]);
        }
        return;
      }

      if (kind !== "program" && kind !== "transaction" && instructionNode) {
        setEdges((eds) => [
          ...eds,
          { id: nanoid(), source: instructionNode.id, target: newNode.id },
        ]);
      }
    },
    [instance, nodes, selectedNode, setEdges, setNodes]
  );

  const onDragStart = useCallback((event: React.DragEvent, kind: BlockKind) => {
    event.dataTransfer.setData("application/reactflow", kind);
    event.dataTransfer.effectAllowed = "move";
  }, []);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const kind = event.dataTransfer.getData("application/reactflow") as BlockKind;
      if (!kind) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      createAndInsertNode(kind, position);
    },
    [createAndInsertNode, screenToFlowPosition]
  );

  const handleReset = useCallback(() => {
    clearGraph();
    const starter = createStarterGraph();
    setNodes(starter.nodes);
    setEdges(starter.edges);
    setSelectedNode(null);
    setExportWarnings([]);
    setActiveStepIndex(0);
  }, [setEdges, setNodes]);

  const handleLoadTemplate = useCallback(() => {
    if (!activeTemplate) return;
    setNodes(activeTemplate.graph.nodes);
    setEdges(activeTemplate.graph.edges);
    setSelectedNode(null);
    setExportWarnings([]);
    setActiveStepIndex(0);
  }, [activeTemplate, setEdges, setNodes]);

  const handleExport = useCallback(() => {
    const result = exportAnchorProgram({ version: 1, nodes, edges, viewport });
    const blob = new Blob([result.contents], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = result.filename;
    anchor.click();
    URL.revokeObjectURL(url);
    setExportWarnings(result.warnings);
  }, [edges, nodes, viewport]);

  const selectedDetails = useMemo(() => {
    if (!selectedNode) return null;
    return {
      label: selectedNode.data.label,
      description: selectedNode.data.description,
      kind: selectedNode.data.kind,
    };
  }, [selectedNode]);

  const inspectorDetails = useMemo(() => {
    if (hoveredBlock) {
      return {
        label: hoveredBlock.label,
        description: hoveredBlock.description,
        kind: hoveredBlock.kind,
        group: hoveredBlock.group,
        accent: hoveredBlock.accent,
        source: "Hover preview",
      };
    }
    if (selectedDetails) {
      const definition = getBlockDefinition(selectedDetails.kind);
      return {
        label: selectedDetails.label,
        description: selectedDetails.description,
        kind: selectedDetails.kind,
        group: definition.group,
        accent: definition.accent,
        source: "Selected block",
      };
    }
    return null;
  }, [hoveredBlock, selectedDetails]);

  const blockHints = useMemo<Record<BlockKind, { connect: string; export: string }>>(
    () => ({
      program: {
        connect: "Connect Program → Instruction",
        export: "Creates the Anchor program module.",
      },
      instruction: {
        connect: "Connect Instruction → Signer/Accounts",
        export: "Generates a handler function and accounts struct.",
      },
      transaction: {
        connect: "Optional grouping for multiple instructions",
        export: "Not exported yet (visual aid only).",
      },
      signer: {
        connect: "Connect Instruction → Signer",
        export: "Adds a Signer field to Accounts.",
      },
      account: {
        connect: "Connect Instruction → Account",
        export: "Adds an AccountInfo placeholder.",
      },
      pda: {
        connect: "Connect Instruction → PDA",
        export: "Adds a PDA AccountInfo placeholder.",
      },
      tokenMint: {
        connect: "Connect Instruction → Token Mint",
        export: "Adds Account<Mint>.",
      },
      tokenAccount: {
        connect: "Connect Instruction → Token Account",
        export: "Adds Account<TokenAccount>.",
      },
      cpi: {
        connect: "Connect Instruction → CPI target",
        export: "Adds AccountInfo placeholder for CPI.",
      },
    }),
    []
  );

  const steps = activeTemplate?.steps ?? [];
  const activeStep = steps[activeStepIndex];
  const currentStepComplete = activeStep ? stepStatuses[activeStepIndex] : true;

  const handlePrevStep = useCallback(() => {
    setActiveStepIndex((index) => Math.max(index - 1, 0));
  }, []);

  const handleNextStep = useCallback(() => {
    setActiveStepIndex((index) => Math.min(index + 1, steps.length - 1));
  }, [steps.length]);

  return (
    <div className={fullscreen ? "w-full" : "w-full border border-white/10 bg-white/[0.02]"}>
      <div className={fullscreen ? "px-4 py-4" : "border-b border-white/10 px-4 py-4"}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Visual Builder</h2>
            <p className="text-xs text-zinc-400">
              Add blocks from the top rail, connect them, then export your Anchor starter code.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 border border-white/10 bg-black/40 px-3 py-2 text-xs">
              <span className="text-white/60">Template</span>
              <select
                value={activeTemplateId}
                onChange={(event) => setActiveTemplateId(event.target.value)}
                className="bg-transparent text-white outline-none"
              >
                {VISUAL_BUILDER_TEMPLATES.map((template) => (
                  <option key={template.id} value={template.id} className="bg-black">
                    {template.name}
                  </option>
                ))}
              </select>
              <button
                onClick={handleLoadTemplate}
                className="border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase text-white transition hover:bg-white/10"
              >
                Load
              </button>
            </div>
            <a
              href="/tools/visual-builder/fullscreen"
              className="border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/10"
            >
              Fullscreen
            </a>
            <button
              onClick={handleReset}
              className="border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/10"
            >
              Reset
            </button>
            <button
              onClick={handleExport}
              className="border border-[#14f195]/50 bg-[#14f195]/10 px-4 py-2 text-xs font-semibold text-[#14f195] transition hover:bg-[#14f195]/20"
            >
              Export Anchor
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 pr-2 whitespace-nowrap">
            {BLOCK_GROUP_ORDER.map((group) => {
              const blocks = BLOCKS_BY_GROUP[group] ?? [];
              return (
                <div key={group} className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] uppercase tracking-[0.24em] text-white/40">
                    {group}
                  </span>
                  {blocks.map((block) => (
                    <button
                      key={block.kind}
                      className="shrink-0 border border-white/10 bg-black/40 px-3 py-2 text-xs font-semibold text-white transition hover:border-white/30"
                      onClick={() => createAndInsertNode(block.kind)}
                      draggable
                      onDragStart={(event) => onDragStart(event, block.kind)}
                      onMouseEnter={() => setHoveredBlock(block)}
                      onMouseLeave={() => setHoveredBlock(null)}
                      title={block.description}
                    >
                      <span className="mr-2">{block.label}</span>
                      <span
                        className="px-2 py-0.5 text-[10px] font-semibold uppercase"
                        style={{ color: block.accent, background: `${block.accent}1f` }}
                      >
                        {block.kind}
                      </span>
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-3 border border-white/10 bg-black/50 px-4 py-3">
          {inspectorDetails ? (
            <div className="grid gap-3 md:grid-cols-[1.2fr_0.8fr]">
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-white/50">
                  {inspectorDetails.source} · {inspectorDetails.group}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span className="text-base font-semibold text-white">
                    {inspectorDetails.label}
                  </span>
                  <span
                    className="border px-2 py-0.5 text-[10px] font-semibold uppercase"
                    style={{
                      color: inspectorDetails.accent,
                      borderColor: `${inspectorDetails.accent}70`,
                    }}
                  >
                    {inspectorDetails.kind}
                  </span>
                </div>
                <p className="mt-2 text-sm text-white/70">{inspectorDetails.description}</p>
              </div>
              <div className="text-xs text-white/70">
                <div className="text-[10px] uppercase tracking-[0.2em] text-white/50">
                  How to connect
                </div>
                <p className="mt-2">{blockHints[inspectorDetails.kind].connect}</p>
                <div className="mt-3 text-[10px] uppercase tracking-[0.2em] text-white/50">
                  Anchor export
                </div>
                <p className="mt-2">{blockHints[inspectorDetails.kind].export}</p>
              </div>
            </div>
          ) : (
            <div className="text-xs text-white/60">
              Hover a block to see full details, or click a block on the canvas to inspect it.
            </div>
          )}
        </div>

        <div className="mt-4 border border-white/10 bg-black/40 px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-white/50">Guided Steps</div>
              <div className="text-sm font-semibold text-white">
                {activeTemplate?.name ?? "Guide"}
              </div>
              <div className="text-xs text-white/60">{activeTemplate?.description}</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevStep}
                disabled={activeStepIndex === 0}
                className="border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase text-white/80 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Prev
              </button>
              <button
                onClick={handleNextStep}
                disabled={activeStepIndex >= steps.length - 1 || !currentStepComplete}
                className="border border-[#14f195]/50 bg-[#14f195]/10 px-3 py-1 text-[10px] font-semibold uppercase text-[#14f195] transition hover:bg-[#14f195]/20 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                Step {Math.min(activeStepIndex + 1, steps.length)}/{steps.length}
              </span>
            </div>
          </div>

          {activeStep ? (
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border border-white/10 bg-black/60 px-3 py-2">
              <div>
                <div className="text-xs font-semibold text-white">{activeStep.title}</div>
                <div className="text-xs text-white/60">{activeStep.description}</div>
              </div>
              <span
                className={`px-2 py-1 text-[10px] font-semibold uppercase ${
                  currentStepComplete
                    ? "border border-[#14f195]/50 bg-[#14f195]/10 text-[#14f195]"
                    : "border border-white/15 bg-white/5 text-white/60"
                }`}
              >
                {currentStepComplete ? "Done" : "In progress"}
              </span>
            </div>
          ) : null}

          <div className="mt-3 flex flex-wrap gap-2">
            {steps.map((step, index) => {
              const isComplete = stepStatuses[index];
              const isActive = index === activeStepIndex;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStepIndex(index)}
                  className={`border px-2 py-1 text-[10px] font-semibold uppercase transition ${
                    isActive
                      ? "border-[#14f195]/60 bg-[#14f195]/10 text-[#14f195]"
                      : "border-white/10 bg-black/40 text-white/60 hover:border-white/30"
                  }`}
                >
                  {isComplete ? "✓" : index + 1}. {step.title}
                </button>
              );
            })}
          </div>
        </div>

        {exportWarnings.length > 0 && (
          <div className="mt-3 border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
            {exportWarnings.map((warning) => (
              <div key={warning}>• {warning}</div>
            ))}
          </div>
        )}
      </div>

      <div
        ref={reactFlowWrapper}
        className={
          fullscreen
            ? "h-[calc(100vh-300px)] min-h-[520px] bg-black/70"
            : "h-[520px] md:h-[600px] xl:h-[640px] bg-black/60"
        }
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          onInit={setInstance}
          onMoveEnd={(_, view) => setViewport(view)}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          defaultViewport={viewport}
          defaultEdgeOptions={defaultEdgeOptions}
          onDrop={onDrop}
          onDragOver={onDragOver}
          snapToGrid
          snapGrid={[24, 24]}
        >
          <Background gap={24} size={1} color="#1f2937" />
          <Controls className="bg-black/60 border border-white/10" />
          <MiniMap
            pannable
            zoomable
            nodeColor={(node) => {
              const nodeData = node.data as VisualBuilderNode["data"] | undefined;
              if (!nodeData?.kind) return "#1f2937";
              return getBlockDefinition(nodeData.kind).accent;
            }}
            maskColor="rgba(0,0,0,0.6)"
            className="bg-black/70 border border-white/10"
          />
        </ReactFlow>
      </div>
    </div>
  );
}

export function VisualBuilderEditor({ fullscreen = false }: { fullscreen?: boolean }) {
  return (
    <ReactFlowProvider>
      <VisualBuilderCanvas fullscreen={fullscreen} />
    </ReactFlowProvider>
  );
}
