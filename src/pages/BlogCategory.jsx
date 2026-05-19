import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import BlogCard from '../components/blog/BlogCard';
import BlogSidebar from '../components/blog/BlogSidebar';
import blogApi from '../utils/blogApi';
import '../index.css';

/* ─── Skeleton ── */
const SkeletonCard = () => (
  <div style={{
    display: 'grid', gridTemplateColumns: '140px 1fr', gap: '18px',
    paddingBottom: '22px', marginBottom: '22px',
    borderBottom: '1px solid #f2f2f2',
    animation: 'bc-skel-pulse 1.4s ease-in-out infinite',
  }}>
    <div style={{ height: '110px', background: '#f0f0f0', borderRadius: '12px' }} />
    <div>
      <div style={{ height: '10px', background: '#f0f0f0', borderRadius: '6px', width: '35%', marginBottom: '12px' }} />
      <div style={{ height: '16px', background: '#f0f0f0', borderRadius: '6px', marginBottom: '8px' }} />
      <div style={{ height: '16px', background: '#f0f0f0', borderRadius: '6px', width: '70%' }} />
    </div>
    <style>{`@keyframes bc-skel-pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
  </div>
);

/* ─── Pagination ── */
const Pagination = ({ current, last, onPage }) => {
  if (last <= 1) return null;
  const pages = [];
  for (let i = 1; i <= last; i++) {
    if (i === 1 || i === last || Math.abs(i - current) <= 1) pages.push(i);
    else if (pages[pages.length - 1] !== '...') pages.push('...');
  }
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', marginTop: '48px', flexWrap: 'wrap' }}>
      <button
        onClick={() => current > 1 && onPage(current - 1)}
        disabled={current === 1}
        className="pag-btn"
        style={{ opacity: current === 1 ? 0.4 : 1, cursor: current === 1 ? 'not-allowed' : 'pointer' }}
      >‹</button>
      {pages.map((p, idx) =>
        p === '...'
          ? <span key={`e${idx}`} style={{ color: '#bbb', fontSize: '14px', padding: '0 4px' }}>…</span>
          : <button
              key={p}
              onClick={() => onPage(p)}
              className={`pag-btn${current === p ? ' pag-btn-active' : ''}`}
            >{p}</button>
      )}
      <button
        onClick={() => current < last && onPage(current + 1)}
        disabled={current === last}
        className="pag-btn"
        style={{ opacity: current === last ? 0.4 : 1, cursor: current === last ? 'not-allowed' : 'pointer' }}
      >›</button>
      <style>{`
        .pag-btn {
          width:38px; height:38px; border:1.5px solid #ebebeb; background:#fff;
          border-radius:10px; font-size:14px; font-weight:500; color:var(--d);
          display:flex; align-items:center; justify-content:center;
          transition:all 0.2s; cursor:pointer;
        }
        .pag-btn:hover:not(:disabled) { border-color:var(--r); color:var(--r); }
        .pag-btn-active { background:var(--r)!important; border-color:var(--r)!important; color:#fff!important; font-weight:700!important; }
      `}</style>
    </div>
  );
};

/* ─── Main ── */
const BlogCategory = () => {
  const { slug } = useParams();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageMeta, setPageMeta] = useState(null);
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);
    blogApi.getByCategory(slug, page).then((r) => {
      const data = r.data.data;
      setBlogs(data?.data || []);
      setPageMeta(data);
      if (data?.data?.[0]?.category?.name) {
        setCategoryName(data.data[0].category.name);
      } else {
        setCategoryName(slug.replace(/-/g, ' '));
      }
    }).finally(() => setLoading(false));
  }, [slug, page]);

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '28px 16px 80px' }}>
      <style>{`
        @media(min-width: 768px) {
          .bc-page-pad { padding: 48px 24px 80px !important; }
        }
        .bc-main-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
          align-items: start;
        }
        @media(min-width: 1024px) {
          .bc-main-grid { grid-template-columns: 1fr 316px; gap: 56px; }
        }
      `}</style>

      {/* Breadcrumb */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '32px', fontSize: '12px', color: '#bbb', flexWrap: 'wrap' }}>
        <Link to="/" style={{ color: '#bbb', textDecoration: 'none', transition: 'color 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--r)'}
          onMouseLeave={e => e.currentTarget.style.color = '#bbb'}>Home</Link>
        <span>›</span>
        <Link to="/blog" style={{ color: '#bbb', textDecoration: 'none', transition: 'color 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--r)'}
          onMouseLeave={e => e.currentTarget.style.color = '#bbb'}>Blog</Link>
        <span>›</span>
        <span style={{ color: 'var(--d)', fontWeight: 600, textTransform: 'capitalize' }}>{categoryName}</span>
      </nav>

      {/* Category header */}
      <div style={{ marginBottom: '44px', paddingBottom: '32px', borderBottom: '1.5px solid #f2f2f2' }}>
        <div className="lbl">
          <div className="lbl-line" />
          <span className="lbl-txt">Category</span>
        </div>
        <h1 className="h-lg" style={{ textTransform: 'capitalize', marginBottom: '10px' }}>
          {categoryName}
        </h1>
        {pageMeta?.total != null && (
          <p style={{ color: '#999', fontSize: '14px' }}>
            {pageMeta.total} article{pageMeta.total !== 1 ? 's' : ''} in this category
          </p>
        )}
      </div>

      {/* Layout */}
      <div className="bc-main-grid">
        {/* Posts */}
        <div>
          {loading ? (
            [1, 2, 3].map(k => <SkeletonCard key={k} />)
          ) : blogs.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '80px 20px',
              border: '1.5px dashed #e8e8e8', borderRadius: '16px'
            }}>
              <div style={{ fontSize: '40px', marginBottom: '14px' }}>📂</div>
              <p style={{ color: '#999', fontSize: '15px', marginBottom: '20px' }}>
                No posts in this category yet.
              </p>
              <Link to="/blog" className="btn-p">Back to Blog</Link>
            </div>
          ) : (
            blogs.map((blog, idx) => (
              <BlogCard key={blog.id} blog={blog} isLast={idx === blogs.length - 1} />
            ))
          )}

          <Pagination
            current={pageMeta?.current_page || 1}
            last={pageMeta?.last_page || 1}
            onPage={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          />
        </div>

        {/* Sidebar */}
        <BlogSidebar />
      </div>
    </div>
  );
};

export default BlogCategory;