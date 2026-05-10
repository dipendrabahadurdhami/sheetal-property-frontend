import React from 'react';
import { Link } from 'react-router-dom';

const BlogCard = ({ blog, featured = false }) => {
  const thumb = blog.thumbnail
    ? `${process.env.REACT_APP_API_URL}/storage/${blog.thumbnail}`
    : 'https://via.placeholder.com/600x400?text=No+Image';

  return (
    <div style={{
      background: '#fff', borderRadius: '12px', overflow: 'hidden',
      boxShadow: '0 2px 16px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column'
    }}>
      <div style={{ position: 'relative', overflow: 'hidden', height: featured ? '260px' : '200px' }}>
        <img src={thumb} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        {blog.category && (
          <Link to={`/blog/category/${blog.category.slug}`}
            style={{ position: 'absolute', top: '12px', left: '12px', background: '#E8272A', color: '#fff',
              padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}>
            {blog.category.name}
          </Link>
        )}
      </div>
      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: '13px', color: '#888', marginBottom: '8px', display: 'flex', gap: '16px' }}>
          <span>ðŸ“… {blog.published_at ? new Date(blog.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Draft'}</span>
          <span>ðŸ‘ï¸ {blog.views || 0} views</span>
        </div>
        <Link to={`/blog/${blog.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3 style={{ fontSize: featured ? '20px' : '17px', fontWeight: 700, margin: '0 0 10px', color: '#1a1a1a', lineHeight: 1.4,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {blog.title}
          </h3>
        </Link>
        {blog.excerpt && (
          <p style={{ color: '#666', fontSize: '14px', lineHeight: 1.6, margin: '0 0 16px',
            display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {blog.excerpt}
          </p>
        )}
        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {blog.author && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#E8272A',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: 700 }}>
                {blog.author.first_name?.[0] || 'A'}
              </div>
              <span style={{ fontSize: '13px', color: '#555', fontWeight: 500 }}>
                {blog.author.first_name} {blog.author.last_name}
              </span>
            </div>
          )}
          <Link to={`/blog/${blog.slug}`} style={{ color: '#E8272A', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
            Read more â†’
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
