import React from 'react';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { AddIcon, DelateIcon } from '@avila-tek/ui/src/icons';
import { Input } from '@avila-tek/ui/src/input/Input';
import { Button } from '@avila-tek/ui';
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
    console.log(methods.getValues());
  };
  const retroceder = () => {
    setSteps((prevSteps) => prevSteps - 1);
    window.scrollTo(0, 0);
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
      totalClientDemand: data.productClientDemand.map((relation) => ({
        client: relation.client,
        totalDemand: relation.demand,
      })),
    };
    createMathModelWithForm(processedData);
  };

  const createMathModelWithForm = async (processedData) => {
    console.log('dataModel');
    console.log(processedData);
    try {
      const { data } = await createMathModel({
        variables: {
          data: {
            user: user._id,
            data: processedData,
          },
        },
      });

      if (data) {
        // La mutación fue exitosa
        const createdModelId = data.createMathModel._id;
        notify('Creación del modelo exitosa', 'success');
        console.log(processedData);
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
            <p className="font-bold text-2xl text-text pb-2 mb-4 w-full border-b border-primary-300">
              Elementos principales (nombres o códigos)
            </p>
            {/* Fabricas */}
            <div className="bg-white px-3 md:px-8 py-4 rounded flex flex-col items-end ">
              <p className="font-semibold text-xl text-text pb-3  w-full text-start underline">
                Fábricas:
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 pb-4 w-full">
                {factoryFields.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex flex-row space-x-4 item text-start"
                  >
                    <Input
                      label={`Fábrica ${index + 1}`}
                      type="text"
                      name="factory"
                      placeholder={`Nombre de la fábrica ${index + 1}`}
                      {...register(`factories.${index}.name`)}
                      required
                      className="w-full"
                      rightIcon={
                        <button
                          type="button"
                          onClick={() => removeFactory(index)}
                        >
                          <DelateIcon className="w-6 h-6 text-red-500 hover:text-red-600" />
                        </button>
                      }
                    />
                  </div>
                ))}
              </div>

              <Button
                className="font-medium text-sm px-6 py-3 w-fit flex items-center justify-center space-x-2"
                type="button"
                onClick={() =>
                  appendFactory({ id: incrementFactoryId(), name: '' })
                }
              >
                <AddIcon className="w-4 h-4 mr-2" />
                Agregar fábrica
              </Button>
            </div>

            {/* Clientes */}
            <div className="bg-white px-3 md:px-8 py-4 rounded flex flex-col items-end ">
              <p className="font-semibold text-xl text-text pb-3  w-full text-start underline">
                Clientes
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 pb-4 w-full">
                {clientFields.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex flex-row space-x-4 item text-start"
                  >
                    <Input
                      label={`Cliente ${index + 1}`}
                      type="text"
                      name="client"
                      placeholder={`Nombre del cliente ${index + 1}`}
                      {...register(`clients.${index}.name`)}
                      required
                      className="w-full"
                      rightIcon={
                        <button
                          type="button"
                          onClick={() => removeClient(index)}
                        >
                          <DelateIcon className="w-6 h-6 text-red-500 hover:text-red-600" />
                        </button>
                      }
                    />
                  </div>
                ))}
              </div>

              <Button
                className="font-medium text-sm px-6 py-3 w-fit flex items-center justify-center space-x-2"
                type="button"
                onClick={() =>
                  appendClient({ id: incrementClientId(), name: '' })
                }
              >
                <AddIcon className="w-4 h-4 mr-2" />
                Agregar cliente
              </Button>
            </div>

            {/* Localizaciones */}
            <div className="bg-white px-3 md:px-8 py-4 rounded flex flex-col items-end ">
              <p className="font-semibold text-xl text-text pb-3  w-full text-start underline">
                Localizaciones
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 pb-4 w-full">
                {locationsFields.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex flex-row space-x-4 item text-start"
                  >
                    <Input
                      label={`Localización ${index + 1}`}
                      type="text"
                      name="location"
                      placeholder={`Nombre de la Localización ${index + 1}`}
                      {...register(`locations.${index}.name`)}
                      required
                      className="w-full"
                      rightIcon={
                        <button
                          type="button"
                          onClick={() => removeLocation(index)}
                        >
                          <DelateIcon className="w-6 h-6 text-red-500 hover:text-red-600" />
                        </button>
                      }
                    />
                  </div>
                ))}
              </div>

              <Button
                className="font-medium text-sm px-6 py-3 w-fit flex items-center justify-center space-x-2"
                type="button"
                onClick={() =>
                  appendLocation({ id: incrementLocationId(), name: '' })
                }
              >
                <AddIcon className="w-4 h-4 mr-2" />
                Agregar Localización
              </Button>
            </div>

            {/* Productos */}
            <div className="bg-white px-3 md:px-8 py-4 rounded flex flex-col items-end ">
              <p className="font-semibold text-xl text-text pb-3  w-full text-start underline">
                Productos
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 pb-4 w-full">
                {productFields.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex flex-row space-x-4 item text-start"
                  >
                    <Input
                      label={`Producto ${index + 1}`}
                      type="text"
                      name="product"
                      placeholder={`Nombre del Producto ${index + 1}`}
                      {...register(`products.${index}.name`)}
                      required
                      className="w-full"
                      rightIcon={
                        <button
                          type="button"
                          onClick={() => removeProduct(index)}
                        >
                          <DelateIcon className="w-6 h-6 text-red-500 hover:text-red-600" />
                        </button>
                      }
                    />
                  </div>
                ))}
              </div>

              <Button
                className="font-medium text-sm px-6 py-3 w-fit flex items-center justify-center space-x-2"
                type="button"
                onClick={() =>
                  appendProduct({ id: incrementProductId(), name: '' })
                }
              >
                <AddIcon className="w-4 h-4 mr-2" />
                Agregar Producto
              </Button>
            </div>
          </>
        )}

        {steps === 2 && (
          <>
            {/* Relaciones Cliente-Localización-Costo */}
            <div className="bg-white px-3 md:px-8 py-4 rounded flex flex-col items-end ">
              <p className="font-semibold text-xl text-text pb-3  w-full text-start underline">
                Costo de asignación Localización-cliente
              </p>
              <div className="flex flex-col divide-y  divide-text-light">
                {combinationsClientLocation.map(
                  (combination, combinationIndex) => (
                    <div
                      key={`${combinationIndex}`}
                      className="flex space-x-4 py-3 justify-between items-center text-start "
                    >
                      <div className="flex flex-col">
                        <p className="font-medium">
                          Cliente:{' '}
                          <span className="font-normal">
                            {combination.client.name}
                          </span>
                        </p>
                        <p className="font-medium">
                          Localización:{' '}
                          <span className="font-normal">
                            {combination.location.name}
                          </span>
                        </p>
                      </div>
                      <input
                        {...register(
                          `assignationClientLocationCost.${combinationIndex}.client`
                        )}
                        value={`${combination.client.id}`}
                        type="hidden"
                      />
                      <input
                        {...register(
                          `assignationClientLocationCost.${combinationIndex}.location`
                        )}
                        value={`${combination.location.id}`}
                        type="hidden"
                      />
                      <div className="flex w-1/2  space-x-4">
                        <Input
                          label="Costo mínimo"
                          name="minCost"
                          {...register(
                            `assignationClientLocationCost.${combinationIndex}.cost.0`,
                            {
                              valueAsNumber: true,
                            }
                          )}
                          min="0"
                          type="number"
                          required
                        />
                        <Input
                          label="Costo máximo"
                          name="maxCost"
                          {...register(
                            `assignationClientLocationCost.${combinationIndex}.cost.1`,
                            {
                              valueAsNumber: true,
                            }
                          )}
                          min="0"
                          type="number"
                          required
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
                      {/* <input
                        {...register(
                          `assignationClientLocationCost.${combinationIndex}.cost.0`,
                          {
                            valueAsNumber: true,
                          }
                        )}
                        min="0"
                        type="number"
                        className="border p-2"
                      /> */}
                      {/* <input
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
                      /> */}
                    </div>
                  )
                )}
              </div>
            </div>
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
