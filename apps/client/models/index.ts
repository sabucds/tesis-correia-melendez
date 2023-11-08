export interface MongooseModel {
  _id?: string;
  active?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export type UserTypeEnum = 'client' | 'superadmin';

export type DniTypeEnum = 'V' | 'E' | 'J' | 'G' | 'P' | 'N/A';

export type PermissionOptionEnum = 'create' | 'read' | 'update' | 'delete';

export interface Permission extends MongooseModel {
  name: string;
  key: string;
  options: Array<PermissionOptionEnum>;
}

export interface Session extends MongooseModel {
  user: string | User;
  token: string;
  device: string;
}

export interface User extends MongooseModel {
  slug?: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  locale?: string;
  permission: Array<Permission>;
  userType: UserTypeEnum;
  emailVerify: boolean;
  resetTokenValidity?: Date;
  resetToken?: string;
  dni?: string;
  dniType?: DniTypeEnum;
  commission?: number;
  sessions?: Array<Session>;
}

// -------- MODEL TYPES OF DATA GIVEN BY USER --------

export interface PrimaryModelVariable {
  // Clients, Products, Factories, Locations
  id: string;
  name: string;
}

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

// all data given by user
export interface ModelInitialData {
  // primary data
  totalBudget: number;
  factories: PrimaryModelVariable[];
  clients: PrimaryModelVariable[];
  locations: PrimaryModelVariable[];
  products: PrimaryModelVariable[];
  // derived data
  assignationClientLocationCost: AssignationClientLocationCost[];
  selectionLocationCost: SelectionLocationCost[];
  shippingFactoryLocationProductCost: ShippingFactoryLocationProductCost[];
  totalClientDemand: TotalClientDemand[];
  productClientDemand: ProductClientDemand[];
  locationCapacity: LocationCapacity[];
  factoryProductCapacity: FactoryProductCapacity[];
}
