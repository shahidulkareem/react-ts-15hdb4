import axios from "axios";
import { apiUrl } from "app/config";
import * as common from "app/services/common";

export const GET_CATEGORY = "GET_CATEGORY";
export const GET_SUBCATEGORY = "GET_SUBCATEGORY";
export const GET_PRODUCT = "GET_PRODUCT";
export const GET_GST = "GET_GST";

export const getCategory = () => dispatch => {
    axios
        .get(apiUrl + "catalog/category")
        .then(res => {
            var data = common.decryptJWT(res.data.token, true)
            dispatch({
                type: GET_CATEGORY,
                payload: data
            });
        })
        .catch((e) => {
            console.log(e.message);
        });
};

export const getSubCategory = () => dispatch => {
    axios
        .get(apiUrl + "catalog/subcategory")
        .then(res => {
            var data = common.decryptJWT(res.data.token, true)
            dispatch({
                type: GET_SUBCATEGORY,
                payload: data
            });
        }).catch((e) => {
            console.log(e.message);
        });;
};

export const getPorductList = () => dispatch => {
    axios.post(apiUrl + "catalog/product_list")
        .then(res => {
            var data = common.decryptJWT(res.data.token, true)
            dispatch({
                type: GET_PRODUCT,
                payload: data
            });
        }).catch((e) => {
            console.log(e.message);
        });
};

export const  getGstList = () => dispatch => {
    axios.get(apiUrl + "master/gst_list")
    .then(res => {
        var data = common.decryptJWT(res.data.token, true)
        dispatch({
            type: GET_GST,
            payload: data
        })
    }).catch((e) => {
        console.log(e.message);
    });
}