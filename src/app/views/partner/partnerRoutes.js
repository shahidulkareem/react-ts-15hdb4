import { lazy } from "react";
import { authRoles } from "app/auth/authRoles";
import { rootPath } from 'app/config'

const ManagePartner = lazy(() => import("../partner/Partner"));

const partnerRoutes = [
    {
        path: rootPath + "master/manage-partner",
        component: ManagePartner,
        auth: authRoles.admin,
    }
];

export default partnerRoutes;