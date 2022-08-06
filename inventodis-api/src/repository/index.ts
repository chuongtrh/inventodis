import { Repository } from 'redis-om'

import redisClient from '../shared/redis.client'
import { Store, StoreSchema } from '../schema/store'
import { Product, ProductSchema } from '../schema/product'
import { Inventory, InventorySchema } from '../schema/inventory'


export let StoreRepository: Repository<Store>;
export let ProductRepository: Repository<Product>;
export let InventoryRepository: Repository<Inventory>;

export async function loadRepositories() {
    StoreRepository = redisClient.client.fetchRepository(StoreSchema)
    await StoreRepository.createIndex()

    ProductRepository = redisClient.client.fetchRepository(ProductSchema)
    await ProductRepository.createIndex()

    InventoryRepository = redisClient.client.fetchRepository(InventorySchema)
    await InventoryRepository.createIndex()

}