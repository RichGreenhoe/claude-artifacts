import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import ArtifactPage from "./ArtifactPage";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/:slug" element={<Suspense fallback={<Loading />}><ArtifactPage /></Suspense>} />
      </Routes>
    </HashRouter>
  </StrictMode>
);

function Loading() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: "#6b6b80", fontFamily: "system-ui" }}>
      Loading…
    </div>
  );
}
