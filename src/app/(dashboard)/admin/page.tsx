'use client';

import { useState } from 'react';

type Tab = 'overview' | 'users' | 'plans' | 'status';

type PlanKey = 'free' | 'standard' | 'premium';

interface UserRow {
  id: string;
  name: string;
  email: string;
  plan: PlanKey;
  status: 'active' | 'suspended';
  pages: number;
}

const INITIAL_USERS: UserRow[] = [
  { id: '1', name: 'Fielder Studio', email: 'hello@fielder.studio', plan: 'standard', status: 'active', pages: 3 },
  { id: '2', name: 'Marlow Coffee', email: 'devon@marlow.coffee', plan: 'free', status: 'active', pages: 1 },
  { id: '3', name: 'Vantage Media', email: 'amara@vantage.media', plan: 'premium', status: 'active', pages: 12 },
  { id: '4', name: 'Nourish Kitchen', email: 'team@nourishco.com', plan: 'standard', status: 'active', pages: 3 },
  { id: '5', name: 'Hearth Goods', email: 'owner@hearthgoods.com', plan: 'free', status: 'suspended', pages: 1 },
];

const PLATFORM_STATUS = [
  { name: 'Facebook', letter: 'f', color: '#E6F1FB', text: '#185FA5', status: 'operational' as const, sub: 'Posting and analytics normal' },
  { name: 'Instagram', letter: 'IG', color: '#FEECEE', text: '#C23558', status: 'operational' as const, sub: 'Posting and analytics normal' },
  { name: 'LinkedIn', letter: 'in', color: '#EDEAFB', text: '#4B3DC4', status: 'degraded' as const, sub: 'Publishing delayed ~4 min' },
  { name: 'TikTok', letter: 'TT', color: '#E7F7F3', text: '#00B39B', status: 'operational' as const, sub: 'Posting and analytics normal' },
  { name: 'X (Twitter)', letter: 'X', color: '#F1EFE8', text: '#444441', status: 'down' as const, sub: 'Token refresh failing since 09:40' },
];

const PLAN_LABEL: Record<PlanKey, string> = { free: 'Free', standard: 'Standard', premium: 'Premium' };

function PlanBadge({ plan }: { plan: PlanKey }) {
  return <span className={`badge badge-${plan}`}>{PLAN_LABEL[plan]}</span>;
}

function StatusDot({ status }: { status: 'operational' | 'degraded' | 'down' }) {
  const color = status === 'operational' ? 'var(--mint)' : status === 'degraded' ? '#B87A0E' : '#C23558';
  return <span className="status-dot" style={{ background: color }} />;
}

function NavIcon({ d }: { d: string }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('overview');
  const [users, setUsers] = useState<UserRow[]>(INITIAL_USERS);

  const totalUsers = users.length;
  const totalPages = users.reduce((sum, u) => sum + u.pages, 0);
  const activeUsers = users.filter((u) => u.status === 'active').length;

  function toggleSuspend(id: string) {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u))
    );
  }

  return (
    <div className="dash-shell">
      <aside className="dash-sidebar">
        <div className="logo">
          <div className="logo-mark" />
          Loopline
        </div>

        <div className="grp-label">Admin</div>
        <nav className="dash-nav">
          <button className={tab === 'overview' ? 'active' : ''} onClick={() => setTab('overview')}>
            <NavIcon d="M3 3v18h18M7 15l4-6 3 4 5-8" />
            Overview
          </button>
          <button className={tab === 'users' ? 'active' : ''} onClick={() => setTab('users')}>
            <NavIcon d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            Users
          </button>
          <button className={tab === 'plans' ? 'active' : ''} onClick={() => setTab('plans')}>
            <NavIcon d="M3 3v18h18M3 9h18M3 15h18" />
            Plans
          </button>
          <button className={tab === 'status' ? 'active' : ''} onClick={() => setTab('status')}>
            <NavIcon d="M12 2a10 10 0 1 0 10 10M12 2v10l7 3" />
            Platform status
          </button>
        </nav>

        <div className="dash-sidebar-foot">Signed in as admin@loopline.app</div>
      </aside>

      <div className="dash-main">
        <div className="dash-topbar">
          <h1>
            {tab === 'overview' && 'Overview'}
            {tab === 'users' && 'Users'}
            {tab === 'plans' && 'Plans'}
            {tab === 'status' && 'Platform status'}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="dash-search">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
              Search users, pages...
            </div>
            <div className="dash-admin-chip">
              <div className="dash-admin-avatar" />
            </div>
          </div>
        </div>

        <div className="dash-content">
          {tab === 'overview' && (
            <>
              <div className="stat-cards">
                <div className="stat-card">
                  <div className="lab">Total users</div>
                  <div className="num mono">{totalUsers}</div>
                  <div className="delta up">↑ 12% this month</div>
                </div>
                <div className="stat-card">
                  <div className="lab">Connected pages</div>
                  <div className="num mono">{totalPages}</div>
                  <div className="delta up">↑ 8% this month</div>
                </div>
                <div className="stat-card">
                  <div className="lab">AI posts this month</div>
                  <div className="num mono">6,420</div>
                  <div className="delta up">↑ 21% this month</div>
                </div>
                <div className="stat-card">
                  <div className="lab">Monthly revenue</div>
                  <div className="num mono">৳84,500</div>
                  <div className="delta down">↓ 3% this month</div>
                </div>
              </div>

              <div className="panel">
                <div className="panel-head">
                  <h2>Recent signups</h2>
                </div>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Account</th>
                      <th>Plan</th>
                      <th>Pages</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td>
                          <div className="row-user">
                            <div className="row-avatar" />
                            <div>
                              <div className="row-name">{u.name}</div>
                              <div className="row-sub">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td><PlanBadge plan={u.plan} /></td>
                        <td>{u.pages}</td>
                        <td>
                          <span className={`badge badge-${u.status}`}>
                            {u.status === 'active' ? 'Active' : 'Suspended'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {tab === 'users' && (
            <div className="panel">
              <div className="panel-head">
                <h2>All users ({activeUsers} active)</h2>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Account</th>
                    <th>Plan</th>
                    <th>Pages</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>
                        <div className="row-user">
                          <div className="row-avatar" />
                          <div>
                            <div className="row-name">{u.name}</div>
                            <div className="row-sub">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td><PlanBadge plan={u.plan} /></td>
                      <td>{u.pages}</td>
                      <td>
                        <span className={`badge badge-${u.status}`}>
                          {u.status === 'active' ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td>
                        <button
                          className={`btn btn-sm ${u.status === 'active' ? 'btn-danger-ghost' : 'btn-ghost'}`}
                          onClick={() => toggleSuspend(u.id)}
                        >
                          {u.status === 'active' ? 'Suspend' : 'Reactivate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'plans' && <PlansEditor />}

          {tab === 'status' && (
            <div className="panel">
              <div className="panel-head">
                <h2>Connected platform APIs</h2>
              </div>
              <div className="status-list">
                {PLATFORM_STATUS.map((p) => (
                  <div className="status-row" key={p.name}>
                    <div className="status-left">
                      <div className="status-ic" style={{ background: p.color, color: p.text }}>
                        {p.letter}
                      </div>
                      <div>
                        <div className="status-name">{p.name}</div>
                        <div className="status-sub">{p.sub}</div>
                      </div>
                    </div>
                    <span className={`badge badge-${p.status}`}>
                      <StatusDot status={p.status} />
                      {p.status === 'operational' ? 'Operational' : p.status === 'degraded' ? 'Degraded' : 'Down'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PlansEditor() {
  const [free, setFree] = useState({ price: 0, pages: 1, posts: 5 });
  const [standard, setStandard] = useState({ price: 500, pages: 3, posts: 40 });
  const [premium, setPremium] = useState({ price: 1000, pages: 999, posts: 1000 });
  const [savedPlan, setSavedPlan] = useState<PlanKey | null>(null);

  function save(plan: PlanKey) {
    setSavedPlan(plan);
    setTimeout(() => setSavedPlan(null), 1800);
  }

  return (
    <div className="plan-edit-grid">
      <div className="plan-edit-card">
        <h3>Free</h3>
        <div className="plan-edit-row">
          <label>Price (৳/month)</label>
          <div className="input-prefix">
            <span>৳</span>
            <input type="number" value={free.price} onChange={(e) => setFree({ ...free, price: Number(e.target.value) })} />
          </div>
        </div>
        <div className="plan-edit-row">
          <label>Pages allowed</label>
          <div className="input-prefix">
            <input type="number" value={free.pages} onChange={(e) => setFree({ ...free, pages: Number(e.target.value) })} />
          </div>
        </div>
        <div className="plan-edit-row">
          <label>AI posts / month</label>
          <div className="input-prefix">
            <input type="number" value={free.posts} onChange={(e) => setFree({ ...free, posts: Number(e.target.value) })} />
          </div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => save('free')}>Save changes</button>
        <div className="plan-save-note">{savedPlan === 'free' ? 'Saved' : ''}</div>
      </div>

      <div className="plan-edit-card">
        <h3>Standard</h3>
        <div className="plan-edit-row">
          <label>Price (৳/month)</label>
          <div className="input-prefix">
            <span>৳</span>
            <input type="number" value={standard.price} onChange={(e) => setStandard({ ...standard, price: Number(e.target.value) })} />
          </div>
        </div>
        <div className="plan-edit-row">
          <label>Pages allowed</label>
          <div className="input-prefix">
            <input type="number" value={standard.pages} onChange={(e) => setStandard({ ...standard, pages: Number(e.target.value) })} />
          </div>
        </div>
        <div className="plan-edit-row">
          <label>AI posts / month</label>
          <div className="input-prefix">
            <input type="number" value={standard.posts} onChange={(e) => setStandard({ ...standard, posts: Number(e.target.value) })} />
          </div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => save('standard')}>Save changes</button>
        <div className="plan-save-note">{savedPlan === 'standard' ? 'Saved' : ''}</div>
      </div>

      <div className="plan-edit-card">
        <h3>Premium</h3>
        <div className="plan-edit-row">
          <label>Price (৳/month)</label>
          <div className="input-prefix">
            <span>৳</span>
            <input type="number" value={premium.price} onChange={(e) => setPremium({ ...premium, price: Number(e.target.value) })} />
          </div>
        </div>
        <div className="plan-edit-row">
          <label>Pages allowed</label>
          <div className="input-prefix">
            <input type="number" value={premium.pages} onChange={(e) => setPremium({ ...premium, pages: Number(e.target.value) })} />
          </div>
        </div>
        <div className="plan-edit-row">
          <label>AI posts / month</label>
          <div className="input-prefix">
            <input type="number" value={premium.posts} onChange={(e) => setPremium({ ...premium, posts: Number(e.target.value) })} />
          </div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => save('premium')}>Save changes</button>
        <div className="plan-save-note">{savedPlan === 'premium' ? 'Saved' : ''}</div>
      </div>
    </div>
  );
}
