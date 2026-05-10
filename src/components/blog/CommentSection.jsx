import React, { useState } from 'react';
import blogApi from '../../utils/blogApi';

const CommentItem = ({ comment, onReply }) => (
  <div style={{ marginBottom: '20px', paddingLeft: comment.parent_id ? '32px' : '0' }}>
    <div style={{ display: 'flex', gap: '12px' }}>
      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#E8272A', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
        {(comment.user?.first_name || comment.author_name || 'A')[0].toUpperCase()}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '6px' }}>
          <strong style={{ fontSize: '14px' }}>{comment.user ? `${comment.user.first_name} ${comment.user.last_name}` : comment.author_name}</strong>
          <span style={{ fontSize: '12px', color: '#999' }}>{new Date(comment.created_at).toLocaleDateString()}</span>
        </div>
        <p style={{ margin: 0, color: '#555', fontSize: '14px', lineHeight: 1.6 }}>{comment.content}</p>
        <button onClick={() => onReply(comment.id)} style={{ background: 'none', border: 'none', color: '#E8272A', fontSize: '13px', cursor: 'pointer', marginTop: '6px', fontWeight: 600 }}>â†© Reply</button>
        {comment.replies?.map(r => <CommentItem key={r.id} comment={r} onReply={onReply} />)}
      </div>
    </div>
  </div>
);

const CommentSection = ({ blog }) => {
  const [form,      setForm]      = useState({ content: '', author_name: '', author_email: '', parent_id: null });
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await blogApi.postComment(blog.id, form);
      setSubmitted(true);
      setForm({ content: '', author_name: '', author_email: '', parent_id: null });
    } catch { alert('Failed to submit. Please try again.'); }
    finally  { setLoading(false); }
  };

  if (!blog.allow_comments) return null;
  const inp = { width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' };

  return (
    <div style={{ marginTop: '40px' }}>
      <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px' }}>ðŸ’¬ Comments ({blog.comments?.length || 0})</h3>
      {blog.comments?.map(c => <CommentItem key={c.id} comment={c} onReply={(id) => setForm(f => ({ ...f, parent_id: id }))} />)}
      <div style={{ background: '#f9f9f9', borderRadius: '12px', padding: '24px', marginTop: '32px' }}>
        <h4 style={{ marginBottom: '16px' }}>
          {form.parent_id ? 'â†© Replying' : 'Leave a Comment'}
          {form.parent_id && <button onClick={() => setForm(f => ({ ...f, parent_id: null }))} style={{ marginLeft: '12px', background: 'none', border: 'none', color: '#E8272A', cursor: 'pointer' }}>âœ• Cancel</button>}
        </h4>
        {submitted ? (
          <div style={{ textAlign: 'center', color: '#27ae60', padding: '20px' }}>âœ… Comment submitted for review. Thank you!</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <input placeholder="Your Name *" required value={form.author_name} onChange={e => setForm(f => ({ ...f, author_name: e.target.value }))} style={inp} />
              <input placeholder="Your Email *" type="email" required value={form.author_email} onChange={e => setForm(f => ({ ...f, author_email: e.target.value }))} style={inp} />
            </div>
            <textarea placeholder="Write your comment..." required rows={5} value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))} style={{ ...inp, resize: 'vertical', marginBottom: '16px', display: 'block' }} />
            <button type="submit" disabled={loading} style={{ background: '#E8272A', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px 28px', fontSize: '15px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Submitting...' : 'Post Comment'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
