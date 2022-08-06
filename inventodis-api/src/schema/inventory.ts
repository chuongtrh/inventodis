import { Entity, Schema } from 'redis-om'

export interface Inventory {
    store: string;
    sku: string;
    categoryName: string;
    availableToPromise: number;
    onHand: number;
    allocated: number;
    reserved: number;
    virtualHold: number;
    epoch: number;
}
export class Inventory extends Entity {

    getAvailableToPromise(): number {
        const demand = this.allocated + this.reserved + this.virtualHold;
        const supply = this.onHand
        return supply - demand;
    }
}

export const InventorySchema = new Schema(Inventory, {
    store: { type: 'string' },
    sku: { type: 'string' },
    availableToPromise: { type: 'number' },
    onHand: { type: 'number' },
    allocated: { type: 'number' },
    reserved: { type: 'number' },
    virtualHold: { type: 'number' },
    epoch: { type: 'number' },
}, {
    dataStructure: 'HASH',
    prefix: 'inventory'
})

