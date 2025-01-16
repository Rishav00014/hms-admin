import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const BACKEND_API_BASE_URL = process.env.BACKEND_API_BASE_URL;

export const createUser = createAsyncThunk(
  "admin/createUser",
  async ({ token, data, userId = null }, { rejectWithValue }) => {
    if (!token) return rejectWithValue("No token found");
    const url = userId
      ? `${BACKEND_API_BASE_URL}/api/super-admin/users/${userId}`
      : `${BACKEND_API_BASE_URL}/api/super-admin/users`;
    const method = userId ? "PUT" : "POST";
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

export const fetchUser = createAsyncThunk(
  "admin/fetchUser",
  async ({ token }, { rejectWithValue }) => {
    if (!token) return rejectWithValue("No token found");
    try {
      const response = await axios.get(
        `${BACKEND_API_BASE_URL}/api/super-admin/users`,
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

// Initial state
const initialState = {
  userList: [],
  loading: false,
  dataLoading: true,
  error: null,
};

// Auth slice
const userSlice = createSlice({
  name: "user",
  initialState,
  extraReducers: (builder) => {
    builder
      // get user
      .addCase(fetchUser.pending, (state) => {
        state.dataLoading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        const { data, count } = action.payload;
        state.dataLoading = false;
        state.userList = data;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.dataLoading = false;
        state.error = action.payload;
      })

      // create user
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        const { data, count } = action.payload;
        state.loading = false;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
