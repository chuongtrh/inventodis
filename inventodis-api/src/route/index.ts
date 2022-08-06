import { Router } from "express";
import storeRoute from "./store.route";
import inventoryRoute from "./inventory.route";

export function loadRoutes(api: Router) {
    api.use('/store', storeRoute.router)
    api.use('/inventory', inventoryRoute.router)


}