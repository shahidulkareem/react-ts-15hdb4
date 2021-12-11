import { lazy } from "react";
import { authRoles } from "app/auth/authRoles";
import { rootPath } from 'app/config'

const Settings = lazy(() => import("./Settings"));

const settingRoutes = [
    {
        path: rootPath + "setting",
        component: Settings,
        auth: authRoles.admin,
    }
];

export default settingRoutes;