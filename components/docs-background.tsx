const DocsBackground = () => (
  <div
    className="absolute inset-0 z-[-1] pointer-events-none overflow-hidden"
    aria-hidden="true"
  >
    {/* Subtle top glow */}
    <div
      className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px]"
      style={{
        background: 'radial-gradient(ellipse at 50% 0%, rgba(169, 255, 47, 0.04) 0%, transparent 70%)',
      }}
    />
  </div>
);

export default DocsBackground;