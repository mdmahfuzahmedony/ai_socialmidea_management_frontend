"use client";

import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function Check() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#00B39B"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export default function PricingPage() {
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch(`${API_URL}/api/plans`);
      const json = await res.json();
      setPlans(json);
    }
    load();
  }, []);

  return (
    <>
      <section className="page-hero wrap">
        <div className="eyebrow" style={{ margin: "0 auto 20px" }}>
          <span className="dot" />
          Simple, page-based pricing
        </div>
        <h1>Pick a plan for how many pages you run</h1>
        <p>
          Every plan includes AI title generation, banner design, auto-posting
          and analytics. Upgrade any time as you add more pages.
        </p>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="pricing-grid">
            {plans.map((plan) => (
              <div
                className={`price-card ${plan.key === "standard" ? "featured" : ""}`}
                key={plan.id}
              >
                {plan.key === "standard" && (
                  <div className="price-badge">Most popular</div>
                )}
                <div className="price-plan">{plan.name}</div>
                <div className="price-amount">
                  ৳{plan.price}
                  <span> /month</span>
                </div>
                <a
                  href="/signup"
                  className={`btn ${plan.key === "standard" ? "btn-primary" : "btn-ghost"}`}
                >
                  {plan.key === "free" ? "Start free" : "Start free trial"}
                </a>
                <ul className="price-features">
                  {plan.features?.map((f: string, i: number) => (
                    <li key={i}>
                      <Check /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pricing-faq">
            <div className="section-head">
              <h2 style={{ fontSize: 28 }}>Questions about pricing</h2>
            </div>
            <div className="faq-item">
              <h3>What counts as an AI post?</h3>
              <p>
                Any single piece of content HeyBazz writes, designs and
                publishes to one of your connected pages.
              </p>
            </div>
            <div className="faq-item">
              <h3>Can I change plans later?</h3>
              <p>
                Yes — upgrade or downgrade any time as the number of pages you
                manage changes.
              </p>
            </div>
            <div className="faq-item">
              <h3>What happens if I go over my post limit?</h3>
              <p>
                HeyBazz pauses new AI posts until the next billing cycle, or you
                can upgrade instantly.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
