'use client'

import {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
} from '@headlessui/react'
import { useState } from 'react'
import { ChevronDownIcon, FunnelIcon } from '@heroicons/react/20/solid'
import ProductList from '@/app/components/productList'
import SideFilter from '@/app/components/sideFilter'
import MobileFilter from '@/app/components/mobileFilter'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/store';
import { listAllProducts } from '@/app/store/slices/productSlice';
import { setProductSearchQuery } from '@/app/store/slices/productSlice'
import { getUpdatedSortByValue, getAvailableFilterCategories } from '@/app/product/utils/productUtils';

const sortOptions = [
    { name: 'Newest', href: '#', current: false },
    { name: 'Oldest', href: '#', current: false },
    { name: 'Price: Low to High', href: '#', current: false },
    { name: 'Price: High to Low', href: '#', current: false },
]

function classNames(...classes: (string | boolean | undefined | null)[]) : string {
    return classes.filter(Boolean).join(' ')
}

export default function List() {
    const dispatch = useDispatch<AppDispatch>();
    const products = useSelector((state: RootState) => state.product.products);
    const productSearchQuery = useSelector((state: RootState) => state.product.productSearchQuery);
    const [filters, setFilters] = useState<{ id: string; name: string; options: { value: string; label: string; checked: boolean; }[]; }[]>([]);

    const handleGetProducts = async (query?:string) => {
        try {
            await dispatch(listAllProducts(query)).unwrap();

        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }

    const sortProducts = (option: string) => {
        let query = productSearchQuery;
        const connector = productSearchQuery.includes('?') ? '&' : '?';
        switch (option) {
            case 'Newest':
                query = getUpdatedSortByValue(query, "createdAt:desc", `${productSearchQuery}${connector}sortBy=createdAt:desc`);
                handleGetProducts(query);
                dispatch(setProductSearchQuery(query));
                break;
            case 'Oldest':
                query = getUpdatedSortByValue(query, "createdAt:asc",`${productSearchQuery}${connector}sortBy=createdAt:asc`);
                handleGetProducts(query);
                dispatch(setProductSearchQuery(query));
                break;
            case 'Price: Low to High':
                query = getUpdatedSortByValue(query, "price:asc",`${productSearchQuery}${connector}sortBy=price:asc`);
                handleGetProducts(query);
                dispatch(setProductSearchQuery(query));
                break;
            case 'Price: High to Low':
                query = getUpdatedSortByValue(query, "price:desc", `${productSearchQuery}${connector}sortBy=price:desc`);
                handleGetProducts(query);
                dispatch(setProductSearchQuery(query));
                break;
            default:
                break;
        }
    }

    useEffect(() => {
        setFilters(getAvailableFilterCategories())
        handleGetProducts();
    }, [dispatch]);

    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    return (
        <div className="bg-white">
            <div>
                <MobileFilter mobileFiltersOpen={mobileFiltersOpen} setMobileFiltersOpen={setMobileFiltersOpen} filters={filters} setFilters={setFilters}/>
                <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-baseline justify-between border-b border-gray-200 pt-10 pb-6">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900">New Arrivals</h1>

                        <div className="flex items-center">
                            <Menu as="div" className="relative inline-block text-left">
                                <div>
                                    <MenuButton className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                                        Sort
                                        <ChevronDownIcon
                                            aria-hidden="true"
                                            className="-mr-1 ml-1 size-5 shrink-0 text-gray-400 group-hover:text-gray-500"
                                        />
                                    </MenuButton>
                                </div>

                                <MenuItems
                                    transition
                                    className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white ring-1 shadow-2xl ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                                >
                                    <div className="py-1">
                                        {sortOptions.map((option) => (
                                            <MenuItem key={option.name}>
                                                <a
                                                    href={option.href}
                                                    className={classNames(
                                                        option.current ? 'font-medium text-gray-900' : 'text-gray-500',
                                                        'block px-4 py-2 text-sm data-focus:bg-gray-100 data-focus:outline-hidden',
                                                    )}
                                                    onClick={() => sortProducts(option.name)}
                                                >
                                                    {option.name}
                                                </a>
                                            </MenuItem>
                                        ))}
                                    </div>
                                </MenuItems>
                            </Menu>
                            <button
                                type="button"
                                onClick={() => setMobileFiltersOpen(true)}
                                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                            >
                                <span className="sr-only">Filters</span>
                                <FunnelIcon aria-hidden="true" className="size-5" />
                            </button>
                        </div>
                    </div>

                    <section aria-labelledby="products-heading" className="pt-6 pb-24">
                        <h2 id="products-heading" className="sr-only">
                            Products
                        </h2>

                        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
                            <SideFilter filters={filters} setFilters={setFilters}/>
                            {Array.isArray(products) &&<ProductList products={products}/>}
                        </div>
                    </section>
                </main>
            </div>
        </div>
    )
}

