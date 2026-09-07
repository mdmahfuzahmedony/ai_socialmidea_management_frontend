'use client';

import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function Analytics() {
  const [pages, setPages] = useState<any[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<string>('');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [pagesLoading, setPagesLoading] = useState(true);

  // ১. পেজ লিস্ট লোড করা
  useEffect(() => {
    async function fetchPages() {
      try {
        const res = await fetch(`${API_URL}/api/pages`, { credentials: 'include' });
        const json = await res.json();
        const list = json.data || [];
        setPages(list);
        // প্রথম পেজটি ডিফল্টভাবে সিলেক্ট করা
        if (list.length > 0) setSelectedPageId(list[0].platform_page_id);
      } catch (err) {
        console.error('Pages fetch failed', err);
      } finally {
        setPagesLoading(false);
      }
    }
    fetchPages();
  }, []);

  // ২. সিলেক্ট করা পেজের অ্যানালিটিক্স আনা
  useEffect(() => {
    if (!selectedPageId) return;

    async function fetchAnalytics() {
      setLoading(true);
      setData(null);
      try {
        const res = await fetch(`${API_URL}/api/analytics?page_id=${selectedPageId}`, {
          credentials: 'include',
        });
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error('Analytics fetch failed', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, [selectedPageId]);

  return (
    <div className="dash-content">
      <div className="section-head" style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#17162A' }}>Performance Analytics</h2>
        <p style={{ color: '#6F6B93' }}>AI-চালিত পেজ অডিট এবং গ্রোথ ইনসাইটস।</p>
      </div>

      {/* পেজ সিলেক্টর */}
      <div className="panel" style={{ padding: '24px', borderRadius: '24px', marginBottom: '32px', maxWidth: '450px', border: '1px solid #E1DDF0' }}>
        <label style={{ fontWeight: '700', display: 'block', marginBottom: '12px', fontSize: '14px', color: '#3A3852' }}>
          বিশ্লেষণ দেখার জন্য পেজ নির্বাচন করুন:
        </label>
        {pagesLoading ? (
          <div className="animate-pulse h-10 bg-slate-100 rounded-xl" />
        ) : (
          <select
            value={selectedPageId}
            onChange={(e) => setSelectedPageId(e.target.value)}
            style={{ width: '100%', padding: '14px', borderRadius: '14px', border: '2px solid #F0EEFB', outline: 'none', appearance: 'none', cursor: 'pointer', fontWeight: '600' }}
          >
            {pages.map((p) => (
              <option key={p.id} value={p.platform_page_id}>
                {p.platform === 'facebook' ? 'fb' : 'ig'} | {p.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {loading ? (
        <div style={{ padding: '80px 0', textAlign: 'center' }}>
          <div className="animate-bounce mb-4 text-4xl">📊</div>
          <p className="font-bold text-indigo-600">আপনার ডাটা প্রসেস করা হচ্ছে...</p>
        </div>
      ) : data && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* স্ট্যাট কার্ডস */}
          <div className="stat-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
            <div className="stat-card" style={{ borderBottom: '4px solid #1877F2' }}>
              <div className="lab text-blue-600 font-bold">Total Reach</div>
              <div className="num mono">{data.reach}</div>
              <div className="delta up">গত ২৮ দিন</div>
            </div>
            <div className="stat-card" style={{ borderBottom: '4px solid #6C5CE7' }}>
              <div className="lab text-indigo-600 font-bold">Engagement Rate</div>
              <div className="num mono">{data.engagement_rate}</div>
              <div className="delta up">High</div>
            </div>
            <div className="stat-card" style={{ borderBottom: '4px solid #00B39B' }}>
              <div className="lab text-mint font-bold">Impressions</div>
              <div className="num mono">{data.impressions}</div>
              <div className="delta up">Organic</div>
            </div>
            <div className="stat-card" style={{ borderBottom: '4px solid #FF6F91' }}>
              <div className="lab text-pink-600 font-bold">Best Post Time</div>
              <div className="num mono" style={{ fontSize: '17px' }}>{data.bestTime}</div>
              <div className="delta up">AI Suggestion</div>
            </div>
          </div>

          {/* AI Summary Box */}
          <div className="panel" style={{ padding: '32px', borderRadius: '35px', border: '2px solid #EDEAFB', backgroundColor: '#fff', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: '#17162A' }}>
              <span style={{ fontSize: '24px' }}>✨</span> AI Insight Summary
            </h3>
            <div style={{ fontSize: '16px', color: '#3A3852', lineHeight: '1.8', backgroundColor: '#F8F9FD', padding: '30px', borderRadius: '25px', border: '1px solid #E1DDF0' }}>
              {data.ai_summary}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}