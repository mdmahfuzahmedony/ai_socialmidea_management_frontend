'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const PLATFORM_LABEL: Record<string, string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  tiktok: 'TikTok',
  x: 'X (Twitter)',
};

export default function AdminOverview() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_URL}/api/admin/stats`, { credentials: 'include' });
        const json = await res.json();
        setStats(json);
      } catch (err) {
        console.error('Admin stats fetch failed', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <div style={{ padding: 60, textAlign: 'center', color: '#6F6B93' }}>Loading overview…</div>;
  }

  if (!stats) {
    return <div style={{ padding: 60, textAlign: 'center', color: '#C23558' }}>Stats load kora jayni.</div>;
  }

  const chartData = (stats.signup_growth || []).map((d: any) => ({
    date: d.date.slice(5), // MM-DD dekhanor jonno
    signups: d.count,
  }));

  const maxPlanCount = Math.max(...(stats.plan_breakdown || []).map((p: any) => p.count), 1);
  const maxPlatformCount = Math.max(...(stats.platform_breakdown || []).map((p: any) => p.count), 1);

  return (
    <>
     
      <div className="dash-content">
        <div className="stat-cards">
          <div className="stat-card">
            <div className="lab">Total users</div>
            <div className="num mono">{stats.total_users}</div>
            <div className="delta up">↑ Lifetime</div>
          </div>
          <div className="stat-card">
            <div className="lab">Connected pages</div>
            <div className="num mono">{stats.connected_pages}</div>
            <div className="delta up">↑ Active connections</div>
          </div>
          <div className="stat-card">
            <div className="lab">AI posts this month</div>
            <div className="num mono">{stats.ai_posts_this_month}</div>
            <div className="delta up">↑ AI usage</div>
          </div>
          <div className="stat-card">
            <div className="lab">Monthly revenue</div>
            <div className="num mono">৳{stats.monthly_revenue}</div>
            <div className="delta up">↑ Cash in</div>
          </div>
        </div>

        <div className="overview-grid">
          {/* --- Signup growth chart --- */}
          <div className="panel" style={{ padding: 24 }}>
            <h2 style={{ fontSize: 16, marginBottom: 16 }}>Signups — last 30 days</h2>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData}>
                <XAxis dataKey="date" tick={{ fontSize: 11 }} interval={4} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={24} />
                <Tooltip />
                <Line type="monotone" dataKey="signups" stroke="#6C5CE7" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* --- Needs attention --- */}
          <div className="panel" style={{ padding: 24 }}>
            <h2 style={{ fontSize: 16, marginBottom: 16 }}>⚠️ Needs attention</h2>
            {stats.needs_attention && stats.needs_attention.length > 0 ? (
              <div className="alert-list">
                {stats.needs_attention.map((a: any, i: number) => (
                  <div key={i} className={`alert-item ${a.severity}`}>
                    {a.message}
                  </div>
                ))}
              </div>
            ) : (
              <div className="alert-empty">সব ঠিক আছে — কোনো সমস্যা নেই ✓</div>
            )}
          </div>
        </div>

        <div className="overview-grid">
          {/* --- Plan breakdown --- */}
          <div className="panel" style={{ padding: 24 }}>
            <h2 style={{ fontSize: 16, marginBottom: 16 }}>Plan breakdown</h2>
            {(stats.plan_breakdown || []).map((p: any) => (
              <div className="breakdown-row" key={p.plan}>
                <span style={{ textTransform: 'capitalize', width: 90 }}>{p.plan}</span>
                <div className="breakdown-bar-track">
                  <div className="breakdown-bar-fill" style={{ width: `${(p.count / maxPlanCount) * 100}%` }} />
                </div>
                <strong>{p.count}</strong>
              </div>
            ))}
          </div>

          {/* --- Platform breakdown --- */}
          <div className="panel" style={{ padding: 24 }}>
            <h2 style={{ fontSize: 16, marginBottom: 16 }}>Connected pages by platform</h2>
            {(stats.platform_breakdown || []).length > 0 ? (
              stats.platform_breakdown.map((p: any) => (
                <div className="breakdown-row" key={p.platform}>
                  <span style={{ width: 90 }}>{PLATFORM_LABEL[p.platform] || p.platform}</span>
                  <div className="breakdown-bar-track">
                    <div className="breakdown-bar-fill" style={{ width: `${(p.count / maxPlatformCount) * 100}%` }} />
                  </div>
                  <strong>{p.count}</strong>
                </div>
              ))
            ) : (
              <div className="alert-empty">এখনো কোনো page connect করা হয়নি</div>
            )}
          </div>
        </div>

        {/* --- Recent signups --- */}
        <div className="panel">
          <div className="panel-head">
            <h2>Recent signups</h2>
            <Link href="/admin/all-users" className="panel-link">View all users →</Link>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Account</th>
                <th>Plan</th>
                <th>Joined at</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {(stats.recent_signups || []).map((u: any) => (
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
                  <td>
                    <span className={`badge badge-${u.plan || 'free'}`}>{(u.plan || 'free').toUpperCase()}</span>
                  </td>
                  <td>{new Date(u.created_at).toLocaleDateString()}</td>
                  <td>
                    <span className="badge badge-active">Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
