import { ImageResponse } from "next/og";
import { brand } from "@/lib/brand";

const SIZE = { width: 1200, height: 630 };
const ACCENT = brand.colors.lime;

export interface ModuleOgOptions {
  title: string;
  description: string;
  logoUrl?: string;
  eyebrow?: string;
}

const truncate = (value: string, maxLength: number): string => {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 1).trimEnd()}...`;
};

export async function generateModuleOgImage(
  options: ModuleOgOptions
): Promise<ImageResponse> {
  const {
    title,
    description,
    logoUrl,
    eyebrow = "solana module",
  } = options;

  const safeTitle = truncate(title, 56);
  const safeDescription = truncate(description, 150);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: "52px",
          backgroundColor: "#05070b",
          backgroundImage:
            "radial-gradient(circle at 82% 22%, rgba(169,255,47,0.2), transparent 34%), radial-gradient(circle at 20% 0%, rgba(169,255,47,0.1), transparent 38%), linear-gradient(120deg, #05070b 20%, #080c06 100%)",
          color: "#f8fafc",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            width: "70%",
            display: "flex",
            flexDirection: "column",
            paddingRight: "32px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "24px",
            }}
          >
            <span style={{ fontSize: "26px", fontWeight: 700 }}>{brand.name}</span>
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "999px",
                backgroundColor: ACCENT,
                display: "flex",
              }}
            />
          </div>

          <span
            style={{
              display: "flex",
              padding: "8px 14px",
              borderRadius: "999px",
              border: "1px solid rgba(169,255,47,0.35)",
              color: "#d8ffa0",
              fontSize: "16px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "26px",
            }}
          >
            {eyebrow}
          </span>

          <h1
            style={{
              display: "flex",
              margin: 0,
              fontSize: "66px",
              lineHeight: 1.04,
              fontWeight: 700,
              letterSpacing: "0",
              maxWidth: "760px",
            }}
          >
            {safeTitle}
          </h1>

          <p
            style={{
              margin: "24px 0 0 0",
              fontSize: "29px",
              lineHeight: 1.25,
              color: "#cbd5e1",
              maxWidth: "760px",
            }}
          >
            {safeDescription}
          </p>
        </div>

        <div
          style={{
            width: "30%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "286px",
              height: "286px",
              borderRadius: "28px",
              backgroundColor: "rgba(15, 23, 42, 0.85)",
              border: "1px solid rgba(148, 163, 184, 0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "26px",
            }}
          >
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Module logo"
                width="220"
                height="220"
                style={{
                  objectFit: "contain",
                }}
              />
            ) : (
              <span style={{ fontSize: "40px", fontWeight: 700, color: "#f8fafc" }}>
                {brand.name}
              </span>
            )}
          </div>
        </div>
      </div>
    ),
    {
      width: SIZE.width,
      height: SIZE.height,
    }
  );
}
