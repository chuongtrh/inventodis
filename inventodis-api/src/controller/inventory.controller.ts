import { InventoryRepository } from '../repository'
import { NextFunction, Request, Response } from 'express';

class InventoryController {

    getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const inventories = await InventoryRepository.search().return.page(0, 25)
        res.status(200).json({ data: inventories });
    }
}

export default new InventoryController()