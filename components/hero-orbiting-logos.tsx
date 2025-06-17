import { OrbitingCircles } from "@/components/ui/orbiting-circles";

export default function HeroOrbitingLogos() {
  return (
    <div className="relative flex h-[400px] w-[400px] items-center justify-center overflow-hidden">
      {/* Inner orbit - clockwise */}
      <OrbitingCircles
        className="border-none bg-transparent"
        radius={50}
        duration={20}
        iconSize={35}
        reverse={false}
      >
        <div className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-orange-500/20 backdrop-blur-sm border border-orange-500/40">
          <span className="text-sm font-bold text-orange-400">🦀</span>
        </div>
        <div className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border border-white/40">
          <span className="text-sm font-bold text-white">▲</span>
        </div>
      </OrbitingCircles>

      {/* Second orbit - counter-clockwise */}
      <OrbitingCircles
        className="border-none bg-transparent"
        radius={95}
        duration={25}
        iconSize={35}
        reverse={true}
      >
        <div className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-green-500/20 backdrop-blur-sm border border-green-500/40">
          <span className="text-sm font-bold text-green-400">⚡</span>
        </div>
        <div className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/40">
          <span className="text-sm font-bold text-yellow-400">🔗</span>
        </div>
      </OrbitingCircles>

      {/* Third orbit - clockwise */}
      <OrbitingCircles
        className="border-none bg-transparent"
        radius={140}
        duration={30}
        iconSize={35}
        reverse={false}
      >
        <div className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-purple-500/20 backdrop-blur-sm border border-purple-500/40">
          <span className="text-sm font-bold text-purple-400">⚓</span>
        </div>
        <div className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-blue-500/20 backdrop-blur-sm border border-blue-500/40">
          <span className="text-sm font-bold text-blue-400">◉</span>
        </div>
      </OrbitingCircles>

      {/* Fourth orbit - counter-clockwise */}
      <OrbitingCircles
        className="border-none bg-transparent"
        radius={185}
        duration={35}
        iconSize={35}
        reverse={true}
      >
        <div className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-pink-500/20 backdrop-blur-sm border border-pink-500/40">
          <span className="text-sm font-bold text-pink-400">💎</span>
        </div>
        <div className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-cyan-500/20 backdrop-blur-sm border border-cyan-500/40">
          <span className="text-sm font-bold text-cyan-400">🌐</span>
        </div>
      </OrbitingCircles>
    </div>
  );
}
