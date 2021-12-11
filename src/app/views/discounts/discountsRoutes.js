import { lazy } from "react";
import { authRoles } from "app/auth/authRoles";
import { rootPath } from 'app/config'

const Discounts = lazy(() => import("./Discounts"));

const discountsRoutes = [
    {
        path: rootPath + "discounts",
        component: Discounts,
        auth: authRoles.admin,
    }
];

export default discountsRoutes;