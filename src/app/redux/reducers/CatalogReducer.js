import {
    GET_CATEGORY,
    GET_SUBCATEGORY,
    GET_PRODUCT,
    GET_GST
} from "../actions/CatalogActions";

const initialState = {
    categoryList: [],
    subcategoryList: [],
    productList: [],
    gstList: [],
};

const CatalogReducer = function (state = initialState, action) {
    switch (action.type) {
        case GET_CATEGORY: {
            return {
                ...state,
                categoryList: [...action.payload]
            };
        }
        case GET_SUBCATEGORY: {
            return {
                ...state,
                subcategoryList: [...action.payload]
            };
        }
        case GET_PRODUCT: {
            return {
                ...state,
                productList: [...action.payload]
            }
        }
        case GET_GST: {
            return {
                ...state,
                gstList: [...action.payload]
            }
        }
        default: {
            return {
                ...state
            };
        }
    }
};

export default CatalogReducer;