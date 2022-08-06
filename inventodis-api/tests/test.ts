import client from '../src/shared/redis.client';

import { StoreRepository, ProductRepository, loadRepositories } from '../src/repository'

async function run() {

    try {
        await client.connect()
        await loadRepositories()

        // const store = await StoreRepository.fetch('2954')
        // console.log("🚀 ~ store", store.toJSON())

        // const product = await ProductRepository.fetch('3BeXdL')
        // console.log("🚀 ~ product", product.toJSON())

        const ids = ['tTXnhX', 'bFd25K'];
        const skus = await ProductRepository.search().where('sku').equals(ids).return.all()
        console.log("🚀 ~ skus", skus)


        // const text = 'House'
        // const results = await StoreRepository.search().where('description').matches(text).return.all()
        // console.log("🚀 ~ results", results.length)

    } catch (error) {
        console.error(error);
    }

}

run()
