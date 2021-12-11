import { lazy } from "react";
import { authRoles } from "app/auth/authRoles";
import { rootPath } from 'app/config';

const Dashboard1 = lazy(() => import("./dashboard1/Dashboard1"));

const dashboardRoutes = [
    {
        path: rootPath + "dashboard",
        component: Dashboard1,
        auth: authRoles.admin,
    }
];

export default dashboardRoutes;