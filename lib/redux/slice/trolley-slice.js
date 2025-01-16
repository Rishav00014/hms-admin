import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const BACKEND_API_BASE_URL = process.env.BACKEND_API_BASE_URL;

export const createTrolley = createAsyncThunk(
  "admin/createTrolley",
  async ({ token, data, trolleyId = null }, { rejectWithValue }) => {
    if (!token) return rejectWithValue("No token found");
    const url = trolleyId
      ? `${BACKEND_API_BASE_URL}/api/super-admin/events/${trolleyId}`
      : `${BACKEND_API_BASE_URL}/api/super-admin/events`;
    const method = trolleyId ? "PUT" : "POST";
    try {
      const response = await axios({
        method,
        url,
        data,
        headers: { Authorization: `Bearer ${token}` },
      });
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.response.data?.message);
    }
  }
);

export const fetchTrolley = createAsyncThunk(
  "admin/fetchTrolley",
  async (
    {
      token,
      currentPage = 1,
      location = null,
      query = null,
      reciveDate = null,
    },
    { rejectWithValue }
  ) => {
    if (!token) return rejectWithValue("No token found");
    try {
      const response = await axios.get(
        `${BACKEND_API_BASE_URL}/api/super-admin/events`,
        {
          params: {
            limit: 8,
            page: currentPage,
            name: query || null
          },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.response.data?.message);
    }
  }
);

export const fetchServiceHistory = createAsyncThunk(
  "admin/fetchTrolleyHistory",
  async ({ token, trolleyId }, { rejectWithValue }) => {
    if (!token) return rejectWithValue("No token found");
    try {
      const response = await axios.get(
        `${BACKEND_API_BASE_URL}/api/super-admin/events/${trolleyId}/halls`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.response.data?.message);
    }
  }
);

export const deleteTrolley = createAsyncThunk(
  "admin/deleteTrolley",
  async ({ token, trolleyId = null }, { rejectWithValue }) => {
    if (!token) return rejectWithValue("No token found");
    try {
      const response = await axios({
        method: "DELETE",
        url: `${BACKEND_API_BASE_URL}/api/super-admin/events/${trolleyId}`,
        headers: { Authorization: `Bearer ${token}` },
      });
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.response.data?.message);
    }
  }
);

// Initial state
const initialState = {
  trolleyList: [],
  serviceHistory: [],
  pagination: {
    totalPages: 0,
    documentCount: 0,
  },
  loading: false,
  dataLoading: true,
  error: null,
};

// Auth slice
const trolleySlice = createSlice({
  name: "trolley",
  initialState,
  extraReducers: (builder) => {
    builder
      // get trolley
      .addCase(fetchTrolley.pending, (state) => {
        state.dataLoading = true;
        state.error = null;
      })
      .addCase(fetchTrolley.fulfilled, (state, action) => {
        const { data, count } = action.payload;
        state.dataLoading = false;
        state.trolleyList = data;
        state.pagination = {
          totalPages: Math.ceil(count / 8),
          documentCount: count,
        };
      })
      .addCase(fetchTrolley.rejected, (state, action) => {
        state.dataLoading = false;
        state.error = action.payload;
      })
      // get trolley service history
      .addCase(fetchServiceHistory.pending, (state) => {
        state.dataLoading = true;
        state.error = null;
      })
      .addCase(fetchServiceHistory.fulfilled, (state, action) => {
        const { data, count } = action.payload;
        state.dataLoading = false;
        state.serviceHistory = data;
      })
      .addCase(fetchServiceHistory.rejected, (state, action) => {
        state.dataLoading = false;
        state.error = action.payload;
      })

      // create trolley
      .addCase(createTrolley.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTrolley.fulfilled, (state, action) => {
        const { data, count } = action.payload;
        state.loading = false;
      })
      .addCase(createTrolley.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default trolleySlice.reducer;
