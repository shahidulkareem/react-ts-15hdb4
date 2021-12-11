import { lazy } from "react";
import { authRoles } from "app/auth/authRoles";
import { rootPath } from 'app/config';

const AddOffer = lazy(() => import("./AddOffer"));
const ManageOffer = lazy(() => import("./Offer"));

const offerRoutes = [
    {
        path: rootPath + "offer/add-offer",
        component: AddOffer,
        auth: authRoles.admin,
    },
    {
        path: rootPath + "offer/update-offer/:id",
        component: AddOffer,
        auth: authRoles.admin,
    },
    {
        path: rootPath + "offer/manage-offer",
        component: ManageOffer,
        auth: authRoles.admin,
    }
];

export default offerRoutes;