import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import artifacts from "./artifacts";
import styles from "./App.module.css";

export default function App() {
  return (
    <div className={styles.page}>
      <div className={styles.orb1} />
      <div className={styles.orb2} />

      <header className={styles.header}>
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          Claude Artifacts
        </div>
        <h1 className={styles.heading}>
          Useful things,<br />built with Claude.
        </h1>
        <p className={styles.subtitle}>
          A growing collection of interactive tools and calculators — each a self-contained React component.
        </p>
      </header>

      <div className={styles.sectionLabel}><span>All Artifacts</span></div>

      <div className={styles.grid}>
        {artifacts.map((a) => (
          <Card key={a.slug} artifact={a} />
        ))}
      </div>

      <footer className={styles.footer}>
        <span className={styles.footerLeft}>
          Built with{" "}
          <a href="https://claude.ai" target="_blank" rel="noopener" className={styles.inlineLink}>
            Claude
          </a>
        </span>
        <a
          className={styles.footerLink}
          href="https://github.com/RichGreenhoe/claude-artifacts"
          target="_blank"
          rel="noopener"
        >
          <GitHubIcon />
          GitHub
        </a>
      </footer>
    </div>
  );
}

function Card({ artifact }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100).toFixed(1) + "%");
      el.style.setProperty("--my", ((e.clientY - r.top)  / r.height * 100).toFixed(1) + "%");
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <Link ref={ref} className={styles.card} to={`/${artifact.slug}`}>
      <div className={styles.cardArrow}><ArrowIcon /></div>
      <div className={styles.cardIcon}>{artifact.icon}</div>
      <div className={styles.cardTitle}>{artifact.title}</div>
      <div className={styles.cardDesc}>{artifact.description}</div>
      <div className={styles.cardMeta}>
        {artifact.tags.map((t) => (
          <span key={t} className={styles.tag}>{t}</span>
        ))}
        <span className={styles.tag}>React</span>
      </div>
    </Link>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" width="14" height="14">
      <path d="M7 17L17 7M7 7h10v10" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}
