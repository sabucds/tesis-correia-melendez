import {
  AssignationClientLocationCost,
  DataConventions,
  FactoryProductCapacity,
  LocationCapacity,
  Model,
  ModelConstraints,
  ModelInitialData,
  ModelInts,
  ModelVariables,
  PrimaryModelVariable,
  ProductClientDemand,
  SelectionLocationCost,
  ShippingFactoryLocationProductCost,
  TotalClientDemand,
  UncertaintyVariable,
  XBinaryVariables,
  YBinaryVariables,
  ZIntegerVariables,
  ConstraintInterface,
  ModelMathEquations,
  ModelBinaries,
} from '../models';

interface GetConstraintsReturn {
  modelConstraints: ModelConstraints;
  xBinaryVariables: XBinaryVariables;
  yBinaryVariables: YBinaryVariables;
  zIntegerVariables: ZIntegerVariables;
  xVariablesWithUncertainty: UncertaintyVariable;
}

interface GetConstraintsProps {
  modelMathEquations: ModelMathEquations;
  locations: PrimaryModelVariable[];
  products: PrimaryModelVariable[];
  factories: PrimaryModelVariable[];
  factoryProductCapacity: FactoryProductCapacity[];
  assignationClientLocationCost: AssignationClientLocationCost[];
  shippingFactoryLocationProductCost: ShippingFactoryLocationProductCost[];
  clients: PrimaryModelVariable[];
  totalBudget: number;
}

/** This function generates the constraints for the model and the data conventions to be used in the solution display
 * @param locations: Locations array given by user
 * @param products: Products array given by user
 * @param factories: Factories array given by user
 * @param factoryProductCapacity: Factory capacity per product array given by user
 * @param assignationClientLocationCost: Assignation cost per client and location array given by user
 * @param shippingFactoryLocationProductCost: Shipping cost per factory, location and product array given by user
 * @param clients: Clients array given by user
 * @param totalBudget: Total budget to choose the locations given by user
 * @returns the constraints for the model and the data conventions to be used in the solution display
 */
function getConstraints({
  modelMathEquations,
  locations,
  products,
  factories,
  factoryProductCapacity,
  assignationClientLocationCost,
  shippingFactoryLocationProductCost,
  clients,
  totalBudget,
}: GetConstraintsProps): GetConstraintsReturn {
  // CONSTRAINTS FOR THE MODEL
  const xBinaryConstraint: ConstraintInterface = {};
  const yBinaryConstraint: ConstraintInterface = {};
  const zIntegerConstraint: ConstraintInterface = {};
  // the client c can only be is assigned to one center d x12 + x11 + x13 = 1
  const clientAssignationConstraint: ConstraintInterface = {};
  // the client can only be assigned to a center that is selected x11 <= y1
  const locationSelectionConstraint: ConstraintInterface = {};
  // The total demand of all the clients cant be greater than the capacity of the center 100x11 + 300x21 + 200x31 - 1000y1 <= 1
  const totalDemandLocationCapacityConstraint: ConstraintInterface = {};
  // amount of product shipped from factory f to center d must be equal to client demand for that product and location
  const productAmountAndDemandConstraint: ConstraintInterface = {};
  // max amount of product that can be produced in factory f
  const factoryCapacityPerProductConstraint: ConstraintInterface = {};
  // the amount of product shipped from factory f to center d must be less than the capacity of the center
  const productAndLocationCapacityConstraint: ConstraintInterface = {};

  // VARIABLES => CONVENTIONS
  const xBinaryVariables: XBinaryVariables = {};

  const yBinaryVariables: YBinaryVariables = {};

  const zIntegerVariables: ZIntegerVariables = {};

  // this object is made with the purpose of identifying which x variables has uncertainty
  // and change them in the uncertainty solving methods using the lower and the upper value of cost
  const xVariablesWithUncertainty: UncertaintyVariable = {};

  // GENERATING MODEL CONSTRAINTS

  clients.forEach(({ id: client }) => {
    clientAssignationConstraint[`client_assignation_x_${client}`] = {
      equal: 1,
    };

    modelMathEquations.constraints[`client_assignation_x_${client}`] = {
      leftSide: ' 0',
      inequalitySign: '=',
      rightSide: '1',
    }; // establishing right side of the equation
  });

  assignationClientLocationCost.forEach(
    ({ client, location, cost, uncertainty }) => {
      xBinaryVariables[`x_${client}_${location}`] = {
        client: clients.find((c) => c.id === client)?.name ?? '',
        location: locations.find((l) => l.id === location)?.name ?? '',
      };

      // binary constraint for x for the model
      xBinaryConstraint[`x_${client}_${location}`] = {
        min: 0,
        max: 1,
      };

      // declare binary constraints for x variables in math equations
      modelMathEquations.variablesNature = `${modelMathEquations.variablesNature}@BIN(x_${client}_${location}); `; // x_cn_d is binary

      // if the cost has uncertainty, it is added to the object
      if (uncertainty) {
        xVariablesWithUncertainty[`x_${client}_${location}`] = {
          cost,
          client,
          location,
        };
      }
    }
  );

  locations.forEach(({ id: location, name: locationName }) => {
    const constraintName1 = `product_and_factory_capacity_${location}`;
    productAndLocationCapacityConstraint[constraintName1] = { max: 0 };

    modelMathEquations.constraints[constraintName1] = {
      leftSide: ' 0',
      inequalitySign: '<=',
      rightSide: '0',
    }; // establishing right side of the equation

    const constraintName2 = `totalDemand_and_locationCapacity_${location}`;
    totalDemandLocationCapacityConstraint[constraintName2] = { max: 0 };

    modelMathEquations.constraints[constraintName2] = {
      leftSide: ' 0',
      inequalitySign: '<=',
      rightSide: '0',
    }; // establishing right side of the equation

    // binary constraint for y for the model
    const constraintName3 = `y_${location}`;
    yBinaryConstraint[constraintName3] = { min: 0, max: 1 };

    // declare binary constraints for y variables in math equations
    modelMathEquations.variablesNature = `${modelMathEquations.variablesNature}@BIN(${constraintName3}); `; // y_dn is binary

    yBinaryVariables[constraintName3] = {
      location: locationName,
    };

    Object.keys(xBinaryVariables).forEach((xVar) => {
      const xVarComponents = xVar.split('_');
      if (xVarComponents[2] === location) {
        const constraintName = `location_selection_${xVar}_y_${location}`;
        locationSelectionConstraint[constraintName] = {
          max: 0,
        };

        modelMathEquations.constraints[constraintName] = {
          leftSide: ' 0',
          inequalitySign: '<=',
          rightSide: '0',
        }; // establishing right side of the equation
      }
    });

    products.forEach(({ id: product }) => {
      const constraintName = `product_amount_and_demand_${product}_${location}`;
      productAmountAndDemandConstraint[constraintName] = { equal: 0 };

      modelMathEquations.constraints[constraintName] = {
        leftSide: ' 0',
        inequalitySign: '=',
        rightSide: '0',
      }; // establishing right side of the equation
    });
  });

  shippingFactoryLocationProductCost.forEach(
    ({ product, factory, location, cost }) => {
      zIntegerVariables[`z_${product}_${factory}_${location}`] = {
        product: products.find((p) => p.id === product)?.name ?? '',
        factory: factories.find((f) => f.id === factory)?.name ?? '',
        location: locations.find((l) => l.id === location)?.name ?? '',
      };
      const capacity =
        factoryProductCapacity.find(
          ({ factory: _factory, product: _product }) =>
            _factory === factory && _product === product
        )?.capacity ?? 0;

      const constraintName1 = `factory_${factory}_product_${product}_capacity`;

      factoryCapacityPerProductConstraint[constraintName1] = {
        max: capacity,
      };
      modelMathEquations.constraints[constraintName1] = {
        leftSide: ' 0',
        inequalitySign: '<=',
        rightSide: `${capacity}`,
      }; // establishing right side of the equation

      const constraintName2 = `z_${product}_${factory}_${location}`;
      zIntegerConstraint[constraintName2] = {
        min: 0,
      };
      modelMathEquations.constraints[constraintName2] = {
        leftSide: `${cost}*${constraintName2}`,
        inequalitySign: '>=',
        rightSide: '0',
      }; // z_pfd is integer and greater than 0
      modelMathEquations.variablesNature = `${modelMathEquations.variablesNature}@GIN(${constraintName2}); `; // z_pfd is integer
    }
  );

  return {
    modelConstraints: {
      xBinaryConstraint,
      yBinaryConstraint,
      zIntegerConstraint,
      clientAssignationConstraint,
      locationSelectionConstraint,
      totalDemandLocationCapacityConstraint,
      productAmountAndDemandConstraint,
      factoryCapacityPerProductConstraint,
      productAndLocationCapacityConstraint,
      ...(totalBudget &&
        totalBudget > 0 && {
          budgetConstraint: {
            budgetConstraint: { max: totalBudget },
          },
        }),
    },
    xBinaryVariables,
    yBinaryVariables,
    zIntegerVariables,
    xVariablesWithUncertainty,
  };
}

interface GetVariablesProps {
  modelConstraints: ModelConstraints;
  locationCapacity: LocationCapacity[];
  totalClientDemand: TotalClientDemand[];
  productClientDemand: ProductClientDemand[];
  selectionLocationCost: SelectionLocationCost[];
  assignationClientLocationCost: AssignationClientLocationCost[];
  shippingFactoryLocationProductCost: ShippingFactoryLocationProductCost[];
  modelMathEquations: ModelMathEquations;
}

interface GetVariablesReturn {
  modelVariables: ModelVariables;
  modelInts: ModelInts;
  modelBinaries: ModelBinaries;
}
/**
 *  This function generates the variables with the constraints where they are involved and intConstraints for the model
 * @param modelConstraints: model constraints generated by the getConstraints function
 * @param locationCapacity: array of objects with the location and its capacity given by the user
 * @param totalClientDemand: array of objects with the client and its total demand given by the user
 * @param productClientDemand: array of objects with the client, product and its demand given by the user
 * @param selectionLocationCost: array of objects with the location and its cost given by the user
 * @param assignationClientLocationCost: array of objects with the client, location and its cost given by the user
 * @param shippingFactoryLocationProductCost: array of objects with the factory, location, product and its cost given by the user
 * @returns modelVariables: object with the variables and its constraints. modelInts: object with the variables and its intConstraints
 */
function getVariables({
  modelConstraints,
  locationCapacity,
  totalClientDemand,
  productClientDemand,
  selectionLocationCost,
  assignationClientLocationCost,
  shippingFactoryLocationProductCost,
  modelMathEquations,
}: GetVariablesProps): GetVariablesReturn {
  const {
    xBinaryConstraint,
    yBinaryConstraint,
    zIntegerConstraint,
    clientAssignationConstraint,
    locationSelectionConstraint,
    totalDemandLocationCapacityConstraint,
    productAmountAndDemandConstraint,
    factoryCapacityPerProductConstraint,
    productAndLocationCapacityConstraint,
    budgetConstraint,
  } = modelConstraints;

  // CONSTRAINTS ARRAYS WHERE X VARIABLES ARE INVOLVED / clientAssignationConstraintArray(1), locationSelectionConstraintArray(1), totalDemandLocationCapacityConstraintArray(1), productAmountAndDemandConstraintArray(more than one per xVariable)
  const clientAssignationConstraintArray = Object.keys(
    clientAssignationConstraint
  );
  const locationSelectionConstraintArray = Object.keys(
    locationSelectionConstraint
  );
  const totalDemandLocationCapacityConstraintArray = Object.keys(
    totalDemandLocationCapacityConstraint
  );
  const productAmountAndDemandConstraintArray = Object.keys(
    productAmountAndDemandConstraint
  );

  //  CONSTRAINTS ARRAYS WHERE Y VARIABLES ARE INVOLVED / locationSelectionConstraintArray(more than one, for each client related to y_dn), totalDemandLocationCapacityConstraintArray(1), productAndLocationCapacityConstraintArray(1)
  const productAndLocationCapacityConstraintArray = Object.keys(
    productAndLocationCapacityConstraint
  );

  //  CONSTRAINTS ARRAYS WHERE Z VARIABLES ARE INVOLVED / productAmountAndDemandConstraintArray(1), factoryCapacityPerProductConstraintArray(1), productAndLocationCapacityConstraintArray(1)
  const factoryCapacityPerProductConstraintArray = Object.keys(
    factoryCapacityPerProductConstraint
  );

  // VARIABLES TO RETURN
  const modelVariables: ModelVariables = {};
  const modelInts: ModelInts = {};
  const modelBinaries: ModelBinaries = {};

  // CONSTRUCT X VARIABLE OBJECTS WITH THE CONSTRAINTS WHERE THEY ARE INVOLVED
  Object.keys(xBinaryConstraint).forEach((key) => {
    const xConstraintElements = key.split('_'); // ["x", "cn", "dn"]

    const clientAssignationConstraintKey =
      clientAssignationConstraintArray.find((constraintKey) =>
        constraintKey.includes(xConstraintElements[1])
      ); // match with x variables that has the same client and location as the constraint

    const locationSelectionConstraintKey =
      locationSelectionConstraintArray.find((constraintKey) =>
        constraintKey.includes(key)
      ); // match with the entire x variable (because this constraint includes x_cn_dn_y_dn)

    const totalDemandLocationCapacityConstraintKey =
      totalDemandLocationCapacityConstraintArray.find((constraintKey) =>
        constraintKey.includes(xConstraintElements[2])
      ); // match with x variables that has the same location as the constraint

    const productAmountAndDemandConstraintKeys: { [key: string]: number } = {};

    productAmountAndDemandConstraintArray.forEach((constraintKey) => {
      const productClientDemandArray = productClientDemand.filter(
        (cd) => cd.client === xConstraintElements[1]
      ); // in productClientDemand are more than one product per client, so we filter by client to get only the products that the client demands

      const productClientDemandObject = productClientDemandArray.find(
        (clientDemandP) => constraintKey.includes(clientDemandP.product)
      ); // get the demand for the current product of the constraint and the client in x var

      if (
        constraintKey.includes(xConstraintElements[2]) &&
        constraintKey.includes(productClientDemandObject?.product ?? '/')
        // constraint key is in the form pn_dn and it has to match both product and location with productClientDemandObject elements
      ) {
        const demand = productClientDemandObject?.demand ?? 0;
        productAmountAndDemandConstraintKeys[constraintKey] = demand;

        modelMathEquations.constraints = {
          ...modelMathEquations.constraints,
          [constraintKey]: {
            ...modelMathEquations.constraints[constraintKey],
            leftSide: `${modelMathEquations.constraints[constraintKey].leftSide} + ${demand}*${key}`,
          },
        };
      }
    }); // match with x variables that has the same location as the constraint. For each x_cn_dn we have more than one constraints, one for each product that the client demands in that location

    const cost =
      assignationClientLocationCost.find(
        (cd) =>
          cd.client === xConstraintElements[1] &&
          cd.location === xConstraintElements[2]
      )?.cost[0] ?? 0; // FOR P MODEL WE ALWAYS TAKE THE FIRST COST WHICH IS THE LOWEST ONE IF IT HAS UNCERTAINTY

    const totalDemand =
      totalClientDemand.find((cd) => cd.client === xConstraintElements[1])
        ?.totalDemand ?? 0;

    // put the constraints in the modelVariables object of x_cn_dn variable
    modelVariables[key] = {
      // [key]: 1, // to apply the binary constraint of x variable

      ...(clientAssignationConstraintKey
        ? { [clientAssignationConstraintKey]: 1 }
        : {}),

      ...(locationSelectionConstraintKey
        ? { [locationSelectionConstraintKey]: 1 }
        : {}),

      ...(totalDemandLocationCapacityConstraintKey
        ? {
            [totalDemandLocationCapacityConstraintKey]: totalDemand,
          }
        : {}),

      ...(productAmountAndDemandConstraintKeys ?? {}),

      cost,
    };

    // declare that variable x_cn_dn must be binary
    modelBinaries[key] = 1;

    // put the variable in the objective function and constraints where it is involved in math equations
    modelMathEquations.objectiveFunction = `${modelMathEquations.objectiveFunction}+ ${cost}*${key} `;
    modelMathEquations.constraints = {
      ...modelMathEquations.constraints,
      ...(clientAssignationConstraintKey
        ? {
            [clientAssignationConstraintKey]: {
              ...modelMathEquations.constraints[clientAssignationConstraintKey],
              leftSide: `${modelMathEquations.constraints[clientAssignationConstraintKey].leftSide} + ${key}`,
            },
          }
        : {}),

      ...(locationSelectionConstraintKey
        ? {
            [locationSelectionConstraintKey]: {
              ...modelMathEquations.constraints[locationSelectionConstraintKey],
              leftSide: `${modelMathEquations.constraints[locationSelectionConstraintKey].leftSide} + ${key}`,
            },
          }
        : {}),

      ...(totalDemandLocationCapacityConstraintKey
        ? {
            [totalDemandLocationCapacityConstraintKey]: {
              ...modelMathEquations.constraints[
                totalDemandLocationCapacityConstraintKey
              ],
              leftSide: `${modelMathEquations.constraints[totalDemandLocationCapacityConstraintKey].leftSide} + ${totalDemand}*${key}`,
            },
          }
        : {}),
    };
  });

  // CONSTRUCT Y VARIABLE OBJECTS WITH THE CONSTRAINTS WHERE THEY ARE INVOLVED
  Object.keys(yBinaryConstraint).forEach((key) => {
    const yConstraintElements = key.split('_'); // ["y", "dn"]

    const locationSelectionConstraintKeys: { [key: string]: number } = {};
    locationSelectionConstraintArray.forEach((constraintKey) => {
      if (constraintKey.includes(`${yConstraintElements[1]}_${key}`)) {
        // these constraints are in the form x_cn_dn_y_dn and it has to match with both dn of x and y variables
        locationSelectionConstraintKeys[constraintKey] = -1;
        modelMathEquations.constraints[constraintKey] = {
          ...modelMathEquations.constraints[constraintKey],
          rightSide: `${modelMathEquations.constraints[constraintKey].rightSide} + ${key}`,
        };
      }
    }); // match with y variables that has the same location as the constraint

    const totalDemandLocationCapacityConstraintKey =
      totalDemandLocationCapacityConstraintArray.find((constraintKey) =>
        constraintKey.includes(yConstraintElements[1])
      ); // match with y variables that has the same location as the constraint

    const productAndLocationCapacityConstraintKey =
      productAndLocationCapacityConstraintArray.find((constraintKey) =>
        constraintKey.includes(yConstraintElements[1])
      ); // match with y variables that has the same location as the constraint

    // get locations capacity and put a negative sign to apply the constraint
    const locationCapacityForConstraints =
      locationCapacity.find((cd) => cd.location === yConstraintElements[1])
        ?.capacity ?? 0;

    // location cost
    const locationCost =
      selectionLocationCost.find(
        (slc) => slc.location === yConstraintElements[1]
      )?.cost ?? 0;

    // put the constraints in the modelVariables object of y_cn_dn variable
    modelVariables[key] = {
      // [key]: 1, // to apply the binary constraint of y variable

      ...(productAndLocationCapacityConstraintKey
        ? {
            [productAndLocationCapacityConstraintKey]:
              locationCapacityForConstraints * -1,
          }
        : {}),

      ...(locationSelectionConstraintKeys ?? {}),

      ...(totalDemandLocationCapacityConstraintKey
        ? {
            [totalDemandLocationCapacityConstraintKey]:
              locationCapacityForConstraints * -1,
          }
        : {}),

      ...(budgetConstraint && { budgetConstraint: locationCost }), // the sum of all location costs must be less than the budget

      cost: locationCost,
    };

    // declare that variable y_dn must be binary
    modelBinaries[key] = 1;

    // put the variable in the objective function and constraints where it is involved in math equations
    modelMathEquations.objectiveFunction = `${modelMathEquations.objectiveFunction}+ ${locationCost}*${key} `;
    modelMathEquations.constraints = {
      ...modelMathEquations.constraints,
      ...(productAndLocationCapacityConstraintKey
        ? {
            [productAndLocationCapacityConstraintKey]: {
              ...modelMathEquations.constraints[
                productAndLocationCapacityConstraintKey
              ],
              rightSide: `${modelMathEquations.constraints[productAndLocationCapacityConstraintKey].rightSide} + ${locationCapacityForConstraints}*${key}`,
            },
          }
        : {}),
      ...(totalDemandLocationCapacityConstraintKey
        ? {
            [totalDemandLocationCapacityConstraintKey]: {
              ...modelMathEquations.constraints[
                totalDemandLocationCapacityConstraintKey
              ],
              rightSide: `${modelMathEquations.constraints[totalDemandLocationCapacityConstraintKey].rightSide} + ${locationCapacityForConstraints}*${key}`,
            },
          }
        : {}),
    };
  });

  // CONSTRUCT Z VARIABLE OBJECTS WITH THE CONSTRAINTS WHERE THEY ARE INVOLVED
  Object.keys(zIntegerConstraint).forEach((key) => {
    const zConstraintElements = key.split('_'); // ["z", "pn", "fn", "dn"]

    const factoryCapacityPerProductConstraintKey =
      factoryCapacityPerProductConstraintArray.find(
        (constraintKey) =>
          constraintKey.includes(zConstraintElements[1]) &&
          constraintKey.includes(zConstraintElements[2])
      ); // match with y variables that has the same product and factory as the constraint

    const productAmountAndDemandConstraintKey =
      productAmountAndDemandConstraintArray.find(
        (constraintKey) =>
          constraintKey.includes(zConstraintElements[1]) &&
          constraintKey.includes(zConstraintElements[3])
      ); // match with y variables that has the same product and location as the constraint

    const productAndLocationCapacityConstraintKey =
      productAndLocationCapacityConstraintArray.find((constraintKey) =>
        constraintKey.includes(zConstraintElements[3])
      ); // match with y variables that has the same location as the constraint

    const cost =
      shippingFactoryLocationProductCost.find(
        (slc) =>
          slc.location === zConstraintElements[3] &&
          slc.factory === zConstraintElements[2] &&
          slc.product === zConstraintElements[1]
      )?.cost ?? 0;

    // put the constraints in the modelVariables object of z_pn_fn_dn variable
    modelVariables[key] = {
      [key]: 1, // to apply the binary constraint of y variable

      ...(factoryCapacityPerProductConstraintKey
        ? {
            [factoryCapacityPerProductConstraintKey]: 1,
          }
        : {}),
      ...(productAmountAndDemandConstraintKey
        ? {
            [productAmountAndDemandConstraintKey]: -1,
          }
        : {}),
      ...(productAndLocationCapacityConstraintKey
        ? {
            [productAndLocationCapacityConstraintKey]: 1,
          }
        : {}),

      cost,
    };

    // declare that variable x_cn_dn must be integer
    modelInts[key] = 1;

    // put the variable in the objective function and constraints where it is involved in math equations
    modelMathEquations.objectiveFunction = `${modelMathEquations.objectiveFunction}+ ${cost}*${key} `;
    modelMathEquations.constraints = {
      ...modelMathEquations.constraints,
      ...(factoryCapacityPerProductConstraintKey
        ? {
            [factoryCapacityPerProductConstraintKey]: {
              ...modelMathEquations.constraints[
                factoryCapacityPerProductConstraintKey
              ],
              leftSide: `${modelMathEquations.constraints[factoryCapacityPerProductConstraintKey].leftSide} + ${key}`,
            },
          }
        : {}),
      ...(productAmountAndDemandConstraintKey
        ? {
            [productAmountAndDemandConstraintKey]: {
              ...modelMathEquations.constraints[
                productAmountAndDemandConstraintKey
              ],
              rightSide: `${modelMathEquations.constraints[productAmountAndDemandConstraintKey].rightSide} + ${key}`,
            },
          }
        : {}),
      ...(productAndLocationCapacityConstraintKey
        ? {
            [productAndLocationCapacityConstraintKey]: {
              ...modelMathEquations.constraints[
                productAndLocationCapacityConstraintKey
              ],
              leftSide: `${modelMathEquations.constraints[productAndLocationCapacityConstraintKey].leftSide} + ${key}`,
            },
          }
        : {}),
    };
  });

  return { modelVariables, modelInts, modelBinaries };
}

interface ConstructPModelProps {
  variables: ModelInitialData;
  modelMathEquations: ModelMathEquations;
}
interface ConstructPModelReturn {
  dataConventions: DataConventions;
  model: Model;
  xVariablesWithUncertainty: UncertaintyVariable;
}

/** This function generates the model variables and constraints for the lp solver library
 * @param variables: the variables needed to generate the model
 * @returns the model variables and constraints. Also, the data conventions to be used in the solution display
 */
export function constructPModel({
  variables,
  modelMathEquations,
}: ConstructPModelProps): ConstructPModelReturn {
  const {
    clients,
    locations,
    products,
    factoryProductCapacity,
    assignationClientLocationCost,
    shippingFactoryLocationProductCost,
    locationCapacity,
    totalClientDemand,
    productClientDemand,
    selectionLocationCost,
    totalBudget,
    factories,
  } = variables;

  const {
    xBinaryVariables,
    yBinaryVariables,
    zIntegerVariables,
    modelConstraints,
    xVariablesWithUncertainty,
  } = getConstraints({
    clients,
    locations,
    products,
    factoryProductCapacity,
    assignationClientLocationCost,
    shippingFactoryLocationProductCost,
    totalBudget,
    factories,
    modelMathEquations,
  });

  const { modelVariables, modelInts, modelBinaries } = getVariables({
    modelConstraints,
    locationCapacity,
    totalClientDemand,
    productClientDemand,
    selectionLocationCost,
    assignationClientLocationCost,
    shippingFactoryLocationProductCost,
    modelMathEquations,
  });

  return {
    model: {
      optimize: 'cost',
      opType: 'min',
      constraints: {
        ...modelConstraints?.budgetConstraint,
        ...modelConstraints.clientAssignationConstraint,
        ...modelConstraints.factoryCapacityPerProductConstraint,
        ...modelConstraints.locationSelectionConstraint,
        ...modelConstraints.productAmountAndDemandConstraint,
        ...modelConstraints.productAndLocationCapacityConstraint,
        ...modelConstraints.totalDemandLocationCapacityConstraint,
        // ...modelConstraints.xBinaryConstraint,
        // ...modelConstraints.yBinaryConstraint,
        ...modelConstraints.zIntegerConstraint,
      },
      variables: modelVariables,
      ints: modelInts,
      binaries: modelBinaries,
      unrestricted: {},
    },
    dataConventions: {
      xBinaryVariables,
      yBinaryVariables,
      zIntegerVariables,
    },
    xVariablesWithUncertainty,
  };
}
