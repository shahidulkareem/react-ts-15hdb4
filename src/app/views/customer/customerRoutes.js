import { lazy } from "react";
import { authRoles } from "app/auth/authRoles";
import { rootPath } from 'app/config'

const Customer = lazy(() => import("./ManageCustomer"));


const customerRoutes = [
    {
        path: rootPath + "customer/manage-customer",
        component: Customer,
        auth: authRoles.admin,
    },
];

export default customerRoutes;