
import ProductImage from './productImage';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/app/store';
import { setSelectedProduct } from '@/app/store/slices/productSlice';
import { getCartItems } from '@/app/store/slices/cartSlice';
import { useEffect } from 'react';

interface Product {
    _id: string;
    name: string;
    price: string;
    brand: string;
    images?: string[];
}
interface ProductListProps {
    products: Product[];
}

const ProductList = ({ products }: ProductListProps) => {
    const router = useRouter();

    const dispatch = useDispatch<AppDispatch>();

    const goToDescription = (product: Product) => {
        dispatch(setSelectedProduct(product));
        router.push(`/product/${product._id}`);
    };
    const handleGetCartItems = async () => {
        try {
            await dispatch(getCartItems()).unwrap();
        } catch (error) {
            console.error("Error fetching cart items:", error);
        }
    }

    useEffect(() => {
        handleGetCartItems();
    }, [dispatch]);

    return (
        <div className="lg:col-span-3">
            <div className="bg-white">
                <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8 text-center">
                        {products.length === 0 && (
                                    <h1 className="mx-auto text-2xl font-bold text-gray-900">No Products Found</h1> )}
                    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                                {products.map((product) => (
                                    <a key={product._id} onClick={() => goToDescription(product)} className="group shadow rounded cursor-pointer">
                                        <ProductImage width={200} height={200} imageUrl={product.images?.[0] || ""} imageAlt={product.name || "no image available"} />
                                        <h3 className="text-left mt-4 h-5 text-sm text-gray-700 pl-[10px] pr-[10px] overflow-hidden overflow-ellipsis">{`${product.brand} - ${product.name}`}</h3>
                                        <p className="text-left mt-1 mb-1 text-lg font-medium text-gray-900 pl-[10px] pr-[10px]">{"$" + product.price}</p>
                                    </a>
                                ))}
                            </div>
                </div>
                </div>
            </div>
            );
}

            export default ProductList;