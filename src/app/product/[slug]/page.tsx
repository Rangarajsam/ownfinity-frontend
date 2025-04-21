'use client';

import { useState, useEffect } from 'react';
import { ShoppingCartIcon, HeartIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '@/app/store';
import { addToCart } from '@/app/store/slices/cartSlice';
import { setBuyProduct, getProductById } from '@/app/store/slices/productSlice';
import { AddToWishList } from '@/app/store/slices/wishlistSlice';
import ProductImage from '@/app/components/productImage';
import { useRouter, useParams } from 'next/navigation';

interface Product {
    _id: string;
    name: string;
    price: string;
    brand: string;
    stock: number;
}

const ProductDescription = () => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState<Product | null>(null);
    const {slug} = useParams();

    const handleAddToCart = async () => {
        try {
            await dispatch(addToCart(product._id)).unwrap();
            
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };
    const handleGetProduct = async () => {
        try {
            const productToView = await dispatch(getProductById(slug)).unwrap();
            setProduct(productToView?.[0]);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }

    const handleBuyNow = (product:Product) => {
        const productToBuy = {
            productDetails: {
                productName: product.name,
                availableItems: product.stock,
                price: product.price,
            },
            productId: product._id,
            quantity: quantity
        };
        dispatch(setBuyProduct([productToBuy]));
        router.push(`/cart`);
    };

    const handleAddToWishlist = async() => {
        try{
            await dispatch(AddToWishList(product._id)).unwrap();
        }
        catch(error) {
            console.error("Error adding to wishlist:", error);
        }
    };

    useEffect(() => {
        handleGetProduct();
    }, [dispatch]);

    return (
        <>
        {!product && <div className="flex items-center justify-center h-screen"> Product not found</div>}
       {product && <div className="flex flex-col lg:flex-row gap-8 p-8 bg-white">
            <div className="lg:w-1/3">
                <div className="bg-white">
                    <ProductImage width={400} height={400} imageUrl={product.images?.[0] || ""} imageAlt={product.name || "no image available"} />
                </div>
                <div className="mx-auto w-full mt-4 flex-col flex gap-4">
                    <button
                        onClick={handleAddToWishlist}
                        className="mt-6 mx-auto flex w-[400px] items-center justify-center bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300"
                    >
                        <HeartIcon className="w-5 h-5 mr-2" />
                        Add to Wishlist
                    </button>
                    <button
                        onClick={handleAddToCart}
                        className="flex mx-auto w-[400px] items-center justify-center bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
                    >
                        <ShoppingCartIcon className="w-5 h-5 mr-2" />
                        Add to Cart
                    </button>
                </div>
            </div>

            <div className="lg:w-2/3">
                <div className="bg-white p-6 rounded-lg shadow min-h-[400px]">
                    <h1 className="text-2xl font-bold text-gray-900">{`${product.brand} - ${product.name}`}</h1>
                    <p className="mt-2 text-gray-700">{product.description}</p>
                    <p className="mt-4 text-lg font-semibold text-gray-900">Price: ${product.price}</p>
                    <p className={`mt-2 text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                    </p>

                    <div className="mt-4 flex items-center gap-4">
                        <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                            Quantity:
                        </label>
                        <input
                            id="quantity"
                            type="number"
                            min="1"
                            max={product.stock}
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            className="w-16 border border-gray-300 rounded-lg text-center py-1"
                        />
                    </div>

                    <button
                        onClick={() => handleBuyNow(product)}
                        className="flex mt-20 items-center justify-center w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
                    >
                        <CreditCardIcon className="w-5 h-5 mr-2" />
                        Buy Now
                    </button>
                   
                </div>
            </div>
        </div>} 
        </>
    );
};

export default ProductDescription;