import React, { useState } from 'react';
import blogApi from '../../utils/blogApi';
import '../../index.css';

/* ── Single comment ── */
const CommentItem = ({ comment, onReply, depth = 0 }) => (
  <div style={{ marginBottom: '16px', paddingLeft: depth > 0 ? '20px' : '0', borderLeft: depth > 0 ? '2px solid #f0f0f0' : 'none' }}>
    <style>{`
      .ci-wrap { display:flex; gap:11px; }
      .ci-avatar {
        width:32px; height:32px;
        background:var(--r);
        color:#fff; display:flex; align-items:center; justify-content:center;
        font-weight:700; font-size:12px; flex-shrink:0;
      }
      .ci-body { flex:1; min-width:0; }
      .ci-header { display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:5px; }
      .ci-name { font-size:13px; font-weight:700; color:var(--d); }
      .ci-date { font-size:11px; color:#bbb; }
      .ci-text { font-size:13px; color:#555; line-height:1.65; margin:0 0 7px; }
      .ci-reply-btn {
        background:none; border:none; color:var(--r);
        font-size:11px; font-weight:700; cursor:pointer; padding:0;
        transition:opacity 0.18s; letter-spacing:0.02em;
      }
      .ci-reply-btn:hover { opacity:0.7; }
    `}</style>
    <div className="ci-wrap">
      <div className="ci-avatar">
        {((comment.user?.first_name || comment.author_name || 'A')[0]).toUpperCase()}
      </div>
      <div className="ci-body">
        <div className="ci-header">
          <strong className="ci-name">
            {comment.user
              ? `${comment.user.first_name} ${comment.user.last_name}`
              : comment.author_name}
          </strong>
          <span className="ci-date">
            {new Date(comment.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
        <p className="ci-text">{comment.content}</p>
        <button className="ci-reply-btn" onClick={() => onReply(comment.id)}>↩ Reply</button>
        {comment.replies?.map(r => (
          <CommentItem key={r.id} comment={r} onReply={onReply} depth={depth + 1} />
        ))}
      </div>
    </div>
  </div>
);

/* ── Comment section ── */
const CommentSection = ({ blog }) => {
  const [form, setForm] = useState({ content: '', author_name: '', author_email: '', parent_id: null });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  if (!blog?.allow_comments) return null;

  const validate = () => {
    const e = {};
    if (!form.author_name.trim())  e.author_name  = 'Name is required';
    if (!form.author_email.trim()) e.author_email = 'Email is required';
    if (!form.content.trim())      e.content      = 'Comment is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await blogApi.postComment(blog.id, form);
      setSubmitted(true);
      setForm({ content: '', author_name: '', author_email: '', parent_id: null });
    } catch {
      setErrors({ general: 'Failed to submit. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const comments = blog.comments || [];

  return (
    <>
      <style>{`
        .cs-wrap { margin-top: 40px; padding-top: 28px; border-top: 1px solid #f0f0f0; }

        .cs-heading {
          font-size: 14px; font-weight: 700; color: var(--d);
          margin-bottom: 20px; letter-spacing: 0.05em; text-transform: uppercase;
          display: flex; align-items: center; gap: 8px;
        }
        .cs-count {
          font-size: 11px; font-weight: 700; color: #bbb;
        }

        .cs-empty {
          padding: 32px 0; text-align: center;
          border: 1px dashed #e8e8e8;
          margin-bottom: 28px;
        }
        .cs-empty-text { color: #bbb; font-size: 13px; }

        /* form */
        .cs-form-wrap {
          background: #fafafa;
          border: 1px solid #f0f0f0;
          padding: 20px;
          margin-top: 28px;
        }
        .cs-form-title {
          font-size: 13px; font-weight: 700; color: var(--d);
          margin-bottom: 16px; text-transform: uppercase;
          letter-spacing: 0.06em;
          display: flex; align-items: center; gap: 8px;
        }
        .cs-form-reply-badge {
          font-size: 10px; font-weight: 700; color: var(--r);
          letter-spacing: 0.1em; text-transform: uppercase;
        }
        .cs-cancel-btn {
          background: none; border: none; color: #bbb;
          cursor: pointer; font-size: 11px; font-weight: 600; padding: 0;
          margin-left: 2px; transition: color 0.18s;
        }
        .cs-cancel-btn:hover { color: var(--r); }

        .cs-fields-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px; margin-bottom: 12px;
        }
        @media(min-width: 480px) { .cs-fields-grid { grid-template-columns: 1fr 1fr; } }

        .cs-field-group { display: flex; flex-direction: column; gap: 5px; }
        .cs-field-label {
          font-size: 10px; font-weight: 700; color: #aaa;
          letter-spacing: 0.1em; text-transform: uppercase;
        }
        .cs-input {
          padding: 9px 11px;
          border: 1px solid #e8e8e8; background: #fff;
          font-size: 13px; color: var(--d);
          outline: none; transition: border-color 0.18s;
          width: 100%; box-sizing: border-box;
          border-radius: 0; -webkit-appearance: none; appearance: none;
        }
        .cs-input:focus { border-color: var(--r); }
        .cs-input-error { border-color: #f87171 !important; }
        .cs-error-msg { font-size: 11px; color: #ef4444; }

        .cs-textarea {
          padding: 10px 11px;
          border: 1px solid #e8e8e8; background: #fff;
          font-size: 13px; color: var(--d);
          outline: none; resize: vertical; min-height: 100px;
          transition: border-color 0.18s;
          width: 100%; box-sizing: border-box; margin-bottom: 14px;
          border-radius: 0; -webkit-appearance: none; appearance: none;
          font-family: inherit;
        }
        .cs-textarea:focus { border-color: var(--r); }

        .cs-submit-btn {
          background: var(--r); color: #fff; border: none;
          padding: 10px 22px;
          font-size: 13px; font-weight: 700; cursor: pointer;
          transition: opacity 0.18s;
          display: inline-flex; align-items: center; gap: 6px;
          border-radius: 0; -webkit-appearance: none; appearance: none;
          letter-spacing: 0.02em;
        }
        .cs-submit-btn:hover:not(:disabled) { opacity: 0.85; }
        .cs-submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }

        .cs-success {
          padding: 24px; text-align: center;
          background: #f0fdf4; border: 1px solid #bbf7d0;
          color: #166534; font-size: 13px; font-weight: 600;
        }

        .cs-general-error {
          background: #fef2f2; border: 1px solid #fecaca;
          padding: 9px 12px;
          font-size: 12px; color: #dc2626; margin-bottom: 12px;
        }
      `}</style>

      <div className="cs-wrap">
        <h3 className="cs-heading">
          Comments
          <span className="cs-count">{comments.length}</span>
        </h3>

        {/* Comments list */}
        {comments.length === 0 ? (
          <div className="cs-empty">
            <p className="cs-empty-text">No comments yet. Be the first to comment.</p>
          </div>
        ) : (
          <div style={{ marginBottom: '8px' }}>
            {comments.map(c => (
              <CommentItem
                key={c.id}
                comment={c}
                onReply={(id) => setForm(f => ({ ...f, parent_id: id }))}
              />
            ))}
          </div>
        )}

        {/* Comment form */}
        <div className="cs-form-wrap">
          <div className="cs-form-title">
            {form.parent_id ? (
              <>
                ↩ Replying
                <span className="cs-form-reply-badge">Reply</span>
                <button
                  className="cs-cancel-btn"
                  onClick={() => setForm(f => ({ ...f, parent_id: null }))}
                >✕ Cancel</button>
              </>
            ) : 'Leave a Comment'}
          </div>

          {submitted ? (
            <div className="cs-success">
              Comment submitted for review. Thank you!
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              {errors.general && (
                <div className="cs-general-error">{errors.general}</div>
              )}

              <div className="cs-fields-grid">
                <div className="cs-field-group">
                  <label className="cs-field-label">Name *</label>
                  <input
                    className={`cs-input${errors.author_name ? ' cs-input-error' : ''}`}
                    placeholder="John Doe"
                    value={form.author_name}
                    onChange={e => setForm(f => ({ ...f, author_name: e.target.value }))}
                  />
                  {errors.author_name && <span className="cs-error-msg">{errors.author_name}</span>}
                </div>
                <div className="cs-field-group">
                  <label className="cs-field-label">Email *</label>
                  <input
                    type="email"
                    className={`cs-input${errors.author_email ? ' cs-input-error' : ''}`}
                    placeholder="john@example.com"
                    value={form.author_email}
                    onChange={e => setForm(f => ({ ...f, author_email: e.target.value }))}
                  />
                  {errors.author_email && <span className="cs-error-msg">{errors.author_email}</span>}
                </div>
              </div>

              <div className="cs-field-group" style={{ marginBottom: '14px' }}>
                <label className="cs-field-label">Comment *</label>
                <textarea
                  className={`cs-textarea${errors.content ? ' cs-input-error' : ''}`}
                  placeholder="Share your thoughts…"
                  value={form.content}
                  onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                />
                {errors.content && <span className="cs-error-msg">{errors.content}</span>}
              </div>

              <button type="submit" disabled={loading} className="cs-submit-btn">
                {loading ? '⏳ Submitting…' : 'Post Comment →'}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default CommentSection;