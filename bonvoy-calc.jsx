import { useState, useEffect, useRef } from "react";

const GOLD = "#9e7c4b";
const GOLD_DARK = "#7a6238";
const GOLD_LIGHT = "rgba(158,124,75,0.08)";
const SANS = "'Helvetica Neue', 'Arial', sans-serif";
const SERIF = "'Georgia', 'Times New Roman', serif";

function getVerdict(cpp) {
  if (cpp >= 0.9) return { verdict: "Use Points", color: "#2e7d32", tier: "Excellent" };
  if (cpp >= 0.7) return { verdict: "Use Points", color: "#558b2f", tier: "Good" };
  if (cpp >= 0.5) return { verdict: "Consider Cash", color: "#e65100", tier: "Below Avg" };
  return { verdict: "Pay Cash", color: "#c62828", tier: "Poor" };
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function nightsBetween(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;
  const a = new Date(checkIn + "T00:00:00");
  const b = new Date(checkOut + "T00:00:00");
  const diff = Math.round((b - a) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

// ─── Main Component ───────────────────────────────────────────
export default function BonvoyCalculator() {
  const [animate, setAnimate] = useState(false);
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [hotels, setHotels] = useState([makeHotel()]);
  const [results, setResults] = useState(null);
  const [copied, setCopied] = useState(false);
  const resultsRef = useRef(null);

  useEffect(() => {
    setTimeout(() => setAnimate(true), 100);
  }, []);

  function makeHotel() {
    return { id: Date.now() + Math.random(), name: "", points: "", cash: "" };
  }

  const addHotel = () => {
    if (hotels.length >= 8) return;
    setHotels([...hotels, makeHotel()]);
  };

  const removeHotel = (id) => {
    if (hotels.length <= 1) return;
    setHotels(hotels.filter((h) => h.id !== id));
  };

  const updateHotel = (id, field, value) => {
    setHotels(hotels.map((h) => (h.id === id ? { ...h, [field]: value } : h)));
  };

  const nights = nightsBetween(checkIn, checkOut);

  const calculate = () => {
    const scored = hotels
      .filter((h) => parseFloat(h.points) > 0 && parseFloat(h.cash) > 0)
      .map((h) => {
        const totalPoints = parseFloat(h.points);
        const totalCash = parseFloat(h.cash);
        const cpp = (totalCash / totalPoints) * 100;
        const v = getVerdict(cpp);
        return {
          ...h,
          totalCash,
          totalPoints,
          cpp,
          ...v,
        };
      })
      .sort((a, b) => b.cpp - a.cpp);

    if (scored.length === 0) return;
    setResults(scored);
    setCopied(false);
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  const reset = () => {
    setDestination("");
    setCheckIn("");
    setCheckOut("");
    setHotels([makeHotel()]);
    setResults(null);
    setCopied(false);
  };

  const generateMarkdown = () => {
    if (!results) return "";
    let md = "# Marriott Bonvoy — Points vs. Cash Comparison\n\n";
    if (destination) md += `**Destination:** ${destination}\n`;
    if (nights > 0) md += `**Dates:** ${formatDate(checkIn)} – ${formatDate(checkOut)} (${nights} night${nights !== 1 ? "s" : ""})\n`;
    if (destination || nights > 0) md += "\n";
    md += "## Rankings (Best → Worst Value)\n\n";
    md += "| Rank | Hotel | Cash (Stay) | Points (Stay) | ¢/Point | Verdict |\n";
    md += "|------|-------|-------------|---------------|---------|----------|\n";
    results.forEach((r, i) => {
      const name = r.name || `Hotel #${i + 1}`;
      const cash = "$" + r.totalCash.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const pts = r.totalPoints.toLocaleString("en-US");
      md += `| ${i + 1} | ${name} | ${cash} | ${pts} | ${r.cpp.toFixed(2)}¢ | ${r.verdict} |\n`;
    });
    md += "\n";
    const best = results[0];
    md += `**Best Value:** ${best.name || "Hotel #1"} at ${best.cpp.toFixed(2)}¢ per point — ${best.verdict}\n\n`;
    md += "---\n*Bonvoy points are generally valued at ~0.7¢ each. Above 0.7¢ is solid; above 0.9¢ is excellent.*\n";
    return md;
  };

  const copyToClipboard = async () => {
    const md = generateMarkdown();
    try {
      await navigator.clipboard.writeText(md);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = md;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const exportMarkdown = () => {
    const md = generateMarkdown();
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const destSlug = destination ? destination.replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase() : "comparison";
    a.download = `bonvoy-${destSlug}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={styles.page}>
      <div style={styles.gridBg} />
      <div
        style={{
          ...styles.container,
          opacity: animate ? 1 : 0,
          transform: animate ? "translateY(0)" : "translateY(20px)",
        }}
      >
        {/* ── Header ── */}
        <div style={styles.header}>
          <svg viewBox="0 0 280 48" style={{ width: 220, height: 38 }}>
            <text x="0" y="30" style={{ fontFamily: `'Didot', 'Playfair Display', ${SERIF}`, fontSize: "14px", fill: "#1C1C1C", letterSpacing: "6px", fontWeight: 400 }}>
              MARRIOTT BONVOY
            </text>
            <line x1="0" y1="38" x2="195" y2="38" stroke={GOLD} strokeWidth="1.5" />
            <circle cx="210" cy="38" r="2" fill={GOLD} />
            <circle cx="220" cy="38" r="2" fill={GOLD} />
            <circle cx="230" cy="38" r="2" fill={GOLD} />
          </svg>
          <p style={styles.subtitle}>Points vs. Cash Calculator</p>
        </div>

        {/* ── Trip Details ── */}
        <SectionLabel text="Trip Details" />
        <div style={styles.form}>
          <TextInput label="Destination" value={destination} onChange={setDestination} placeholder="e.g. Maui, Hawaii" icon="📍" />
          <div style={styles.dateRow}>
            <DateInput label="Check-in" value={checkIn} onChange={setCheckIn} />
            <DateInput label="Check-out" value={checkOut} onChange={setCheckOut} />
          </div>
          {nights > 0 && (
            <div style={styles.nightsBadge}>
              <span style={styles.nightsBadgeText}>{nights} night{nights !== 1 ? "s" : ""}</span>
            </div>
          )}
        </div>

        {/* ── Hotels ── */}
        <SectionLabel text="Hotels to Compare" style={{ marginTop: 32 }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {hotels.map((h, i) => (
            <HotelCard
              key={h.id}
              hotel={h}
              index={i}
              onChange={(field, val) => updateHotel(h.id, field, val)}
              onRemove={() => removeHotel(h.id)}
              canRemove={hotels.length > 1}
            />
          ))}
        </div>

        {hotels.length < 8 && (
          <button style={styles.addBtn} onClick={addHotel}>
            + Add Another Hotel
          </button>
        )}

        {/* ── Actions ── */}
        <div style={styles.btnRow}>
          <button
            style={styles.calcBtn}
            onClick={calculate}
            onMouseEnter={(e) => (e.target.style.background = GOLD_DARK)}
            onMouseLeave={(e) => (e.target.style.background = GOLD)}
          >
            Compare &amp; Rank
          </button>
          <button
            style={styles.resetBtn}
            onClick={reset}
            onMouseEnter={(e) => (e.target.style.color = GOLD)}
            onMouseLeave={(e) => (e.target.style.color = "#999")}
          >
            Reset
          </button>
        </div>

        {/* ── Results ── */}
        {results && (
          <div ref={resultsRef} style={{ marginTop: 36 }}>
            {/* Trip summary bar */}
            {(destination || nights > 0) && (
              <div style={styles.tripSummary}>
                {destination && <span style={styles.tripDest}>{destination}</span>}
                {nights > 0 && (
                  <span style={styles.tripDates}>
                    {formatDate(checkIn)} – {formatDate(checkOut)} · {nights} night{nights !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
            )}

            <SectionLabel text="Ranked by Value" />
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {results.map((r, i) => (
                <ResultRow key={r.id} result={r} rank={i + 1} isBest={i === 0} isLast={i === results.length - 1} totalResults={results.length} />
              ))}
            </div>

            {/* Best value callout */}
            <div style={styles.bestCallout}>
              <div style={styles.bestIcon}>★</div>
              <div>
                <div style={styles.bestTitle}>Best Value: {results[0].name || `Hotel #1`}</div>
                <div style={styles.bestSub}>
                  {results[0].cpp.toFixed(2)}¢ per point · {results[0].verdict}
                  {results.length > 1 && results[0].cpp > results[results.length - 1].cpp
                    ? ` · ${((results[0].cpp / results[results.length - 1].cpp - 1) * 100).toFixed(0)}% better value than the lowest option`
                    : ""}
                </div>
              </div>
            </div>

            {/* Export / Copy actions */}
            <div style={styles.exportRow}>
              <button
                style={styles.exportBtn}
                onClick={copyToClipboard}
                onMouseEnter={(e) => { e.target.style.borderColor = GOLD; e.target.style.color = GOLD; }}
                onMouseLeave={(e) => { e.target.style.borderColor = "#ddd"; e.target.style.color = "#888"; }}
              >
                {copied ? "✓ Copied!" : "Copy as Markdown"}
              </button>
              <button
                style={styles.exportBtn}
                onClick={exportMarkdown}
                onMouseEnter={(e) => { e.target.style.borderColor = GOLD; e.target.style.color = GOLD; }}
                onMouseLeave={(e) => { e.target.style.borderColor = "#ddd"; e.target.style.color = "#888"; }}
              >
                Save .md File
              </button>
            </div>
          </div>
        )}

        <p style={styles.footerNote}>
          Bonvoy points are generally valued at ~0.7¢ each. Above 0.7¢ is a solid redemption; above 0.9¢ is excellent. Enter your rates from Marriott.com to compare.
        </p>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────

function SectionLabel({ text, style: extraStyle }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "24px 0 14px", ...extraStyle }}>
      <div style={{ height: 1, flex: 1, background: "#e0dcd5" }} />
      <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", color: GOLD, fontFamily: SANS }}>{text}</span>
      <div style={{ height: 1, flex: 1, background: "#e0dcd5" }} />
    </div>
  );
}

function TextInput({ label, value, onChange, placeholder, icon }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={styles.inputGroup}>
      <label style={styles.label}>{label}</label>
      <div style={{ ...styles.inputWrapper, borderColor: focused ? GOLD : "#ddd", boxShadow: focused ? `0 0 0 3px ${GOLD_LIGHT}` : "none" }}>
        {icon && <span style={{ marginRight: 8, fontSize: 16 }}>{icon}</span>}
        <input
          style={styles.input}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </div>
    </div>
  );
}

function DateInput({ label, value, onChange }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ ...styles.inputGroup, flex: 1 }}>
      <label style={styles.label}>{label}</label>
      <div style={{ ...styles.inputWrapper, borderColor: focused ? GOLD : "#ddd", boxShadow: focused ? `0 0 0 3px ${GOLD_LIGHT}` : "none" }}>
        <input
          type="date"
          style={{ ...styles.input, fontSize: 15, colorScheme: "light" }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </div>
    </div>
  );
}

function HotelCard({ hotel, index, onChange, onRemove, canRemove }) {
  return (
    <div style={styles.hotelCard}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={styles.hotelIndex}>Hotel {index + 1}</span>
        {canRemove && (
          <button style={styles.removeBtn} onClick={onRemove}>✕</button>
        )}
      </div>
      <div style={styles.inputGroup}>
        <label style={styles.label}>Hotel Name</label>
        <div style={styles.inputWrapper}>
          <input
            style={styles.input}
            value={hotel.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="e.g. Sheraton Maui Resort"
          />
        </div>
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
        <div style={{ ...styles.inputGroup, flex: 1 }}>
          <label style={styles.label}>Points / Stay</label>
          <div style={styles.inputWrapper}>
            <input
              style={styles.input}
              value={hotel.points}
              onChange={(e) => onChange("points", e.target.value.replace(/[^0-9]/g, ""))}
              placeholder="35000"
            />
            <span style={styles.suffix}>pts</span>
          </div>
        </div>
        <div style={{ ...styles.inputGroup, flex: 1 }}>
          <label style={styles.label}>Cash / Stay</label>
          <div style={styles.inputWrapper}>
            <span style={styles.prefix}>$</span>
            <input
              style={styles.input}
              value={hotel.cash}
              onChange={(e) => onChange("cash", e.target.value.replace(/[^0-9.]/g, ""))}
              placeholder="289"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ResultRow({ result, rank, isBest, isLast, totalResults }) {
  const v = getVerdict(result.cpp);
  const isOnly = totalResults === 1;
  let borderRadius = 0;
  if (isOnly) borderRadius = 12;
  else if (isBest) borderRadius = "12px 12px 0 0";
  else if (isLast) borderRadius = "0 0 12px 12px";

  return (
    <div
      style={{
        background: isBest ? "linear-gradient(135deg, rgba(158,124,75,0.07), rgba(158,124,75,0.02))" : "#fff",
        border: isBest ? `1.5px solid ${GOLD}` : "1px solid #e8e4dd",
        borderBottom: isLast || isOnly ? undefined : "none",
        borderRadius,
        padding: "20px 20px",
        display: "flex",
        alignItems: "flex-start",
        gap: 16,
        position: "relative",
      }}
    >
      {/* Rank */}
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: isBest ? GOLD : "#eee",
          color: isBest ? "#fff" : "#999",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 14,
          fontWeight: 700,
          fontFamily: SANS,
          flexShrink: 0,
          marginTop: 2,
        }}
      >
        {rank}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 8 }}>
          <span style={{ fontSize: 16, fontWeight: 600, color: "#1C1C1C", fontFamily: SERIF }}>
            {result.name || `Hotel #${rank}`}
          </span>
          <span style={{ fontSize: 24, fontWeight: 700, color: "#1C1C1C", fontFamily: SERIF }}>
            {result.cpp.toFixed(2)}¢
          </span>
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap", alignItems: "center" }}>
          <span
            style={{
              display: "inline-block",
              padding: "3px 12px",
              borderRadius: 20,
              background: v.color,
              color: "#fff",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              fontFamily: SANS,
            }}
          >
            {v.verdict}
          </span>
          <span style={{ fontSize: 12, color: "#999", fontFamily: SANS }}>
            ${result.totalCash.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} cash · {result.totalPoints.toLocaleString("en-US")} pts per stay
          </span>
        </div>

        {/* Mini scale */}
        <div style={{ marginTop: 10 }}>
          <div style={{ height: 4, borderRadius: 2, background: "linear-gradient(90deg, #c62828, #e65100, #558b2f, #2e7d32)", position: "relative" }}>
            <div
              style={{
                position: "absolute",
                top: -4,
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: "#1C1C1C",
                border: "2px solid #fff",
                boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                transform: "translateX(-50%)",
                left: `${Math.min(Math.max((result.cpp / 1.4) * 100, 3), 97)}%`,
                transition: "left 0.5s ease",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────
const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "40px 16px 80px",
    fontFamily: SERIF,
    background: "#FAF9F6",
    position: "relative",
    overflow: "hidden",
  },
  gridBg: {
    position: "absolute",
    inset: 0,
    backgroundImage: `linear-gradient(rgba(158,124,75,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(158,124,75,0.04) 1px, transparent 1px)`,
    backgroundSize: "48px 48px",
    pointerEvents: "none",
  },
  container: {
    width: "100%",
    maxWidth: 500,
    transition: "opacity 0.6s ease, transform 0.6s ease",
    position: "relative",
    zIndex: 1,
  },
  header: { textAlign: "center", marginBottom: 12 },
  subtitle: { marginTop: 12, fontSize: 15, color: "#888", letterSpacing: "0.5px", fontStyle: "italic" },
  form: { display: "flex", flexDirection: "column", gap: 16 },
  dateRow: { display: "flex", gap: 12 },
  inputGroup: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1.5px", color: "#666", fontFamily: SANS },
  inputWrapper: {
    display: "flex",
    alignItems: "center",
    border: "1.5px solid #ddd",
    borderRadius: 8,
    padding: "0 14px",
    background: "#fff",
    transition: "all 0.2s ease",
    height: 46,
  },
  prefix: { fontSize: 17, color: GOLD, fontWeight: 600, marginRight: 4 },
  input: { flex: 1, border: "none", outline: "none", fontSize: 16, fontFamily: SERIF, background: "transparent", color: "#1C1C1C", padding: 0, minWidth: 0 },
  suffix: { fontSize: 12, color: "#aaa", marginLeft: 8, whiteSpace: "nowrap", fontFamily: SANS },
  nightsBadge: { textAlign: "center" },
  nightsBadgeText: { fontSize: 13, color: GOLD, fontWeight: 600, fontFamily: SANS, letterSpacing: "0.5px" },
  hotelCard: {
    background: "#fff",
    border: "1px solid #e8e4dd",
    borderRadius: 12,
    padding: "16px 18px 20px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
  },
  hotelIndex: { fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: GOLD, fontFamily: SANS },
  removeBtn: {
    width: 26,
    height: 26,
    borderRadius: "50%",
    border: "1px solid #ddd",
    background: "transparent",
    color: "#bbb",
    fontSize: 12,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  addBtn: {
    marginTop: 12,
    width: "100%",
    height: 44,
    border: "1.5px dashed #d0ccc5",
    borderRadius: 10,
    background: "transparent",
    color: "#999",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: SANS,
    letterSpacing: "0.5px",
    transition: "all 0.15s ease",
  },
  btnRow: { display: "flex", gap: 12, marginTop: 28 },
  calcBtn: {
    flex: 1,
    height: 50,
    background: GOLD,
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 600,
    letterSpacing: "1px",
    textTransform: "uppercase",
    cursor: "pointer",
    fontFamily: SANS,
    transition: "background 0.2s ease",
  },
  resetBtn: {
    height: 50,
    padding: "0 24px",
    background: "transparent",
    color: "#999",
    border: "none",
    fontSize: 14,
    cursor: "pointer",
    fontFamily: SANS,
    transition: "color 0.2s ease",
  },
  tripSummary: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
    marginBottom: 8,
  },
  tripDest: { fontSize: 18, fontWeight: 600, color: "#1C1C1C", fontFamily: SERIF },
  tripDates: { fontSize: 13, color: "#999", fontFamily: SANS },
  bestCallout: {
    marginTop: 20,
    display: "flex",
    alignItems: "center",
    gap: 14,
    background: "linear-gradient(135deg, rgba(158,124,75,0.1), rgba(158,124,75,0.03))",
    border: `1px solid rgba(158,124,75,0.25)`,
    borderRadius: 12,
    padding: "16px 18px",
  },
  bestIcon: { fontSize: 28, color: GOLD, flexShrink: 0 },
  bestTitle: { fontSize: 15, fontWeight: 700, color: "#1C1C1C", fontFamily: SANS },
  bestSub: { fontSize: 13, color: "#777", marginTop: 2, lineHeight: 1.4, fontFamily: SANS },
  footerNote: { marginTop: 28, fontSize: 12, color: "#bbb", textAlign: "center", lineHeight: 1.5, fontStyle: "italic" },
  exportRow: {
    display: "flex",
    gap: 10,
    marginTop: 16,
  },
  exportBtn: {
    flex: 1,
    height: 40,
    border: "1.5px solid #ddd",
    borderRadius: 8,
    background: "#fff",
    color: "#888",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: SANS,
    transition: "all 0.2s ease",
  },
};
