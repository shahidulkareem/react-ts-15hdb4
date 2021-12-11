import { lazy } from "react";
import { rootPath } from 'app/config'

const Signup = lazy(() => import("./Signup"));
const Signin = lazy(() => import("./Signin"));
const ForgotPassword = lazy(() => import("./ForgotPassword"));
const Error404 = lazy(() => import("./Error"));

const sessionsRoutes = [
    {
        path: rootPath + "session/signup",
        component: Signup
    },
    {
        path: rootPath + "login",
        component: Signin
    },
    {
        path: rootPath + "signin",
        component: Signin
    },
    {
        path: rootPath + "session/signin",
        component: Signin
    },
    {
        path: rootPath + "session/forgot-password",
        component: ForgotPassword
    },
    {
        path: rootPath + "session/404",
        component: Error404
    }
];

export default sessionsRoutes;