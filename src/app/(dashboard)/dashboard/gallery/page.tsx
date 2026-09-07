'use client';

import { useState, useEffect, useRef } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function getCookie(name: string): string | undefined {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : undefined;
}

interface MediaItem {
  id: number;
  type: 'image' | 'video';
  file_name: string;
  url: string;
  thumbnail_url: string | null;
  is_ai_generated: boolean;
  created_at: string;
}

export default function Gallery() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'image' | 'video'>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function fetchGallery(type: string = 'all') {
    setLoading(true);
    try {
      const query = type !== 'all' ? `?type=${type}` : '';
      const res = await fetch(`${API_URL}/api/gallery${query}`, {
        credentials: 'include',
        headers: { Accept: 'application/json' },
      });

      const json = await res.json();
      const mediaData = json.data?.data || json.data || [];
      setItems(mediaData);
    } catch (err) {
      console.error('Failed to fetch gallery', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchGallery(filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // ⚠️ CSRF cookie age fetch korte hobe, na hole 419 error ashবে
      await fetch(`${API_URL}/sanctum/csrf-cookie`, { credentials: 'include' });
      const token = getCookie('XSRF-TOKEN');

      const res = await fetch(`${API_URL}/api/gallery`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'X-XSRF-TOKEN': token || '',
          // ⚠️ FormData pathanor shomoy 'Content-Type' header nijer theke set
          // koro na — browser nijei multipart boundary shoho set korে dেয়.
        },
        body: formData,
      });

      if (res.ok) {
        fetchGallery(filter);
      } else {
        const errData = await res.json().catch(() => ({}));
        setUploadError(errData.error || errData.message || `Upload failed (${res.status})`);
      }
    } catch (err) {
      console.error('Upload error', err);
      setUploadError('Upload failed — network/server error.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Ei file ta delete korte chao?')) return;
    try {
      await fetch(`${API_URL}/sanctum/csrf-cookie`, { credentials: 'include' });
      const token = getCookie('XSRF-TOKEN');

      const res = await fetch(`${API_URL}/api/gallery/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'X-XSRF-TOKEN': token || '',
        },
      });
      if (res.ok) {
        setItems((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error('Delete error', err);
    }
  }

  return (
    <div className="dash-content">
      <div className="panel-head" style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '800' }}>Gallery</h2>

        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleUpload}
            style={{ display: 'none' }}
          />
          <button
            className="btn btn-primary btn-sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : '+ Upload Media'}
          </button>
        </div>
      </div>

      {uploadError && <div className="form-error" style={{ marginBottom: 16 }}>{uploadError}</div>}

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {(['all', 'image', 'video'] as const).map((f) => (
          <button
            key={f}
            className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : f === 'image' ? 'Images' : 'Videos'}
          </button>
        ))}
      </div>

      <div className="panel">
        {loading ? (
          <p style={{ padding: '20px' }}>Loading gallery...</p>
        ) : items.length === 0 ? (
          <p style={{ padding: '20px', color: '#888' }}>
            Kono media nei. Upload kore shuru koro.
          </p>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: '16px',
              padding: '16px',
            }}
          >
            {items.map((item) => (
              <div
                key={item.id}
                style={{
                  border: '1px solid #eee',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  position: 'relative',
                  background: '#fafafa',
                }}
              >
                {item.type === 'image' ? (
                  <img
                    src={item.url}
                    alt={item.file_name}
                    style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block' }}
                  />
                ) : (
                  <video
                    src={item.url}
                    style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block' }}
                    muted
                  />
                )}

                {item.is_ai_generated && (
                  <span
                    className="badge"
                    style={{
                      position: 'absolute',
                      top: '8px',
                      left: '8px',
                      background: '#6C5CE7',
                      color: '#fff',
                      fontSize: '10px',
                    }}
                  >
                    AI
                  </span>
                )}

                <div
                  style={{
                    padding: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span
                    style={{
                      fontSize: '12px',
                      color: '#666',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '110px',
                    }}
                  >
                    {item.file_name}
                  </span>
                  <button
                    onClick={() => handleDelete(item.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#e74c3c',
                      cursor: 'pointer',
                      fontSize: '13px',
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
