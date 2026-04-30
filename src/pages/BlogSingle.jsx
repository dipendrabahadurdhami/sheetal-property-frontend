import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogBySlug, clearSingle } from '../features/slices/blog';
import BlogSidebar from '../components/blog/BlogSidebar';
import CommentSection from '../components/blog/CommentSection';
import RelatedProperties from '../components/blog/RelatedProperties';

const BlogSingle = () => {
  const { slug }   = useParams();
  const dispatch   = useDispatch();
  const { single: blog, loading } = useSelector(s => s.blog);

  useEffect(() => {
    dispatch(fetchBlogBySlug(slug));
    window.scrollTo(0, 0);
    return () => dispatch(clearSingle());
  }, [slug, dispatch]);

  if (loading) return <div style={{ textAlign: 'center', padding: '100px', color: '#888' }}>Loading...</div>;
  if (!blog)   return <div style={{ textAlign: 'center', padding: '100px', color: '#888' }}>Post not found.</div>;

  const thumb = blog.thumbnail ? `${process.env.REACT_APP_API_URL}/storage/${blog.thumbnail}` : null;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ marginBottom: '24px', fontSize: '14px', color: '#888' }}>
        <Link to="/" style={{ color: '#888', textDecoration: 'none' }}>Home</Link> {' / '}
        <Link to="/blog" style={{ color: '#888', textDecoration: 'none' }}>Blog</Link> {' / '}
        <span style={{ color: '#1a1a1a' }}>{blog.title}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '40px', alignItems: 'start' }}>
        <article>
          {blog.category && (
            <Link to={`/blog/category/${blog.category.slug}`}
              style={{ display: 'inline-block', background: '#E8272A', color: '#fff', padding: '4px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, textDecoration: 'none', marginBottom: '16px' }}>
              {blog.category.name}
            </Link>
          )}
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#1a1a1a', lineHeight: 1.3, marginBottom: '16px' }}>{blog.title}</h1>
          <div style={{ display: 'flex', gap: '20px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
            {blog.author && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#E8272A', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                  {blog.author.first_name?.[0]}
                </div>
                <span style={{ fontSize: '14px', color: '#555' }}>{blog.author.first_name} {blog.author.last_name}</span>
              </div>
            )}
            <span style={{ color: '#999', fontSize: '14px' }}>ðŸ“… {blog.published_at ? new Date(blog.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</span>
            <span style={{ color: '#999', fontSize: '14px' }}>ðŸ‘ï¸ {blog.views} views</span>
          </div>
          {thumb && <img src={thumb} alt={blog.title} style={{ width: '100%', borderRadius: '12px', marginBottom: '32px', maxHeight: '460px', objectFit: 'cover' }} />}
          <div dangerouslySetInnerHTML={{ __html: blog.content }} style={{ fontSize: '16px', lineHeight: 1.8, color: '#333' }} />
          {blog.tags?.length > 0 && (
            <div style={{ marginTop: '32px', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, color: '#555' }}>Tags:</span>
              {blog.tags.map(tag => (
                <Link key={tag.id} to={`/blog/tag/${tag.slug}`}
                  style={{ padding: '4px 14px', background: '#f5f5f5', borderRadius: '20px', fontSize: '13px', color: '#555', textDecoration: 'none' }}>
                  #{tag.name}
                </Link>
              ))}
            </div>
          )}
          <RelatedProperties properties={blog.related_properties} />
          <CommentSection blog={blog} />
        </article>
        <BlogSidebar currentSlug={slug} />
      </div>
    </div>
  );
};

export default BlogSingle;
