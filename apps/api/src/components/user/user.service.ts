import type {
  FilterQuery,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';
import { IUser, User } from './user.model';
import { paginateModel } from '../../utils';

export async function findOne(
  filter?: FilterQuery<IUser>,
  projection?: ProjectionType<IUser> | null,
  options?: QueryOptions<IUser> | null
) {
  return User.findOne(filter, projection, options).exec();
}

export async function find(
  filter?: FilterQuery<IUser>,
  projection?: ProjectionType<IUser> | null,
  options?: QueryOptions<IUser> | null
) {
  return User.find(filter, projection, options).exec();
}

export async function pagination(
  _page: number,
  _perPage: number,
  filter?: FilterQuery<IUser>,
  projection?: ProjectionType<IUser> | null,
  options?: QueryOptions<IUser> | null
) {
  const [page, perPage] = [Math.max(_page, 1), Math.max(_perPage, 10)];
  return paginateModel(page, perPage, User, filter, projection, options);
}

export async function create(user: IUser) {
  return User.create(user);
}

export async function updateOne(
  filter: FilterQuery<IUser>,
  update: UpdateQuery<IUser>,
  options?: QueryOptions<IUser> | null
) {
  return User.findOneAndUpdate(filter, update, options).exec();
}
