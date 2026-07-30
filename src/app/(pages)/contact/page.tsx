
export default function ContactPage() {
  return (
    <>
    

      <section className="page-hero wrap">
        <div className="eyebrow" style={{ margin: '0 auto 20px' }}>
          <span className="dot" />
          Get in touch
        </div>
        <h1>Questions before you connect a page?</h1>
        <p>Send us a message and we&apos;ll reply within one business day.</p>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="contact-grid">
            <div className="contact-info">
              <h2>Contact details</h2>
              <p>Reach out directly, or use the form and we&apos;ll get back to you.</p>

              <div className="contact-detail">
                <div className="ic">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6C5CE7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16v16H4z" opacity="0" />
                    <path d="M22 6l-10 7L2 6" />
                    <path d="M2 6h20v12H2z" />
                  </svg>
                </div>
                <div>
                  <h4>Email</h4>
                  <p>support@loopline.app</p>
                </div>
              </div>

              <div className="contact-detail">
                <div className="ic">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6C5CE7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.4 2.1L8 9.9a16 16 0 0 0 6 6l1.4-1.4a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.8 2.2z" />
                  </svg>
                </div>
                <div>
                  <h4>Phone</h4>
                  <p>+880 1XXX-XXXXXX</p>
                </div>
              </div>

              <div className="contact-detail">
                <div className="ic">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6C5CE7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <h4>Office</h4>
                  <p>Dhaka, Bangladesh</p>
                </div>
              </div>
            </div>

            <form className="contact-form">
              <div className="form-row">
                <label htmlFor="name">Name</label>
                <input id="name" name="name" type="text" placeholder="Your name" required />
              </div>
              <div className="form-row">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" placeholder="you@company.com" required />
              </div>
              <div className="form-row">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" placeholder="How can we help?" required />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Send message
              </button>
            </form>
          </div>
        </div>
      </section>

     
    </>
  );
}
