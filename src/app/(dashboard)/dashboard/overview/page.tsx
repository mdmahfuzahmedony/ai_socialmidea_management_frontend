'use client';

import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function Overview() {
  const [stats, setStats] = useState({ connected_pages: 0, posts_this_month: 0 });
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOverviewData() {
      try {
        const res = await fetch(`${API_URL}/api/overview-stats`, { credentials: 'include' });
        const json = await res.json();
        
        setStats({
          connected_pages: json.connected_pages,
          posts_this_month: json.posts_this_month
        });
        
        // ডাটাবেস থেকে আসা পোস্টগুলোকে ম্যাপ করা
        const mappedPosts = (json.recent_posts || []).map((p: any) => ({
          id: p.id,
          platform: p.platform || 'Facebook',
          color: p.platform === 'instagram' ? '#E4405F' : '#1877F2',
          text: p.idea || p.caption || 'No content',
          status: p.status === 'posted' ? 'published' : 'draft',
          time: new Date(p.created_at).toLocaleDateString()
        }));

        setRecentPosts(mappedPosts);
      } catch (err) {
        console.error("Failed to fetch overview data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOverviewData();
  }, []);

  return (
    <div className="dash-content">
      {/* স্ট্যাট কার্ডস */}
      <div className="stat-cards">
        <div className="stat-card">
          <div className="lab">Connected pages</div>
          <div className="num mono">{stats.connected_pages}</div>
          <div className="delta up">of 3 allowed</div>
        </div>
        <div className="stat-card">
          <div className="lab">AI posts this month</div>
          <div className="num mono">{stats.posts_this_month}/40</div>
          <div className="delta up">{40 - stats.posts_this_month} remaining</div>
        </div>
        <div className="stat-card">
          <div className="lab">Published</div>
          <div className="num mono">{recentPosts.filter(p => p.status === 'published').length}</div>
          <div className="delta up">recent</div>
        </div>
        <div className="stat-card">
          <div className="lab">Status</div>
          <div className="num mono" style={{ fontSize: '18px' }}>Active</div>
          <div className="delta up">System normal</div>
        </div>
      </div>

      {/* রিসেন্ট পোস্ট টেবিল */}
      <div className="panel">
        <div className="panel-head">
          <h2 style={{ fontSize: '18px', fontWeight: '800' }}>Recent activity</h2>
          <a href="/dashboard/posts" className="btn btn-ghost btn-sm">View all</a>
        </div>
        
        {loading ? (
          <p style={{ padding: '20px' }}>Loading statistics...</p>
        ) : recentPosts.length === 0 ? (
          <p style={{ padding: '20px', color: '#888' }}>No recent activity found.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Post Idea</th>
                <th>Platform</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentPosts.map((p) => (
                <tr key={p.id}>
                  <td style={{ fontWeight: '600' }}>{p.text.slice(0, 50)}...</td>
                  <td>
                    <span className="badge" style={{ background: '#F6F4FC', color: p.color, fontWeight: 'bold' }}>
                      {p.platform}
                    </span>
                  </td>
                  <td style={{ fontSize: '13px' }}>{p.time}</td>
                  <td>
                    <span className={`badge ${p.status === 'published' ? 'badge-active' : 'badge-free'}`}>
                      {p.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}