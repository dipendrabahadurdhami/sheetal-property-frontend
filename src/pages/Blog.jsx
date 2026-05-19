import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, Link } from 'react-router-dom';
import { fetchBlogs, fetchFeatured } from '../features/slices/blog';
import BlogCard from '../components/blog/BlogCard';
import BlogSidebar from '../components/blog/BlogSidebar';
import blogApi from '../utils/blogApi';
import '../index.css';

/* ─── helpers ─────────────────────────────────────── */
const thumb = (path) =>
  path ? `${(process.env.REACT_APP_API_LINK || '').replace(/\/api$/, '')}/storage/${path}` : null;

const fmt = (d) =>
  d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '';

const sortNewest = (arr) =>
  [...arr].sort((a, b) => new Date(b.published_at || 0) - new Date(a.published_at || 0));

/* ─── Slideshow ───────────────────────────────────── */
const FeaturedSlideshow = ({ slides }) => {
  const [active, setActive]   = useState(0);
  const [prev, setPrev]       = useState(null);
  const [dir, setDir]         = useState('next');
  const timerRef              = useRef(null);

  const goTo = (idx, d = 'next') => {
    if (idx === active) return;
    setDir(d);
    setPrev(active);
    setActive(idx);
  };

  const goNext = () => goTo((active + 1) % slides.length, 'next');
  const goPrev = () => goTo((active - 1 + slides.length) % slides.length, 'prev');

  const resetTimer = (fn) => {
    clearInterval(timerRef.current);
    fn();
  };

  useEffect(() => {
    timerRef.current = setInterval(goNext, 3000);
    return () => clearInterval(timerRef.current);
  }, [active, slides.length]);

  return (
    <div style={{ position: 'relative', height: '440px', overflow: 'hidden', marginBottom: '56px', borderRadius: '4px' }}>
      <style>{`
        @keyframes ss-in-next  { from{transform:translateX(6%);opacity:0} to{transform:translateX(0);opacity:1} }
        @keyframes ss-out-next { from{transform:translateX(0);opacity:1}  to{transform:translateX(-6%);opacity:0} }
        @keyframes ss-in-prev  { from{transform:translateX(-6%);opacity:0} to{transform:translateX(0);opacity:1} }
        @keyframes ss-out-prev { from{transform:translateX(0);opacity:1}  to{transform:translateX(6%);opacity:0} }
        @keyframes ss-progress { from{width:0%} to{width:100%} }
        .ss-in-next  { animation: ss-in-next  0.6s cubic-bezier(0.22,1,0.36,1) forwards; }
        .ss-out-next { animation: ss-out-next 0.6s cubic-bezier(0.22,1,0.36,1) forwards; }
        .ss-in-prev  { animation: ss-in-prev  0.6s cubic-bezier(0.22,1,0.36,1) forwards; }
        .ss-out-prev { animation: ss-out-prev 0.6s cubic-bezier(0.22,1,0.36,1) forwards; }
        .ss-nav:hover { background: rgba(255,255,255,0.22) !important; }
      `}</style>

      {slides.map((blog, idx) => {
        const img      = thumb(blog.thumbnail);
        const isActive = idx === active;
        const isPrev   = idx === prev;
        if (!isActive && !isPrev) return null;

        let cls = '';
        if (isActive) cls = dir === 'next' ? 'ss-in-next' : 'ss-in-prev';
        if (isPrev)   cls = dir === 'next' ? 'ss-out-next' : 'ss-out-prev';

        return (
          <Link
            key={blog.id}
            to={`/blog/${blog.slug}`}
            className={cls}
            style={{ position: 'absolute', inset: 0, textDecoration: 'none', display: 'block' }}
          >
            <div style={{ position: 'absolute', inset: 0 }}>
              {img
                ? <img src={img} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <div style={{ width: '100%', height: '100%', background: '#1a1a1a' }} />}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(0deg,rgba(0,0,0,0.82) 0%,rgba(0,0,0,0.1) 55%,transparent 100%)',
              }} />
            </div>

            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '36px 32px' }}>
              {blog.category && (
                <span style={{
                  display: 'inline-block',
                  background: 'var(--r)', color: '#fff',
                  fontSize: '10px', fontWeight: 700,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  padding: '3px 10px', marginBottom: '11px', borderRadius: '4px',
                }}>{blog.category.name}</span>
              )}
              <h2 style={{
                fontSize: 'clamp(18px,3vw,32px)', fontWeight: 700,
                color: '#fff', lineHeight: 1.22, letterSpacing: '-0.3px',
                marginBottom: '12px', maxWidth: '640px',
              }}>{blog.title}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                {blog.author && (
                  <>
                    <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>
                      {blog.author.first_name} {blog.author.last_name}
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>·</span>
                  </>
                )}
                <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '12px' }}>{fmt(blog.published_at)}</span>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>·</span>
                <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '12px' }}>{(blog.views || 0).toLocaleString()} views</span>
              </div>
            </div>
          </Link>
        );
      })}

      {/* Arrows */}
      <button className="ss-nav" onClick={() => resetTimer(goPrev)} style={{
        position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', zIndex: 10,
        background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff',
        width: '38px', height: '38px', cursor: 'pointer',
        fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 0.2s',
      }}>‹</button>
      <button className="ss-nav" onClick={() => resetTimer(goNext)} style={{
        position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', zIndex: 10,
        background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff',
        width: '38px', height: '38px', cursor: 'pointer',
        fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 0.2s',
      }}>›</button>

      {/* Dots */}
      <div style={{ position: 'absolute', bottom: '18px', right: '32px', display: 'flex', gap: '6px', zIndex: 10 }}>
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => resetTimer(() => goTo(idx, idx > active ? 'next' : 'prev'))}
            style={{
              width: idx === active ? '22px' : '6px', height: '6px',
              border: 'none', cursor: 'pointer',
              background: idx === active ? '#fff' : 'rgba(255,255,255,0.35)',
              transition: 'all 0.35s cubic-bezier(0.22,1,0.36,1)',
              padding: 0,
            }}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: 'rgba(255,255,255,0.15)', zIndex: 10 }}>
        <div key={active} style={{ height: '100%', background: 'var(--r)', animation: 'ss-progress 3s linear forwards' }} />
      </div>
    </div>
  );
};

/* ─── Skeleton ────────────────────────────────────── */
const Skeleton = () => (
  <div style={{ padding: '18px 0', borderBottom: '1px solid #f2f2f2' }}>
    <style>{`@keyframes sp{0%,100%{opacity:1}50%{opacity:.45}}.sp{animation:sp 1.5s ease-in-out infinite;background:#f0f0f0}`}</style>
    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '16px' }}>
      <div className="sp" style={{ height: '100px' }} />
      <div>
        <div className="sp" style={{ height: '10px', width: '40%', marginBottom: '10px' }} />
        <div className="sp" style={{ height: '15px', marginBottom: '8px' }} />
        <div className="sp" style={{ height: '15px', width: '70%' }} />
      </div>
    </div>
  </div>
);

/* ─── Pagination ──────────────────────────────────── */
const Pagination = ({ current, last, onPage }) => {
  if (last <= 1) return null;
  const pages = [];
  for (let i = 1; i <= last; i++) {
    if (i === 1 || i === last || Math.abs(i - current) <= 1) pages.push(i);
    else if (pages[pages.length - 1] !== '...') pages.push('...');
  }
  const base = {
    width: '34px', height: '34px', border: '1px solid #e8e8e8', background: '#fff',
    fontSize: '13px', fontWeight: 500, color: '#333',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', transition: 'all 0.15s', borderRadius: '4px',
  };
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px', marginTop: '44px', flexWrap: 'wrap' }}>
      <button onClick={() => current > 1 && onPage(current - 1)} disabled={current === 1}
        style={{ ...base, opacity: current === 1 ? 0.35 : 1 }}>‹</button>
      {pages.map((p, idx) =>
        p === '...'
          ? <span key={`e${idx}`} style={{ color: '#bbb', fontSize: '13px', padding: '0 3px' }}>…</span>
          : <button key={p} onClick={() => onPage(p)}
              style={{ ...base, ...(current === p ? { background: 'var(--r)', borderColor: 'var(--r)', color: '#fff', fontWeight: 700 } : {}) }}>
              {p}
            </button>
      )}
      <button onClick={() => current < last && onPage(current + 1)} disabled={current === last}
        style={{ ...base, opacity: current === last ? 0.35 : 1 }}>›</button>
    </div>
  );
};

/* ─── Main Blog Page ──────────────────────────────── */
const Blog = () => {
  const dispatch = useDispatch();
  const { list, pagination, loading, featured } = useSelector((s) => s.blog);
  const [searchParams] = useSearchParams();
  const [searchResults, setSearchResults] = useState(null);
  const search = searchParams.get('search');

  useEffect(() => {
    if (search) {
      blogApi.search(search).then((r) => setSearchResults(r.data.data?.data || []));
    } else {
      dispatch(fetchBlogs(1));
      dispatch(fetchFeatured());
      setSearchResults(null);
    }
  }, [search, dispatch]);

  const rawList    = searchResults !== null ? searchResults : list;
  const displayList = sortNewest(rawList);
  const slideItems  = !search && featured.length > 0 ? sortNewest(featured) : [];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 20px 80px' }}>
      <style>{`
        @media(min-width:1024px){ .blog-main-grid{ grid-template-columns:1fr 300px !important; } }
      `}</style>

      {/* ── Search heading ── */}
      {search && (
        <div style={{ marginBottom: '32px' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--r)', marginBottom: '6px' }}>
            Search results
          </p>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--d)', marginBottom: '4px' }}>"{search}"</h1>
          <p style={{ fontSize: '13px', color: '#999' }}>{displayList.length} article{displayList.length !== 1 ? 's' : ''} found</p>
        </div>
      )}

      {/* ── Slideshow ── */}
      {slideItems.length > 0 && <FeaturedSlideshow slides={slideItems} />}

      {/* ── Main layout ── */}
      <div className="blog-main-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '48px', alignItems: 'start' }}>
        <div>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #f0f0f0',
          }}>
            <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--d)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              {search ? 'Results' : 'Latest Articles'}
            </h2>
            {!search && pagination?.total > 0 && (
              <span style={{ fontSize: '12px', color: '#bbb' }}>{pagination.total} articles</span>
            )}
          </div>

          {loading ? (
            <div>{[1,2,3,4].map((k) => <Skeleton key={k} />)}</div>
          ) : displayList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '64px 20px', border: '1px dashed #e8e8e8' }}>
              <p style={{ fontSize: '13px', color: '#aaa' }}>No posts found.</p>
            </div>
          ) : (
            <div>
              {displayList.map((blog, idx) => (
                <BlogCard key={blog.id} blog={blog} isLast={idx === displayList.length - 1} />
              ))}
            </div>
          )}

          {pagination?.last_page > 1 && (
            <Pagination
              current={pagination.current_page}
              last={pagination.last_page}
              onPage={(p) => { dispatch(fetchBlogs(p)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            />
          )}
        </div>

        <BlogSidebar />
      </div>
    </div>
  );
};

export default Blog;