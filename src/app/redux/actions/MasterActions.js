import axios from "axios";
import { apiUrl } from "app/config";
import * as common from "app/services/common";

export const GET_BANNER = "GET_BANNER";
export const GET_PRICELIST = "GET_PRICELIST";
export const GET_PARTNER = "GET_PARTNER";


export const getBanner = () => dispatch => {
    axios.get(apiUrl + "master/banner")
        .then(res => {
            var data = common.decryptJWT(res.data.token, true)
            dispatch({
                type: GET_BANNER,
                payload: data
            });
        })
        .catch((e) => {
            console.log(e.message);
        });
};

export const getPriceList = () => dispatch => {
    axios.get(apiUrl + "catalog/pricelist")
        .then(res => {
            var data = common.decryptJWT(res.data.token, true)
            dispatch({
                type: GET_PRICELIST,
                payload: data
            });
        }).catch((e) => {
            console.log(e.message);
        });
};

export const getPartnerList = () => dispatch => {
    axios.get(apiUrl + "partner/partner")
        .then(res => {
            var data = common.decryptJWT(res.data.token, true)
            dispatch({
                type: GET_PARTNER,
                payload: data
            });
        }).catch((e) => {
            console.log(e.message);
        });
};