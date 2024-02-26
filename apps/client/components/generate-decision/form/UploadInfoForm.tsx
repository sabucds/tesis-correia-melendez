import React from 'react';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import { useRouter, withRouter } from 'next/router';
import { AddIcon, DelateIcon, ArrowIcon } from '@avila-tek/ui/src/icons';
import { Input } from '@avila-tek/ui/src/input/Input';
import { Button } from '@avila-tek/ui/src';
import { ModelInitialData } from '../../../models';
import { CREATE_MATH_MODEL } from '../../../graphql/mutation';
import { useNotify, useUser } from '../../../hooks';
import LoadingModal from './LoadingModal';

function UploadInfoForm() {
  const methods = useForm<ModelInitialData>();
  const { register, control, handleSubmit } = methods;
  const [createMathModel] = useMutation(CREATE_MATH_MODEL);
  const router = useRouter();
  const notify = useNotify();
  const [user] = useUser();
  const [modelName, setModelName] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleInputChange = (e) => {
    setModelName(e.target.value);
  };

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
    window.scrollTo(0, 0);
    // console.log(methods.getValues());
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
    // console.log('dataModel');
    // console.log(processedData);
    try {
      setLoading(true);
      const { data } = await createMathModel({
        variables: {
          data: {
            user: user._id,
            data: processedData,
            name: modelName,
          },
        },
      });

      if (data) {
        // La mutación fue exitosa
        const createdModelId = data.createMathModel._id;
        notify('Creación del modelo exitosa', 'success');
        // console.log(processedData);
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
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingModal />;

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-4"
      >
        {steps === 1 && (
          <>
            <p className="font-bold text-2xl text-primary-400 pb-2 mb-4 w-full border-b border-primary-300">
              Elementos principales (nombres o códigos)
            </p>
            {/* Fabricas */}
            <div className="bg-white px-3 md:px-8 py-4 rounded flex flex-col items-end shadow-md">
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
                          id="removeFactory"
                          aria-label="remove factory"
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
                className="font-medium text-sm text-white px-6 py-3 w-fit flex items-center justify-center space-x-2"
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
            <div className="bg-white px-3 md:px-8 py-4 rounded flex flex-col items-end  shadow-md">
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
                          id="removeClient"
                          aria-label="remove client"
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
                className="font-medium text-white text-sm px-6 py-3 w-fit flex items-center justify-center space-x-2"
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
            <div className="bg-white px-3 md:px-8 py-4 rounded flex flex-col items-end shadow-md ">
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
                          id="removeLocation"
                          aria-label="remove location"
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
                className="font-medium text-white text-sm px-6 py-3 w-fit flex items-center justify-center space-x-2"
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
            <div className="bg-white px-3 md:px-8 py-4 rounded flex flex-col items-end  shadow-md">
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
                          id="removeProduct"
                          aria-label="remove product"
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
                className="font-medium  text-white text-sm px-6 py-3 w-fit flex items-center justify-center space-x-2"
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
            <div className="bg-white px-3 md:px-8 py-4 rounded flex flex-col items-end  shadow-md">
              <p className="font-semibold text-xl text-primary-400 pb-3  w-full text-start underline">
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
            <div className="bg-white px-3 md:px-8 py-4 rounded flex flex-col items-center  shadow-md">
              <p className="font-semibold text-xl text-primary-400 pb-3  w-full text-start underline">
                Costo de seleccionar la localización
              </p>
              <div className="w-full text-base flex items-end justify-between px-8 border-b pb-2 border-text font-semibold ">
                <p>Localización</p>
                <p>Costo de selección</p>
              </div>
              <div className="flex flex-col divide-y w-full divide-text-light">
                {methods.getValues().locations.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex space-x-4 py-3 justify-between items-center text-start "
                  >
                    <input
                      {...register(`selectionLocationCost.${index}.location`)}
                      value={`d${index + 1}`}
                      type="hidden"
                    />
                    <p className="font-normal">{item.name}</p>
                    {/* <input
                      {...register(`selectionLocationCost.${index}.cost`, {
                        valueAsNumber: true,
                      })}
                      type="number"
                      min="0"
                      className="border p-2"
                    /> */}
                    <Input
                      type="number"
                      min="0"
                      placeholder={`Costo de selección ${index + 1}`}
                      {...register(`selectionLocationCost.${index}.cost`, {
                        valueAsNumber: true,
                      })}
                      required
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
            </div>
            {/* Relaciones Localización-Costo */}
            {/* {methods.getValues().locations.map((item, index) => (
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
            ))} */}
          </>
        )}

        {steps === 4 && (
          <>
            {/* Relación shippingFactoryLocationProductCost */}
            <div className="bg-white px-3 md:px-8 py-4 rounded flex flex-col items-end shadow-md ">
              <p className="font-semibold text-xl text-primary-400 pb-3  w-full text-start underline">
                Costo de envío de cada producto desde cada fabrica a cada
                localización
              </p>
              <div className="w-full text-base flex items-end justify-between px-8 border-b pb-2 border-text font-semibold ">
                <p>Relación producto-fábrica-localización</p>
                <p>Costo de envío</p>
              </div>
              <div className="flex flex-col divide-y w-full divide-text-light">
                {combinationsShippingFactoryLocationProductCost.map(
                  (combination, combinationIndex) => (
                    <div
                      key={`${combinationIndex}`}
                      className="flex space-x-4 py-3 justify-between items-center text-start "
                    >
                      <input
                        {...register(
                          `shippingFactoryLocationProductCost.${combinationIndex}.product`
                        )}
                        value={`${combination.product.id}`}
                        type="hidden"
                      />
                      <input
                        {...register(
                          `shippingFactoryLocationProductCost.${combinationIndex}.factory`
                        )}
                        value={`${combination.factory.id}`}
                        type="hidden"
                      />
                      <input
                        {...register(
                          `shippingFactoryLocationProductCost.${combinationIndex}.location`
                        )}
                        value={`${combination.location.id}`}
                        type="hidden"
                      />
                      <div className="flex flex-col">
                        <p className="font-medium">
                          Producto:{' '}
                          <span className="font-normal">
                            {combination.product.name}
                          </span>
                        </p>
                        <p className="font-medium">
                          Fábrica:{' '}
                          <span className="font-normal">
                            {combination.factory.name}
                          </span>
                        </p>
                        <p className="font-medium">
                          Localización:{' '}
                          <span className="font-normal">
                            {combination.location.name}
                          </span>
                        </p>
                      </div>
                      <Input
                        placeholder="Costo"
                        name="cost"
                        {...register(
                          `shippingFactoryLocationProductCost.${combinationIndex}.cost`,
                          {
                            valueAsNumber: true,
                          }
                        )}
                        min="0"
                        type="number"
                        required
                      />
                      {/* <input
                      {...register(
                        `shippingFactoryLocationProductCost.${combinationIndex}.cost`,
                        {
                          valueAsNumber: true,
                        }
                      )}
                      type="number"
                      min="0"
                      className="border p-2"
                    /> */}
                    </div>
                  )
                )}
              </div>
            </div>
          </>
        )}

        {steps === 5 && (
          <>
            {/* Relación totalClientDemand */}
            {/* Relación productClientDemand */}
            <div className="bg-white px-3 md:px-8 py-4 rounded flex flex-col items-end shadow-md ">
              <p className="font-semibold text-xl text-primary-400 pb-3  w-full text-start underline">
                Demanda de cada producto para cada cliente
              </p>
              <div className="w-full text-base flex items-end justify-between px-8 border-b pb-2 border-text font-semibold ">
                <p>Relación cliente-producto</p>
                <p>Demanda del producto</p>
              </div>
              <div className="flex flex-col divide-y w-full divide-text-light">
                {methods.getValues().clients.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex space-x-4 py-3 justify-between items-center text-start "
                  >
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center md:w-1/2 ">
                      <input
                        {...register(`productClientDemand.${index}.client`)}
                        value={`c${index + 1}`}
                        type="hidden"
                      />
                      <p className="font-medium">
                        Cliente:{' '}
                        <span className="font-normal">{item.name}</span>
                      </p>
                      <select
                        className={` md:w-2/5 px-4 py-2 border border-primary-300 rounded-md text-text-light `}
                        {...register(`productClientDemand.${index}.product`)}
                      >
                        {methods
                          .getValues()
                          .products.map((product, productIndex) => (
                            <option
                              key={product.id}
                              value={`p${productIndex + 1}`}
                            >
                              {product.name}
                            </option>
                          ))}
                      </select>
                    </div>
                    <Input
                      name="demand"
                      {...register(`productClientDemand.${index}.demand`, {
                        valueAsNumber: true,
                      })}
                      placeholder={`Demanda ${index + 1}`}
                      min="0"
                      type="number"
                      required
                      className="w-full md:w-auto"
                    />
                    {/* <input
                      {...register(`productClientDemand.${index}.demand`, {
                        valueAsNumber: true,
                      })}
                      type="number"
                      min="0"
                      className="border p-2"
                    /> */}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {steps === 6 && (
          <>
            {/* Relación locationCapacity */}
            <div className="bg-white px-3 md:px-8 py-4 rounded flex flex-col items-end  shadow-md">
              <p className="font-semibold text-xl text-primary-400 pb-3  w-full text-start underline">
                Capacidad de cada localización
              </p>
              <div className="w-full text-base flex items-end justify-between px-8 border-b pb-2 border-text font-semibold ">
                <p>Localización</p>
                <p>Capacidad</p>
              </div>
              <div className="flex flex-col divide-y w-full divide-text-light">
                {methods.getValues().locations.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex space-x-4 py-3 justify-between items-center text-start "
                  >
                    <input
                      {...register(`locationCapacity.${index}.location`)}
                      value={`d${index + 1}`}
                      type="hidden"
                    />
                    <p className="font-normal">{item.name}</p>
                    {/* <input
                      {...register(`locationCapacity.${index}.capacity`, {
                        valueAsNumber: true,
                      })}
                      min="0"
                      type="number"
                      className="border p-2"
                    /> */}
                    <Input
                      type="number"
                      min="0"
                      placeholder={`Capacidad ${index + 1}`}
                      {...register(`locationCapacity.${index}.capacity`, {
                        valueAsNumber: true,
                      })}
                      required
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {steps === 7 && (
          <>
            <div className="bg-white px-3 md:px-8 py-4 rounded flex flex-col items-end  shadow-md">
              <p className="font-semibold text-xl text-primary-400 pb-3  w-full text-start underline">
                Capacidad de producción de cada fabrica por cada producto
              </p>
              <div className="w-full text-base flex items-end justify-between px-8 border-b pb-2 border-text font-semibold ">
                <p>Relación fábrica-producto</p>
                <p>Capacidad</p>
              </div>
              <div className="flex flex-col divide-y w-full divide-text-light">
                {combinationsFactoryProductCapacity.map(
                  (combination, combinationIndex) => (
                    <div
                      key={`${combinationIndex}`}
                      className="flex space-x-4 py-3 justify-between items-center text-start "
                    >
                      <input
                        {...register(
                          `factoryProductCapacity.${combinationIndex}.factory`
                        )}
                        value={`${combination.factory.id}`}
                        type="hidden"
                      />
                      <input
                        {...register(
                          `factoryProductCapacity.${combinationIndex}.product`
                        )}
                        value={`${combination.product.id}`}
                        type="hidden"
                      />
                      <div className="flex flex-col">
                        <p className="font-medium">
                          Fábrica:{' '}
                          <span className="font-normal">
                            {combination.factory.name}
                          </span>
                        </p>
                        <p className="font-medium">
                          Producto:{' '}
                          <span className="font-normal">
                            {combination.product.name}
                          </span>
                        </p>
                      </div>
                      {/* <input
                        {...register(
                          `factoryProductCapacity.${combinationIndex}.capacity`,
                          {
                            valueAsNumber: true,
                          }
                        )}
                        min="0"
                        type="number"
                        className="border p-2"
                      /> */}
                      <Input
                        type="number"
                        min="0"
                        placeholder={`Capacidad ${combinationIndex + 1}`}
                        {...register(
                          `factoryProductCapacity.${combinationIndex}.capacity`,
                          {
                            valueAsNumber: true,
                          }
                        )}
                        required
                        className="w-full"
                      />
                    </div>
                  )
                )}
              </div>
            </div>
            {/* Relación factoryProductCapacity */}
          </>
        )}

        {steps === 8 && (
          <div>
            <div className="bg-white px-3 md:px-8 py-4 rounded flex flex-col items-end space-y-4 shadow-md">
              <div className="w-full flex flex-col ">
                <p className="font-semibold text-xl text-primary-400 pb-3  w-full text-start underline">
                  Presupuesto Total
                </p>
                <div className="w-full">
                  <Input
                    type="number"
                    min="0"
                    placeholder="Ingrese su presupuesto total"
                    {...register(`totalBudget`, {
                      valueAsNumber: true,
                    })}
                    className="w-full"
                  />
                </div>
              </div>
              <div className="w-full flex flex-col ">
                <p className="font-semibold text-xl text-primary-400 pb-3  w-full text-start underline">
                  Nombre del modelo
                </p>
                <div className="w-full">
                  <Input
                    type="text"
                    placeholder="Ingrese un nombre para su modelo"
                    value={modelName}
                    onChange={handleInputChange}
                    required
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {steps === 1 && (
          <Button
            onClick={() => avanzar()}
            className="w-1/2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed bg-gray-200 hover:bg-gray-300 text-black font-medium px-6 py-3 flex items-center justify-center space-x-2"
            disabled={
              methods.getValues().factories?.length === 0 ||
              methods.getValues().clients?.length === 0 ||
              methods.getValues().locations?.length === 0 ||
              methods.getValues().products?.length === 0
            }
            type="button"
          >
            Siguiente
            <ArrowIcon className="h-3 w-3 ml-2" />
          </Button>
        )}
        {steps > 1 && steps < 8 && (
          <div className="flex space-x-4 items-center justify-center">
            <Button
              type="button"
              onClick={() => retroceder()}
              className="shadow-md rounded-lg bg-gray-200 hover:bg-gray-300 text-black font-medium px-6 py-3 flex items-center justify-center space-x-2"
            >
              <ArrowIcon className="h-3 w-3 mr-2 rotate-180" />
              Anterior
            </Button>
            <Button
              onClick={() => avanzar()}
              className="w-1/2 shadow-md  bg-gray-200 hover:bg-gray-300 text-black font-medium px-6 py-3 flex items-center justify-center space-x-2"
              type="button"
            >
              Siguiente
              <ArrowIcon className="h-3 w-3 ml-2" />
            </Button>
          </div>
        )}

        {steps === 8 && (
          <div className="flex space-x-4 items-center justify-center">
            <Button
              type="button"
              onClick={() => retroceder()}
              className="shadow-md rounded-lg bg-gray-200 hover:bg-gray-300 text-black font-medium px-6 py-3 flex items-center justify-center space-x-2"
            >
              <ArrowIcon className="h-3 w-3 mr-2 rotate-180" />
              Anterior
            </Button>
            <Button
              className="bg-primary-300 hover:bg-primary-400 text-white font-semibold px-6 py-3 shadow-md "
              type="submit"
            >
              Enviar
            </Button>
          </div>
        )}
      </form>
    </FormProvider>
  );
}

export default withRouter(UploadInfoForm);
