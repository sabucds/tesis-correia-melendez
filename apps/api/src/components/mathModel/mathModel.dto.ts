import { MathModelTC } from './mathModel.model';

export const MathModelType = MathModelTC.getTypeName();
export const MathModelTypePlural = MathModelTC.getTypePlural().getTypeName();
export const MathModelTypeNotNull = MathModelTC.getTypeNonNull().getTypeName();

// Create One
export const CreateOneMathModelInput = MathModelTC.mongooseResolvers
  .createOne()
  .getArgs()
  .record.type.getTypeName();
