'use client';

import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function getCookie(name: string): string | undefined {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : undefined;
}

// Sanctum SPA auth er jonno protected POST call korার common helper —
// CSRF cookie set kore, tarpor XSRF token header e diye actual request pathay
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

export default function CreatePost() {
  const [platform, setPlatform] = useState('facebook');
  const [connectedPages, setConnectedPages] = useState<any[]>([]); // সব কানেক্টেড পেজ
  const [selectedPage, setSelectedPage] = useState<any>(null); // সিলেক্ট করা নির্দিষ্ট পেজ
  const [topic, setTopic] = useState('');

  const [auditData, setAuditData] = useState<any>(null); // পেজ অডিট ডাটা
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditError, setAuditError] = useState<string | null>(null);

  // --- Step 1: Image/Video source — AI generate NAKI gallery theke select ---
  const [imageSource, setImageSource] = useState<'ai' | 'gallery'>('ai');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image'); // selected media image na video
  const [usedPrompt, setUsedPrompt] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  // --- Gallery picker state ---
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [galleryError, setGalleryError] = useState<string | null>(null);
  const [galleryFilter, setGalleryFilter] = useState<'all' | 'image' | 'video'>('all');

  // --- Step 2: Caption generation state ---
  const [postId, setPostId] = useState<number | null>(null);
  const [caption, setCaption] = useState<string | null>(null);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [postLoading, setPostLoading] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);

  // --- Step 3: Publish to Facebook state ---
  const [publishLoading, setPublishLoading] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [publishedAt, setPublishedAt] = useState<string | null>(null);

  // ১. ডাটাবেস থেকে সব কানেক্টেড পেজ লোড করা
  useEffect(() => {
    async function fetchPages() {
      const res = await fetch(`${API_URL}/api/pages`, { credentials: 'include' });
      const json = await res.json();
      setConnectedPages(json.data || []);
    }
    fetchPages();
  }, []);

  // ২. প্ল্যাটফর্ম অনুযায়ী পেজ ফিল্টার করা
  const filteredPages = connectedPages.filter((p) => p.platform === platform);

  // পেজ বদলালে/নতুন সিলেক্ট করলে পুরনো generation state রিসেট করা দরকার,
  // না হলে আগের পেজের ছবি/ক্যাপশন নতুন পেজের সাথে মিশে যাবে
  const resetGenerationState = () => {
    setImageUrl(null);
    setMediaType('image');
    setUsedPrompt(null);
    setImageError(null);
    setImageSource('ai');
    setPostId(null);
    setCaption(null);
    setHashtags([]);
    setPostError(null);
    setPublishError(null);
    setPublishedAt(null);
  };

  // ৩. পেজ সিলেক্ট করলে তার real audit data Laravel -> Python theke fetch kora
  const handlePageSelect = async (page: any) => {
    setSelectedPage(page);
    setAuditData(null);
    setAuditError(null);
    setAuditLoading(true);
    resetGenerationState();
    setTopic('');

    try {
      const json = await authedPost('/api/audit', { page_id: page.platform_page_id });
      setAuditData(json);
    } catch (err: any) {
      console.error('Audit fetch failed', err);
      setAuditError(err.message || 'Backend/AI service e connect kora jayni.');
    } finally {
      setAuditLoading(false);
    }
  };

  // ৪. Step 1 (AI) — idea theke image generate kora (AI diye ekhono shudhu image e generate hoy, video na)
  const handleGenerateImage = async () => {
    if (!selectedPage || !topic) return;

    setImageLoading(true);
    setImageError(null);
    setImageUrl(null);
    setCaption(null); // notun image generate korle purono caption ar valid thake na
    setHashtags([]);

    try {
      const json = await authedPost('/api/generate-image', {
        idea: topic,
        page_id: selectedPage.platform_page_id,
      });

      if (!json.image_url) {
        setImageError(json.message || 'Image generate kora jayni, abar try koro.');
        return;
      }

      setImageUrl(json.image_url);
      setMediaType('image');
      setUsedPrompt(json.used_prompt || null);
    } catch (err: any) {
      console.error('Image generation failed', err);
      setImageError(err.message || 'Image generate korার somoy somossa hoyeche.');
    } finally {
      setImageLoading(false);
    }
  };

  // ৪ব. Step 1 (Gallery) — nijer age theke upload kora/AI generate kora image+video list ana
  const loadGallery = async (type: 'all' | 'image' | 'video' = 'all') => {
    setGalleryLoading(true);
    setGalleryError(null);
    try {
      const query = type !== 'all' ? `?type=${type}` : '';
      const res = await fetch(`${API_URL}/api/gallery${query}`, {
        credentials: 'include',
        headers: { Accept: 'application/json' },
      });
      const json = await res.json();
      const items = json.data?.data || json.data || [];
      setGalleryItems(items);
    } catch (err) {
      console.error('Gallery fetch failed', err);
      setGalleryError('Gallery load kora jayni.');
    } finally {
      setGalleryLoading(false);
    }
  };

  // Gallery filter tab (All / Image / Video) change korle notun kore fetch kora
  const handleGalleryFilterChange = (type: 'all' | 'image' | 'video') => {
    setGalleryFilter(type);
    loadGallery(type);
  };

  // Image source tab switch korার shomoy — 'gallery' e switch korle list load koro
  const handleImageSourceChange = (source: 'ai' | 'gallery') => {
    setImageSource(source);
    setImageUrl(null);
    setMediaType('image');
    setUsedPrompt(null);
    setImageError(null);
    setCaption(null);
    setHashtags([]);
    if (source === 'gallery' && galleryItems.length === 0) {
      loadGallery(galleryFilter);
    }
  };

  const handlePickFromGallery = (item: any) => {
    setImageUrl(item.url);
    setMediaType(item.type === 'video' ? 'video' : 'image');
    setUsedPrompt(null); // gallery theke asha media er kono AI prompt nai
  };

  // ৫. Step 2 — image/video + idea theke caption/hashtag generate kora
  const handleGeneratePost = async () => {
    if (!selectedPage || !topic) return;

    setPostLoading(true);
    setPostError(null);

    try {
      const json = await authedPost('/api/generate-post', {
        idea: topic,
        page_id: selectedPage.platform_page_id,
        image_url: imageUrl,
        media_type: mediaType,
        used_prompt: usedPrompt,
      });

      setPostId(json.post_id || null);
      setCaption(json.caption || '');
      setHashtags(json.hashtags || []);
    } catch (err: any) {
      console.error('Post generation failed', err);
      setPostError(err.message || 'Caption generate korার somoy somossa hoyeche.');
    } finally {
      setPostLoading(false);
    }
  };

  // ৬. Step 3 — draft post ke actual Facebook page e publish kora
  const handlePublish = async () => {
    if (!postId) return;

    setPublishLoading(true);
    setPublishError(null);

    try {
      const json = await authedPost(`/api/posts/${postId}/publish`, {});
      setPublishedAt(json.message || 'Successfully published!');
    } catch (err: any) {
      console.error('Publish failed', err);
      setPublishError(err.message || 'Facebook e publish korার somoy somossa hoyeche.');
    } finally {
      setPublishLoading(false);
    }
  };

  return (
    <div className="dash-content">
      <div className="section-head" style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '800' }}>Create AI Post</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '30px' }}>
        {/* --- বাম পাশ: পেজ সিলেকশন ও অডিট --- */}
        <div className="space-y-6">
          <div className="panel" style={{ padding: '24px', borderRadius: '24px' }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>১. প্ল্যাটফর্ম বেছে নিন</label>
            <select
              value={platform}
              onChange={(e) => {
                setPlatform(e.target.value);
                setSelectedPage(null);
                setAuditData(null);
                setAuditError(null);
                resetGenerationState();
              }}
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #E1DDF0' }}
            >
              <option value="facebook">Facebook</option>
              <option value="instagram">Instagram</option>
            </select>

            <label style={{ fontWeight: 'bold', display: 'block', marginTop: '20px', marginBottom: '10px' }}>২. পেজ সিলেক্ট করুন</label>
            <div className="space-y-2">
              {filteredPages.map((page) => (
                <div
                  key={page.id}
                  onClick={() => handlePageSelect(page)}
                  style={{
                    padding: '12px 15px',
                    borderRadius: '15px',
                    cursor: 'pointer',
                    border: selectedPage?.id === page.id ? '2px solid #6C5CE7' : '1px solid #eee',
                    backgroundColor: selectedPage?.id === page.id ? '#F6F4FC' : 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <img src={page.picture} style={{ width: '30px', height: '30px', borderRadius: '50%' }} alt="" />
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>{page.name}</span>
                </div>
              ))}
              {filteredPages.length === 0 && (
                <p style={{ fontSize: '13px', color: '#6F6B93' }}>
                  Ei platform e kono connected page nai. Age "Connected pages" theke connect koro.
                </p>
              )}
            </div>
          </div>

          {/* --- পেজ অডিট রিপোর্ট --- */}
          {selectedPage && auditLoading && (
            <div className="panel" style={{ padding: '24px', borderRadius: '24px', textAlign: 'center', color: '#6F6B93', fontSize: '13.5px' }}>
              AI page ta analyze korche…
            </div>
          )}

          {selectedPage && auditError && !auditLoading && (
            <div className="form-error">{auditError}</div>
          )}

          {selectedPage && auditData && !auditLoading && (
            <div
              className="panel animate-in fade-in slide-in-from-left-4"
              style={{ padding: '24px', borderRadius: '24px', backgroundColor: '#17162A', color: 'white' }}
            >
              <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#00B39B', marginBottom: '4px' }}>📊 Page Audit Summary</h3>
              <p style={{ fontSize: '11.5px', color: '#8B87AC', marginBottom: '15px' }}>
                সাম্প্রতিক {auditData.posts_analyzed} টি পোস্ট বিশ্লেষণ করে তৈরি
              </p>
              <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <p>● আনুমানিক রিচ: <strong>{auditData.reach_estimate}</strong></p>
                <p>● গড় লাইক/পোস্ট: <strong>{auditData.avg_likes}</strong></p>
                <p>● পোস্টিং ফ্রিকোয়েন্সি: <strong>{auditData.posting_frequency}</strong></p>
                <p>● সেরা সময়: <strong>{auditData.best_time}</strong></p>
                <p>● কনটেন্ট প্যাটার্ন: {auditData.content_pattern}</p>
                <p>● প্রধান ভুল: <span style={{ color: '#FF6F91' }}>{auditData.top_mistake}</span></p>

                <div style={{ marginTop: '6px', paddingTop: '10px', borderTop: '1px solid #2C2A4A', fontSize: '12px', color: '#B8B4D6' }}>
                  <p>🏆 সেরা পোস্ট: &quot;{auditData.best_performing_post}&quot;</p>
                  <p style={{ marginTop: '4px' }}>📉 দুর্বল পোস্ট: &quot;{auditData.worst_performing_post}&quot;</p>
                </div>

                {auditData.content_ideas && auditData.content_ideas.length > 0 && (
                  <div style={{ marginTop: '6px', paddingTop: '10px', borderTop: '1px solid #2C2A4A' }}>
                    <p style={{ fontWeight: 'bold', color: '#C7C2F0', marginBottom: '6px' }}>💡 এখন কী পোস্ট করবেন:</p>
                    <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {auditData.content_ideas.map((idea: string, i: number) => (
                        <li key={i} style={{ fontSize: '12.5px' }}>{idea}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <hr style={{ margin: '10px 0', borderColor: '#2C2A4A' }} />
                <p style={{ fontStyle: 'italic', color: '#B8B4D6' }}>AI Suggestion: {auditData.suggestion}</p>
              </div>
            </div>
          )}
        </div>

        {/* --- ডান পাশ: পোস্ট ক্রিয়েশন বক্স --- */}
        <div className="panel" style={{ padding: '32px', borderRadius: '32px', opacity: selectedPage ? 1 : 0.5, pointerEvents: selectedPage ? 'auto' : 'none' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>৩. আপনার আইডিয়া লিখুন</h2>
          <textarea
            rows={6}
            placeholder={selectedPage ? `${selectedPage.name} পেজের জন্য কী পোস্ট করতে চান?` : 'আগে একটি পেজ সিলেক্ট করুন...'}
            value={topic}
            onChange={(e) => {
              setTopic(e.target.value);
              // idea change korle purono generated image/caption ar relevant thake na
              resetGenerationState();
            }}
            style={{ width: '100%', padding: '20px', borderRadius: '20px', border: '1.5px solid #E1DDF0', outline: 'none', fontSize: '16px' }}
          />

          {/* --- Image source tabs: AI Generate vs Gallery --- */}
          <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
            <button
              type="button"
              className={`btn btn-sm ${imageSource === 'ai' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => handleImageSourceChange('ai')}
              style={{ flex: 1 }}
            >
              🎨 AI Generate
            </button>
            <button
              type="button"
              className={`btn btn-sm ${imageSource === 'gallery' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => handleImageSourceChange('gallery')}
              style={{ flex: 1 }}
            >
              🖼️ Select from Gallery
            </button>
          </div>

          {/* --- AI Generate mode --- */}
          {imageSource === 'ai' && (
            <button
              onClick={handleGenerateImage}
              disabled={!topic || imageLoading}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '14px', padding: '15px', fontSize: '16px', borderRadius: '15px' }}
            >
              {imageLoading ? 'Image toiri hocche...' : '🎨 Generate Image'}
            </button>
          )}

          {imageError && !imageLoading && (
            <div className="form-error" style={{ marginTop: '10px' }}>{imageError}</div>
          )}

          {/* --- Gallery picker mode --- */}
          {imageSource === 'gallery' && (
            <div style={{ marginTop: 14 }}>
              {/* Type filter: All / Image / Video */}
              <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                {(['all', 'image', 'video'] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    className={`btn btn-sm ${galleryFilter === f ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => handleGalleryFilterChange(f)}
                  >
                    {f === 'all' ? 'All' : f === 'image' ? 'Images' : 'Videos'}
                  </button>
                ))}
              </div>

              {galleryLoading ? (
                <p style={{ fontSize: 13.5, color: '#6F6B93', padding: '12px 0' }}>Gallery load hocche…</p>
              ) : galleryError ? (
                <div className="form-error">{galleryError}</div>
              ) : galleryItems.length === 0 ? (
                <p style={{ fontSize: 13.5, color: '#6F6B93', padding: '12px 0' }}>
                  Gallery e kono media nai। age Gallery page theke upload/generate koro।
                </p>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
                    gap: 10,
                    maxHeight: 260,
                    overflowY: 'auto',
                    padding: 4,
                  }}
                >
                  {galleryItems.map((item: any) =>
                    item.type === 'video' ? (
                      <video
                        key={item.id}
                        src={item.url}
                        muted
                        onClick={() => handlePickFromGallery(item)}
                        style={{
                          width: '100%',
                          height: 90,
                          objectFit: 'cover',
                          borderRadius: 10,
                          cursor: 'pointer',
                          border: imageUrl === item.url ? '3px solid #6C5CE7' : '1px solid #E1DDF0',
                        }}
                      />
                    ) : (
                      <img
                        key={item.id}
                        src={item.url}
                        alt={item.file_name}
                        onClick={() => handlePickFromGallery(item)}
                        style={{
                          width: '100%',
                          height: 90,
                          objectFit: 'cover',
                          borderRadius: 10,
                          cursor: 'pointer',
                          border: imageUrl === item.url ? '3px solid #6C5CE7' : '1px solid #E1DDF0',
                        }}
                      />
                    )
                  )}
                </div>
              )}
            </div>
          )}

          {/* --- Generated/selected media preview + Step 2 button --- */}
          {imageUrl && !imageLoading && (
            <div style={{ marginTop: '24px' }}>
              {mediaType === 'video' ? (
                <video
                  src={imageUrl}
                  controls
                  style={{ width: '100%', borderRadius: '20px', border: '1.5px solid #E1DDF0' }}
                />
              ) : (
                <img
                  src={imageUrl}
                  alt="Post banner"
                  style={{ width: '100%', borderRadius: '20px', border: '1.5px solid #E1DDF0' }}
                />
              )}

              <button
                onClick={handleGeneratePost}
                disabled={postLoading}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '16px', padding: '15px', fontSize: '16px', borderRadius: '15px' }}
              >
                {postLoading ? 'Caption লেখা হচ্ছে...' : '✍️ Generate Post'}
              </button>
            </div>
          )}

          {postError && !postLoading && (
            <div className="form-error" style={{ marginTop: '10px' }}>{postError}</div>
          )}

          {/* --- Generated caption + hashtags --- */}
          {caption && !postLoading && (
            <div
              className="panel animate-in fade-in slide-in-from-bottom-4"
              style={{ marginTop: '20px', padding: '20px', borderRadius: '20px', backgroundColor: '#F6F4FC' }}
            >
              <p style={{ fontSize: '14px', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{caption}</p>

              {hashtags.length > 0 && (
                <p style={{ marginTop: '12px', fontSize: '13px', color: '#6C5CE7', fontWeight: 600 }}>
                  {hashtags.join(' ')}
                </p>
              )}
            </div>
          )}

          {/* --- Step 3 button: Publish to Facebook --- */}
          {postId && caption && !postLoading && !publishedAt && (
            <button
              onClick={handlePublish}
              disabled={publishLoading}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '16px', padding: '15px', fontSize: '16px', borderRadius: '15px', backgroundColor: '#00B39B' }}
            >
              {publishLoading ? 'Facebook e post hocche...' : '🚀 Post to Facebook'}
            </button>
          )}

          {publishError && !publishLoading && (
            <div className="form-error" style={{ marginTop: '10px' }}>{publishError}</div>
          )}

          {publishedAt && (
            <div
              className="panel animate-in fade-in"
              style={{ marginTop: '16px', padding: '16px', borderRadius: '16px', backgroundColor: '#E6F9F5', color: '#00846F', fontSize: '14px', fontWeight: 600, textAlign: 'center' }}
            >
              ✅ {publishedAt}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
