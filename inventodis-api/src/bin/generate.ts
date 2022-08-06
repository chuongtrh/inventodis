import redisClient from '../shared/redis.client';
import * as util from '../shared/utils';

import { StoreRepository, ProductRepository, InventoryRepository, loadRepositories } from '../repository'

async function run() {

    try {
        await redisClient.connect()
        await loadRepositories()

        const stores = await StoreRepository.search().returnAll()
        const products = await ProductRepository.search().returnAll()

        for (let i = 0; i < stores.length; i++) {

            const store = stores[i];

            for (let j = 0; j < 10; j++) {
                const product = products[Math.floor(Math.random() * products.length)];

                const inventory = InventoryRepository.createEntity()
                inventory.store = store.store
                inventory.sku = product.sku
                inventory.onHand = util.rand(10, 100)
                inventory.allocated = 0
                inventory.reserved = 0
                inventory.virtualHold = 0
                inventory.availableToPromise = inventory.getAvailableToPromise()

                const id = await InventoryRepository.save(inventory)
                console.log("🚀 ~ id", id, product.sku, product.entityId)
            }

        }

        console.log("🚀 ~ Done")
    } catch (error) {
        console.error(error);
    }

}

run()
