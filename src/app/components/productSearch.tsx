import { useState } from "react"
import { useCombobox } from "downshift";
import { listAllProducts, setSelectedProduct } from "@/app/store/slices/productSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch } from "@/app/store";
interface Product {
    _id: string | undefined;
    description: string;
    name: string;
    price: string;
    brand: string;
    stock: number;
}

const ProductSearch = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    const handleGetProducts = async (query: string = "") => {
        try {
            if (query && query !== "" && query.length > 1) {
                let searchQuery = `?search=${query}`;
                let listofProducts = await dispatch(listAllProducts(searchQuery)).unwrap();
                setProducts(listofProducts.products);
            }

        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }

    const {
        isOpen,
        getToggleButtonProps,
        getMenuProps,
        getInputProps,
        highlightedIndex,
        getItemProps,
        selectedItem,
    } = useCombobox({
        items: products,
        onInputValueChange: ({ inputValue }) => handleGetProducts(inputValue),
        products,
        itemToString(product: Product) {
            return product ? product.name : ''
        },
    })


    return (
        <div className="w-full relative">
            <div className="flex flex-col gap-1">
                <div className="flex shadow-sm bg-white gap-0.5">
                    <input
                        placeholder="Search for a product"
                        className="w-full p-1.5"
                        {...getInputProps()}
                    />
                    <button
                        aria-label="toggle menu"
                        className="px-2"
                        type="button"
                        {...getToggleButtonProps()}
                    >
                        {isOpen ? <>&#8593;</> : <>&#8595;</>}
                    </button>
                </div>
            </div>
            <ul
                className={`absolute w-full bg-white mt-1 shadow-md max-h-80 overflow-auto z-10 rounded-b-lg ${!(isOpen && products?.length) && 'hidden'
                    }`}
                {...getMenuProps()}
            >
                {isOpen &&
                    products?.map((product, index) => (
                        <li
                            className={`
                                ${highlightedIndex === index && 'bg-black text-white'} 
                                ${selectedItem === product && 'font-bold'} 
                                py-2 px-3 shadow-sm flex flex-col cursor-pointer
                            `}
                            key={product._id}
                            {...getItemProps({ product, index, 
                                onClick:() => {
                                        setSelectedProduct(product);
                                        router.push(`/product/${product._id}`);
                                    }
                                }
                            )}
                            
                        >
                            <h2 className="text-lg">{product.name}</h2>
                            <p className="text-sm">{product.description}</p>
                        </li>
                    ))}
            </ul>
        </div>
    )
}

export default ProductSearch;