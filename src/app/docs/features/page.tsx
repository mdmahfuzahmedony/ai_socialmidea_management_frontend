export default function FeaturesPage() {
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
        FEATURES
      </div>
      <h1 style={{ fontSize: "32px", fontWeight: 800, marginBottom: "16px" }}>
        What HeyBazz does
      </h1>
      <p style={{ fontSize: "16px", color: "#666", marginBottom: "40px" }}>
        Three core pieces work together: understand your page, create content,
        and keep it running on schedule.
      </p>

      <div style={{ marginBottom: "36px" }}>
        <h3 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "10px" }}>
          AI Audit
        </h3>
        <p style={{ color: "#555", lineHeight: 1.6 }}>
          HeyBazz looks at your page's most recent posts and tells you, in plain
          language, what's working and what isn't — low reach, missing
          calls-to-action, inconsistent posting — plus the time of day your
          audience is most active.
        </p>
      </div>

      <div style={{ marginBottom: "36px" }}>
        <h3 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "10px" }}>
          Smart Post Creator
        </h3>
        <p style={{ color: "#555", lineHeight: 1.6 }}>
          Describe a topic and HeyBazz writes the caption and hashtags, designs
          a matching banner, and places your logo on it automatically. You
          review before it goes anywhere.
        </p>
      </div>

      <div>
        <h3 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "10px" }}>
          Scheduling
        </h3>
        <p style={{ color: "#555", lineHeight: 1.6 }}>
          Confirm a post and pick a time — HeyBazz queues it and publishes
          automatically to Facebook or Instagram when the time comes, no need to
          be online.
        </p>
      </div>
    </div>
  );
}
