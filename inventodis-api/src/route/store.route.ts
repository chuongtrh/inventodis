import { Router } from 'express';
import { Routes } from './routes.interface';

import storeController from '../controller/store.controller';


class StoreRouter implements Routes {
    public path = '';
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/`, storeController.getAll);
        this.router.get(`${this.path}/:id/inventory`, storeController.getInventory);
    }
}

export default new StoreRouter();