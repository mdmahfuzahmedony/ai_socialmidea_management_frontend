'use client';

import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function PostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');

  // ১. ডাটাবেস থেকে সব পোস্ট লোড করার ফাংশন
  useEffect(() => {
    async function loadPosts() {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/posts`, { 
          credentials: 'include',
          headers: { 'Accept': 'application/json' }
        });
        const json = await res.json();
        
        const rawPosts = json.data || [];

        // ২. ডাটাবেসের কলাম (idea, caption, status) অনুযায়ী ডাটা ম্যাপিং
        const mapped = rawPosts.map((p: any) => ({
          id: p.id,
          platform: p.platform || 'Facebook', 
          color: p.platform === 'instagram' ? '#E4405F' : '#1877F2',
          
          // আপনার দেওয়া সেই 'Idea' এবং AI এর বানানো 'Caption'
          title: p.idea || 'Untitled Post', 
          caption: p.caption || '', 
          
          status: p.status === 'posted' ? 'published' : 'draft', 
          time: new Date(p.created_at).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
        }));

        setPosts(mapped);
      } catch (err) {
        console.error('Failed to load posts from database', err);
      } finally {
        setLoading(false);
      }
    }
    loadPosts();
  }, []);

  // ৩. ফিল্টারিং লজিক (Published/Draft বাটন কাজের জন্য)
  const filtered = filter === 'all' ? posts : posts.filter((p) => p.status === filter);

  return (
    <div className="dash-content">
      {/* হেডার সেকশন */}
      <div className="section-head" style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#17162A' }}>AI Post History</h2>
        <p style={{ color: '#6F6B93' }}>আপনার তৈরি করা সব পোস্ট এবং তাদের স্ট্যাটাস এখানে দেখুন।</p>
      </div>

      <div className="panel" style={{ borderRadius: '24px', overflow: 'hidden' }}>
        <div className="panel-head" style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E1DDF0' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700' }}>All posts</h3>
          
          {/* ফিল্টার বাটনসমূহ */}
          <div style={{ display: 'flex', gap: 8 }}>
            {(['all', 'published', 'draft'] as const).map((f) => (
              <button
                key={f}
                className="btn btn-ghost btn-sm"
                style={filter === f ? { background: '#17162A', color: '#fff', borderColor: '#17162A' } : {}}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* লোডিং এবং ডাটা কন্ডিশনাল রেন্ডারিং */}
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#6C5CE7' }}>
             <div className="animate-pulse font-bold">Loading from database...</div>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center' }}>
            <p style={{ color: '#888', fontSize: '15px' }}>এখনো কোনো পোস্ট তৈরি করা হয়নি।</p>
          </div>
        ) : (
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', background: '#F8F9FD' }}>
                <th style={{ padding: '15px 24px', fontSize: '13px', color: '#6F6B93', width: '50%' }}>Post Content</th>
                <th style={{ padding: '15px 24px', fontSize: '13px', color: '#6F6B93' }}>Platform</th>
                <th style={{ padding: '15px 24px', fontSize: '13px', color: '#6F6B93' }}>Date</th>
                <th style={{ padding: '15px 24px', fontSize: '13px', color: '#6F6B93' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors" style={{ borderBottom: '1px solid #F1EFE8' }}>
                  <td style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {/* ১. আপনার দেওয়া টাইটেল (Idea) */}
                      <span style={{ fontWeight: '700', color: '#17162A', fontSize: '15.5px' }}>
                        {p.title}
                      </span>
                      {/* ২. AI এর বানানো ক্যাপশনের প্রিভিউ */}
                      <span style={{ fontSize: '13px', color: '#6F6B93', marginTop: '6px', lineHeight: '1.5' }}>
                        {p.caption.length > 90 ? p.caption.slice(0, 90) + '...' : p.caption}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '24px' }}>
                    <span className="badge" style={{ background: '#F6F4FC', color: p.color, fontWeight: '800', fontSize: '11px' }}>
                      {p.platform.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '24px', fontSize: '13px', color: '#3A3852' }}>
                    {p.time}
                  </td>
                  <td style={{ padding: '24px' }}>
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