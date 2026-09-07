'use client';

import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const BADGE_MAP: Record<string, string> = {
  free: 'badge-free',
  standard: 'badge-standard',
  premium: 'badge-premium',
  Active: 'badge-active',
  Suspended: 'badge-suspended',
};

export default function AllUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch(`${API_URL}/api/admin/all-users`, { credentials: 'include' });
        const json = await res.json();
        setUsers(json.data || []);
      } catch (err) {
        console.error("Failed to load users", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  if (loading) return <div className="p-20 text-center animate-pulse">Loading Users List...</div>;

  return (
    <>
     

      <div className="dash-content">
        <div className="panel">
          <div className="panel-head">
            <h2>Registered users</h2>
            <span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{users.length} total</span>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Social Account & ID</th>
                <th>Plan</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                // ইউজারের প্রথম কানেক্টেড পেজটি খুঁজে বের করা
                const connectedPage = u.social_pages?.[0]; 
                
                return (
                  <tr key={u.id}>
                    <td>
                      <div className="row-user">
                        {/* পেজের ছবি অথবা ডিফল্ট অবতার */}
                        <img 
                          src={connectedPage?.picture || `https://ui-avatars.com/api/?name=${u.name}&background=random`} 
                          style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          {/* পেজের নাম বড় করে */}
                          <div className="row-name" style={{ fontWeight: '700' }}>
                            {connectedPage?.name || u.name}
                          </div>
                          {/* নিচে আইডি (platform_page_id) */}
                          <div className="row-sub" style={{ fontSize: '11px', color: '#888' }}>
                            ID: {connectedPage?.platform_page_id || 'Not Connected'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${BADGE_MAP[u.plan] || 'badge-free'}`}>
                        {u.plan.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-active">Active</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn btn-ghost btn-sm">Manage</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {users.length === 0 && (
            <p style={{ padding: '30px', textAlign: 'center', color: '#999' }}>No users found in database.</p>
          )}
        </div>
      </div>
    </>
  );
}