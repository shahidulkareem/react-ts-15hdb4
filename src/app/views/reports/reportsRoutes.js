import { lazy } from "react";
import { authRoles } from "app/auth/authRoles";
import { rootPath } from 'app/config'

const Reports = lazy(() => import("./Reports"));

const reportRoutes = [
    {
        path: rootPath + "report",
        component: Reports,
        auth: authRoles.admin,
    }
];

export default reportRoutes;