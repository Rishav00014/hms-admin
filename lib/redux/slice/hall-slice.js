import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const BACKEND_API_BASE_URL = process.env.BACKEND_API_BASE_URL;

export const createHall = createAsyncThunk(
  "admin/createHall",
  async ({ token, data, id = null }, { rejectWithValue }) => {
    if (!token) return rejectWithValue("No token found");
    const url = id
      ? `${BACKEND_API_BASE_URL}/api/super-admin/halls/${id}`
      : `${BACKEND_API_BASE_URL}/api/super-admin/halls`;
    const method = id ? "PUT" : "POST";
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

export const fetchHall = createAsyncThunk(
  "admin/fetchHall",
  async ({ token, currentPage = 1 }, { rejectWithValue }) => {
    if (!token) return rejectWithValue("No token found");
    try {
      const response = await axios.get(
        `${BACKEND_API_BASE_URL}/api/super-admin/halls`,
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
export const fetchSupervisor = createAsyncThunk(
  "admin/fetchSupervisor",
  async ({ token, currentPage = 1 }, { rejectWithValue }) => {
    if (!token) return rejectWithValue("No token found");
    try {
      const response = await axios.get(
        `${BACKEND_API_BASE_URL}/api/super-admin/users/role/Supervisor`,
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

export const deleteHall = createAsyncThunk(
  "admin/deleteHall",
  async ({ token, id = null }, { rejectWithValue }) => {
    if (!token) return rejectWithValue("No token found");
    try {
      const response = await axios({
        method: "DELETE",
        url: `${BACKEND_API_BASE_URL}/api/super-admin/halls/${id}`,
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
  supervisor: [],
  loading: false,
  dataLoading: true,
  pagination: {
    totalPages: 0,
    documentCount: 0,
  },
  error: null,
};

// Auth slice
const hallSlice = createSlice({
  name: "hall",
  initialState,
  extraReducers: (builder) => {
    builder
      // get repair
      .addCase(fetchHall.pending, (state) => {
        state.dataLoading = true;
        state.error = null;
      })
      .addCase(fetchHall.fulfilled, (state, action) => {
        const { data, count } = action.payload;
        state.dataLoading = false;
        state.requestList = data;
        state.pagination = {
          totalPages: Math.ceil(count / 8),
          documentCount: count,
        };
      })
      .addCase(fetchHall.rejected, (state, action) => {
        state.dataLoading = false;
        state.error = action.payload;
      })

      // create repair
      .addCase(createHall.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createHall.fulfilled, (state, action) => {
        const { data, message } = action.payload;
        state.loading = false;
      })
      .addCase(createHall.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetch supervisor
      .addCase(fetchSupervisor.pending, (state) => {
        state.dataLoading = true;
        state.error = null;
      })
      .addCase(fetchSupervisor.fulfilled, (state, action) => {
        console.log("===================")
        console.log(action.payload);
        console.log("===================")
        state.supervisor  = action.payload.data;
      })
      .addCase(fetchSupervisor.rejected, (state, action) => {
        state.dataLoading = false;
        state.error = action.payload;
      });
  },
});

export default hallSlice.reducer;
