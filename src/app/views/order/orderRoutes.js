import { lazy } from "react";
import { authRoles } from "app/auth/authRoles";
import { rootPath } from 'app/config'
import './orderStyle.css';

const ViewOrder = lazy(() => import ("./ViewOrder"));
const ViewEnquiryList = lazy(() => import("./ViewEnquiryList"));
const ViewEnquiry = lazy(() => import("./ViewEnquiry"));
const Orders = lazy(() => import ("./Orders"));

const orderRoutes = [{
        path: rootPath + "order/view-order",
        component: ViewOrder,
        auth: authRoles.admin,
    },
    {
        path: rootPath + "order/view-enquiry-list",
        component: ViewEnquiryList,
        auth: authRoles.admin,
    },
    {
        path: rootPath + "order/view-enquiry",
        component: ViewEnquiry,
        auth: authRoles.admin,
    },
    {
        path: rootPath + "order/viewPage/:memberId/:orderId",
        component: Orders,
        auth: authRoles.admin,
    },
];

export default orderRoutes;