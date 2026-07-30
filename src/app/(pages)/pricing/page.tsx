
function Check() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00B39B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export default function PricingPage() {
  return (
    <>
     
      <section className="page-hero wrap">
        <div className="eyebrow" style={{ margin: '0 auto 20px' }}>
          <span className="dot" />
          Simple, page-based pricing
        </div>
        <h1>Pick a plan for how many pages you run</h1>
        <p>Every plan includes AI title generation, banner design, auto-posting and analytics. Upgrade any time as you add more pages.</p>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="pricing-grid">
            <div className="price-card">
              <div className="price-plan">Free</div>
              <div className="price-amount">
                ৳0<span> /month</span>
              </div>
              <p className="price-desc">Try Loopline on a single page, no card needed.</p>
              <a href="/signup" className="btn btn-ghost">Start free</a>
              <ul className="price-features">
                <li><Check /> 1 connected page</li>
                <li><Check /> Up to 5 AI posts / month</li>
                <li><Check /> AI titles + captions</li>
                <li><Check /> Basic analytics</li>
              </ul>
            </div>

            <div className="price-card featured">
              <div className="price-badge">Most popular</div>
              <div className="price-plan">Standard</div>
              <div className="price-amount">
                ৳500<span> /month</span>
              </div>
              <p className="price-desc">For small teams running a few active pages.</p>
              <a href="/signup" className="btn btn-primary">Start free trial</a>
              <ul className="price-features">
                <li><Check /> Up to 3 connected pages</li>
                <li><Check /> Up to 40 AI posts / month</li>
                <li><Check /> AI titles + captions + banners</li>
                <li><Check /> Best-time auto-scheduling</li>
                <li><Check /> Weekly plain-language reports</li>
              </ul>
            </div>

            <div className="price-card">
              <div className="price-plan">Premium</div>
              <div className="price-amount">
                ৳1000<span> /month</span>
              </div>
              <p className="price-desc">For agencies managing many pages at once.</p>
              <a href="/signup" className="btn btn-ghost">Start free trial</a>
              <ul className="price-features">
                <li><Check /> Unlimited connected pages</li>
                <li><Check /> Up to 1000 AI posts / month</li>
                <li><Check /> AI titles + captions + banners</li>
                <li><Check /> Best-time auto-scheduling</li>
                <li><Check /> Full analytics + client reports</li>
                <li><Check /> Priority support</li>
              </ul>
            </div>
          </div>

          <div className="pricing-faq">
            <div className="section-head">
              <h2 style={{ fontSize: 28 }}>Questions about pricing</h2>
            </div>
            <div className="faq-item">
              <h3>What counts as an AI post?</h3>
              <p>Any single piece of content Loopline writes, designs and publishes to one of your connected pages.</p>
            </div>
            <div className="faq-item">
              <h3>Can I change plans later?</h3>
              <p>Yes — upgrade or downgrade any time as the number of pages you manage changes.</p>
            </div>
            <div className="faq-item">
              <h3>What happens if I go over my post limit?</h3>
              <p>Loopline pauses new AI posts until the next billing cycle, or you can upgrade instantly.</p>
            </div>
          </div>
        </div>
      </section>

     
    </>
  );
}
