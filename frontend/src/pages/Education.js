import React, { useMemo, useState } from "react";

export default function Education() {
  const [query, setQuery] = useState("");

  const tutorials = useMemo(() => [
    { title: "Getting Started with Investing", desc: "Learn account setup, funding, and placing your first trade.", icon: "fa-rocket" },
    { title: "Basic Order Types", desc: "Market vs Limit vs Stop — when to use which.", icon: "fa-sliders" },
    { title: "Risk Management 101", desc: "Position sizing, diversification, and drawdown control.", icon: "fa-shield-halved" },
    { title: "Reading Charts", desc: "Candlesticks, trends, support & resistance.", icon: "fa-chart-line" }
  ], []);

  const explainers = useMemo(() => [
    { title: "What is a Stock?", desc: "Ownership, dividends, and earnings.", icon: "fa-building" },
    { title: "Bonds", desc: "Yield, duration, coupons, and credit risk.", icon: "fa-file-lines" },
    { title: "ETFs", desc: "Index tracking and portfolio building.", icon: "fa-layer-group" },
    { title: "Options", desc: "Calls, puts, greeks, and payoff diagrams.", icon: "fa-code-branch" },
    { title: "Indices", desc: "Benchmarks that track market segments.", icon: "fa-chart-area" },
    { title: "Forex & Crypto", desc: "Currencies, pairs, volatility, and wallets.", icon: "fa-bitcoin" }
  ], []);

  const faqs = [
    { q: "Is investing risky?", a: "Yes. Always invest within your risk tolerance and time horizon." },
    { q: "How much do I need to start?", a: "You can start with small amounts; focus on consistency and learning." },
    { q: "Should I time the market?", a: "Timing is hard. Many prefer systematic strategies and diversification." },
  ];

  const qLower = query.trim().toLowerCase();
  const filteredTutorials = useMemo(
    () => tutorials.filter(t => t.title.toLowerCase().includes(qLower)),
    [qLower, tutorials]
  );
  const filteredExplainers = useMemo(
    () => explainers.filter(e => e.title.toLowerCase().includes(qLower)),
    [qLower, explainers]
  );

  return (
    <div className="education-page">
      <style>{`
        .education-page {
          --bg: #000000;
          --surface: #0c0c0c;
          --surface-2: #111315;
          --border: #1f2226;
          --text: #ffffff;
          --muted: #adb5bd;
          --primary: #0d6efd;
          --primary-ghost: rgba(13,110,253,0.15);
        }
        .edu-hero {
          background: radial-gradient(1000px 480px at 10% 10%, var(--primary-ghost), transparent),
                      radial-gradient(1000px 480px at 90% 10%, rgba(102,16,242,0.12), transparent),
                      linear-gradient(180deg, var(--bg), var(--bg));
          color: var(--text);
          padding: 64px 0 40px;
          text-align: center;
        }
        .edu-hero h1 { font-weight: 800; letter-spacing: 0.5px; color: var(--text); }
        .edu-hero p { color: var(--muted); }
        .edu-search {
          max-width: 720px; margin: 24px auto 0; position: relative;
        }
        .edu-search input { padding-left: 44px; background: var(--bg); color: var(--text); border: 1px solid #ffffff; }
        .edu-search i {
          position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
          color: var(--muted);
        }
        .edu-section { padding: 40px 0; background: var(--surface); }
        .edu-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; }
        .edu-card { background: var(--surface-2); border: 1px solid var(--border); border-radius: 14px; padding: 18px; color: var(--text); transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease; }
        .edu-card:hover { transform: translateY(-2px); border-color: var(--primary); box-shadow: 0 10px 24px var(--primary-ghost); }
        .edu-icon { width: 44px; height: 44px; display: grid; place-items: center; border-radius: 10px; background: var(--primary-ghost); color: var(--primary); margin-bottom: 10px; }
        .edu-kicker { font-size: 12px; letter-spacing: .08em; color: var(--muted); text-transform: uppercase; margin-bottom: 12px; }
        .faq-item { background: var(--surface-2); border: 1px solid var(--border); border-radius: 12px; }
        .faq-q { cursor: pointer; padding: 14px 16px; color: var(--text); display:flex; align-items:center; justify-content:space-between; }
        .faq-a { padding: 0 16px 16px; color: var(--muted); }
        .section-title { display:flex; align-items:center; gap:10px; color: var(--text); margin-bottom: 16px; }
        .section-title i { color: var(--primary); }
        .chip { font-size: 12px; color: var(--muted); padding: 4px 10px; border: 1px solid var(--border); border-radius: 999px; background: transparent; }
        .education-page a { color: var(--primary); text-decoration: none; }
        .education-page a:hover { text-decoration: underline; }
      `}</style>

      <div className="edu-hero">
        <div className="container">
          <span className="chip">Learn</span>
          <h1 className="mt-2">Learn & Explore the Markets</h1>
          <p>Beginner-friendly tutorials, clear FAQs, and bite-sized market explainers — all in one place.</p>
          <div className="edu-search input-group">
            <i className="fa fa-search" aria-hidden="true"></i>
            <input className="form-control form-control-lg" placeholder="Search topics (e.g. Options, ETFs, Risk)" value={query} onChange={e=>setQuery(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="container">
        {/* Tutorials */}
        <section className="edu-section" id="tutorials">
          <div className="section-title">
            <i className="fa fa-graduation-cap"></i>
            <h4 className="m-0">Beginner Tutorials</h4>
          </div>
          <div className="edu-grid">
            {filteredTutorials.map((t, i) => (
              <div key={i} className="edu-card">
                <div className="edu-icon"><i className={`fa ${t.icon}`}></i></div>
                <h6 className="mb-1">{t.title}</h6>
                <div className="text-secondary small">{t.desc}</div>
                <a href="/education#tutorials" className="mt-2 d-inline-block text-decoration-none">Read tutorial →</a>
              </div>
            ))}
            {filteredTutorials.length === 0 && <div className="text-secondary">No tutorials match your search.</div>}
          </div>
        </section>

        {/* FAQs */}
        <section className="edu-section" id="faqs">
          <div className="section-title">
            <i className="fa fa-circle-question"></i>
            <h4 className="m-0">FAQs</h4>
          </div>
          <div className="d-grid gap-2">
            {faqs.map((f, idx) => (
              <details key={idx} className="faq-item">
                <summary className="faq-q">
                  <span>{f.q}</span>
                  <i className="fa fa-chevron-down"></i>
                </summary>
                <div className="faq-a">{f.a}</div>
              </details>
            ))}
          </div>
        </section>

        {/* Market Explainers */}
        <section className="edu-section" id="explainers">
          <div className="section-title">
            <i className="fa fa-lightbulb"></i>
            <h4 className="m-0">Market Explainers</h4>
          </div>
          <div className="edu-grid">
            {filteredExplainers.map((e, i) => (
              <div key={i} className="edu-card">
                <div className="edu-icon"><i className={`fa ${e.icon}`}></i></div>
                <h6 className="mb-1">{e.title}</h6>
                <div className="text-secondary small">{e.desc}</div>
                <a href="/education#explainers" className="mt-2 d-inline-block text-decoration-none">Learn more →</a>
              </div>
            ))}
            {filteredExplainers.length === 0 && <div className="text-secondary">No explainers match your search.</div>}
          </div>
        </section>
      </div>
    </div>
  );
}
