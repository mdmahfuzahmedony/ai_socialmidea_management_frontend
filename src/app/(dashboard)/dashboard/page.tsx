'use client';

import { useState } from 'react';

type Tab = 'overview' | 'pages' | 'posts' | 'create' | 'analytics' | 'billing';
type PostStatus = 'draft' | 'scheduled' | 'published';
type PlanKey = 'free' | 'standard' | 'premium';

interface Post {
  id: string;
  platform: string;
  color: string;
  text: string;
  status: PostStatus;
  time: string;
}

const INITIAL_POSTS: Post[] = [
  { id: 'p1', platform: 'Instagram', color: '#C23558', text: 'Cold-brew launch banner + caption', status: 'published', time: 'Today, 9:00am' },
  { id: 'p2', platform: 'Facebook', color: '#185FA5', text: 'Weekend menu carousel', status: 'scheduled', time: 'Tomorrow, 11:00am' },
  { id: 'p3', platform: 'LinkedIn', color: '#4B3DC4', text: 'Behind-the-scenes roastery post', status: 'draft', time: 'Not scheduled' },
];

const CONNECTED_PAGES = [
  { name: 'Marlow Coffee', platform: 'Facebook Page', color: '#E6F1FB', text: '#185FA5', letter: 'f' },
  { name: 'marlow.coffee', platform: 'Instagram Business', color: '#FEECEE', text: '#C23558', letter: 'IG' },
];

const AVAILABLE_TO_CONNECT = [
  { name: 'LinkedIn Page', color: '#EDEAFB', text: '#4B3DC4', letter: 'in' },
  { name: 'TikTok', color: '#E7F7F3', text: '#00B39B', letter: 'TT' },
  { name: 'X (Twitter)', color: '#F1EFE8', text: '#444441', letter: 'X' },
];

const PLAN_LIMITS: Record<PlanKey, { price: number; pages: number; posts: number }> = {
  free: { price: 0, pages: 1, posts: 5 },
  standard: { price: 500, pages: 3, posts: 40 },
  premium: { price: 1000, pages: 999, posts: 1000 },
};

function NavIcon({ d }: { d: string }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

function StatusBadge({ status }: { status: PostStatus }) {
  const map = { draft: 'badge-free', scheduled: 'badge-standard', published: 'badge-active' };
  const label = { draft: 'Draft', scheduled: 'Scheduled', published: 'Published' };
  return <span className={`badge ${map[status]}`}>{label[status]}</span>;
}

export default function UserDashboard() {
  const [tab, setTab] = useState<Tab>('overview');
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [pages, setPages] = useState(CONNECTED_PAGES);
  const [plan, setPlan] = useState<PlanKey>('standard');
  const [postFilter, setPostFilter] = useState<'all' | PostStatus>('all');

  const limit = PLAN_LIMITS[plan];
  const postsUsed = posts.length;
  const usagePct = Math.min(100, Math.round((postsUsed / limit.posts) * 100));

  function connectPage(name: string, color: string, text: string, letter: string) {
    setPages((prev) => [...prev, { name, platform: name, color, text, letter }]);
  }

  const filteredPosts = postFilter === 'all' ? posts : posts.filter((p) => p.status === postFilter);

  return (
    <div className="dash-shell">
      <aside className="dash-sidebar">
        <div className="logo">
          <div className="logo-mark" />
          Loopline
        </div>

        
        <nav className="dash-nav">
          <button className={tab === 'overview' ? 'active' : ''} onClick={() => setTab('overview')}>
            <NavIcon d="M3 3v18h18M7 15l4-6 3 4 5-8" />
            Overview
          </button>
          <button className={tab === 'pages' ? 'active' : ''} onClick={() => setTab('pages')}>
            <NavIcon d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" />
            Connected pages
          </button>
          <button className={tab === 'posts' ? 'active' : ''} onClick={() => setTab('posts')}>
            <NavIcon d="M3 4h18M3 4v16h18V4M8 4v16" />
            Posts
          </button>
          <button className={tab === 'create' ? 'active' : ''} onClick={() => setTab('create')}>
            <NavIcon d="M12 5v14M5 12h14" />
            Create post
          </button>
          <button className={tab === 'analytics' ? 'active' : ''} onClick={() => setTab('analytics')}>
            <NavIcon d="M3 3v18h18M7 15l4-6 3 4 5-8" />
            Analytics
          </button>
          <button className={tab === 'billing' ? 'active' : ''} onClick={() => setTab('billing')}>
            <NavIcon d="M3 4h18v16H3zM3 9h18" />
            Billing
          </button>
        </nav>

        <div className="dash-sidebar-foot">marlow.coffee · {limit.price === 0 ? 'Free' : `৳${limit.price}/mo`}</div>
      </aside>

      <div className="dash-main">
        <div className="dash-topbar">
          <h1>
            {tab === 'overview' && 'Overview'}
            {tab === 'pages' && 'Connected pages'}
            {tab === 'posts' && 'Posts'}
            {tab === 'create' && 'Create post'}
            {tab === 'analytics' && 'Analytics'}
            {tab === 'billing' && 'Billing'}
          </h1>
          <a href="#" className="btn btn-primary btn-sm" onClick={() => setTab('create')}>
            + New post
          </a>
        </div>

        <div className="dash-content">
          {tab === 'overview' && (
            <>
              <div className="stat-cards">
                <div className="stat-card">
                  <div className="lab">Connected pages</div>
                  <div className="num mono">{pages.length}</div>
                  <div className="delta up">of {limit.pages === 999 ? 'unlimited' : limit.pages} allowed</div>
                </div>
                <div className="stat-card">
                  <div className="lab">AI posts this month</div>
                  <div className="num mono">{postsUsed}/{limit.posts}</div>
                  <div className="delta up">{limit.posts - postsUsed} remaining</div>
                </div>
                <div className="stat-card">
                  <div className="lab">Published</div>
                  <div className="num mono">{posts.filter((p) => p.status === 'published').length}</div>
                  <div className="delta up">this month</div>
                </div>
                <div className="stat-card">
                  <div className="lab">Scheduled</div>
                  <div className="num mono">{posts.filter((p) => p.status === 'scheduled').length}</div>
                  <div className="delta up">upcoming</div>
                </div>
              </div>

              <div className="panel">
                <div className="panel-head">
                  <h2>Recent posts</h2>
                </div>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Post</th>
                      <th>Platform</th>
                      <th>When</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map((p) => (
                      <tr key={p.id}>
                        <td>{p.text}</td>
                        <td>
                          <span className="badge" style={{ background: '#F1EFE8', color: p.color }}>
                            {p.platform}
                          </span>
                        </td>
                        <td>{p.time}</td>
                        <td><StatusBadge status={p.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {tab === 'pages' && (
            <>
              <div className="section-head" style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 20 }}>Connected</h2>
              </div>
              <div className="connect-grid" style={{ marginBottom: 40 }}>
                {pages.map((p) => (
                  <div className="connect-card" key={p.name}>
                    <div className="connect-ic" style={{ background: p.color, color: p.text }}>{p.letter}</div>
                    <div>
                      <div className="connect-name">{p.name}</div>
                      <div className="connect-sub">{p.platform}</div>
                    </div>
                    <span className="badge badge-active" style={{ marginLeft: 'auto' }}>Connected</span>
                  </div>
                ))}
              </div>

              <div className="section-head" style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 20 }}>Available to connect</h2>
                <p>{limit.pages === 999 ? 'Unlimited pages on your plan.' : `Your ${plan} plan allows up to ${limit.pages} pages.`}</p>
              </div>
              <div className="connect-grid">
                {AVAILABLE_TO_CONNECT.map((p) => (
                  <div className="connect-card" key={p.name}>
                    <div className="connect-ic" style={{ background: p.color, color: p.text }}>{p.letter}</div>
                    <div>
                      <div className="connect-name">{p.name}</div>
                      <div className="connect-sub">Not connected</div>
                    </div>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => connectPage(p.name, p.color, p.text, p.letter)}
                      disabled={pages.length >= limit.pages}
                    >
                      Connect
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === 'posts' && (
            <div className="panel">
              <div className="panel-head">
                <h2>All posts</h2>
                <div style={{ display: 'flex', gap: 8 }}>
                  {(['all', 'draft', 'scheduled', 'published'] as const).map((f) => (
                    <button
                      key={f}
                      className="btn btn-ghost btn-sm"
                      style={postFilter === f ? { background: 'var(--ink)', color: '#fff', borderColor: 'var(--ink)' } : {}}
                      onClick={() => setPostFilter(f)}
                    >
                      {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Post</th>
                    <th>Platform</th>
                    <th>When</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.map((p) => (
                    <tr key={p.id}>
                      <td>{p.text}</td>
                      <td>
                        <span className="badge" style={{ background: '#F1EFE8', color: p.color }}>
                          {p.platform}
                        </span>
                      </td>
                      <td>{p.time}</td>
                      <td><StatusBadge status={p.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'create' && (
            <CreatePost
              onGenerated={(post) => setPosts((prev) => [post, ...prev])}
              pages={pages}
            />
          )}

          {tab === 'analytics' && (
            <>
              <div className="stat-cards">
                <div className="stat-card">
                  <div className="lab">Reach this month</div>
                  <div className="num mono">42.6k</div>
                  <div className="delta up">↑ 14% vs last month</div>
                </div>
                <div className="stat-card">
                  <div className="lab">Engagement rate</div>
                  <div className="num mono">6.1%</div>
                  <div className="delta up">↑ 0.8pt</div>
                </div>
                <div className="stat-card">
                  <div className="lab">Best performing post</div>
                  <div className="num mono" style={{ fontSize: 16 }}>Cold-brew launch</div>
                  <div className="delta up">2.1k likes</div>
                </div>
                <div className="stat-card">
                  <div className="lab">Best time to post</div>
                  <div className="num mono" style={{ fontSize: 16 }}>Thu, 9–10am</div>
                  <div className="delta up">based on last 30 days</div>
                </div>
              </div>
              <div className="panel" style={{ padding: 24 }}>
                <h2 style={{ fontSize: 17, marginBottom: 12 }}>This week in plain language</h2>
                <p style={{ fontSize: 14.5, color: 'var(--ink-soft)', lineHeight: 1.7 }}>
                  Your Instagram post about the cold-brew launch drove most of this week&apos;s
                  reach — mornings around 9am consistently outperform afternoon posts across
                  all your connected pages. Facebook engagement dipped slightly, likely tied to
                  fewer posts published there this week.
                </p>
              </div>
            </>
          )}

          {tab === 'billing' && (
            <>
              <div className="usage-card">
                <div className="usage-top">
                  <div className="plan-name">{plan.charAt(0).toUpperCase() + plan.slice(1)} plan</div>
                  <div className="usage-meta">{limit.price === 0 ? 'Free' : `৳${limit.price}/month`}</div>
                </div>
                <div className="usage-meta">{postsUsed} of {limit.posts} AI posts used this month</div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${usagePct}%` }} />
                </div>
                <div className="usage-meta">{pages.length} of {limit.pages === 999 ? 'unlimited' : limit.pages} pages connected</div>
              </div>

              <h2 style={{ fontSize: 17, marginBottom: 4 }}>Change plan</h2>
              <p style={{ fontSize: 14, color: 'var(--ink-soft)' }}>Switch any time — takes effect immediately.</p>
              <div className="plan-pick-grid">
                {(Object.keys(PLAN_LIMITS) as PlanKey[]).map((k) => (
                  <div className={`plan-pick-card${plan === k ? ' current' : ''}`} key={k}>
                    <h4>{k.charAt(0).toUpperCase() + k.slice(1)}</h4>
                    <div className="amt">{PLAN_LIMITS[k].price === 0 ? 'Free' : `৳${PLAN_LIMITS[k].price}`}</div>
                    <button
                      className={`btn btn-sm ${plan === k ? 'btn-ghost' : 'btn-primary'}`}
                      onClick={() => setPlan(k)}
                      disabled={plan === k}
                    >
                      {plan === k ? 'Current plan' : 'Switch'}
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function CreatePost({
  onGenerated,
  pages,
}: {
  onGenerated: (post: Post) => void;
  pages: { name: string; platform: string; text: string }[];
}) {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState(pages[0]?.platform ?? 'Instagram');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  function generate() {
    if (!topic.trim()) return;
    setGenerating(true);
    setResult(null);
    setTimeout(() => {
      const caption = `${topic} — freshly brewed and ready to share. #${topic.replace(/\s+/g, '')} #smallbusiness`;
      setResult(caption);
      setGenerating(false);
      onGenerated({
        id: `p${Date.now()}`,
        platform,
        color: '#6C5CE7',
        text: topic,
        status: 'draft',
        time: 'Not scheduled',
      });
    }, 1200);
  }

  return (
    <div className="create-form">
      <div className="form-row">
        <label htmlFor="platform">Platform</label>
        <select id="platform" value={platform} onChange={(e) => setPlatform(e.target.value)}>
          {pages.map((p) => (
            <option key={p.platform} value={p.platform}>{p.platform}</option>
          ))}
        </select>
      </div>
      <div className="form-row">
        <label htmlFor="topic">What&apos;s the post about?</label>
        <input
          id="topic"
          type="text"
          placeholder="e.g. New cold-brew launch"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
      </div>
      <button className="btn btn-primary" onClick={generate} disabled={generating}>
        {generating ? 'Generating...' : 'Generate with AI'}
      </button>

      {result && (
        <div className="generated-preview">
          <div className="gen-banner">AI-generated banner preview</div>
          <div className="gen-caption">{result}</div>
          <button className="btn btn-ghost btn-sm">Save as draft</button>
        </div>
      )}
    </div>
  );
}
