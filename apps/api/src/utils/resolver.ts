import { Resolver, ResolverDefinition, schemaComposer } from 'graphql-compose';
import { ObjectTypeComposerWithMongooseResolvers } from 'graphql-compose-mongoose';
import { getCamelCase, pluralize } from './text';

type ResolversObject = {
  [x: string]: Resolver<any, any, any, any>;
};

/**
 * Creates a graphql-compose resolver with the given options and the selected type.
 * @param {ResolverDefinition} opts ResolverDefinition object
 * @returns {Resolver} Resolver object
 */
export function createResolver<T>(
  opts: ResolverDefinition<
    any,
    any,
    { data: T } | { data: T; filter: any } | any
  >
): Resolver<any, any, any, any> {
  return schemaComposer.createResolver<
    any,
    { data: T } | { data: T; filter: any } | any
  >(opts);
}

/**
 * Generates an object with basic queries for a given model.
 * @param {ObjectTypeComposerWithMongooseResolvers} Model Mongoose model
 * @returns {ResolversObject} Object with basic queries
 */
export function getBasicQueries(
  Model: ObjectTypeComposerWithMongooseResolvers<any, any>
): ResolversObject {
  const typeName = getCamelCase(Model.getTypeName());
  return {
    [typeName]: Model.mongooseResolvers.findOne(),
    [pluralize(typeName)]: Model.mongooseResolvers.findMany(),
    [`${typeName}Pagination`]: Model.mongooseResolvers.pagination(),
  };
}

/**
 * Generates an object with basic mutations for a given model.
 * @param {ObjectTypeComposerWithMongooseResolvers} Model Mongoose model
 * @returns {ResolversObject} Object with basic mutations
 */
export function getBasicMutations(
  Model: ObjectTypeComposerWithMongooseResolvers<any, any>
): ResolversObject {
  const typeName = Model.getTypeName();
  return {
    [`create${typeName}`]: Model.mongooseResolvers.createOne(),
    [`update${typeName}`]: Model.mongooseResolvers.updateOne(),
  };
}
