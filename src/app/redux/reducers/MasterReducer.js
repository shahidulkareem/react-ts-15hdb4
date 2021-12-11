import {
    GET_BANNER,
    GET_PRICELIST,
    GET_PARTNER,
} from "../actions/MasterActions";

const initialState = {
    bannerList: [],
    priceList: [],
    partnerList: [],
};

const MasterReducer = function (state = initialState, action) {
    switch (action.type) {
        case GET_BANNER: {
            return {
                ...state,
                bannerList: [...action.payload]
            };
        }
        case GET_PRICELIST: {
            return {
                ...state,
                priceList: [...action.payload]
            };
        }
        case GET_PARTNER: {
            return {
                ...state,
                partnerList: [...action.payload]
            };
        }
       
        default: {
            return {
                ...state
            };
        }
    }
};

export default MasterReducer;