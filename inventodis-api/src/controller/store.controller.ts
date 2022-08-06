import { StoreRepository, InventoryRepository, ProductRepository } from '../repository'
import { NextFunction, Request, Response } from 'express';

class StoreController {

    getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        const page = Number(req.query.page) || 1;
        const page_size = Number(req.query.page_size) || 20;
        const offset = (page - 1) * page_size
        const keyword = req.query.keyword ? String(req.query.keyword) : '';


        let builder = StoreRepository.search()
        if (keyword) {
            builder = builder.where('address').match(`${keyword}*`).or('description').match(`${keyword}*`)
        }

        const total = await builder.return.count()
        const stores = await builder.return.page(offset, page_size)

        const pagination = {
            current: page,
            page_size,
            total,
            total_page: Math.floor(total / page_size),
        }
        res.status(200).json({
            data: stores,
            pagination
        });
    }
    getInventory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const id = req.params.id
        const store = await StoreRepository.fetch(id)
        if (store) {
            const inventories = await InventoryRepository.search().where('store').eq(id).return.all()

            const ids = inventories.map(inventory => inventory.sku)

            const skus = await Promise.all(inventories.map(async (inventory) => {
                const sku = await ProductRepository.fetch(inventory.sku);
                return {
                    inventory: inventory,
                    id: sku.entityId,
                    sku
                }
            }))

            skus.sort((a, b) => {
                return a.id > b.id ? -1 : 1
            })

            res.status(200).json({
                data: {
                    ...store.toJSON(),
                    skus
                }
            });
        }
    }
}

export default new StoreController()