export default function Features() {
  return (
    <section className="section" id="features">
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow">
            <span className="dot" />
            Fully automated, start to finish
          </div>
          <h2>From connected account to published post — no manual steps</h2>
          <p>
            Add your pages once. From there, Loopline's AI handles the
            writing, the design, the posting schedule and the reporting.
          </p>
        </div>

        <div className="features">
          <div className="feature">
            <div className="ic" style={{ background: '#EDEAFB' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6C5CE7" strokeWidth="2" strokeLinecap="round">
                <path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" />
              </svg>
            </div>
            <h3>SEO-friendly title generation</h3>
            <p>AI writes titles and captions tuned for search and each platform's tone — no blank page.</p>
          </div>

          <div className="feature">
            <div className="ic" style={{ background: '#FEECEE' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C23558" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="14" rx="2" />
                <path d="M3 15l5-5 4 4 5-6 4 4" />
              </svg>
            </div>
            <h3>AI banner and image generation</h3>
            <p>Every post gets an on-brand banner or image, generated automatically — no design tool needed.</p>
          </div>

          <div className="feature">
            <div className="ic" style={{ background: '#E7F7F3' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00B39B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="17" rx="2" />
                <path d="M3 9h18M8 2v4M16 2v4" />
              </svg>
            </div>
            <h3>Auto-publishing to your pages</h3>
            <p>Once connected, posts go live on your schedule across every added page — nothing to click.</p>
          </div>

          <div className="feature">
            <div className="ic" style={{ background: '#FFF3DA' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B87A0E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18" />
                <path d="M7 15l4-6 3 4 5-8" />
              </svg>
            </div>
            <h3>Plain-language analytics</h3>
            <p>A weekly summary of what worked, in sentences — reach, engagement and top posts explained simply.</p>
          </div>

          <div className="feature">
            <div className="ic" style={{ background: '#EDEAFB' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6C5CE7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" />
                <path d="M12 3v18M4 7.5l8 4.5 8-4.5" />
              </svg>
            </div>
            <h3>Connect multiple pages</h3>
            <p>Add every Facebook, Instagram or LinkedIn page you manage — Loopline runs all of them from one place.</p>
          </div>

          <div className="feature">
            <div className="ic" style={{ background: '#E7F7F3' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00B39B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a10 10 0 1 0 10 10" />
                <path d="M12 2v10l7 3" />
              </svg>
            </div>
            <h3>Best-time auto-scheduling</h3>
            <p>Posts publish when your audience is actually online, timed per platform automatically.</p>
          </div>
        </div>
      </div>
    </section>
  );
}