import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import blogApi from '../../../utils/blogApi';

export const fetchBlogs      = createAsyncThunk('blog/fetchAll',       async (page) => (await blogApi.getAll(page)).data);
export const fetchBlogBySlug = createAsyncThunk('blog/fetchBySlug',    async (slug) => (await blogApi.getBySlug(slug)).data);
export const fetchCategories = createAsyncThunk('blog/fetchCategories', async ()     => (await blogApi.getCategories()).data);
export const fetchFeatured   = createAsyncThunk('blog/fetchFeatured',   async ()     => (await blogApi.getFeatured()).data);

const blogSlice = createSlice({
  name: 'blog',
  initialState: {
    list: [], single: null, categories: [], featured: [],
    pagination: null, loading: false, error: null
  },
  reducers: { clearSingle: (state) => { state.single = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending,       (s)    => { s.loading = true; })
      .addCase(fetchBlogs.fulfilled,     (s, a) => { s.loading = false; s.list = a.payload.data?.data || []; s.pagination = a.payload.data; })
      .addCase(fetchBlogs.rejected,      (s, a) => { s.loading = false; s.error = a.error.message; })
      .addCase(fetchBlogBySlug.pending,  (s)    => { s.loading = true; })
      .addCase(fetchBlogBySlug.fulfilled,(s, a) => { s.loading = false; s.single = a.payload.data; })
      .addCase(fetchCategories.fulfilled,(s, a) => { s.categories = a.payload.data || []; })
      .addCase(fetchFeatured.fulfilled,  (s, a) => { s.featured   = a.payload.data || []; });
  }
});

export const { clearSingle } = blogSlice.actions;
export default blogSlice.reducer;
