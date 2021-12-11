import { GET_OFFER, GET_PARTNER } from "../actions/OfferActions";

const initialState = {
    offerList: [],
    partnerList: [],
};

const OfferReducer = function (state = initialState, action) {
    switch (action.type) {
        case GET_OFFER: {
            return {
                ...state,
                offerList: [...action.payload]
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

export default OfferReducer;