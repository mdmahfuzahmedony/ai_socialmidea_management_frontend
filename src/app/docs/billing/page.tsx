export default function BillingPage() {
  return (
    <div>
      <div
        style={{
          fontSize: "13px",
          color: "#00B39B",
          fontWeight: 700,
          marginBottom: "10px",
        }}
      >
        BILLING
      </div>
      <h1 style={{ fontSize: "32px", fontWeight: 800, marginBottom: "16px" }}>
        Plans and limits
      </h1>
      <p style={{ fontSize: "16px", color: "#666", marginBottom: "30px" }}>
        Every plan includes AI captions, banners, and scheduling. Plans differ
        in how many pages you can connect and how many AI posts you can generate
        per month.
      </p>

      <div style={{ marginBottom: "24px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "6px" }}>
          Free
        </h3>
        <p style={{ color: "#555" }}>
          1 connected page, up to 5 AI posts a month — good for trying HeyBazz
          out.
        </p>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "6px" }}>
          Standard
        </h3>
        <p style={{ color: "#555" }}>
          Up to 3 pages, 40 AI posts a month, plus best-time auto-scheduling and
          weekly reports.
        </p>
      </div>

      <div style={{ marginBottom: "30px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "6px" }}>
          Premium
        </h3>
        <p style={{ color: "#555" }}>
          Unlimited pages, up to 1000 AI posts a month, full analytics and
          priority support.
        </p>
      </div>

      <p style={{ color: "#555" }}>
        You can upgrade or downgrade any time from <strong>Billing</strong> in
        your dashboard — changes apply to your next cycle.
      </p>
    </div>
  );
}
