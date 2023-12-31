import { Schema, Document, Types, Model, model, models } from 'mongoose';
import { composeMongoose } from 'graphql-compose-mongoose';
import { IUser } from '../user/user.model';
import { IModelData, modelDataSchema } from './modelData/modelData.schema';

interface MathModelVar {
  [varName: string]: number;
}
interface MathModelSolutionProps {
  feasible: boolean;
  bounded: boolean;
  result: number;
  isIntegral: boolean;
}

export type MathModelSolution = MathModelVar & MathModelSolutionProps;

export interface IMathModel {
  _id?: any;
  data: IModelData;
  user: Types.ObjectId | IUser;
  name?: string;
  solutions: MathModelSolution[];
  finalSolution?: MathModelSolution;
  averageExecutionTime: number;
  method: 1 | 2 | 3;
  lingoModels: { modelNumber: number; model: string }[];
  intervals?: number; // discretization intervals throw the uncertainty ranges
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type MathModelDocument = Document<Types.ObjectId, any, IMathModel> &
  IMathModel;

const mathModelSchema = new Schema<IMathModel>(
  {
    name: {
      type: String,
      trim: true,
    },
    data: modelDataSchema,
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide a user'],
    },
    solutions: [
      {
        type: Schema.Types.Map,
        of: {
          type: Number,
        },
        feasible: {
          type: Boolean,
        },
        bounded: {
          type: Boolean,
        },
        result: {
          type: Number,
        },
        isIntegral: {
          type: Boolean,
        },
      },
    ],
    finalSolution: {
      type: Schema.Types.Map,
      of: {
        type: Number,
      },
      feasible: {
        type: Boolean,
      },
      bounded: {
        type: Boolean,
      },
      result: {
        type: Number,
      },
      isIntegral: {
        type: Boolean,
      },
    },

    averageExecutionTime: {
      type: Number,
    },
    method: {
      type: Number,
      enum: [1, 2, 3],
      default: 1,
    },
    lingoModels: [
      {
        modelNumber: {
          type: Number,
        },
        model: {
          type: String,
        },
      },
    ],
    intervals: {
      type: Number,
      default: 5,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const MathModel =
  (models.MathModel as Model<MathModelDocument> & {
    SyncToAlgolia?: any;
    SetAlgoliaSettings?: any;
  }) ||
  model<
    MathModelDocument,
    Model<MathModelDocument> & {
      SyncToAlgolia?: any;
      SetAlgoliaSettings?: any;
    }
  >('MathModel', mathModelSchema);

export const MathModelTC = composeMongoose(MathModel);
