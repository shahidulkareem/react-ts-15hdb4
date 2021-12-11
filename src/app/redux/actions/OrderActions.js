import axios from "axios";
import { apiUrl } from "app/config";
import * as common from "app/services/common";

export const GET_ORDER = "GET_ORDER";
export const GET_ORDERVIEW = "GET_ORDERVIEW";
export const GET_ORDERCOUNT = "GET_ORDERCOUNT";


export const getOrderList = (params) => dispatch => {
    // http://algrix.in:1430/order/list_order_all
    axios
        .post("http://algrix.in:1430/order/list_order_all", params)
        .then(res => {
            var data = common.decryptJWT(res.data.token)
            dispatch({
                type: GET_ORDER,
                payload: data
            });
        })
        .catch((e) => {
            console.log(e.message);
        });
};

export const getOrderView = (params) => dispatch => {
    axios
        .post("http://algrix.in:1430/order/list_order", params)
        .then(res => {
            var data = common.decryptJWT(res.data.token)
            dispatch({
                type: GET_ORDERVIEW,
                payload: data
            });
        })
        .catch((e) => {
            console.log(e.message);
        });
};

export const getOrderCount = (params) => dispatch => {
    axios
        .post("http://algrix.in:1430/order/order_count", params)
        .then(res => {
            var data = common.decryptJWT(res.data.token)
            dispatch({
                type: GET_ORDERCOUNT,
                payload: data
            });
        })
        .catch((e) => {
            console.log(e.message);
        });
};