import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";

export const runtime = "edge";

const COLORS: Record<string, { bg: string; accent: string }> = {
  article: { bg: "#1e1b4b", accent: "#818cf8" },
  topic: { bg: "#0c4a6e", accent: "#38bdf8" },
  company: { bg: "#14532d", accent: "#4ade80" },
  coding: { bg: "#7c2d12", accent: "#fb923c" },
  roadmap: { bg: "#4c1d95", accent: "#a78bfa" },
  default: { bg: "#0f172a", accent: "#8b5cf6" },
};

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = searchParams.get("title") || "InterviewHub AI";
  const type = searchParams.get("type") || "default";
  const subtitle = searchParams.get("subtitle") || "";

  const colors = COLORS[type] || COLORS.default;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 80px",
          background: `linear-gradient(135deg, ${colors.bg} 0%, #000000 100%)`,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Top bar accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: `linear-gradient(90deg, ${colors.accent}, #ec4899)`,
          }}
        />

        {/* Logo + type badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: `linear-gradient(135deg, ${colors.accent}, #ec4899)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              fontWeight: 800,
              color: "white",
            }}
          >
            IH
          </div>
          <span style={{ color: "#94a3b8", fontSize: "20px", fontWeight: 600 }}>
            InterviewHub AI
          </span>
          {type !== "default" && (
            <span
              style={{
                color: colors.accent,
                fontSize: "16px",
                fontWeight: 600,
                border: `1px solid ${colors.accent}`,
                borderRadius: "20px",
                padding: "4px 16px",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              {type}
            </span>
          )}
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: title.length > 60 ? "40px" : title.length > 40 ? "48px" : "56px",
            fontWeight: 800,
            color: "white",
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
            maxWidth: "900px",
          }}
        >
          {title}
        </div>

        {/* Subtitle */}
        {subtitle && (
          <div
            style={{
              fontSize: "24px",
              color: "#94a3b8",
              marginTop: "16px",
              maxWidth: "800px",
            }}
          >
            {subtitle}
          </div>
        )}

        {/* Bottom tagline */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            left: "80px",
            display: "flex",
            alignItems: "center",
            gap: "24px",
          }}
        >
          <span style={{ color: "#64748b", fontSize: "18px" }}>
            interviewhub.ai — Crack Any Tech Interview
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
