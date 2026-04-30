import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchBlogs, fetchFeatured } from '../features/slices/blog';
import BlogCard from '../components/blog/BlogCard';
import BlogSidebar from '../components/blog/BlogSidebar';
import blogApi from '../utils/blogApi';

const Blog = () => {
  const dispatch = useDispatch();
  const { list, pagination, loading, featured } = useSelector(s => s.blog);
  const [searchParams] = useSearchParams();
  const [searchResults, setSearchResults] = useState(null);
  const search = searchParams.get('search');

  useEffect(() => {
    if (search) {
      blogApi.search(search).then(r => setSearchResults(r.data.data?.data || []));
    } else {
      dispatch(fetchBlogs(1));
      dispatch(fetchFeatured());
      setSearchResults(null);
    }
  }, [search, dispatch]);

  const displayList = searchResults !== null ? searchResults : list;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#1a1a1a', marginBottom: '12px' }}>
          {search ? `Search: "${search}"` : 'Our Blog'}
        </h1>
        <p style={{ color: '#666', fontSize: '16px' }}>Real estate insights, market trends & property tips</p>
      </div>

      {!search && featured.length > 0 && (
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>Featured Posts</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
            {featured.slice(0, 3).map(blog => <BlogCard key={blog.id} blog={blog} featured />)}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '40px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>{search ? 'Results' : 'Latest Posts'}</h2>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>Loading...</div>
          ) : displayList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>No posts found.</div>
          ) : (
            <div style={{ display: 'grid', gap: '28px' }}>
              {displayList.map(blog => <BlogCard key={blog.id} blog={blog} />)}
            </div>
          )}
          {pagination?.last_page > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '40px' }}>
              {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map(page => (
                <button key={page} onClick={() => dispatch(fetchBlogs(page))}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                    background: pagination.current_page === page ? '#E8272A' : '#f5f5f5',
                    color: pagination.current_page === page ? '#fff' : '#444', fontWeight: 600 }}>
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
        <BlogSidebar />
      </div>
    </div>
  );
};

export default Blog;
