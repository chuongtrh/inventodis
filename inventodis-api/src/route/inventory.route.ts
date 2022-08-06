import { Router } from 'express';
import { Routes } from './routes.interface';

import inventoryController from '../controller/inventory.controller';


class StoreRouter implements Routes {
    public path = '';
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/`, inventoryController.getAll);
    }
}

export default new StoreRouter();