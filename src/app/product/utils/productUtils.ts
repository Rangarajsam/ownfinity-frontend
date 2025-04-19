import { AppDispatch } from "@/app/store";
import { listAllProducts } from "@/app/store/slices/productSlice";
import { CATEGORIES } from "@/app/config/generalConfig";

const updateSortBy = (queryString: string, newSortByValue: string) => {
    return queryString.replace(
        /sortBy=[^&]*/g,
        `sortBy=${newSortByValue}`
    );
}

const getUpdatedSortByValue = (currentSortBy: string, newSortByValue: string, newlyGenerated: string) => {
    const newSortBy = currentSortBy.includes("sortBy=") ? updateSortBy(currentSortBy, newSortByValue) : newlyGenerated;
    return newSortBy;
}

const replaceCharAt = (str: string, index: number, newChar: string) => {
    if (index < 0 || index >= str.length) return str;
    return str.slice(0, index) + newChar + str.slice(index + 1);
}


const createCategoryOptions = (categories: string[]) => {
    return categories.map((category) => ({
        value: category,
        label: category,
        checked: false,
    }));
}

const getAvailableFilterCategories = () => {
    const filters = [
        {
            id: 'category',
            name: 'category',
            options: createCategoryOptions(CATEGORIES),
        }
    ]
    return filters;
}



const handleGetProducts = async (dispatch: AppDispatch, query?: string) => {
    try {
        await dispatch(listAllProducts(query)).unwrap();

    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

const getStringQuery = (e: React.ChangeEvent<HTMLInputElement>, currentFilter:string[], currentQuery: string) => {
    const { name, value, checked } = e.target;
    const updatedFilters = [...currentFilter];
    let query = '';
    let connector = currentQuery.includes('?') ? '&' : '?';
    if (checked) {
        updatedFilters.push(value);
        const encodedQuery = encodeURIComponent(name.split("-")[0] || "");
        query = `${currentQuery}${connector}${encodedQuery}=${updatedFilters.join(',')}`;
    } else {
        let combinedQuery = `category=${value}`
        const index = currentQuery.indexOf(combinedQuery);
        if (index > -1) {
            let queryConnector = currentQuery.charAt(index - 1);
            query = currentQuery.replace(`${queryConnector}${combinedQuery}`, "");
            query = query.charAt(0) === '&' ? replaceCharAt(query,0,"?") : query;
        }
    }
    return query;
}


export {
    updateSortBy,
    getUpdatedSortByValue,
    replaceCharAt,
    createCategoryOptions,
    getAvailableFilterCategories,
    handleGetProducts,
    getStringQuery
}