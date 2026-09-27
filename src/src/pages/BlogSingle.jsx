import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { trackPageViewWithEntity } from '../utils/trackVisit';
import { fetchBlogBySlug, clearSingle } from '../features/slices/blog';
import BlogSidebar from '../components/blog/BlogSidebar';
import CommentSection from '../components/blog/CommentSection';
import RelatedProperties from '../components/blog/RelatedProperties';
import SEO, { SITE } from '../components/SEO/SEO';
import '../index.css';

const thumb = (path) =>
  path ? `${(process.env.REACT_APP_API_LINK || '').replace(/\/api$/, '')}/storage/${path}` : null;

const fmt = (d) =>
  d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';

/* ─── Reading Progress Bar ── */
const ReadingProgress = () => {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const handler = () => {
      const el = document.documentElement;
      const total = el.scrollHeight - el.clientHeight;
      setPct(total > 0 ? (el.scrollTop / total) * 100 : 0);
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '2px', zIndex: 200, background: '#f0f0f0' }}>
      <div style={{ height: '100%', width: `${pct}%`, background: 'var(--r)', transition: 'width 0.1s linear' }} />
    </div>
  );
};

/* ─── Skeleton ── */
const Skeleton = () => (
  <div>
    <style>{`@keyframes sk-pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
    <div style={{ animation: 'sk-pulse 1.4s ease-in-out infinite' }}>
      <div style={{ height: '400px', background: '#f0f0f0', marginBottom: '32px' }} />
      {[55, 80, 100, 70, 100, 85, 60].map((w, i) => (
        <div key={i} style={{
          height: i < 2 ? '28px' : '13px',
          background: '#f0f0f0',
          width: `${w}%`,
          marginBottom: '12px',
        }} />
      ))}
    </div>
  </div>
);

/* ─── Share Button ── */
const ShareBtn = ({ platform, icon, label, url, title }) => {
  const [copied, setCopied] = useState(false);
  const links = {
    twitter:  `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  };
  const handleClick = () => {
    if (platform === 'copy') {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      });
    } else {
      window.open(links[platform], '_blank', 'noopener,width=580,height=400');
    }
  };
  return (
    <button onClick={handleClick} title={label} style={{
      width: '32px', height: '32px',
      border: '1px solid #e8e8e8', background: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', fontSize: '12px', fontWeight: 700,
      transition: 'all 0.18s', color: copied ? 'var(--r)' : '#555',
      flexShrink: 0,
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--r)'; e.currentTarget.style.color = 'var(--r)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8e8e8'; e.currentTarget.style.color = copied ? 'var(--r)' : '#555'; }}
    >
      {copied ? '✓' : icon}
    </button>
  );
};

/* ─── Main ── */
const BlogSingle = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { single: blog, loading } = useSelector((s) => s.blog);

  useEffect(() => {
    if (blog?.id) trackPageViewWithEntity(window.location.pathname, blog.id, blog.title);
  }, [blog?.id, blog?.title]);
  const [stickyShare, setStickyShare] = useState(false);
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  useEffect(() => {
    dispatch(fetchBlogBySlug(slug));
    window.scrollTo(0, 0);
    return () => dispatch(clearSingle());
  }, [slug, dispatch]);

  useEffect(() => {
    const handler = () => setStickyShare(window.scrollY > 320);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const imgSrc = thumb(blog?.thumbnail);

  const plainExcerpt = blog?.content
    ? String(blog.content).replace(/<[^>]*>/g, '').trim().slice(0, 160)
    : 'Read the latest Nepal real estate news, market trends and investment guidance from Sheetal Property Nepal.';

  const blogJsonLd = blog?.id
    ? {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: blog.title,
        description: plainExcerpt,
        image: imgSrc ? [imgSrc] : undefined,
        datePublished: blog.published_at,
        dateModified: blog.updated_at || blog.published_at,
        author: blog.author
          ? { '@type': 'Person', name: `${blog.author.first_name || ''} ${blog.author.last_name || ''}`.trim() }
          : { '@type': 'Organization', name: 'Sheetal Property Nepal' },
        publisher: {
          '@type': 'Organization',
          name: 'Sheetal Property Nepal',
          logo: { '@type': 'ImageObject', url: `${SITE}/shetallogo.png` },
        },
        mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE}/blog/${slug}` },
      }
    : null;

  return (
    <>
      {!loading && blog?.id && (
        <SEO
          title={blog.title}
          description={plainExcerpt}
          keywords={`${blog.title}, ${blog.category?.name || ''}, ${(blog.tags || []).map(t => t.name || t).join(', ')}, Nepal real estate blog, property news Nepal`}
          path={`/blog/${slug}`}
          image={imgSrc || undefined}
          type="article"
          jsonLd={blogJsonLd}
        />
      )}
    <>
      <style>{`
        .bs-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 80px 20px 80px;
        }

        .bs-breadcrumb {
          display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
          margin-bottom: 28px; font-size: 12px; color: #bbb;
        }
        .bs-bread-link { color: #bbb; text-decoration: none; transition: color 0.18s; }
        .bs-bread-link:hover { color: var(--r); }
        .bs-bread-current {
          color: #666; font-weight: 600;
          max-width: 220px; overflow: hidden;
          text-overflow: ellipsis; white-space: nowrap;
        }

        .bs-main-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
          align-items: start;
        }
        @media(min-width: 1024px) {
          .bs-main-grid { grid-template-columns: 1fr 300px; gap: 56px; }
        }

        /* category */
        .bs-cat-pill {
          display: inline-block;
          background: var(--r); color: #fff;
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          padding: 3px 10px; border-radius: 4px;
          text-decoration: none; margin-bottom: 14px;
          transition: opacity 0.2s;
        }
        .bs-cat-pill:hover { opacity: 0.85; }

        /* title */
        .bs-title {
          font-size: clamp(22px, 4vw, 38px);
          font-weight: 800; color: var(--d);
          line-height: 1.15; letter-spacing: -0.5px;
          margin-bottom: 20px;
        }

        /* meta */
        .bs-meta-row {
          display: flex; gap: 14px; align-items: center;
          flex-wrap: wrap; margin-bottom: 24px;
          padding-bottom: 20px; border-bottom: 1px solid #f0f0f0;
        }
        .bs-meta-author { display: flex; align-items: center; gap: 9px; }
        .bs-meta-avatar {
          width: 34px; height: 34px;
          background: var(--r); color: #fff;
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 12px; flex-shrink: 0;
        }
        .bs-meta-author-name { font-size: 13px; font-weight: 700; color: var(--d); line-height: 1.2; }
        .bs-meta-author-role { font-size: 11px; color: #bbb; }
        .bs-meta-divider { width: 1px; height: 24px; background: #ebebeb; flex-shrink: 0; }
        .bs-meta-item-label { font-size: 10px; color: #bbb; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 2px; }
        .bs-meta-item-val { font-size: 12px; font-weight: 600; color: var(--d); }
        .bs-share-inline { margin-left: auto; display: flex; gap: 6px; }
        @media(max-width: 640px) { .bs-share-inline { display: none; } }

        /* hero image */
        .bs-hero-img-wrap { overflow: hidden; margin-bottom: 32px; }
        .bs-hero-img { width: 100%; max-height: 480px; object-fit: cover; display: block; }

        /* body prose */
        .bs-body { font-size: 16px; line-height: 1.85; color: #333; }
        .bs-body h2 { font-size: 21px; font-weight: 700; color: var(--d); margin: 36px 0 12px; letter-spacing: -0.2px; }
        .bs-body h3 { font-size: 17px; font-weight: 700; color: var(--d); margin: 26px 0 10px; }
        .bs-body p  { margin-bottom: 20px; }
        .bs-body ul, .bs-body ol { padding-left: 22px; margin-bottom: 20px; }
        .bs-body li { margin-bottom: 8px; }
        .bs-body blockquote {
          border-left: 3px solid var(--r);
          margin: 28px 0; padding: 12px 20px;
          background: #fafafa;
          font-style: italic; color: #555;
        }
        .bs-body img { max-width: 100%; margin: 24px 0; display: block; }
        .bs-body a { color: var(--r); text-decoration: underline; }
        .bs-body pre { background: #111; color: #f8f8f8; padding: 18px; overflow-x: auto; font-size: 13px; margin: 24px 0; }
        .bs-body code { background: #f5f5f5; padding: 2px 6px; font-size: 13px; }
        .bs-body table { width:100%; border-collapse:collapse; margin:24px 0; font-size:14px; }
        .bs-body th { background:var(--d); color:#fff; padding:9px 13px; text-align:left; font-size:11px; letter-spacing:0.05em; }
        .bs-body td { padding:9px 13px; border-bottom:1px solid #f0f0f0; }

        /* tags */
        .bs-tags {
          margin-top: 36px; padding-top: 22px;
          border-top: 1px solid #f0f0f0;
          display: flex; gap: 7px; flex-wrap: wrap; align-items: center;
        }
        .bs-tags-label {
          font-size: 10px; font-weight: 700; letter-spacing: 0.12em;
          text-transform: uppercase; color: #bbb; margin-right: 4px;
        }
        .bs-tag {
          padding: 4px 12px; background: #f5f5f5;
          border-radius: 4px; font-size: 12px; color: #666;
          text-decoration: none; font-weight: 500;
          border: 1px solid transparent;
          transition: all 0.18s;
        }
        .bs-tag:hover { background: #fff; border-color: var(--r); color: var(--r); }

        /* author card */
        .bs-author-card {
          margin-top: 40px; padding: 20px;
          background: #fafafa; border: 1px solid #f0f0f0;
          display: flex; gap: 16px; align-items: flex-start;
        }
        .bs-author-card-avatar {
          width: 48px; height: 48px;
          background: var(--r); color: #fff;
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 16px; flex-shrink: 0;
        }
        .bs-author-card-label {
          font-size: 10px; font-weight: 700; letter-spacing: 0.12em;
          text-transform: uppercase; color: var(--r); margin-bottom: 3px;
        }
        .bs-author-card-name { font-size: 15px; font-weight: 700; color: var(--d); margin-bottom: 5px; }
        .bs-author-card-bio { font-size: 13px; color: #666; line-height: 1.65; }

        /* mobile share */
        .bs-mobile-share {
          display: flex; align-items: center; gap: 10px;
          margin: 18px 0;
          padding: 12px 14px;
          background: #fafafa; border: 1px solid #f0f0f0;
        }
        .bs-mobile-share-label { font-size: 11px; font-weight: 700; color: #999; flex-shrink: 0; text-transform: uppercase; letter-spacing: 0.08em; }
        .bs-mobile-share-btns { display: flex; gap: 7px; }
        @media(min-width: 641px) { .bs-mobile-share { display: none; } }

        /* sticky share */
        .bs-sticky-share {
          position: fixed; left: 20px; top: 50%;
          display: flex; flex-direction: column; gap: 8px;
          z-index: 100;
          transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.3s;
        }
        .bs-sticky-share-label {
          font-size: 9px; font-weight: 700; letter-spacing: 0.14em;
          text-transform: uppercase; color: #ccc;
          writing-mode: vertical-rl; margin: 0 auto 2px;
        }
        @media(max-width: 1100px) { .bs-sticky-share { display: none !important; } }
      `}</style>

      <ReadingProgress />

      <div className="bs-page">
        {/* Breadcrumb */}
        <nav className="bs-breadcrumb">
          <Link to="/" className="bs-bread-link">Home</Link>
          <span>›</span>
          <Link to="/blog" className="bs-bread-link">Blog</Link>
          {blog?.category && (
            <>
              <span>›</span>
              <Link to={`/blog/category/${blog.category.slug}`} className="bs-bread-link">
                {blog.category.name}
              </Link>
            </>
          )}
          {blog && (
            <>
              <span>›</span>
              <span className="bs-bread-current">{blog.title}</span>
            </>
          )}
        </nav>

        <div className="bs-main-grid">
          <article>
            {loading || !blog ? (
              <Skeleton />
            ) : (
              <>
                {blog.category && (
                  <Link to={`/blog/category/${blog.category.slug}`} className="bs-cat-pill">
                    {blog.category.name}
                  </Link>
                )}

                <h1 className="bs-title">{blog.title}</h1>

                {/* Meta */}
                <div className="bs-meta-row">
                  {blog.author && (
                    <div className="bs-meta-author">
                      <div className="bs-meta-avatar">
                        {blog.author.first_name?.[0]}{blog.author.last_name?.[0]}
                      </div>
                      <div>
                        <div className="bs-meta-author-name">
                          {blog.author.first_name} {blog.author.last_name}
                        </div>
                        <div className="bs-meta-author-role">Author</div>
                      </div>
                    </div>
                  )}
                  <div className="bs-meta-divider" />
                  <div>
                    <div className="bs-meta-item-label">Published</div>
                    <div className="bs-meta-item-val">{fmt(blog.published_at)}</div>
                  </div>
                  <div className="bs-meta-divider" />
                  <div>
                    <div className="bs-meta-item-label">Views</div>
                    <div className="bs-meta-item-val">{(blog.views || 0).toLocaleString()}</div>
                  </div>
                  <div className="bs-share-inline">
                    <ShareBtn platform="twitter"  icon="𝕏"  label="Share on X"        url={currentUrl} title={blog.title} />
                    <ShareBtn platform="facebook" icon="f"  label="Share on Facebook"  url={currentUrl} title={blog.title} />
                    <ShareBtn platform="linkedin" icon="in" label="Share on LinkedIn"  url={currentUrl} title={blog.title} />
                    <ShareBtn platform="copy"     icon="🔗" label="Copy link"          url={currentUrl} title={blog.title} />
                  </div>
                </div>

                {/* Mobile share */}
                <div className="bs-mobile-share">
                  <span className="bs-mobile-share-label">Share</span>
                  <div className="bs-mobile-share-btns">
                    <ShareBtn platform="twitter"  icon="𝕏"  label="Share on X"       url={currentUrl} title={blog.title} />
                    <ShareBtn platform="facebook" icon="f"  label="Share on Facebook" url={currentUrl} title={blog.title} />
                    <ShareBtn platform="linkedin" icon="in" label="Share on LinkedIn" url={currentUrl} title={blog.title} />
                    <ShareBtn platform="copy"     icon="🔗" label="Copy link"         url={currentUrl} title={blog.title} />
                  </div>
                </div>

                {/* Hero image */}
                {imgSrc && (
                  <div className="bs-hero-img-wrap">
                    <img src={imgSrc} alt={blog.title} className="bs-hero-img" />
                  </div>
                )}

                {/* Body */}
                <div className="bs-body" dangerouslySetInnerHTML={{ __html: blog.content }} />

                {/* Tags */}
                {blog.tags?.length > 0 && (
                  <div className="bs-tags">
                    <span className="bs-tags-label">Tags</span>
                    {blog.tags.map(tag => (
                      <Link key={tag.id} to={`/blog/tag/${tag.slug}`} className="bs-tag">
                        #{tag.name}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Author card */}
                {blog.author && (
                  <div className="bs-author-card">
                    <div className="bs-author-card-avatar">
                      {blog.author.first_name?.[0]}{blog.author.last_name?.[0]}
                    </div>
                    <div>
                      <p className="bs-author-card-label">About the author</p>
                      <p className="bs-author-card-name">
                        {blog.author.first_name} {blog.author.last_name}
                      </p>
                      {blog.author.bio && (
                        <p className="bs-author-card-bio">{blog.author.bio}</p>
                      )}
                    </div>
                  </div>
                )}

                <RelatedProperties properties={blog.related_properties} />
                <CommentSection blog={blog} />
              </>
            )}
          </article>

          <BlogSidebar currentSlug={slug} />
        </div>
      </div>

      {/* Sticky share */}
      {blog && (
        <div
          className="bs-sticky-share"
          style={{
            transform: `translateY(-50%) ${stickyShare ? 'translateX(0)' : 'translateX(-80px)'}`,
            opacity: stickyShare ? 1 : 0,
            pointerEvents: stickyShare ? 'all' : 'none',
          }}
        >
          <span className="bs-sticky-share-label">Share</span>
          <ShareBtn platform="twitter"  icon="𝕏"  label="Share on X"       url={currentUrl} title={blog.title} />
          <ShareBtn platform="facebook" icon="f"  label="Share on Facebook" url={currentUrl} title={blog.title} />
          <ShareBtn platform="linkedin" icon="in" label="Share on LinkedIn" url={currentUrl} title={blog.title} />
          <ShareBtn platform="copy"     icon="🔗" label="Copy link"         url={currentUrl} title={blog.title} />
        </div>
      )}
    </>
    </>
  );
};

export default BlogSingle;