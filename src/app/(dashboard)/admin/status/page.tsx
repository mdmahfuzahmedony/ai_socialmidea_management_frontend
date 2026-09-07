'use client';

const SERVICES = [
  { name: 'Facebook API', sub: 'Graph API v18.0', status: 'operational', uptime: '99.9%' },
  { name: 'Instagram API', sub: 'Basic Display + Graph', status: 'operational', uptime: '99.8%' },
  { name: 'LinkedIn API', sub: 'Marketing API', status: 'degraded', uptime: '97.2%' },
  { name: 'OpenAI API', sub: 'GPT-4 / DALL-E', status: 'operational', uptime: '99.5%' },
  { name: 'Database', sub: 'MySQL Primary', status: 'operational', uptime: '100%' },
];

const STATUS_COLOR: Record<string, string> = {
  operational: '#00B39B',
  degraded: '#B87A0E',
  down: '#C23558',
};

const BADGE_CLASS: Record<string, string> = {
  operational: 'badge-operational',
  degraded: 'badge-degraded',
  down: 'badge-down',
};

export default function PlatformStatus() {
  return (
    <>
      <div className="dash-topbar">
        <h1>Platform status</h1>
        <span className="badge badge-operational" style={{ fontSize: 12 }}>All systems normal</span>
      </div>

      <div className="dash-content">
        <div className="panel">
          <div className="panel-head">
            <h2>Service health</h2>
            <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>Last updated: just now</span>
          </div>
          <div className="status-list">
            {SERVICES.map((s) => (
              <div className="status-row" key={s.name}>
                <div className="status-left">
                  <div
                    className="status-ic"
                    style={{ background: `${STATUS_COLOR[s.status]}15`, color: STATUS_COLOR[s.status] }}
                  >
                    <span className="status-dot" style={{ background: STATUS_COLOR[s.status] }} />
                  </div>
                  <div>
                    <div className="status-name">{s.name}</div>
                    <div className="status-sub">{s.sub}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{ fontSize: 13, color: 'var(--ink-soft)', fontFamily: 'IBM Plex Mono' }}>
                    {s.uptime}
                  </span>
                  <span className={`badge ${BADGE_CLASS[s.status]}`} style={{ textTransform: 'capitalize' }}>
                    {s.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}