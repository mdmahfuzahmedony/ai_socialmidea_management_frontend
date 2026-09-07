export default function GettingStartedPage() {
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
        GETTING STARTED
      </div>
      <h1 style={{ fontSize: "32px", fontWeight: 800, marginBottom: "16px" }}>
        Set up HeyBazz in three steps
      </h1>
      <p style={{ fontSize: "16px", color: "#666", marginBottom: "40px" }}>
        From signing up to your first AI-generated post, here's the full flow.
      </p>

      <div style={{ display: "flex", gap: "14px", marginBottom: "30px" }}>
        <div
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            background: "#17162A",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "13px",
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          1
        </div>
        <div>
          <h3
            style={{ fontSize: "19px", fontWeight: 700, marginBottom: "8px" }}
          >
            Sign up and connect a page
          </h3>
          <p style={{ color: "#555", lineHeight: 1.6 }}>
            Log in with Google or Facebook. When you connect with Facebook,
            HeyBazz asks for permission to read your Page's posts and publish on
            your behalf — you'll see a list of your Pages and any linked
            Instagram Business accounts. Pick the one you want to manage.
          </p>
        </div>
      </div>

      <div style={{ display: "flex", gap: "14px", marginBottom: "30px" }}>
        <div
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            background: "#17162A",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "13px",
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          2
        </div>
        <div>
          <h3
            style={{ fontSize: "19px", fontWeight: 700, marginBottom: "8px" }}
          >
            Run your first AI audit
          </h3>
          <p style={{ color: "#555", lineHeight: 1.6 }}>
            From <strong>Create Post</strong>, select your page. HeyBazz pulls
            your recent post performance and gives you a short summary — reach,
            what's not working (like missing calls-to-action), and the best time
            to post next.
          </p>
        </div>
      </div>

      <div style={{ display: "flex", gap: "14px" }}>
        <div
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            background: "#17162A",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "13px",
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          3
        </div>
        <div>
          <h3
            style={{ fontSize: "19px", fontWeight: 700, marginBottom: "8px" }}
          >
            Generate and publish a post
          </h3>
          <p style={{ color: "#555", lineHeight: 1.6 }}>
            Type a topic — a product launch, an offer, anything. HeyBazz writes
            a caption and hashtags, designs a banner, and shows you a preview
            before anything goes live.
          </p>
        </div>
      </div>
    </div>
  );
}
