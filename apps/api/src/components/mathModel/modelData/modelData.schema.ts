import slugs from 'slugs';
import { hash } from 'argon2';
import { Schema, Document, Types, Model, model, models } from 'mongoose';
import {
  composeMongoose,
  convertSchemaToGraphQL,
} from 'graphql-compose-mongoose';
import { schemaComposer } from 'graphql-compose';
import { IModelItem, modelItemSchema } from './modelItem.schema';

export interface AssignationClientLocationCost {
  client: string; // id of client
  location: string; // id of location
  cost: number[];
  uncertainty: boolean;
}

export interface SelectionLocationCost {
  location: string; // id of location
  cost: number;
}

export interface ShippingFactoryLocationProductCost {
  factory: string; // id
  location: string; // id
  product: string; // id
  cost: number;
}

export interface TotalClientDemand {
  client: string; // id
  totalDemand: number;
}

export interface ProductClientDemand {
  client: string; // id
  product: string; // id
  demand: number;
}

export interface LocationCapacity {
  location: string; // id
  capacity: number;
}

export interface FactoryProductCapacity {
  factory: string; // id
  product: string; // id
  capacity: number;
}

export interface IModelData {
  _id?: any;
  // primary data
  totalBudget: number;
  factories: IModelItem[];
  clients: IModelItem[];
  locations: IModelItem[];
  products: IModelItem[];
  // derived data
  assignationClientLocationCost: AssignationClientLocationCost[];
  selectionLocationCost: SelectionLocationCost[];
  shippingFactoryLocationProductCost: ShippingFactoryLocationProductCost[];
  totalClientDemand: TotalClientDemand[];
  productClientDemand: ProductClientDemand[];
  locationCapacity: LocationCapacity[];
  factoryProductCapacity: FactoryProductCapacity[];
}

export const modelDataSchema = new Schema<IModelData>({
  totalBudget: {
    type: Number,
    // required: [true, 'Please provide a totalBudget'],
  },
  factories: [modelItemSchema],
  clients: [modelItemSchema],
  locations: [modelItemSchema],
  products: [modelItemSchema],
  assignationClientLocationCost: [
    {
      client: {
        type: String,
      },
      location: {
        type: String,
      },
      cost: {
        type: [Number],
      },
      uncertainty: {
        type: Boolean,
      },
    },
  ],
  selectionLocationCost: [
    {
      location: {
        type: String,
      },
      cost: {
        type: Number,
      },
    },
  ],
  shippingFactoryLocationProductCost: [
    {
      factory: {
        type: String,
      },
      location: {
        type: String,
      },
      product: {
        type: String,
      },
      cost: {
        type: Number,
      },
    },
  ],
  totalClientDemand: [
    {
      client: {
        type: String,
      },
      totalDemand: {
        type: Number,
      },
    },
  ],
  productClientDemand: [
    {
      client: {
        type: String,
      },
      product: {
        type: String,
      },
      demand: {
        type: Number,
      },
    },
  ],
  locationCapacity: [
    {
      location: {
        type: String,
      },
      capacity: {
        type: Number,
      },
    },
  ],
  factoryProductCapacity: [
    {
      factory: {
        type: String,
      },
      product: {
        type: String,
      },
      capacity: {
        type: Number,
      },
    },
  ],
});

convertSchemaToGraphQL(modelDataSchema, 'ModelData', schemaComposer);
