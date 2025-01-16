import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const BACKEND_API_BASE_URL = process.env.BACKEND_API_BASE_URL;

export const createService = createAsyncThunk(
    "admin/createService",
    async ({ token, data, serviceId = null }, { rejectWithValue }) => {
        if (!token) return rejectWithValue("No token found");
        const url = serviceId
            ? `${BACKEND_API_BASE_URL}/api/super-admin/designations/${serviceId}`
            : `${BACKEND_API_BASE_URL}/api/super-admin/designations`;
        const method = serviceId ? "PUT" : "POST";
        try {
            const response = await axios({
                method,
                url,
                data,
                headers: { Authorization: `Bearer ${token}` },
            });
            return response?.data;
        } catch (error) {
            console.log("error", error);
            return rejectWithValue(error.response.data?.message);
        }
    }
);

export const fetchService = createAsyncThunk(
    "admin/fetchService",
    async (
        {
            token,
            currentPage = 1,
            query = null
        },
        { rejectWithValue }
    ) => {
        if (!token) return rejectWithValue("No token found");
        try {
            const response = await axios.get(
                `${BACKEND_API_BASE_URL}/api/super-admin/designations`,
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


export const deleteService = createAsyncThunk(
    "admin/deleteService",
    async ({ token, serviceId = null }, { rejectWithValue }) => {
        if (!token) return rejectWithValue("No token found");
        try {
            const response = await axios({
                method: "DELETE",
                url: `${BACKEND_API_BASE_URL}/api/super-admin/designations/${serviceId}`,
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
    serviceList: [],
    pagination: {
        totalPages: 0,
        documentCount: 0,
    },
    loading: false,
    dataLoading: true,
    error: null,
};

// Auth slice
const serviceSlice = createSlice({
    name: "service",
    initialState,
    extraReducers: (builder) => {
        builder
            // get Service
            .addCase(fetchService.pending, (state) => {
                state.dataLoading = true;
                state.error = null;
            })
            .addCase(fetchService.fulfilled, (state, action) => {
                const { data, count } = action.payload;
                state.dataLoading = false;
                state.serviceList = data;
                state.pagination = {
                    totalPages: Math.ceil(count / 8),
                    documentCount: count,
                };
            })
            .addCase(fetchService.rejected, (state, action) => {
                state.dataLoading = false;
                state.error = action.payload;
            })

            // create Service
            .addCase(createService.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createService.fulfilled, (state, action) => {
                const { data, count } = action.payload;
                state.loading = false;
            })
            .addCase(createService.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default serviceSlice.reducer;
