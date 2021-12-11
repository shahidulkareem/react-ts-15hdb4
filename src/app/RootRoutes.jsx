import React from "react";
import { Redirect } from "react-router-dom";

import dashboardRoutes from "./views/dashboard/dashboardRoutes";
import sessionsRoutes from "./views/sessions/sessionsRoutes";
import catalogueRoutes from './views/catalogue/catalogueRoutes';
import partnerRoutes from './views/partner/partnerRoutes';
import discountsRoutes from './views/discounts/discountsRoutes';
import orderRoutes from './views/order/orderRoutes';
import offerRoutes from './views/offer/offerRoutes';
import settingRoutes from './views/setting/settingRoutes';
import reportsRoutes from './views/reports/reportsRoutes';
import masterRoutes from './views/master/masterRoutes';
import customerRoutes from './views/customer/customerRoutes'

import AuthGuard from "./auth/AuthGuard";
import { rootPath } from 'app/config';

const redirectRoute = [
    {
        path: rootPath,
        exact: true,
        component: () => <Redirect to={rootPath+"dashboard"} />
    }
];

const errorRoute = [
    {
        component: () => <Redirect to={rootPath + "session/404"} />
    }
];

const routes = [
    ...sessionsRoutes,
    {
        path: rootPath,
        component: AuthGuard,
        routes: [
            ...dashboardRoutes,
            ...masterRoutes,
            ...catalogueRoutes,
            ...partnerRoutes,
            ...customerRoutes,
            ...discountsRoutes,
            ...orderRoutes,
            ...offerRoutes,
            ...settingRoutes,
            ...reportsRoutes,
            ...redirectRoute,
            ...errorRoute
        ]
    }
];

export default routes;
