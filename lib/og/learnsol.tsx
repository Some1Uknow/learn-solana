import { ImageResponse } from "next/og";

const SIZE = { width: 1200, height: 630 };

const accent = "#14F195"; // Solana green from theme

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

  const limitedBullets = bullets.slice(0, 2);
  const showBullets = limitedBullets.length > 0;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0a0a0a",
          backgroundImage: "radial-gradient(ellipse 120% 80% at 70% 20%, rgba(153, 69, 255, 0.12), transparent 50%), radial-gradient(ellipse 100% 60% at 30% 10%, rgba(20, 241, 149, 0.08), transparent 60%)",
          color: "#f5f5f5",
          fontFamily: "'Inter', sans-serif",
          padding: "64px",
        }}
      >
        {/* Header with learn.sol branding */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "64px" }}>
          <span
            style={{
              fontSize: "24px",
              fontWeight: 600,
            }}
          >
            learn.sol
          </span>
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "999px",
              backgroundColor: accent,
              display: "flex",
            }}
          />
        </div>

        {/* Eyebrow */}
        <div style={{ display: "flex", marginBottom: "24px" }}>
          <span
            style={{
              color: accent,
              fontSize: "14px",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            {eyebrow}
          </span>
        </div>

        {/* Title */}
        <div style={{ display: "flex", marginBottom: "32px" }}>
          <h1
            style={{
              fontSize: "72px",
              fontWeight: 700,
              lineHeight: 1.1,
              whiteSpace: "pre-line",
              margin: 0,
            }}
          >
            {title}
          </h1>
        </div>

        {/* Subtitle */}
        {subtitle ? (
          <div style={{ display: "flex", marginBottom: "48px" }}>
            <p
              style={{
                fontSize: "24px",
                color: "#a1a1aa",
                maxWidth: "900px",
                lineHeight: 1.4,
                margin: 0,
              }}
            >
              {subtitle}
            </p>
          </div>
        ) : null}

        {/* Bullets */}
        {showBullets ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "auto" }}>
            {limitedBullets.map((item, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "999px",
                    backgroundColor: accent,
                    flexShrink: 0,
                    display: "flex",
                  }}
                />
                <p
                  style={{
                    fontSize: "20px",
                    color: "#d4d4d8",
                    margin: 0,
                  }}
                >
                  {item}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: "flex", flexGrow: 1 }} />
        )}

        {/* Footer - empty div to maintain spacing */}
        <div style={{ display: "flex", marginTop: "auto" }} />
      </div>
    ),
    {
      width: SIZE.width,
      height: SIZE.height,
    }
  );
}
