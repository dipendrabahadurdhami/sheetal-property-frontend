import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import blogApi from '../../utils/blogApi';
import '../../index.css';

const storageUrl = (path) => {
  if (!path) return null;
  const base = (process.env.REACT_APP_API_LINK || '').replace(/\/api$/, '');
  return `${base}/storage/${path}`;
};

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Draft';

/* ── Skeleton ── */
const Skel = ({ w = '100%', h = '12px' }) => (
  <div style={{
    width: w, height: h, flexShrink: 0,
    background: '#f0f0f0',
    animation: 'skel-pulse 1.5s ease-in-out infinite',
  }} />
);

/* ── Section label ── */
const SideLabel = ({ children }) => (
  <p style={{
    fontSize: '10px', fontWeight: 700,
    letterSpacing: '0.14em', textTransform: 'uppercase',
    color: '#bbb', margin: '0 0 12px',
  }}>
    {children}
  </p>
);

/* ─────────────────────────────────────── */
const BlogSidebar = () => {
  const [categories, setCategories] = useState([]);
  const [recent,     setRecent]     = useState([]);
  const [tags,       setTags]       = useState([]);
  const [search,     setSearch]     = useState('');
  const [focused,    setFocused]    = useState(false);
  const [loading,    setLoading]    = useState(true);
  const [imgErrors,  setImgErrors]  = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    Promise.allSettled([
      blogApi.getCategories(),
      blogApi.getRecent(),
      blogApi.getTags(),
    ]).then(([cats, rec, tgs]) => {
      if (cats.status === 'fulfilled') setCategories(cats.value.data.data || []);
      if (rec.status  === 'fulfilled') setRecent(rec.value.data.data  || []);
      if (tgs.status  === 'fulfilled') setTags(tgs.value.data.data    || []);
    }).finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim())
      navigate(`/blog?search=${encodeURIComponent(search.trim())}`);
  };

  return (
    <>
      <style>{`
        @keyframes skel-pulse { 0%,100%{opacity:1} 50%{opacity:.45} }

        /* Search */
        .sb-form {
          display: flex; align-items: center; gap: 10px;
          border-bottom: 1.5px solid #e0e0e0;
          padding-bottom: 10px; margin-bottom: 32px;
          transition: border-color .2s;
        }
        .sb-form.is-focused { border-color: var(--r); }
        .sb-form-icon { width: 15px; height: 15px; flex-shrink: 0; color: #ccc; transition: color .2s; }
        .sb-form.is-focused .sb-form-icon { color: var(--r); }
        .sb-form input {
          flex: 1; border: none; outline: none; background: transparent;
          font-size: 13px; color: var(--d); font-family: inherit; padding: 0; min-width: 0;
          border-radius: 0; -webkit-appearance: none; appearance: none;
        }
        .sb-form input::placeholder { color: #ccc; }
        .sb-form button {
          border: 1px solid #e0e0e0; background: transparent;
          font-size: 10px; color: #ccc; padding: 2px 7px;
          font-family: inherit; cursor: pointer; flex-shrink: 0;
          transition: border-color .2s, color .2s; letter-spacing: .02em;
          border-radius: 0; -webkit-appearance: none; appearance: none;
        }
        .sb-form.is-focused button { border-color: var(--r); color: var(--r); }

        /* Block */
        .sb-block { margin-bottom: 28px; }

        /* Category rows */
        .sb-cat {
          display: flex; align-items: center; justify-content: space-between;
          padding: 8px 0; border-bottom: 1px solid #f2f2f2;
          text-decoration: none; color: var(--d);
        }
        .sb-cat:last-child { border-bottom: none; }
        .sb-cat-name { font-size: 13px; transition: color .18s; }
        .sb-cat:hover .sb-cat-name { color: var(--r); }
        .sb-cat-count {
          font-size: 11px; color: #ccc; transition: color .18s;
          font-variant-numeric: tabular-nums; flex-shrink: 0; margin-left: 8px;
        }
        .sb-cat:hover .sb-cat-count { color: var(--r); }

        /* Recent posts */
        .sb-recent {
          display: flex; gap: 11px; align-items: flex-start;
          padding: 10px 0; border-bottom: 1px solid #f2f2f2;
          text-decoration: none; transition: opacity .18s;
        }
        .sb-recent:last-child { border-bottom: none; }
        .sb-recent:hover { opacity: .65; }
        .sb-recent-img {
          width: 52px; height: 46px; flex-shrink: 0;
          object-fit: cover;
        }
        .sb-recent-placeholder {
          width: 52px; height: 46px; flex-shrink: 0;
          background: #f5f5f5;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
        }
        .sb-recent-title {
          font-size: 12px; font-weight: 600; color: var(--d);
          line-height: 1.45; margin: 0 0 4px;
          display: -webkit-box; -webkit-line-clamp: 2;
          -webkit-box-orient: vertical; overflow: hidden;
        }
        .sb-recent-date { font-size: 11px; color: #bbb; }

        /* Tags */
        .sb-tags { display: flex; flex-wrap: wrap; gap: 6px; }
        .sb-tag {
          font-size: 11px; padding: 3px 10px;
          border: 1px solid #e8e8e8;
          color: #999; text-decoration: none; background: transparent;
          transition: border-color .18s, color .18s;
          white-space: nowrap;
        }
        .sb-tag:hover { border-color: var(--r); color: var(--r); }

        /* Skel rows */
        .sb-skel-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 8px 0; border-bottom: 1px solid #f2f2f2; gap: 10px;
        }
        .sb-skel-row:last-child { border-bottom: none; }
        .sb-skel-recent { display: flex; gap: 11px; margin-bottom: 12px; }
        .sb-skel-recent:last-child { margin-bottom: 0; }
      `}</style>

      <aside>

        {/* Search */}
        <form onSubmit={handleSearch} className={`sb-form${focused ? ' is-focused' : ''}`}>
          <span className="sb-form-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Search articles…"
            aria-label="Search articles"
          />
          <button type="submit" aria-label="Submit">↵</button>
        </form>

        {/* Categories */}
        <div className="sb-block">
          <SideLabel>Categories</SideLabel>
          {loading ? (
            [70, 55, 80, 60].map((w, i) => (
              <div key={i} className="sb-skel-row">
                <Skel w={`${w}%`} h="12px" />
                <Skel w="16px" h="12px" />
              </div>
            ))
          ) : categories.length === 0 ? (
            <p style={{ fontSize: '12px', color: '#ccc', padding: '4px 0' }}>No categories yet</p>
          ) : (
            categories.map(cat => (
              <Link key={cat.id} to={`/blog/category/${cat.slug}`} className="sb-cat">
                <span className="sb-cat-name">{cat.name}</span>
                <span className="sb-cat-count">{cat.blogs_count || 0}</span>
              </Link>
            ))
          )}
        </div>

        {/* Recent Posts */}
        <div className="sb-block">
          <SideLabel>Recent Posts</SideLabel>
          {loading ? (
            [1, 2, 3].map(k => (
              <div key={k} className="sb-skel-recent">
                <Skel w="52px" h="46px" />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px', paddingTop: '2px' }}>
                  <Skel h="12px" />
                  <Skel h="12px" w="65%" />
                  <Skel h="10px" w="40%" />
                </div>
              </div>
            ))
          ) : recent.length === 0 ? (
            <p style={{ fontSize: '12px', color: '#ccc', padding: '4px 0' }}>No recent posts</p>
          ) : (
            recent.map(post => {
              const imgSrc = !imgErrors[post.id] && post.thumbnail
                ? storageUrl(post.thumbnail) : null;
              return (
                <Link key={post.id} to={`/blog/${post.slug}`} className="sb-recent">
                  {imgSrc ? (
                    <img
                      src={imgSrc} alt={post.title} className="sb-recent-img"
                      onError={() => setImgErrors(p => ({ ...p, [post.id]: true }))}
                    />
                  ) : (
                    <div className="sb-recent-placeholder">🏠</div>
                  )}
                  <div style={{ minWidth: 0 }}>
                    <p className="sb-recent-title">{post.title}</p>
                    <span className="sb-recent-date">{fmtDate(post.published_at)}</span>
                  </div>
                </Link>
              );
            })
          )}
        </div>

        {/* Tags */}
        {(loading || tags.length > 0) && (
          <div className="sb-block">
            <SideLabel>Tags</SideLabel>
            {loading ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {[52, 70, 46, 64, 56].map((w, i) => (
                  <Skel key={i} w={`${w}px`} h="24px" />
                ))}
              </div>
            ) : (
              <div className="sb-tags">
                {tags.map(tag => (
                  <Link key={tag.id} to={`/blog/tag/${tag.slug}`} className="sb-tag">
                    #{tag.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

      </aside>
    </>
  );
};

export default BlogSidebar;