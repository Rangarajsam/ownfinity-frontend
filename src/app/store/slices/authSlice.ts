import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "@/app/config/generalConfig";
import api from "@/app/utils/axios";
import { RootState } from "@/app/store";

const loadUserFromStorage = () => {
    if (typeof window !== "undefined") {
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    }
    return null;
};

export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (creadentials:{name:string, email:string, mobileNumber:number, password:string, isAdmin:boolean }, {rejectWithValue}) => {
        try {
            const response = await axios.post(`${API_URL}/signUp`, creadentials);
            return response.data;
        }
        catch (error:unknown) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data || "Failed to register");
            }
            return rejectWithValue("Failed to register");
        }
    }
);

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (creadentials:{email:string, password:string}, {rejectWithValue}) => {
        try {
            const response = await api.post(`${API_URL}/login`, creadentials);
            return response.data;
        }
        catch (error:unknown) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data || "Failed to login");
            }
            return rejectWithValue("Failed to login");
        }

    }
)

export const logoutUser = createAsyncThunk(
    "auth/logoutUser",
    async (_, {rejectWithValue, getState}) => {
        try {
            const state = getState() as RootState;
            const token = state.auth.user?.token;
            if (!token) {
                throw new Error("No token found, user is not logged in.");
            }
            const response = await axios.post(`${API_URL}/logout`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            return response.data;
        }
        catch (error:unknown) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data || "Failed to logout");
            }
            return rejectWithValue("Failed to logout");
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user:loadUserFromStorage(),
        loading:false,
        error: null as string | null
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(registerUser.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(registerUser.fulfilled, (state, action) => {
            const user = {...action.payload.user, token: action.payload.token};
            state.loading = false;
            state.user = user;
            localStorage.setItem("user", JSON.stringify(user));
        });
        builder.addCase(registerUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string | null;
        });
        builder.addCase(loginUser.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(loginUser.fulfilled, (state, action) => {
            const user = {...action.payload.user, token: action.payload.token};
            state.loading = false;
            state.user = user;
            localStorage.setItem("user", JSON.stringify(user));
        });
        builder.addCase(loginUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string | null;
        });
        builder.addCase(logoutUser.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(logoutUser.fulfilled, (state) => {
            state.loading = false;
            state.user = null;
            localStorage.removeItem("user");
        });
        builder.addCase(logoutUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string | null;
        });
    }
});

export default authSlice.reducer;