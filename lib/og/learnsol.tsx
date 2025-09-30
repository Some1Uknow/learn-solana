import { ImageResponse } from "next/og";

const SIZE = { width: 1200, height: 630 };

const accent = "#14F195";

export interface LearnSolOgOptions {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  bullets?: string[];
  footer?: string;
}

export async function generateLearnSolOgImage(
  options: LearnSolOgOptions
): Promise<ImageResponse> {
  const { title, subtitle, eyebrow = "learn.sol", bullets = [], footer } = options;

  // Heuristic sizing so long titles don't push subtitle off the canvas
  const tLen = title.length;
  // More aggressive scaling to guarantee room under 3-line cases
  const titleFontSize = tLen > 42 ? 68 : tLen > 36 ? 76 : tLen > 30 ? 86 : tLen > 22 ? 96 : 104;
  const subtitleFontSize = tLen > 42 ? 22 : tLen > 36 ? 24 : tLen > 30 ? 25 : 27;
  const verticalGap = tLen > 42 ? 16 : tLen > 36 ? 18 : 22;
  const maxTitleWidth = tLen > 40 ? 660 : tLen > 32 ? 690 : 730;
  const contentWidth = maxTitleWidth + 40; // shared width for title, subtitle, bullets

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          backgroundColor: "#050505",
          color: "#f9fafb",
          fontFamily: "'Instrument Sans', 'Inter', sans-serif",
          letterSpacing: "-0.01em",
          padding: "60px 70px 72px 70px",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(120% 90% at 85% 15%, rgba(20,241,149,0.25), transparent 60%)",
            opacity: 0.85,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(130% 95% at 15% 10%, rgba(10,132,255,0.2), transparent 65%)",
            opacity: 0.7,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(160% 120% at 50% 100%, rgba(255,92,216,0.18), transparent 70%)",
            opacity: 0.8,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: "60px",
            borderRadius: "46px",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 26px 70px rgba(0,0,0,0.55)",
            opacity: 0.85,
          }}
        />

        <div style={{ position: "relative", display: "flex", flexDirection: "column", flex: 1 }}>
          <header
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "32px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div
                style={{
                  fontSize: "42px",
                  fontWeight: 600,
                  textTransform: "lowercase",
                }}
              >
                learn.sol
              </div>
              <div
                style={{
                  width: "14px",
                  height: "14px",
                  borderRadius: "9999px",
                  backgroundColor: accent,
                  boxShadow: "0 0 14px rgba(20, 241, 149, 0.9)",
                }}
              />
            </div>
            <div
              style={{
                fontSize: "15px",
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: "rgba(248, 250, 252, 0.55)",
              }}
            >
              {eyebrow}
            </div>
          </header>

          <main style={{ display: "flex", flexDirection: "column", gap: `${verticalGap}px`, flexGrow: 1 }}>
            <h1
              style={{
                fontSize: `${titleFontSize}px`,
                lineHeight: 1.02,
                fontWeight: 600,
                maxWidth: `${maxTitleWidth}px`,
                whiteSpace: "pre-wrap",
              }}
            >
              {title}
            </h1>
            {subtitle ? (
              <p
                style={{
                  fontSize: `${subtitleFontSize}px`,
                  color: "rgba(248, 250, 252, 0.75)",
                  maxWidth: `${contentWidth}px`,
                  lineHeight: 1.28,
                  minHeight: "64px",
                }}
              >
                {subtitle}
              </p>
            ) : null}

            {bullets.length ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: `${contentWidth}px` }}>
                {bullets.slice(0, 4).map((item, idx) => {
                  // compute dynamic height allowance for multi-line bullet text without overflow
                  const bulletFontSize = 20;
                  return (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        padding: "14px 16px",
                        borderRadius: "16px",
                        background: "rgba(10,10,10,0.40)",
                        border: "1px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "28px",
                          height: "28px",
                          borderRadius: "28px",
                          background: "rgba(20,241,149,0.18)",
                          color: accent,
                          fontWeight: 600,
                          fontSize: "16px",
                          marginRight: "12px",
                          flexShrink: 0,
                        }}
                      >
                        {idx + 1}
                      </div>
                      <span
                        style={{
                          fontSize: `${bulletFontSize}px`,
                          color: "rgba(248,250,252,0.82)",
                          lineHeight: 1.2,
                          flex: 1,
                        }}
                      >
                        {item}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </main>

          <footer style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: "28px", paddingBottom: "8px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                fontSize: "20px",
                color: "rgba(248, 250, 252, 0.6)",
              }}
            >
              <span
                style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "999px",
                  backgroundColor: accent,
                  boxShadow: "0 0 14px rgba(20,241,149,0.9)",
                  display: "flex",
                }}
              ></span>
              <span>Solana-native curriculum for builders</span>
            </div>
            {footer ? (
              <div
                style={{
                  fontSize: "18px",
                  color: "rgba(248, 250, 252, 0.6)",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                }}
              >
                {footer}
              </div>
            ) : null}
          </footer>
        </div>
      </div>
    ),
    {
      width: SIZE.width,
      height: SIZE.height,
    }
  );
}
