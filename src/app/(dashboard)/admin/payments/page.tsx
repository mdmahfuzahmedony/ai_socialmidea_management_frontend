'use client';
import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface PaymentRequest {
  id: number;
  plan: string;
  method: string;
  transaction_id: string;
  sender_number: string;
  status: string;
  user?: {
    name: string;
    email: string;
  };
}

interface Stats {
  free: number;
  standard: number;
  premium: number;
  total_users: number;
  pending_payments: number;
}

export default function AdminPayments() {
  const [requests, setRequests] = useState<PaymentRequest[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // দুটো API একসাথে কল করো
      const [reqRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/payments`, { credentials: 'include' }),
        fetch(`${API_URL}/api/admin/payments/stats`, { credentials: 'include' }),
      ]);

      const reqJson = await reqRes.json();
      const statsJson = await statsRes.json();

      setRequests(reqJson.data || []);
      setStats(statsJson.data || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    if (!confirm("Are you sure you want to approve this payment?")) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/payments/${id}/approve`, {
        method: 'POST',
        credentials: 'include'
      });
      if (res.ok) {
        alert("Approved successfully!");
        fetchData();
      }
    } catch (e) { 
      alert("Error approving"); 
    }
  };

  const handleReject = async (id: number) => {
    if (!confirm("Are you sure you want to reject this payment?")) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/payments/${id}/reject`, {
        method: 'POST',
        credentials: 'include'
      });
      if (res.ok) {
        alert("Rejected successfully!");
        fetchData();
      }
    } catch (e) { 
      alert("Error rejecting"); 
    }
  };

  // কার্ড স্টাইল
  const cardStyle = (bg: string) => ({
    background: bg,
    borderRadius: '20px',
    padding: '24px',
    color: '#fff',
    minWidth: '180px',
    flex: '1',
  });

  return (
    <div className="dash-content">
      <div className="section-head" style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800' }}>Payment Verification</h2>
        <p style={{ color: '#6F6B93' }}>Verify transaction IDs and approve user plan upgrades.</p>
      </div>

      {/* ✅ SUMMARY CARDS */}
      {stats && (
        <div style={{ 
          display: 'flex', 
          gap: '20px', 
          marginBottom: '30px',
          flexWrap: 'wrap'
        }}>
          <div style={cardStyle('linear-gradient(135deg, #667eea 0%, #764ba2 100%)')}>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Total Users</div>
            <div style={{ fontSize: '32px', fontWeight: '800', marginTop: '8px' }}>
              {stats.total_users}
            </div>
          </div>
          
          <div style={cardStyle('linear-gradient(135deg, #11998e 0%, #38ef7d 100%)')}>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Free Plan</div>
            <div style={{ fontSize: '32px', fontWeight: '800', marginTop: '8px' }}>
              {stats.free}
            </div>
          </div>

          <div style={cardStyle('linear-gradient(135deg, #f093fb 0%, #f5576c 100%)')}>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Standard Plan</div>
            <div style={{ fontSize: '32px', fontWeight: '800', marginTop: '8px' }}>
              {stats.standard}
            </div>
          </div>

          <div style={cardStyle('linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)')}>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Premium Plan</div>
            <div style={{ fontSize: '32px', fontWeight: '800', marginTop: '8px' }}>
              {stats.premium}
            </div>
          </div>

          <div style={cardStyle('linear-gradient(135deg, #fa709a 0%, #fee140 100%)')}>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Pending Payments</div>
            <div style={{ fontSize: '32px', fontWeight: '800', marginTop: '8px' }}>
              {stats.pending_payments}
            </div>
          </div>
        </div>
      )}

      {/* ✅ PAYMENTS TABLE */}
      <div className="panel" style={{ borderRadius: '24px', overflow: 'hidden' }}>
        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F8F9FD', textAlign: 'left' }}>
              <th style={{ padding: '15px 24px' }}>User</th>
              <th style={{ padding: '15px 24px' }}>Requested Plan</th>
              <th style={{ padding: '15px 24px' }}>TrxID & Method</th>
              <th style={{ padding: '15px 24px' }}>Status</th>
              <th style={{ padding: '15px 24px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '20px 24px' }}>
                  <div style={{ fontWeight: 'bold' }}>{r.user?.name || 'N/A'}</div>
                  <div style={{ fontSize: '12px', color: '#888' }}>{r.user?.email || ''}</div>
                </td>
                <td style={{ padding: '20px 24px' }}>
                  <span className="badge badge-standard">
                    {(r.plan || '').toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '20px 24px' }}>
                  <div style={{ fontWeight: 'bold', color: 'var(--violet)' }}>
                    {r.transaction_id || 'N/A'}
                  </div>
                  <div style={{ fontSize: '11px', color: '#666' }}>
                    {(r.method || '').toUpperCase()} ({r.sender_number || ''})
                  </div>
                </td>
                <td style={{ padding: '20px 24px' }}>
                  <span className={`badge ${r.status === 'approved' ? 'badge-active' : r.status === 'rejected' ? 'badge-danger' : 'badge-free'}`}>
                    {(r.status || '').toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '20px 24px' }}>
                  {r.status === 'pending' && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => handleApprove(r.id)} 
                        className="btn btn-primary btn-sm"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleReject(r.id)} 
                        className="btn btn-danger btn-sm"
                        style={{ background: '#dc3545', border: 'none' }}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {requests.length === 0 && !loading && (
          <p style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
            No pending payment requests found.
          </p>
        )}
      </div>
    </div>
  );
}