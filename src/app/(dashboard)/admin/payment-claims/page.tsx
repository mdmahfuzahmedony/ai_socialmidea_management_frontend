'use client';

import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function getCookie(name: string): string | undefined {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : undefined;
}

async function authedPost(path: string, body: any) {
  await fetch(`${API_URL}/sanctum/csrf-cookie`, { credentials: 'include' });

  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-XSRF-TOKEN': decodeURIComponent(getCookie('XSRF-TOKEN') || ''),
    },
    body: JSON.stringify(body),
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(json.message || 'Request failed.');
  }

  return json;
}

export default function AdminPaymentClaims() {
  const [claims, setClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [rejectNoteFor, setRejectNoteFor] = useState<number | null>(null);
  const [rejectNote, setRejectNote] = useState('');

  const loadClaims = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/admin/payment-claims`, { credentials: 'include' });
      const json = await res.json();

      if (!res.ok) {
        setError(json.message || 'Claims load kora jayni.');
        return;
      }

      setClaims(json.data || []);
    } catch (err: any) {
      setError('Backend e connect kora jayni.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClaims();
  }, []);

  const handleApprove = async (claimId: number) => {
    setActionLoadingId(claimId);
    try {
      await authedPost(`/api/admin/payment-claims/${claimId}/approve`, {});
      // Approve howar por list theke shoriye dei — pending list e r dekhabe na
      setClaims((prev) => prev.filter((c) => c.id !== claimId));
    } catch (err: any) {
      alert(err.message || 'Approve korার somoy somossa hoyeche.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (claimId: number) => {
    setActionLoadingId(claimId);
    try {
      await authedPost(`/api/admin/payment-claims/${claimId}/reject`, {
        admin_note: rejectNote,
      });
      setClaims((prev) => prev.filter((c) => c.id !== claimId));
      setRejectNoteFor(null);
      setRejectNote('');
    } catch (err: any) {
      alert(err.message || 'Reject korার somoy somossa hoyeche.');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="dash-content">
      <div className="section-head" style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '800' }}>Payment Requests</h2>
        <p style={{ color: '#6F6B93' }}>Pending bKash payment claim gula ekhane review koro।</p>
      </div>

      {loading && <p style={{ color: '#6F6B93' }}>Loading…</p>}

      {error && !loading && <div className="form-error">{error}</div>}

      {!loading && !error && claims.length === 0 && (
        <div className="panel" style={{ padding: '40px', borderRadius: '24px', textAlign: 'center', color: '#6F6B93' }}>
          Kono pending payment request nai। ✓
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {claims.map((claim) => (
          <div key={claim.id} className="panel" style={{ padding: '24px', borderRadius: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <p style={{ fontWeight: 700, fontSize: '15px' }}>
                  {claim.user?.name || claim.user?.email || `User #${claim.user_id}`}
                </p>
                <p style={{ fontSize: '13px', color: '#6F6B93', marginTop: '2px' }}>
                  {claim.user?.email}
                </p>
              </div>

              <span
                style={{
                  padding: '4px 12px',
                  borderRadius: '99px',
                  fontSize: '12px',
                  fontWeight: 700,
                  backgroundColor: claim.plan_requested === 'premium' ? '#FFF4E5' : '#EEF2FF',
                  color: claim.plan_requested === 'premium' ? '#B45309' : '#3730A3',
                  textTransform: 'uppercase',
                }}
              >
                {claim.plan_requested} plan
              </span>
            </div>

            <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', fontSize: '13px' }}>
              <div>
                <p style={{ color: '#6F6B93' }}>Amount</p>
                <p style={{ fontWeight: 700 }}>৳{claim.amount}</p>
              </div>
              <div>
                <p style={{ color: '#6F6B93' }}>Sender bKash Number</p>
                <p style={{ fontWeight: 700 }}>{claim.sender_bkash_number}</p>
              </div>
              <div>
                <p style={{ color: '#6F6B93' }}>Transaction ID</p>
                <p style={{ fontWeight: 700 }}>{claim.transaction_id}</p>
              </div>
              <div>
                <p style={{ color: '#6F6B93' }}>Submitted</p>
                <p style={{ fontWeight: 700 }}>{new Date(claim.created_at).toLocaleString()}</p>
              </div>
            </div>

            {rejectNoteFor === claim.id ? (
              <div style={{ marginTop: '16px' }}>
                <textarea
                  rows={2}
                  placeholder="Reject korার karon (optional)"
                  value={rejectNote}
                  onChange={(e) => setRejectNote(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1.5px solid #E1DDF0', fontSize: '13px' }}
                />
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button
                    className="btn"
                    onClick={() => handleReject(claim.id)}
                    disabled={actionLoadingId === claim.id}
                    style={{ backgroundColor: '#DC2626', color: '#fff', borderRadius: '10px', padding: '8px 16px', fontSize: '13px' }}
                  >
                    {actionLoadingId === claim.id ? 'Rejecting...' : 'Confirm Reject'}
                  </button>
                  <button
                    className="btn btn-ghost"
                    onClick={() => { setRejectNoteFor(null); setRejectNote(''); }}
                    style={{ borderRadius: '10px', padding: '8px 16px', fontSize: '13px' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '10px', marginTop: '18px' }}>
                <button
                  className="btn"
                  onClick={() => handleApprove(claim.id)}
                  disabled={actionLoadingId === claim.id}
                  style={{ backgroundColor: '#00B39B', color: '#fff', borderRadius: '10px', padding: '10px 20px', fontSize: '13px', fontWeight: 700 }}
                >
                  {actionLoadingId === claim.id ? 'Approving...' : '✓ Approve & Upgrade Plan'}
                </button>
                <button
                  className="btn btn-ghost"
                  onClick={() => setRejectNoteFor(claim.id)}
                  style={{ borderRadius: '10px', padding: '10px 20px', fontSize: '13px' }}
                >
                  ✕ Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
