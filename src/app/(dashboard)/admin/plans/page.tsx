'use client';

import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function getCookie(name: string) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

async function apiPut(path: string, body: any) {
  await fetch(`${API_URL}/sanctum/csrf-cookie`, { credentials: 'include' });
  const token = getCookie('XSRF-TOKEN');
  const res = await fetch(`${API_URL}${path}`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',      // ← eta add koro
      'X-XSRF-TOKEN': token || '',
    },
    body: JSON.stringify(body),
  });
  return res.json();
}

export default function AdminPlans() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetch(`${API_URL}/api/plans`);
      const json = await res.json();
      setPlans(json);
      setLoading(false);
    }
    load();
  }, []);

  function updateField(planId: number, field: string, value: any) {
    setPlans((prev) => prev.map((p) => (p.id === planId ? { ...p, [field]: value } : p)));
  }

  function updateFeature(planId: number, index: number, value: string) {
    setPlans((prev) =>
      prev.map((p) => {
        if (p.id !== planId) return p;
        const features = [...p.features];
        features[index] = value;
        return { ...p, features };
      })
    );
  }

  function addFeature(planId: number) {
    setPlans((prev) =>
      prev.map((p) => (p.id === planId ? { ...p, features: [...p.features, ''] } : p))
    );
  }

  function removeFeature(planId: number, index: number) {
    setPlans((prev) =>
      prev.map((p) => {
        if (p.id !== planId) return p;
        const features = p.features.filter((_: any, i: number) => i !== index);
        return { ...p, features };
      })
    );
  }

 // AdminPlans কম্পোনেন্টের ভেতরে saveAll ফাংশনটি এভাবে আপডেট করুন
async function saveAll() {
  setSaving(true);
  try {
    for (const plan of plans) {
      // এখানে পাথটি হবে '/api/plans/...' 
      // কিন্তু খেয়াল রাখুন আপনার apiPut ফাংশনটি যেন ডাবল /api না বানায়
      await apiPut(`/api/plans/${plan.id}`, {
        name: plan.name,
        price: plan.price,
        pages_limit: plan.pages_limit,
        posts_limit: plan.posts_limit,
        features: plan.features.filter((f: string) => f.trim() !== ''),
      });
    }
    alert('সফলভাবে সেভ হয়েছে!');
  } catch (err) {
    console.error(err);
    alert('সেভ করা যায়নি!');
  } finally {
    setSaving(false);
  }
}

  if (loading) return <div className="p-20 text-center animate-pulse">Loading Plans...</div>;

  return (
    <>
      <div className="dash-topbar">
        <h1></h1>
        <button className="btn btn-primary btn-sm" onClick={saveAll} disabled={saving}>
          {saving ? 'Saving...' : 'Save changes'}
        </button>
      </div>

      <div className="dash-content">
        <div className="plan-edit-grid">
          {plans.map((plan) => (
            <div className="plan-edit-card" key={plan.id}>
              <h3>{plan.name}</h3>

              <div className="plan-edit-row">
                <label>Price (৳/month)</label>
                <div className="input-prefix">
                  <span>৳</span>
                  <input
                    type="number"
                    value={plan.price}
                    onChange={(e) => updateField(plan.id, 'price', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="plan-edit-row">
                <label>Pages limit</label>
                <div className="input-prefix">
                  <span>#</span>
                  <input
                    type="number"
                    value={plan.pages_limit}
                    onChange={(e) => updateField(plan.id, 'pages_limit', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="plan-edit-row">
                <label>AI posts / month</label>
                <div className="input-prefix">
                  <span>#</span>
                  <input
                    type="number"
                    value={plan.posts_limit}
                    onChange={(e) => updateField(plan.id, 'posts_limit', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="plan-edit-row">
                <label>Features</label>
                {plan.features.map((f: string, i: number) => (
                  <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                    <input
                      type="text"
                      value={f}
                      onChange={(e) => updateFeature(plan.id, i, e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <button className="btn btn-ghost btn-sm" onClick={() => removeFeature(plan.id, i)}>
                      ✕
                    </button>
                  </div>
                ))}
                <button className="btn btn-ghost btn-sm" onClick={() => addFeature(plan.id)}>
                  + Add feature
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}