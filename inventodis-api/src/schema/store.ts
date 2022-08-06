import { Entity, Schema } from 'redis-om'

export interface Store {
  store: string;
  description: string;
  market: string;
  parent: number;
  address: string;
  city: string;
  country: string;
  latitude: number,
  longitude: number,
  state: string;
  postalCode: string;
  type: string;
}

export class Store extends Entity {
}

export const StoreSchema = new Schema(Store, {
  store: { type: 'string' },
  description: { type: 'text' },
  market: { type: 'string' },
  parent: { type: 'number' },
  address: { type: 'text' },
  city: { type: 'string' },
  country: { type: 'string' },
  latitude: { type: 'number' },
  longitude: { type: 'number' },
  location: { type: 'point' },
  state: { type: 'string' },
  postalCode: { type: 'string' },
  type: { type: 'string' },
}, {
  dataStructure: 'HASH',
  prefix: 'store'
})

