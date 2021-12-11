import {
    GET_CUSTOMER,
} from "../actions/CustomerActions";

const initialState = {
    customerList: [],
};

const CustomerReducer = function (state = initialState, action) {
    switch (action.type) {
        case GET_CUSTOMER: {
            return {
                ...state,
                customerList: [...action.payload]
            };
        }
        default: {
            return {
                ...state
            };
        }
    }
};

export default CustomerReducer;