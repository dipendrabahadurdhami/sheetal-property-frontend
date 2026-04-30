import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import blogApi from '../../utils/blogApi';

const BlogSidebar = () => {
  const [categories, setCategories] = useState([]);
  const [recent,     setRecent]     = useState([]);
  const [tags,       setTags]       = useState([]);
  const [search,     setSearch]     = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    blogApi.getCategories().then(r => setCategories(r.data.data || []));
    blogApi.getRecent().then(r => setRecent(r.data.data || []));
    blogApi.getTags().then(r => setTags(r.data.data || []));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/blog?search=${encodeURIComponent(search)}`);
  };

  const box     = { background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', marginBottom: '24px' };
  const heading = { fontSize: '16px', fontWeight: 700, color: '#1a1a1a', marginBottom: '16px', paddingBottom: '10px', borderBottom: '2px solid #E8272A' };

  return (
    <aside>
      <div style={box}>
        <h4 style={heading}>Search</h4>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search blogs..."
            style={{ flex: 1, padding: '10px 14px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
          <button type="submit" style={{ background: '#E8272A', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 16px', cursor: 'pointer' }}>ðŸ”</button>
        </form>
      </div>

      <div style={box}>
        <h4 style={heading}>Categories</h4>
        {categories.map(cat => (
          <Link key={cat.id} to={`/blog/category/${cat.slug}`}
            style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f5f5f5', textDecoration: 'none', color: '#444', fontSize: '14px' }}>
            <span>ðŸ“ {cat.name}</span>
            <span style={{ background: '#f5f5f5', borderRadius: '12px', padding: '2px 10px', fontSize: '12px', color: '#888' }}>{cat.blogs_count || 0}</span>
          </Link>
        ))}
      </div>

      <div style={box}>
        <h4 style={heading}>Recent Posts</h4>
        {recent.map(post => (
          <Link key={post.id} to={`/blog/${post.slug}`}
            style={{ display: 'flex', gap: '12px', marginBottom: '14px', textDecoration: 'none' }}>
            <img src={post.thumbnail ? `${process.env.REACT_APP_API_URL}/storage/${post.thumbnail}` : 'https://via.placeholder.com/60x60'}
              alt={post.title} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />
            <div>
              <p style={{ color: '#1a1a1a', fontSize: '13px', fontWeight: 600, margin: '0 0 4px', lineHeight: 1.4 }}>{post.title}</p>
              <span style={{ color: '#999', fontSize: '12px' }}>{post.published_at ? new Date(post.published_at).toLocaleDateString() : ''}</span>
            </div>
          </Link>
        ))}
      </div>

      {tags.length > 0 && (
        <div style={box}>
          <h4 style={heading}>Tags</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {tags.map(tag => (
              <Link key={tag.id} to={`/blog/tag/${tag.slug}`}
                style={{ padding: '5px 14px', background: '#f5f5f5', borderRadius: '20px', fontSize: '13px', color: '#555', textDecoration: 'none' }}>
                #{tag.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
};

export default BlogSidebar;
