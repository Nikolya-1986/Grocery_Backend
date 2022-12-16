import { Router } from "express";

import { AuthenticatedUser, Login, Logout, Refresh, Register } from "../controllers/auth.controller";

export const routes = (router: Router) => {
    router.post('/auth/signup', Register);
    router.post('/auth/login', Login);
    router.get('/auth/logout', Logout);
    router.get('/auth/user', AuthenticatedUser),
    router.post('/auth/refresh', Refresh)
}