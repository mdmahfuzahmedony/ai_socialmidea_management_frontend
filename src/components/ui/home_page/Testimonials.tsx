export default function Testimonials() {
  return (
    <section className="section testimonials">
      <div className="wrap">
        <div className="section-head">
          <div
            className="eyebrow"
            style={{
              background: "#2A2850",
              borderColor: "#3A3860",
              color: "#C7C2F0",
            }}
          >
            <span className="dot" />
            From teams using HeyBazz
          </div>
          <h2>Set it up once, it keeps running</h2>
          <p>
            Small teams and busy solo creators on what changed after switching
            over.
          </p>
        </div>

        <div className="t-grid">
          <div className="t-card">
            <div className="stars">★★★★★</div>
            <p className="t-quote">
              "I connected our three pages and stopped thinking about posting
              entirely. The banners actually match our brand."
            </p>
            <div className="t-person">
              <div className="t-avatar" />
              <div>
                <div className="t-name">Priya Nathan</div>
                <div className="t-role">Social lead, Fielder Studio</div>
              </div>
            </div>
          </div>

          <div className="t-card">
            <div className="stars">★★★★★</div>
            <p className="t-quote">
              "I run five accounts alone. HeyBazz writes, designs and posts — I
              only step in to check the weekly report."
            </p>
            <div className="t-person">
              <div className="t-avatar" />
              <div>
                <div className="t-name">Devon Marsh</div>
                <div className="t-role">Solo creator, @marlow.coffee</div>
              </div>
            </div>
          </div>

          <div className="t-card">
            <div className="stars">★★★★★</div>
            <p className="t-quote">
              "The SEO titles alone brought in more search traffic than our old
              captions ever did."
            </p>
            <div className="t-person">
              <div className="t-avatar" />
              <div>
                <div className="t-name">Amara Osei</div>
                <div className="t-role">Agency owner, Vantage Media</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
