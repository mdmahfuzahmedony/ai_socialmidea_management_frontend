
const PLATFORMS = [
  { name: 'Facebook Page', color: '#E6F1FB', text: '#185FA5', letter: 'f' },
  { name: 'Instagram Business', color: '#FEECEE', text: '#C23558', letter: 'IG' },
  { name: 'LinkedIn Page', color: '#EDEAFB', text: '#4B3DC4', letter: 'in' },
  { name: 'TikTok', color: '#E7F7F3', text: '#00B39B', letter: 'TT' },
  { name: 'X (Twitter)', color: '#F1EFE8', text: '#444441', letter: 'X' },
  { name: 'Threads', color: '#EDEAFB', text: '#4B3DC4', letter: '@' },
];

export default function IntegrationsPage() {
  return (
    <>
     
      <section className="page-hero wrap">
        <div className="eyebrow" style={{ margin: '0 auto 20px' }}>
          <span className="dot" />
          Connect your pages
        </div>
        <h1>Everywhere Loopline can post for you</h1>
        <p>
          Connect a page once with a secure login — Loopline never asks for
          your password directly, only the permissions needed to post and
          read basic performance data.
        </p>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="features">
            {PLATFORMS.map((p) => (
              <div className="feature" key={p.name}>
                <div
                  className="ic"
                  style={{ background: p.color, color: p.text, fontWeight: 600, fontSize: 14 }}
                >
                  {p.letter}
                </div>
                <h3>{p.name}</h3>
                <p>Connect with one click and choose which pages Loopline can manage.</p>
                <a href="/signup" className="btn btn-ghost" style={{ marginTop: 16 }}>
                  Connect
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">
              <span className="dot" />
              How a connection works
            </div>
            <h2>Three steps, no passwords shared</h2>
            <p>The same secure login flow every major platform uses for third-party apps.</p>
          </div>

          <div className="values-grid">
            <div className="value-card">
              <div className="num">01</div>
              <h3>Log in on the platform&apos;s own screen</h3>
              <p>Clicking connect opens Facebook, Instagram or LinkedIn&apos;s own login window — never a Loopline form.</p>
            </div>
            <div className="value-card">
              <div className="num">02</div>
              <h3>Approve what Loopline can access</h3>
              <p>You choose which pages to share, and grant permission to post and read basic post performance only.</p>
            </div>
            <div className="value-card">
              <div className="num">03</div>
              <h3>Loopline takes it from there</h3>
              <p>The page shows up as connected in your dashboard, and AI can start writing, designing and posting.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0, paddingBottom: 0 }}>
        <div className="cta-band">
          <h2>Ready to connect your first page?</h2>
          <p>Start free — no card required.</p>
          <a href="/signup" className="btn btn-primary">
            Start free trial
          </a>
        </div>
      </section>

    
    </>
  );
}
