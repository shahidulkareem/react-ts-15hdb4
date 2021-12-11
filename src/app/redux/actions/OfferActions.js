import axios from "axios";
import { apiUrl } from "app/config"
import * as common from "app/services/common";

export const GET_OFFER = "GET_OFFER";
export const GET_PARTNER = "GET_PARTNER";

export const getOfferList = () => dispatch => {
    axios.get(apiUrl + "master/offer")
    .then(res => {
        var data = common.decryptJWT(res.data.token, true)
        dispatch({
            type: GET_OFFER,
            payload: data
        });
    }).catch((e) => {
        console.log(e.message);
    });
}

export const getPartnerList = () => dispatch => {
    axios.post(apiUrl + "partner").then(res => {
        dispatch({
            type: GET_PARTNER,
            payload: (res.data.results.length === 0) ? [] : res.data.results,
        });
    }).catch((e) => {
        console.log(e.message);
    });
}
