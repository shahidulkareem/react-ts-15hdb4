import {
    GET_ORDER,
    GET_ORDERVIEW,
    GET_ORDERCOUNT,
} from "../actions/OrderActions";

const initialState = {
    orderList: [],
    orderCount: [],
    orderView: [],
};

const orderReducer = function(state = initialState, action) {
    switch (action.type) {
        case GET_ORDER:
            {
                return {
                    ...state,
                    orderList: action.payload.orderData1
                };
            }
        case GET_ORDERCOUNT:
            {
                return {
                    ...state,
                    orderCount: action.payload.reponse
                };
            }
        case GET_ORDERVIEW:
            {
                return {
                    ...state,
                    orderView: action.payload.response
                };
            }
        default:
            {
                return {
                    ...state
                };
            }
    }
};

export default orderReducer;