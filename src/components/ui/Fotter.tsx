import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">
            <div className="logo">
              <div className="logo-mark" />
              HeyBazz
            </div>
            <p>
              AI-powered social media management — connect your accounts and let
              HeyBazz write, design and publish your posts for you.
            </p>
          </div>

          <div className="foot-col">
            <h4>Product</h4>
            <Link href="/#features">Features</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/integrations">Integrations</Link>
          </div>

          <div className="foot-col">
            <h4>Company</h4>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/#">Careers</Link>
          </div>

          <div className="foot-col">
            <h4>Resources</h4>
            <Link href="/docs">Docs</Link>
            <Link href="/#">Blog</Link>
            <Link href="/#">Status</Link>
          </div>
        </div>

        <div className="foot-bottom">
          <span>© 2026 HeyBazz. All rights reserved.</span>
          <span>Made for teams juggling too many accounts.</span>
        </div>
      </div>
    </footer>
  );
}
