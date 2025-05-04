"use client"

import { useEffect, useRef, useState } from "react"

export default function AIAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [userTyping, setUserTyping] = useState(false)
  const [aiTyping, setAiTyping] = useState(false)
  const [userText, setUserText] = useState("")
  const [aiText, setAiText] = useState("")

  const userMessage = "How do I start a Solana project?"
  const aiResponse = `To start a Solana project:

  1. 🔧 Install Rust & Solana CLI
     $ curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
     $ sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
  
  2. 👜 Create a Solana Wallet
     $ solana-keygen new
     $ solana config set --keypair ~/.config/solana/id.json
  
  3. 🌐 Connect to Devnet & Get SOL
     $ solana config set --url https://api.devnet.solana.com
     $ solana airdrop 2
  
  4. 🚀 Set up a new Anchor project
     $ cargo install --git https://github.com/coral-xyz/anchor anchor-cli --locked
     $ anchor init my-solana-app
     $ cd my-solana-app
  
  5. 🛠 Build & Deploy to Devnet
     $ anchor build
     $ anchor deploy
  `;  

  useEffect(() => {
    // Animation timeline
    const timeline = [
      // Step 0: Show empty chat
      () => {
        setTimeout(() => {
          setCurrentStep(1)
        }, 1000)
      },
      // Step 1: User starts typing
      () => {
        setUserTyping(true)
        let i = 0
        const typeInterval = setInterval(() => {
          if (i <= userMessage.length) {
            setUserText(userMessage.substring(0, i))
            i++
          } else {
            clearInterval(typeInterval)
            setUserTyping(false)
            setTimeout(() => {
              setCurrentStep(2)
            }, 500)
          }
        }, 70)
      },
      // Step 2: AI starts typing
      () => {
        setAiTyping(true)
        setTimeout(() => {
          setCurrentStep(3)
        }, 1500)
      },
      // Step 3: AI responds
      () => {
        setAiTyping(false)
        let i = 0
        const typeInterval = setInterval(() => {
          if (i <= aiResponse.length) {
            setAiText(aiResponse.substring(0, i))
            i++
          } else {
            clearInterval(typeInterval)
            setTimeout(() => {
              setCurrentStep(4)
            }, 3000)
          }
        }, 10)
      },
      // Step 4: Reset animation
      () => {
        setUserText("")
        setAiText("")
        setCurrentStep(0)
      },
    ]

    // Start the animation
    timeline[currentStep]()
  }, [currentStep])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()

      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr

      ctx.scale(dpr, dpr)
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Animation parameters
    const particles: Particle[] = []
    const particleCount = 50
    const colors = ["#14F195", "#9945FF", "#00C2FF"]
    const maxRadius = 3

    // Particle class
    class Particle {
      x: number
      y: number
      radius: number
      color: string
      velocity: { x: number; y: number }
      alpha: number

      constructor(x: number, y: number, radius: number, color: string) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = {
          x: (Math.random() - 0.5) * 1,
          y: (Math.random() - 0.5) * 1,
        }
        this.alpha = Math.random() * 0.8 + 0.2
      }

      draw() {
        if (!ctx) return
        ctx.save()
        ctx.globalAlpha = this.alpha
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
        ctx.restore()
      }

      update() {
        if (!canvas) return

        this.x += this.velocity.x
        this.y += this.velocity.y

        // Bounce off edges
        if (this.x + this.radius > canvas.width / window.devicePixelRatio || this.x - this.radius < 0) {
          this.velocity.x = -this.velocity.x
        }

        if (this.y + this.radius > canvas.height / window.devicePixelRatio || this.y - this.radius < 0) {
          this.velocity.y = -this.velocity.y
        }

        this.draw()
      }
    }

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      const radius = Math.random() * maxRadius + 1
      const x = Math.random() * (canvas.width / window.devicePixelRatio - radius * 2) + radius
      const y = Math.random() * (canvas.height / window.devicePixelRatio - radius * 2) + radius
      const color = colors[Math.floor(Math.random() * colors.length)]

      particles.push(new Particle(x, y, radius, color))
    }

    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio)

      particles.forEach((particle) => {
        particle.update()
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  return (
    <div className="relative w-full max-w-md aspect-square mx-auto">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full rounded-xl" />

      <div className="relative z-10 w-full h-full flex flex-col p-2 sm:p-4">
        <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-3 sm:p-4 h-full flex flex-col">
          {/* Chat header */}
          <div className="flex items-center gap-2 pb-2 sm:pb-3 border-b border-white/10">
            <div className="h-2 w-2 rounded-full bg-[#14F195]"></div>
            <span className="text-white/80 text-xs sm:text-sm font-medium">learn.sol AI Assistant</span>
          </div>

          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto py-2 sm:py-4 space-y-3 sm:space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {userText && (
              <div className="flex justify-end">
                <div className="bg-[#9945FF]/20 border border-[#9945FF]/30 rounded-lg rounded-tr-none p-2 sm:p-3 max-w-[85%] break-words">
                  <p className="text-xs sm:text-sm text-white">{userText}</p>
                </div>
              </div>
            )}

            {(aiText || aiTyping) && (
              <div className="flex justify-start">
                <div className="bg-[#14F195]/10 border border-[#14F195]/30 rounded-lg rounded-tl-none p-2 sm:p-3 max-w-[85%] break-words">
                  {aiTyping ? (
                    <div className="flex gap-1 items-center h-5 sm:h-6">
                      <div className="h-1.5 sm:h-2 w-1.5 sm:w-2 rounded-full bg-[#14F195] animate-pulse"></div>
                      <div className="h-1.5 sm:h-2 w-1.5 sm:w-2 rounded-full bg-[#9945FF] animate-pulse delay-100"></div>
                      <div className="h-1.5 sm:h-2 w-1.5 sm:w-2 rounded-full bg-[#00C2FF] animate-pulse delay-200"></div>
                    </div>
                  ) : (
                    <pre className="text-xs sm:text-sm text-white font-mono whitespace-pre-wrap overflow-x-auto">{aiText}</pre>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Chat input */}
          <div className="border-t border-white/10 pt-2 sm:pt-3">
            <div className="flex items-center gap-2 bg-black/30 border border-white/10 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2">
              <input
                type="text"
                disabled
                placeholder={userTyping ? "Typing..." : "Ask a question..."}
                className="bg-transparent text-xs sm:text-sm text-white/80 flex-1 outline-none placeholder:text-white/50"
              />
              <button className="text-[#14F195] rounded-md p-1 hover:bg-white/5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="sm:w-4 sm:h-4"
                >
                  <path d="m22 2-7 20-4-9-9-4Z" />
                  <path d="M22 2 11 13" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
