import { lazy } from "react";
import { authRoles } from "app/auth/authRoles";
import { rootPath } from 'app/config'

const Categories = lazy(() => import("./Categories"));
const SubCategories = lazy(() => import("./SubCategories"));
const ManageProduct = lazy(() => import("./ManageProduct"));

const catalogueRoutes = [
    {
        path: rootPath + "catalogue/categories",
        component: Categories,
        auth: authRoles.admin,
    },
    {
        path: rootPath + "catalogue/subcategories",
        component: SubCategories,
        auth: authRoles.admin,
    },
    {
        path: rootPath + "catalogue/manage-product",
        component: ManageProduct,
        auth: authRoles.admin,
    },
];

export default catalogueRoutes;