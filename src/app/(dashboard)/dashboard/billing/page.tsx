'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// পেমেন্ট নম্বরসমূহ
const PAYMENT_NUMBERS: any = {
  bkash: { number: '01309834483', label: 'bKash (Personal)' },
  nagad: { number: '01309834483', label: 'Nagad (Personal)' },
  rocket: { number: '01XXXXXXXXX1', label: 'Rocket (Personal)' },
};

const PLANS_INFO = [
  { id: 'free', name: 'FREE', price: 0, features: ['1 connected page', 'Up to 5 AI posts/mo', 'AI titles + captions'] },
  { id: 'standard', name: 'STANDARD', price: 500, features: ['Up to 3 connected pages', 'Up to 40 AI posts/mo', 'AI Banners'] },
  { id: 'premium', name: 'PREMIUM', price: 1000, features: ['Unlimited pages', '1000 AI posts/mo', 'Priority support'] }
];

function BillingContent() {
  const [data, setData] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  
  // পেমেন্ট ফরম স্টেট
  const [method, setMethod] = useState('bkash');
  const [senderNumber, setSenderNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // সেশন কুকি নিশ্চিত করা
      await fetch(`${API_URL}/sanctum/csrf-cookie`, { credentials: 'include' });

      // একসাথে বিলিং এবং পেমেন্ট হিস্ট্রি ডাটা আনা
      const [billRes, histRes] = await Promise.all([
        fetch(`${API_URL}/api/billing`, { credentials: 'include' }),
        fetch(`${API_URL}/api/payments/mine`, { credentials: 'include' })
      ]);

      if (billRes.ok) {
        const billJson = await billRes.json();
        setData(billJson);
      }

      if (histRes.ok) {
        const histJson = await histRes.json();
        setHistory(histJson.data || []);
      }
    } catch (e) {
      console.error("Data fetching error:", e);
    } finally {
      setLoading(false);
    }
  };

  const handlePlanClick = (plan: any) => {
    if (plan.id === 'free') {
       alert("You are already on the Free plan.");
       return;
    }
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handlePaymentSubmit = async () => {
    if (!transactionId || !senderNumber) return alert("দয়া করে সব তথ্য দিন");
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/payments/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          plan: selectedPlan.id,
          method,
          sender_number: senderNumber,
          transaction_id: transactionId,
        }),
      });
      if (res.ok) {
        alert("আবেদন জমা হয়েছে! যাচাই করে ২৪ ঘণ্টার মধ্যে আপডেট করা হবে।");
        setIsModalOpen(false);
        fetchData();
      } else {
        alert("পেমেন্ট সাবমিট করতে সমস্যা হয়েছে।");
      }
    } catch (e) { alert("Server error!"); }
    setSubmitting(false);
  };

  // ডাটা লোড না হওয়া পর্যন্ত এই সেকশনটি দেখাবে (TypeError ফিক্স করার জন্য)
  if (loading || !data) {
    return <div className="p-20 text-center animate-pulse font-bold text-indigo-600">Loading Billing info...</div>;
  }

  // প্রোগ্রেস ক্যালকুলেশন (নিরাপদভাবে)
  const postsUsed = data.posts_used || 0;
  const postsLimit = data.posts_limit || 5;
  const usagePct = Math.min(100, (postsUsed / postsLimit) * 100);

  return (
    <div className="dash-content">
      {/* ১. বর্তমান ব্যবহার কার্ড */}
      <div className="panel" style={{ padding: '32px', borderRadius: '35px', marginBottom: '40px', border: '1px solid #E1DDF0' }}>
         <h2 style={{ fontSize: '13px', color: '#6F6B93', fontWeight: 'bold', letterSpacing: '1px' }}>YOUR CURRENT PLAN</h2>
         <h3 style={{ fontSize: '28px', fontWeight: '900', color: '#17162A', margin: '5px 0' }}>
            {data.plan?.toUpperCase()} PLAN
         </h3>
         
         <div style={{ width: '100%', height: '10px', background: '#F0EEFB', borderRadius: '10px', margin: '20px 0', overflow: 'hidden' }}>
            <div style={{ width: `${usagePct}%`, height: '100%', background: 'var(--violet)', transition: '1s ease-in-out' }} />
         </div>
         
         <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '600', color: '#3A3852' }}>
            <span>{postsUsed} of {postsLimit} AI posts used</span>
            <span>{data.pages_connected || 0} pages linked</span>
         </div>
      </div>

      {/* ২. প্ল্যান কার্ডস গ্রিড */}
      <div className="section-head" style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '800' }}>Change Your Plan</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        {PLANS_INFO.map((p) => {
          const isCurrent = data.plan === p.id;
          return (
            <div key={p.id} className="panel" style={{ 
              padding: '40px 30px', borderRadius: '35px', display: 'flex', flexDirection: 'column',
              border: isCurrent ? '2.5px solid #00B39B' : '1.5px solid #E1DDF0',
              backgroundColor: isCurrent ? '#F6FFF9' : '#fff',
              position: 'relative',
              boxShadow: isCurrent ? '0 20px 40px -15px rgba(0, 179, 155, 0.15)' : 'none'
            }}>
              {isCurrent && <span style={{ position: 'absolute', top: '20px', right: '20px', background: '#00B39B', color: '#fff', padding: '4px 12px', borderRadius: '99px', fontSize: '10px', fontWeight: 'bold' }}>ACTIVE</span>}
              
              <h4 style={{ fontWeight: 'bold', color: '#6F6B93', fontSize: '14px' }}>{p.name}</h4>
              <div style={{ fontSize: '38px', fontWeight: '900', margin: '15px 0', color: '#17162A' }}>৳{p.price}</div>
              
              <button 
                onClick={() => handlePlanClick(p)}
                disabled={isCurrent}
                className="btn" 
                style={{ 
                  width: '100%', borderRadius: '16px', padding: '14px', border: 'none', fontWeight: 'bold',
                  backgroundColor: isCurrent ? '#00B39B' : '#17162A', 
                  color: '#fff', cursor: isCurrent ? 'default' : 'pointer' 
                }}
              >
                {isCurrent ? '✓ Current Plan' : 'Upgrade Plan'}
              </button>

              <ul style={{ marginTop: '25px', listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {p.features.map((f, i) => (
                  <li key={i} style={{ fontSize: '13px', display: 'flex', gap: '8px', color: '#3A3852' }}>
                    <span style={{ color: isCurrent ? '#00B39B' : 'var(--violet)' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* --- পেমেন্ট মোডাল --- */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div className="panel animate-in zoom-in duration-200" style={{ maxWidth: '450px', width: '100%', padding: '40px', borderRadius: '35px', backgroundColor: '#fff', position: 'relative' }}>
            <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '20px', right: '20px', border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            
            <h2 style={{ fontSize: '22px', fontWeight: '800' }}>Upgrade to {selectedPlan?.name}</h2>
            <p style={{ fontSize: '14px', color: '#6F6B93', marginBottom: '25px' }}>বিকাশ বা নগদে ৳{selectedPlan?.price} পাঠিয়ে ট্রানজ্যাকশন আইডি দিন।</p>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              {['bkash', 'nagad'].map(m => (
                <button key={m} onClick={() => setMethod(m)} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: method === m ? '2px solid #6C5CE7' : '1px solid #eee', background: method === m ? '#F6F4FC' : '#fff', cursor: 'pointer', fontWeight: 'bold' }}>{m.toUpperCase()}</button>
              ))}
            </div>

            <div style={{ backgroundColor: '#F8F9FD', padding: '15px', borderRadius: '15px', fontSize: '13px', marginBottom: '20px', border: '1px solid #E1DDF0' }}>
              Send Money: <strong>{PAYMENT_NUMBERS[method].number}</strong>
            </div>

            <input type="text" placeholder="আপনার বিকাশ/নগদ নম্বর" value={senderNumber} onChange={(e) => setSenderNumber(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #ddd', marginBottom: '10px', outline: 'none' }} />
            <input type="text" placeholder="Transaction ID (TrxID)" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #ddd', marginBottom: '20px', outline: 'none' }} />

            <button onClick={handlePaymentSubmit} disabled={submitting} className="btn btn-primary" style={{ width: '100%', borderRadius: '15px', padding: '15px' }}>
              {submitting ? 'Submitting...' : 'Confirm Payment'}
            </button>
          </div>
        </div>
      )}

      {/* ৩. পেমেন্ট হিস্ট্রি */}
      {history.length > 0 && (
        <div className="panel" style={{ marginTop: '40px', padding: '24px', borderRadius: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px' }}>Recent Payment History</h3>
          <div className="space-y-2">
            {history.map(h => (
              <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', borderBottom: '1px solid #f5f5f5' }}>
                <span style={{ fontSize: '14px', fontWeight: '600' }}>{h.plan?.toUpperCase()} Plan</span>
                <span className={`badge ${h.status === 'approved' ? 'badge-active' : 'badge-free'}`} style={{ fontSize: '11px' }}>{h.status.toUpperCase()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// মেইন এক্সপোর্ট (Suspense সহ)
export default function Billing() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BillingContent />
    </Suspense>
  );
}