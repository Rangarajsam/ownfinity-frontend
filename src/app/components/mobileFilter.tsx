
import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    Disclosure, DisclosureButton, DisclosurePanel
} from '@headlessui/react'
import { XMarkIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useState, Dispatch, SetStateAction } from 'react';
import { setProductSearchQuery } from '@/app/store/slices/productSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/app/store';
import { getStringQuery, handleGetProducts } from '@/app/product/utils/productUtils';
interface FilterOption {
    value: string;
    label: string;
    checked: boolean;
}

interface FilterSection {
    id: string;
    name: string;
    options: FilterOption[];
}

interface MobileFilterProps {
    mobileFiltersOpen: boolean;
    setMobileFiltersOpen: (open: boolean) => void;
    filters: FilterSection[];
    setFilters: Dispatch<SetStateAction<FilterSection[]>>;
}

const MobileFilter = ({ mobileFiltersOpen, setMobileFiltersOpen, filters, setFilters }: MobileFilterProps) => {
    const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
    const dispatch = useDispatch<AppDispatch>();
    const productSearchQuery = useSelector((state: any) => state.product.productSearchQuery);

    const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>, currentFilter:string[], currentQuery: string) => {
        const query = getStringQuery(e, currentFilter, currentQuery);
        dispatch(setProductSearchQuery(query));
        let newFilters = [{id: filters[0].id, name: filters[0].name, options: [...filters[0].options]}];
        newFilters[0].options.forEach((op) => {
            if(op.value === e.target.name.split('-')[1]) {
                op.checked = e.target.checked;
            }
        });
        setFilters(newFilters);
        handleGetProducts(dispatch, query);
    }

    return (
        <Dialog open={mobileFiltersOpen} onClose={setMobileFiltersOpen} className="relative z-40 lg:hidden">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-closed:opacity-0"
            />

            <div className="fixed inset-0 z-40 flex">
                <DialogPanel
                    transition
                    className="relative ml-auto flex size-full max-w-xs transform flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl transition duration-300 ease-in-out data-closed:translate-x-full"
                >
                    <div className="flex items-center justify-between px-4">
                        <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                        <button
                            type="button"
                            onClick={() => setMobileFiltersOpen(false)}
                            className="-mr-2 flex size-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                        >
                            <span className="sr-only">Close menu</span>
                            <XMarkIcon aria-hidden="true" className="size-6" />
                        </button>
                    </div>

                    {/* Filters */}
                    <form className="mt-4 border-t border-gray-200 p-5">
                        {Array.isArray(filters) && filters.map((section) => (
                            <Disclosure key={section.id} as="div" defaultOpen={true} className="border-b border-gray-200 py-6">
                                <h3 className="-my-3 flow-root">
                                    <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                                        <span className="font-medium text-gray-900">{section.name}</span>
                                        <span className="ml-6 flex items-center">
                                            <PlusIcon aria-hidden="true" className="size-5 group-data-open:hidden" />
                                            <MinusIcon aria-hidden="true" className="size-5 group-not-data-open:hidden" />
                                        </span>
                                    </DisclosureButton>
                                </h3>
                                <DisclosurePanel className="pt-6">
                                    <div className="space-y-4">
                                        {Array.isArray(section.options) && section.options.map((option, optionIdx) => (
                                            <div key={option.value} className="flex gap-3">
                                                <div className="flex h-5 shrink-0 items-center">
                                                    <div className="group grid size-4 grid-cols-1">
                                                        <input
                                                            defaultValue={option.value}
                                                            defaultChecked={option.checked}
                                                            id={`filter-${section.id}-${optionIdx}`}
                                                            name={`${section.id}-${option.value}`}
                                                            type="checkbox"
                                                            onChange={(e) => handleCategoryChange(e, categoryFilters, productSearchQuery)}
                                                            className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                                                        />
                                                        <svg
                                                            fill="none"
                                                            viewBox="0 0 14 14"
                                                            className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                                                        >
                                                            <path
                                                                d="M3 8L6 11L11 3.5"
                                                                strokeWidth={2}
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                className="opacity-0 group-has-checked:opacity-100"
                                                            />
                                                            <path
                                                                d="M3 7H11"
                                                                strokeWidth={2}
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                className="opacity-0 group-has-indeterminate:opacity-100"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <label htmlFor={`filter-${section.id}-${optionIdx}`} className="text-sm text-gray-600">
                                                    {option.label}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </DisclosurePanel>
                            </Disclosure>
                        ))}

                    </form>
                </DialogPanel>
            </div>
        </Dialog>
    );
}

export default MobileFilter;