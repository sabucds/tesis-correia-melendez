import React from 'react';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { ModelInitialData } from '../../../models';
import { CREATE_MATH_MODEL } from '../../../graphql/mutation';
import { useNotify, useUser } from '../../../hooks';

export default function UploadInfoForm() {
  const methods = useForm<ModelInitialData>();
  const { register, control, handleSubmit } = methods;
  const [createMathModel] = useMutation(CREATE_MATH_MODEL);
  const router = useRouter();
  const notify = useNotify();
  const [user] = useUser();

  const {
    fields: factoryFields,
    append: appendFactory,
    remove: removeFactory,
  } = useFieldArray({
    control,
    name: 'factories',
  });
  const [factoryId, setFactoryId] = React.useState(1);
  const incrementFactoryId = () => {
    setFactoryId((prevFactoryId) => prevFactoryId + 1);
    return `f${factoryId.toString()}`;
  };

  const {
    fields: clientFields,
    append: appendClient,
    remove: removeClient,
  } = useFieldArray({
    control,
    name: 'clients',
  });
  const [clientId, setClientId] = React.useState(1);
  const incrementClientId = () => {
    setClientId((prevClientId) => prevClientId + 1);
    return `c${clientId.toString()}`;
  };

  const {
    fields: locationsFields,
    append: appendLocation,
    remove: removeLocation,
  } = useFieldArray({
    control,
    name: 'locations',
  });
  const [locationId, setLocationId] = React.useState(1);
  const incrementLocationId = () => {
    setLocationId((prevLocationId) => prevLocationId + 1);
    return `d${locationId.toString()}`;
  };

  const {
    fields: productFields,
    append: appendProduct,
    remove: removeProduct,
  } = useFieldArray({
    control,
    name: 'products',
  });
  const [productId, setProductId] = React.useState(1);
  const incrementProductId = () => {
    setProductId((prevProductId) => prevProductId + 1);
    return `p${productId.toString()}`;
  };

  // Combinaciones de fábricas y productos
  const combinationsFactoryProductCapacity = [];
  for (let i = 0; i < methods.getValues().factories?.length; i += 1) {
    for (let j = 0; j < methods.getValues().products?.length; j += 1) {
      const combination = {
        factory: methods.getValues().factories[i],
        product: methods.getValues().products[j],
      };
      combinationsFactoryProductCapacity.push(combination);
    }
  }

  // Combinaciones de clientes y localizaciones
  const combinationsClientLocation = [];
  for (let i = 0; i < methods.getValues().clients?.length; i += 1) {
    for (let j = 0; j < methods.getValues().locations?.length; j += 1) {
      const combination = {
        client: methods.getValues().clients[i],
        location: methods.getValues().locations[j],
      };
      combinationsClientLocation.push(combination);
    }
  }

  // Combinaciones de fábricas, productos y localización
  const combinationsShippingFactoryLocationProductCost = [];
  for (let j = 0; j < methods.getValues().locations?.length; j += 1) {
    for (let k = 0; k < methods.getValues().factories?.length; k += 1) {
      for (let l = 0; l < methods.getValues().products?.length; l += 1) {
        const combination = {
          location: methods.getValues().locations[j],
          factory: methods.getValues().factories[k],
          product: methods.getValues().products[l],
        };
        combinationsShippingFactoryLocationProductCost.push(combination);
      }
    }
  }

  const [steps, setSteps] = React.useState(1);
  const avanzar = () => {
    setSteps((prevSteps) => prevSteps + 1);
  };

  const onSubmit = (data) => {
    const processedData = {
      ...data,
      assignationClientLocationCost: data.assignationClientLocationCost.map(
        (relation) => ({
          ...relation,
          cost: [
            relation.cost[0] !== '' &&
            relation.cost[0] !== null &&
            relation.cost[0] !== 0
              ? relation.cost[0]
              : 0,
            relation.cost[1] !== '' &&
            relation.cost[1] !== null &&
            relation.cost[1] !== 0 &&
            !Number.isNaN(relation.cost[1])
              ? relation.cost[1]
              : 0,
          ],

          uncertainty:
            relation.cost[1] !== '' &&
            relation.cost[1] !== null &&
            relation.cost[1] !== 0,
        })
      ),
    };
    createMathModelWithForm(processedData);
  };

  const createMathModelWithForm = async (dataModel) => {
    console.log('dataModel');
    console.log(dataModel);
    try {
      const { data } = await createMathModel({
        variables: {
          data: {
            user: user._id,
            data: dataModel,
          },
        },
      });

      if (data) {
        // La mutación fue exitosa
        const createdModelId = data.createMathModel._id;
        notify('Creación del modelo exitosa', 'success');
        console.log(dataModel);
        router.push({
          pathname: '/results',
          query: { id: createdModelId },
        });
      } else {
        // La mutación falló
        return notify('Ocurrió un error al crear el modelo', 'error');
      }
    } catch (err) {
      // Manejo de errores
      console.error(err);
      return notify(err.message, 'error');
    }
  };
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-4"
      >
        {steps === 1 && (
          <>
            {/* Fabricas */}
            {factoryFields.map((item, index) => (
              <div key={item.id} className="flex space-x-4">
                <input
                  {...register(`factories.${index}.name`)}
                  className="border p-2"
                />
                <button
                  type="button"
                  onClick={() => removeFactory(index)}
                  className="bg-red-500 text-white p-2"
                >
                  Eliminar fábrica
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                appendFactory({ id: incrementFactoryId(), name: '' })
              }
              className="bg-blue-500 text-white p-2"
            >
              Agregar fábrica
            </button>

            {/* Clientes */}
            {clientFields.map((item, index) => (
              <div key={item.id} className="flex space-x-4">
                <input
                  {...register(`clients.${index}.name`)}
                  className="border p-2"
                />
                <button
                  type="button"
                  onClick={() => removeClient(index)}
                  className="bg-red-500 text-white p-2"
                >
                  Eliminar cliente
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                appendClient({ id: incrementClientId(), name: '' })
              }
              className="bg-blue-500 text-white p-2"
            >
              Agregar cliente
            </button>

            {/* Localizaciones */}
            {locationsFields.map((item, index) => (
              <div key={item.id} className="flex space-x-4">
                <input
                  {...register(`locations.${index}.name`)}
                  className="border p-2"
                />
                <button
                  type="button"
                  onClick={() => removeLocation(index)}
                  className="bg-red-500 text-white p-2"
                >
                  Eliminar Localización
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                appendLocation({ id: incrementLocationId(), name: '' })
              }
              className="bg-blue-500 text-white p-2"
            >
              Agregar Localización
            </button>

            {/* Productos */}
            {productFields.map((item, index) => (
              <div key={item.id} className="flex space-x-4">
                <input
                  {...register(`products.${index}.name`)}
                  className="border p-2"
                />
                <button
                  type="button"
                  onClick={() => removeProduct(index)}
                  className="bg-red-500 text-white p-2"
                >
                  Eliminar Producto
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                appendProduct({ id: incrementProductId(), name: '' })
              }
              className="bg-blue-500 text-white p-2"
            >
              Agregar Producto
            </button>
          </>
        )}

        {steps === 2 && (
          <>
            {/* Relaciones Cliente-Localización-Costo */}
            {combinationsClientLocation.map((combination, combinationIndex) => (
              <div key={`${combinationIndex}`} className="flex space-x-4">
                <input
                  {...register(
                    `assignationClientLocationCost.${combinationIndex}.client`
                  )}
                  value={`${combination.client.id}`}
                  type="hidden"
                />
                <p>{combination.client.name}</p>
                <input
                  {...register(
                    `assignationClientLocationCost.${combinationIndex}.location`
                  )}
                  value={`${combination.location.id}`}
                  type="hidden"
                />
                <p>{combination.location.name}</p>
                <input
                  {...register(
                    `assignationClientLocationCost.${combinationIndex}.cost.0`,
                    {
                      valueAsNumber: true,
                    }
                  )}
                  min="0"
                  type="number"
                  className="border p-2"
                />
                <input
                  {...register(
                    `assignationClientLocationCost.${combinationIndex}.cost.1`,
                    {
                      valueAsNumber: true,
                    }
                  )}
                  min="0"
                  type="number"
                  className="border p-2"
                  defaultValue={
                    methods.getValues(
                      `assignationClientLocationCost.${combinationIndex}.cost.1`
                    ) || 0
                  }
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (!Number.isNaN(value)) {
                      // Actualizar el valor en el estado del formulario directamente
                      methods.setValue(
                        `assignationClientLocationCost.${combinationIndex}.cost.1`,
                        value
                      );
                    }
                  }}
                />
              </div>
            ))}
          </>
        )}

        {steps === 3 && (
          <>
            {/* Relaciones Localización-Costo */}
            {methods.getValues().locations.map((item, index) => (
              <div key={item.id} className="flex space-x-4">
                <input
                  {...register(`selectionLocationCost.${index}.location`)}
                  value={`d${index + 1}`}
                  type="hidden"
                />
                <p>{item.name}</p>
                <input
                  {...register(`selectionLocationCost.${index}.cost`, {
                    valueAsNumber: true,
                  })}
                  type="number"
                  min="0"
                  className="border p-2"
                />
              </div>
            ))}
          </>
        )}

        {steps === 4 && (
          <>
            {/* Relación shippingFactoryLocationProductCost */}
            {combinationsShippingFactoryLocationProductCost.map(
              (combination, combinationIndex) => (
                <div key={`${combinationIndex}`} className="flex space-x-4">
                  <input
                    {...register(
                      `shippingFactoryLocationProductCost.${combinationIndex}.product`
                    )}
                    value={`${combination.product.id}`}
                    type="hidden"
                  />
                  <p>{combination.product.name}</p>
                  <input
                    {...register(
                      `shippingFactoryLocationProductCost.${combinationIndex}.factory`
                    )}
                    value={`${combination.factory.id}`}
                    type="hidden"
                  />
                  <p>{combination.factory.name}</p>
                  <input
                    {...register(
                      `shippingFactoryLocationProductCost.${combinationIndex}.location`
                    )}
                    value={`${combination.location.id}`}
                    type="hidden"
                  />
                  <p>{combination.location.name}</p>
                  <input
                    {...register(
                      `shippingFactoryLocationProductCost.${combinationIndex}.cost`,
                      {
                        valueAsNumber: true,
                      }
                    )}
                    type="number"
                    min="0"
                    className="border p-2"
                  />
                </div>
              )
            )}
          </>
        )}

        {steps === 5 && (
          <>
            {/* Relación totalClientDemand */}
            {/* Relación productClientDemand */}

            {methods.getValues().clients.map((item, index) => (
              <div key={item.id} className="flex space-x-4">
                <input
                  {...register(`productClientDemand.${index}.client`)}
                  value={`c${index + 1}`}
                  type="hidden"
                />
                <p>{item.name}</p>
                <select
                  className="border p-2"
                  {...register(`productClientDemand.${index}.product`)}
                >
                  {methods.getValues().products.map((product, productIndex) => (
                    <option key={product.id} value={`p${productIndex + 1}`}>
                      {product.name}
                    </option>
                  ))}
                </select>
                <input
                  {...register(`productClientDemand.${index}.demand`, {
                    valueAsNumber: true,
                  })}
                  type="number"
                  min="0"
                  className="border p-2"
                />
              </div>
            ))}
          </>
        )}

        {steps === 6 && (
          <>
            {/* Relación locationCapacity */}

            {methods.getValues().locations.map((item, index) => (
              <div key={item.id} className="flex space-x-4">
                <input
                  {...register(`locationCapacity.${index}.location`)}
                  value={`d${index + 1}`}
                  type="hidden"
                />
                <p>{item.name}</p>
                <input
                  {...register(`locationCapacity.${index}.capacity`, {
                    valueAsNumber: true,
                  })}
                  min="0"
                  type="number"
                  className="border p-2"
                />
              </div>
            ))}
          </>
        )}

        {steps === 7 && (
          <>
            {/* Relación factoryProductCapacity */}
            {combinationsFactoryProductCapacity.map(
              (combination, combinationIndex) => (
                <div key={`${combinationIndex}`} className="flex space-x-4">
                  <input
                    {...register(
                      `factoryProductCapacity.${combinationIndex}.factory`
                    )}
                    value={`${combination.factory.id}`}
                    type="hidden"
                  />
                  <p>{combination.factory.name}</p>
                  <input
                    {...register(
                      `factoryProductCapacity.${combinationIndex}.product`
                    )}
                    value={`${combination.product.id}`}
                    type="hidden"
                  />
                  <p>{combination.product.name}</p>
                  <input
                    {...register(
                      `factoryProductCapacity.${combinationIndex}.capacity`,
                      {
                        valueAsNumber: true,
                      }
                    )}
                    min="0"
                    type="number"
                    className="border p-2"
                  />
                </div>
              )
            )}
          </>
        )}

        {steps === 8 && (
          <>
            {/* Presupuesto total */}
            <p>Presupuesto Total</p>
            <input
              {...register(`totalBudget`, {
                valueAsNumber: true,
              })}
              min="0"
              type="number"
              className="border p-2"
            />
          </>
        )}

        <button
          type="button"
          onClick={() => setSteps((prevSteps) => prevSteps - 1)}
          className="bg-gray-200 text-white p-2"
        >
          Anterior
        </button>
        <button
          type="button"
          onClick={() => avanzar()}
          className="bg-yellow-500 text-white p-2"
        >
          Siguiente
        </button>
        <button type="submit" className="bg-green-500 text-white p-2">
          Enviar
        </button>
      </form>
    </FormProvider>
  );
}
