import { lazy } from "react";
import { authRoles } from "app/auth/authRoles";
import { rootPath } from 'app/config'

const Banner = lazy(() => import("./Banner"));
const PriceList = lazy(() => import("./PriceList"));
const DiscountsOffer = lazy(() => import("./DiscountsOffer"));
const ManagePartner = lazy(() => import("./ManagePartner"));

const masterRoutes = [
    {
        path: rootPath + "master/banner",
        component: Banner,
        auth: authRoles.admin,
    },
    {
        path: rootPath + "master/price-list",
        component: PriceList,
        auth: authRoles.admin,
    },
    {
        path: rootPath + "master/discounts-offer",
        component: DiscountsOffer,
        auth: authRoles.admin,
    },
    {
        path: rootPath + "master/manage-partner",
        component: ManagePartner,
        auth: authRoles.admin,
    }
];

export default masterRoutes;