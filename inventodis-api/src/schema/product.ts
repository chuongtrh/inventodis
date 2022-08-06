import { Entity, Schema } from 'redis-om'

export interface Product {
    sku: string;
    name: string;
    description: string;
    category: string;
    categoryName: string;
    style: string;
    styleName: string;
    isOrganic: string;
    abv: number;
    ibu: number;
    icon: string;
    status: string;
}
export class Product extends Entity { }

export const ProductSchema = new Schema(Product, {
    sku: { type: 'string' },
    name: { type: 'text' },
    description: { type: 'text' },
    category: { type: 'string' },
    categoryName: { type: 'string' },
    style: { type: 'string' },
    styleName: { type: 'string' },
    isOrganic: { type: 'string' },
    abv: { type: 'number' },
    ibu: { type: 'number' },
    icon: { type: 'string' },
    status: { type: 'string' },
}, {
    dataStructure: 'HASH',
    prefix: 'product'
})

