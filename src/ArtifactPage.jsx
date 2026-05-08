import { useParams, Link } from "react-router-dom";
import { Suspense } from "react";
import artifacts from "./artifacts";

export default function ArtifactPage() {
  const { slug } = useParams();
  const artifact = artifacts.find((a) => a.slug === slug);

  if (!artifact) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", gap: 16, fontFamily: "system-ui", color: "#6b6b80" }}>
        <div style={{ fontSize: 48 }}>404</div>
        <Link to="/" style={{ color: "#a89ef4", textDecoration: "none" }}>← Back to dashboard</Link>
      </div>
    );
  }

  const Component = artifact.component;

  return (
    <>
      <div style={{
        position: "fixed",
        top: 16,
        left: 16,
        zIndex: 9999,
      }}>
        <Link
          to="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 14px",
            borderRadius: 100,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.7)",
            textDecoration: "none",
            fontSize: 13,
            fontFamily: "system-ui",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = "#fff"}
          onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.7)"}
        >
          ← Dashboard
        </Link>
      </div>
      <Suspense fallback={null}>
        <Component />
      </Suspense>
    </>
  );
}
