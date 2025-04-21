import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import {API_URL} from "../../config/generalConfig";
import {RootState} from "@/app/store";

export const AddToWishList = createAsyncThunk(
    "wishlist/addToWishlist",
    async (productId: string, {rejectWithValue, getState}) => {
        try {
            const state = getState() as RootState;
            const token = state.auth.user?.token;
            if (!token) {
                throw new Error("No token found, user is not logged in.");
            }
            const response = await axios.post(
                `${API_URL}/wishlist/add`,
                {productId},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data || "Failed to add to wishlist");
            }
            return rejectWithValue("Failed to add to wishlist");
        }
    }
);

export const removeFromWishlist = createAsyncThunk(
    "wishlist/removeFromWishlist",
    async (id: string, {rejectWithValue, getState}) => {
        try {
            const state = getState() as RootState;
            const token = state.auth.user?.token;
            if (!token) {
                throw new Error("No token found, user is not logged in.");
            }
            const response = await axios.delete(
                `${API_URL}/wishlist/remove/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data || "Failed to remove from wishlist");
            }
            return rejectWithValue("Failed to remove from wishlist");
        }
    }
);

export const getWishlistItems = createAsyncThunk(
    "wishlist/getWishlistItems",
    async (_, {rejectWithValue, getState}) => {
        try {
            const state = getState() as RootState;
            const token = state.auth.user?.token;
            if (!token) {
                throw new Error("No token found, user is not logged in.");
            }
            const response = await axios.get(
                `${API_URL}/wishlist`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data || "Failed to fetch wishlist items");
            }
            return rejectWithValue("Failed to fetch wishlist items");
        }
    }
);

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState: {
        wishlistItems: [] as { product: { _id: string } }[],
        loading: false,
        error: null as unknown | null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(AddToWishList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(AddToWishList.fulfilled, (state, action) => {
                state.loading = false;
                state.wishlistItems = action.payload;
            })
            .addCase(AddToWishList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as unknown;
            })
            .addCase(removeFromWishlist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeFromWishlist.fulfilled, (state, action) => {
                state.loading = false;
                state.wishlistItems = state.wishlistItems.filter((item) => item.product._id !== action.payload.removedProductId);
            })
            .addCase(removeFromWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as unknown;
            })
            .addCase(getWishlistItems.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getWishlistItems.fulfilled, (state, action) => {
                state.loading = false;
                state.wishlistItems = action.payload.items;
            })
            .addCase(getWishlistItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as unknown;
            });
    },
});

export default wishlistSlice.reducer;