'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/app/store';
import { removeFromCart } from '@/app/store/slices/cartSlice';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

const CartListPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const cart = useSelector((state: RootState) => state.cart);
    const productToBuy = useSelector((state: RootState) => state.product.productToBuy);
    const productsToList = productToBuy.length > 0 ? productToBuy : cart.cartItems;
    const [eachItemQuantity, setEachItemQuantity] = useState<{ [key: string]: number }>({});

    const handleRemoveItem = (id: string) => {
        dispatch(removeFromCart(id));
    };

    const handleUpdateQuantity = (e: React.ChangeEvent<HTMLInputElement>, productId: string) => {
        let itemQuantity = { ...eachItemQuantity };
        itemQuantity[productId] = parseInt(e.target.value);
        setEachItemQuantity(itemQuantity);
    };

    const quantityToShow = (productId:string, currentQuantity:number) => {
        const quantity = eachItemQuantity[productId] ? eachItemQuantity[productId] : currentQuantity;
        return quantity;
    }

    const totalPrice = productsToList.reduce((total, item) => {
        return total + (item.productDetails.price * quantityToShow(item._id, item.quantity));
    }, 0);

    const handlePlaceOrder = () => {
        toast.success('Your order placed successfully!')
    };

    if(!cart.cartItems || cart.cartItems.length === 0 && !productToBuy.length) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900">Your Cart is Empty</h1>
                    <p className="mt-4 text-gray-600">Add some products to your cart to see them here.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row gap-8 p-8 mb-10">
            <div className="lg:w-2/3">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Your Cart</h1>
                        <div className="space-y-4">
                            {productsToList.map((item) => (
                                <div
                                    key={item.productDetails._id}
                                    className="flex items-center justify-between border-b border-b-gray-200 pb-4"
                                >
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">
                                            {item.productDetails.productName}
                                        </h2>
                                        <p className="text-sm text-gray-600">
                                            Price: ${item.productDetails.price.toFixed(2)}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Total: ${item.productDetails.price * quantityToShow(item._id, item.quantity)}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="number"
                                            min="1"
                                            value={quantityToShow(item._id, item.quantity)}
                                            onChange={(e) => handleUpdateQuantity(e, item._id)}
                                            className="w-16 border border-gray-300 rounded-lg text-center py-1"
                                        />
                                        {!productToBuy.length && <button
                                            onClick={() => handleRemoveItem(item._id)}
                                            className="text-red-600 hover:underline self-end"
                                        >
                                            Remove
                                        </button>}
                                    </div>
                                </div>
                            ))}
                        </div>
                </div>
                    <button
                        onClick={handlePlaceOrder}
                        className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
                    >
                        Place Order
                    </button>
            </div>

            <div className="lg:w-1/3">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
                    <p className="text-gray-700">
                        Total Items: <span className="font-semibold">{"2"}</span>
                    </p>
                    <p className="text-gray-700">
                        Total Price: <span className="font-semibold">{totalPrice}</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CartListPage;