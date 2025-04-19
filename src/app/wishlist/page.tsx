'use client';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/app/store';
import { removeFromWishlist, getWishlistItems } from '@/app/store/slices/wishlistSlice';
import { setSelectedProduct } from '@/app/store/slices/productSlice';
import { useRouter } from 'next/navigation';
import ProductImage from '@/app/components/productImage';

interface WishlistItem {
    _id: string;
    product: {
        name: string;
        description: string;
        price: number;
        images?: string[];
        _id: string;
    };
}

const WishlistPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const wishlist = useSelector((state: RootState) => state.wishlist.wishlistItems) as WishlistItem[];
    const router = useRouter();

    const handleRemoveFromWishlist = async(e: React.MouseEvent<HTMLButtonElement>, id: string) => {
            e.preventDefault();
            try {
                await dispatch(removeFromWishlist(id)).unwrap();
            }
            catch (error) {
                console.error("Error removing from wishlist:", error);
            }
        };

    const handleGetWishlistItems = async () => {
        try {
            await dispatch(getWishlistItems()).unwrap();
        } catch (error) {
            console.error("Error fetching wishlist items:", error);
        }
    }
    const handleGoToDescription = (product: WishlistItem) => {
        dispatch(setSelectedProduct(product.product));
        router.push(`/product/${product.product._id}`);
    };

    useEffect(() => {
        handleGetWishlistItems();
    }, [dispatch]);

    if (wishlist.length === 0) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900">Your Wishlist is Empty</h1>
                    <p className="mt-4 text-gray-600">Add some products to your wishlist to see them here.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Wishlist</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {wishlist.length && wishlist.map((item) => (
                    <div key={item._id} className="bg-white p-4 mb-10 rounded-lg shadow cursor-pointer" onClick={() => handleGoToDescription(item)}>
                        <ProductImage width={300} height={300} imageUrl={item.product.images?.[0] || ""} imageAlt={item.product.name || "no image available"} />
                        <div className="max-w-[300px] mx-auto">
                            <h2 className="mt-4 text-lg font-semibold text-gray-900">{item.product.name}</h2>
                            <p className="mt-2 text-gray-700">{item.product.description}</p>
                            <p className="mt-2 text-lg font-bold text-gray-900">${item.product.price.toFixed(2)}</p>
                            <button
                                onClick={(e) => handleRemoveFromWishlist(e, item.product._id)}
                                className="mt-4 w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
                            >
                                Remove from Wishlist
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WishlistPage;