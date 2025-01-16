import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const BACKEND_API_BASE_URL = process.env.BACKEND_API_BASE_URL;

export const raiseRequest = createAsyncThunk(
  "admin/raiseRequest",
  async ({ token, data, repairId = null }, { rejectWithValue }) => {
    if (!token) return rejectWithValue("No token found");
    const url = repairId
      ? `${BACKEND_API_BASE_URL}/api/super-admin/trollys/histories/${repairId}`
      : `${BACKEND_API_BASE_URL}/api/super-admin/trollys/histories`;
    const method = repairId ? "PUT" : "POST";
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

export const fetchRepairRequest = createAsyncThunk(
  "admin/fetchRepairRequest",
  async ({ token, currentPage = 1 }, { rejectWithValue }) => {
    if (!token) return rejectWithValue("No token found");
    try {
      const response = await axios.get(
        `${BACKEND_API_BASE_URL}/api/super-admin/trollys/histories`,
        {
          params: {
            page: currentPage,
            limit: 8,
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

export const deleteRequest = createAsyncThunk(
  "admin/deleteRequest",
  async ({ token, requestId = null }, { rejectWithValue }) => {
    if (!token) return rejectWithValue("No token found");
    try {
      const response = await axios({
        method: "DELETE",
        url: `${BACKEND_API_BASE_URL}/api/super-admin/trollys/histories/${requestId}`,
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
  requestList: [],
  loading: false,
  dataLoading: true,
  pagination: {
    totalPages: 0,
    documentCount: 0,
  },
  error: null,
};

// Auth slice
const repairSlice = createSlice({
  name: "repair",
  initialState,
  extraReducers: (builder) => {
    builder
      // get repair
      .addCase(fetchRepairRequest.pending, (state) => {
        state.dataLoading = true;
        state.error = null;
      })
      .addCase(fetchRepairRequest.fulfilled, (state, action) => {
        const { data, count } = action.payload;
        state.dataLoading = false;
        state.requestList = data;
        state.pagination = {
          totalPages: Math.ceil(count / 8),
          documentCount: count,
        };
      })
      .addCase(fetchRepairRequest.rejected, (state, action) => {
        state.dataLoading = false;
        state.error = action.payload;
      })

      // create repair
      .addCase(raiseRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(raiseRequest.fulfilled, (state, action) => {
        const { data, count } = action.payload;
        state.loading = false;
      })
      .addCase(raiseRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default repairSlice.reducer;
