import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BlogCard from '../components/blog/BlogCard';
import BlogSidebar from '../components/blog/BlogSidebar';
import blogApi from '../utils/blogApi';

const BlogCategory = () => {
  const { slug } = useParams();
  const [blogs,    setBlogs]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [page,     setPage]     = useState(1);
  const [pageMeta, setPageMeta] = useState(null);

  useEffect(() => {
    setLoading(true);
    blogApi.getByCategory(slug, page)
      .then(r => { setBlogs(r.data.data?.data || []); setPageMeta(r.data.data); })
      .finally(() => setLoading(false));
  }, [slug, page]);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '32px', color: '#1a1a1a', textTransform: 'capitalize' }}>
        Category: {slug.replace(/-/g, ' ')}
      </h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '40px' }}>
        <div>
          {loading ? <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>Loading...</div>
          : blogs.length === 0 ? <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>No posts in this category.</div>
          : <div style={{ display: 'grid', gap: '24px' }}>{blogs.map(b => <BlogCard key={b.id} blog={b} />)}</div>}
          {pageMeta?.last_page > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '32px' }}>
              {Array.from({ length: pageMeta.last_page }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                  background: pageMeta.current_page === p ? '#E8272A' : '#f5f5f5', color: pageMeta.current_page === p ? '#fff' : '#444', fontWeight: 600 }}>{p}</button>
              ))}
            </div>
          )}
        </div>
        <BlogSidebar />
      </div>
    </div>
  );
};

export default BlogCategory;
