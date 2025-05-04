interface RoadmapItemProps {
  version: string
  title: string
  description: string
  active?: boolean
}

export default function RoadmapItem({ version, title, description, active = false }: RoadmapItemProps) {
  return (
    <div className="relative pl-10 pb-10 last:pb-0">
      {/* Vertical line */}
      <div className="absolute left-3 top-3 bottom-0 w-px bg-white/20"></div>

      {/* Circle indicator */}
      <div
        className={`absolute left-0 top-3 h-6 w-6 rounded-full border-2 flex items-center justify-center
        ${active ? "border-[#14F195] bg-[#14F195]/20" : "border-white/30 bg-black/50"}`}
      >
        {active && <div className="h-2 w-2 rounded-full bg-[#14F195]"></div>}
      </div>

      <div className="mb-2">
        <span
          className={`text-sm font-medium px-2 py-1 rounded-full
          ${active ? "bg-[#14F195]/10 text-[#14F195]" : "bg-white/10 text-white/70"}`}
        >
          {version}
        </span>
      </div>

      <h3 className="text-xl font-bold mb-2 font-space-grotesk">{title}</h3>
      <p className="text-white/70 text-sm sm:text-base">{description}</p>
    </div>
  )
}
