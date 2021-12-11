import axios from "axios";
import { apiUrl } from "app/config";
import * as common from "app/services/common";

export const GET_CUSTOMER = "GET_CUSTOMER";

export const getCustomer = () => dispatch => {
    axios
        .post(apiUrl + "member/customer")
        .then(res => {
            var data = common.decryptJWT(res.data.token, true)
            dispatch({
                type: GET_CUSTOMER,
                payload: data
            });
        })
        .catch((e) => {
            console.log(e.message);
        });
};