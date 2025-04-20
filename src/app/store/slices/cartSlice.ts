import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import {API_URL} from "@/app/config/generalConfig";

export const addToCart = createAsyncThunk(
    "cart/addToCart",
    async (productId: string, {rejectWithValue, getState}) => {
        try {
            const state = getState() as any;
            const token = state.auth.user?.token;
            if (!token) {
                throw new Error("No token found, user is not logged in.");
            }
            const response = await axios.post(
                `${API_URL}/cart`,
                {productId},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data || "Failed to add to cart");
        }
    }
);

export const removeFromCart = createAsyncThunk(
    "cart/removeFromCart",
    async (id: string, {rejectWithValue, getState}) => {
        try {
            const state = getState() as any;
            const token = state.auth.user?.token;
            if (!token) {
                throw new Error("No token found, user is not logged in.");
            }
            const response = await axios.delete(
                `${API_URL}/cart/removeItem/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data || "Failed to remove from cart");
        }
    }
);

export const getCartItems = createAsyncThunk(
    "cart/getCartItems",
    async (_, {rejectWithValue, getState}) => {
        try {
            const state = getState() as any;
            const token = state.auth.user?.token;
            if (!token) {
                throw new Error("No token found, user is not logged in.");
            }
            const response = await axios.get(
                `${API_URL}/cart`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data || "Failed to fetch cart items");
        }
    }
);

export const clearCart = createAsyncThunk(
    "cart/clearCart",
    async (_, {rejectWithValue, getState}) => {
        try {
            const state = getState() as any;
            const token = state.auth.user?.token;
            if (!token) {
                throw new Error("No token found, user is not logged in.");
            }
            const response = await axios.delete(
                `${API_URL}/cart/clearCart`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data || "Failed to clear cart");
        }
    }
);
const getTotalPrice = (cartItems: any[]) => {
    return cartItems.reduce((total, item) => {
        return total + (item.productDetails.price * item.quantity);
    }, 0);
}
const cartSlice = createSlice({
    name: "cart",
    initialState: {
        cartItems: [] as any[],
        loading: false,
        error: null as unknown | null,
        totalPrice: 0,
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(addToCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cartItems = action.payload.items;
                state.totalPrice = getTotalPrice(state.cartItems);
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as unknown;
            }).addCase(removeFromCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            }
            ).addCase(removeFromCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cartItems = state.cartItems.filter(item => item._id !== action.payload.id);
                state.totalPrice = getTotalPrice(state.cartItems);
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as unknown;
            })
            .addCase(getCartItems.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCartItems.fulfilled, (state, action) => {
                state.loading = false;
                state.cartItems = action.payload.items;
                state.totalPrice = getTotalPrice(state.cartItems);
            })
            .addCase(getCartItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as unknown;
            });
    },
});

export default cartSlice.reducer;