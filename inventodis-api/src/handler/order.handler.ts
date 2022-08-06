
import { InventoryRepository } from '../repository'
import redisClient from '../shared/redis.client'
import { Socket, Server } from 'socket.io'

export default (io: Server, socket: Socket) => {
    const addCart = async (payload: any) => {

        const { inventoryId } = payload
        // const virtualHold = await redisClient.client.execute(['HINCRBY', `inventory:${inventoryId}`, 'virtualHold', 1])

        const inventory = await InventoryRepository.fetch(inventoryId)

        if (inventory.availableToPromise > 0) {
            inventory.virtualHold++
            inventory.availableToPromise = inventory.getAvailableToPromise()
        }
        await InventoryRepository.save(inventory)


        io.emit('update:inventory', {
            ...payload,
            inventory
        })

    }
    socket.on("addCart", addCart)
}