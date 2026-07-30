
export default function AboutPage() {
  return (
    <>
      

      <section className="page-hero wrap">
        <div className="eyebrow" style={{ margin: '0 auto 20px' }}>
          <span className="dot" />
          Why we built Loopline
        </div>
        <h1>Social media shouldn&apos;t need a full-time team</h1>
        <p>
          Most small teams and solo creators manage social media on top of
          their real job. Loopline exists so a page gets posted, designed and
          reported on without anyone opening five different tabs.
        </p>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">
              <span className="dot" />
              What we believe
            </div>
            <h2>Automation should feel like a quiet teammate</h2>
            <p>Three ideas guide every feature we build.</p>
          </div>

          <div className="values-grid">
            <div className="value-card">
              <div className="num">01</div>
              <h3>Connect once, forget it</h3>
              <p>Adding a page shouldn&apos;t mean a new daily chore. Once it&apos;s connected, Loopline keeps it running.</p>
            </div>
            <div className="value-card">
              <div className="num">02</div>
              <h3>Write like the brand, not a robot</h3>
              <p>AI output should read like someone who actually knows the brand wrote it — never generic.</p>
            </div>
            <div className="value-card">
              <div className="num">03</div>
              <h3>Reports you can actually use</h3>
              <p>Numbers mean nothing without context. We explain what happened in plain sentences.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">
              <span className="dot" />
              The team
            </div>
            <h2>A small team building for small teams</h2>
            <p>We manage our own accounts on Loopline — every feature ships because we needed it first.</p>
          </div>

          <div className="team-grid">
            <div className="team-card">
              <div className="team-avatar" />
              <div className="team-name">Rafiul Hasan</div>
              <div className="team-role">Founder</div>
            </div>
            <div className="team-card">
              <div className="team-avatar" style={{ opacity: 0.7 }} />
              <div className="team-name">Nadia Islam</div>
              <div className="team-role">Product</div>
            </div>
            <div className="team-card">
              <div className="team-avatar" style={{ opacity: 0.85 }} />
              <div className="team-name">Tanvir Ahmed</div>
              <div className="team-role">Engineering</div>
            </div>
            <div className="team-card">
              <div className="team-avatar" style={{ opacity: 0.6 }} />
              <div className="team-name">Sadia Karim</div>
              <div className="team-role">Support</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0, paddingBottom: 0 }}>
        <div className="cta-band">
          <h2>Come see it running on your own pages</h2>
          <p>Start free — no card required.</p>
          <a href="/signup" className="btn btn-primary">
            Start free trial
          </a>
        </div>
      </section>

     
    </>
  );
}
