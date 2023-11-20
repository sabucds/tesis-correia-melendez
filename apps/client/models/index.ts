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

// -------- GENERATED TYPES TO SEND TO THE LP SOLVER LIBRARY --------

type BinaryConstraint = { min: 0; max: 1 }; // every constraint in the form of: 0 <= expression <= 1 for binary variables

type RangeConstraint = { min: number; max: number }; // every constraint in the form of: number <= expression <= number; for float variables

type MaxCeroConstraint = { max: 0 }; // every constraint in the form of: expression <= 0

type MinCeroConstraint = { min: 0 }; // every constraint in the form of: expression >= 0

type MinNumberConstraint = { min: number }; // every constraint in the form of: expression >= number

type EqualCeroConstraint = { equal: 0 }; // every constraint in the form of: expression = 0

type EqualOneConstraint = { equal: 1 }; // every constraint in the form of: expression = 1

type MaxNumberConstraint = { max: number }; // every constraint in the form of: expression <= any number

type BudgetConstraint = { max: number }; // max budget constraint

export interface ConstraintInterface {
  [constraintName: string]:
    | BinaryConstraint // xBinaryConstraint and yBinaryConstraint
    | MaxCeroConstraint // locationSelectionConstraint, totalDemandLocationCapacityConstraint, productAndLocationCapacityConstraint, constraint Wcd <= C(l)cd * Xcd in the form of C(l)cd * Xcd - Wcd <= 0
    | MinCeroConstraint // zIntegerConstraint, w Variable constraint (positive but not integer), constraint Wcd >= C(u)cd * Xcd in the form of C(u)cd * Xcd - Wcd => 0
    | EqualCeroConstraint // productAmountAndDemandConstraint
    | EqualOneConstraint // clientAssignationConstraint
    | MaxNumberConstraint // factoryCapacityPerProductConstraint, C(u)cd - C(u)cd * Xcd >= Ccd - Wcd in the form of  C(u)cd >= Ccd - Wcd + C(u)cd * Xcd
    | BudgetConstraint // budgetConstraint
    | RangeConstraint // Ccd constraint
    | MinNumberConstraint; // lower Ccd, Wcd, Xcd constraint C(l)cd - C(l)cd * Xcd <= Ccd - Wcd in the form of  C(l)cd <= Ccd - Wcd + C(l)cd * Xcd
}

export interface ModelConstraints {
  // declaration of constraints
  xBinaryConstraint: ConstraintInterface;
  yBinaryConstraint: ConstraintInterface;
  zIntegerConstraint: ConstraintInterface;
  clientAssignationConstraint: ConstraintInterface;
  locationSelectionConstraint: ConstraintInterface;
  totalDemandLocationCapacityConstraint: ConstraintInterface;
  productAmountAndDemandConstraint: ConstraintInterface;
  factoryCapacityPerProductConstraint: ConstraintInterface;
  productAndLocationCapacityConstraint: ConstraintInterface;
  budgetConstraint: ConstraintInterface;
}

export interface ModelVariables {
  // variables and the constraints that apply to them
  // variableName is the name of the x, y or z variable
  [variableName: string]: {
    // constraintName is the name of the constraint that applies to the variable
    [constraintName: string]: number;
  };
}

// DISCLAIMER: THE VARIABLES THAT ARE NOT DEFINED IN ANY OF THESE TYPES ARE CONSIDERED CONTINUAL NON-NEGATIVE VARIABLES [0, +inf]
export interface ModelInts {
  // which variables are integers (1) and which are not (0)
  [variableName: string]: 1 | 0;
}

export interface ModelUnrestricted {
  // which variables are not integers (-inf,+inf) (1) and which are not (0)
  [variableName: string]: 1 | 0;
}

export interface ModelBinaries {
  // which variables are binaries (1) and which are not (0)
  [variableName: string]: 1 | 0;
}

// this is the object that the library expects in order to solve the problem
export interface Model {
  optimize: 'cost'; // for our model we always optimize cost
  opType: 'min' | 'max';
  constraints: ConstraintInterface;
  variables: ModelVariables;
  ints: ModelInts;
  unrestricted?: ModelUnrestricted;
  binaries?: ModelBinaries;
  options?: {
    tolerance?: number;
    timeout?: number;
  };
}

interface ModelVariableResult {
  // these are the x, y and z variables that the library returns as results
  // in the case of binary variables (x,y) the library only return them if they are equal to 1
  [variableName: string]: number;
}

export interface ModelResultParameters {
  // these are the parameters that the library returns as results
  bounded: boolean; //
  feasible: boolean; // if the solution is feasible
  result: number; // min cost resulting from the solution
  isIntegral: boolean; //
}

export type ModelResult = ModelVariableResult & ModelResultParameters; // the result that the library throws of the model is the variables and the parameters

export interface XBinaryVariables {
  // variableName: name of the variable in the form of x_cn_dn
  [variableName: string]: {
    client: string; // name
    location: string; // name
  };
}

export interface YBinaryVariables {
  // variableName: name of the variable in the form of y_dn
  [variableName: string]: {
    location: string; // name
  };
}

export interface ZIntegerVariables {
  // variableName: name of the variable in the form of z_pn_fn_dn
  [variableName: string]: {
    location: string; // name
    product: string; // name
    factory: string; // name
  };
}

// -------- DATA CONVENTIONS TO TRANSLATE SOLVER SOLUTION AND DISPLAY IT FOR THE USER --------

// this is the object to translate the solution given by the library to something that the user can understand
export interface DataConventions {
  xBinaryVariables: XBinaryVariables;
  yBinaryVariables: YBinaryVariables;
  zIntegerVariables: ZIntegerVariables;
}

// -------- FUNCTIONAL INTERFACES (FOR DEVELOPMENT USES ONLY) --------
// this type is to identify the x variables that has uncertainty and its cost to use them in the uncertaintySolutions methods
export interface UncertaintyVariable {
  [varName: string]: {
    // variable name in the form of x_cn_dn
    cost: number[]; // cost of the variable (array with two values, the lower and the upper cost)
    client: string; // id
    location: string; // id
  };
}

// -------- EQUATION MODEL TO EXPRESS THE PROBLEM WITH MATH EQUATIONS AND PASTE THEM IN LINGO APP --------
// in order to use the lingo app we need to express the problem in the form of math equations
// all of them have to end with a semicolon but that will be added when we create the final string
export interface ModelMathEquations {
  objectiveFunction: string; // objective function (it has to start with "MIN=" or "MAX=")
  constraints: {
    // constraints (including the variable constraints). Each constraint have to have an inequality sign (<=, >=, =)
    [constraintName: string]: {
      leftSide: string; // left side of the equation
      inequalitySign: '<=' | '>=' | '='; // inequality sign
      rightSide: string; // right side of the equation
    };
  };
  variablesNature: string; // nature of the variables (binary, integer, positive, negative, etc)
}
