import apiClient from './apiClient';

const jobApi = {
  getAll:    (params = {}) => {
    const q = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
    ).toString();
    return apiClient.get(`/jobs${q ? `?${q}` : ''}`);
  },
  getFilters: ()              => apiClient.get('/jobs/filters'),
  getBySlug:  (slug)          => apiClient.get(`/jobs/${slug}`),
  apply:      (slug, formData) =>
    apiClient.post(`/jobs/${slug}/apply`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
};

export default jobApi;
