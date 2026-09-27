import apiClient from './apiClient';

const blogApi = {
  getAll:        (page = 1, perPage = 10) => apiClient.get(`/blog?page=${page}&per_page=${perPage}`),
  getBySlug:     (slug)                   => apiClient.get(`/blog/${slug}`),
  getByCategory: (slug, page = 1)         => apiClient.get(`/blog/category/${slug}?page=${page}`),
  getByTag:      (slug, page = 1)         => apiClient.get(`/blog/tag/${slug}?page=${page}`),
  search:        (q, page = 1)            => apiClient.get(`/blog/search?q=${q}&page=${page}`),
  getCategories: ()                       => apiClient.get('/blog/categories'),
  getTags:       ()                       => apiClient.get('/blog/tags'),
  getFeatured:   ()                       => apiClient.get('/blog/featured'),
  getRecent:     ()                       => apiClient.get('/blog/recent'),
  postComment:   (blogId, data)           => apiClient.post(`/blog/${blogId}/comment`, data),

  admin: {
    getAll:             (page = 1) => apiClient.get(`/admin/blog?page=${page}`),
    getStats:           ()         => apiClient.get('/admin/blog/stats'),
    getOne:             (id)       => apiClient.get(`/admin/blog/${id}`),
    create:             (data)     => apiClient.post('/admin/blog', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    update:             (id, data) => apiClient.post(`/admin/blog/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    delete:             (id)       => apiClient.delete(`/admin/blog/${id}`),
    getCategories:      ()         => apiClient.get('/admin/blog/categories'),
    createCategory:     (data)     => apiClient.post('/admin/blog/categories', data),
    updateCategory:     (id, data) => apiClient.post(`/admin/blog/categories/${id}`, data),
    deleteCategory:     (id)       => apiClient.delete(`/admin/blog/categories/${id}`),
    getPendingComments: ()         => apiClient.get('/admin/blog/comments/pending'),
    getAllComments:      ()         => apiClient.get('/admin/blog/comments/all'),
    approveComment:     (id)       => apiClient.post(`/admin/blog/comments/${id}/approve`),
    rejectComment:      (id)       => apiClient.post(`/admin/blog/comments/${id}/reject`),
    deleteComment:      (id)       => apiClient.delete(`/admin/blog/comments/${id}`),
  }
};

export default blogApi;
