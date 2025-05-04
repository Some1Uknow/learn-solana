import type { ReactNode } from "react"

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6 hover:bg-white/10 transition-colors group">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
        <div className="p-3 rounded-lg bg-black/30 border border-white/10 group-hover:border-white/20 transition-colors mb-2 sm:mb-0">
          {icon}
        </div>
        <div className="text-center sm:text-left">
          <h3 className="text-xl font-bold mb-2 font-space-grotesk">{title}</h3>
          <p className="text-white/70">{description}</p>
        </div>
      </div>
    </div>
  )
}
