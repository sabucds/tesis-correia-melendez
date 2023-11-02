import { Schema, Types } from 'mongoose';
import { schemaComposer } from 'graphql-compose';
import { convertSchemaToGraphQL } from 'graphql-compose-mongoose';

export interface IModelItem {
  id: string;
  name: string;
}

export const modelItemSchema = new Schema<IModelItem>({
  id: {
    type: String,
  },
  name: {
    type: String,
  },
});

convertSchemaToGraphQL(modelItemSchema, 'ModelItem', schemaComposer);
