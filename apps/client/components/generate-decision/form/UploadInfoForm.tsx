import React from 'react';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import { ModelInitialData } from '../../../models';

export default function UploadInfoForm() {
  const methods = useForm<ModelInitialData>();
  const { register, control, handleSubmit } = methods;

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

  // Relación assignationClientLocationCost
  const {
    fields: assignationClientLocationCostFields,
    append: appendAssignationCLC,
    remove: removeAssignationCLC,
  } = useFieldArray({
    control,
    name: 'assignationClientLocationCost',
  });

  // Relación selectionLocationCost
  const {
    fields: selectionLocationCostFields,
    append: appendAssignationLC,
    remove: removeAssignationLC,
  } = useFieldArray({
    control,
    name: 'selectionLocationCost',
  });

  // Relación shippingFactoryLocationProductCost
  const {
    fields: shippingFactoryLocationProductCostFields,
    append: appendShippingFLPC,
    remove: removeShippingFLPC,
  } = useFieldArray({
    control,
    name: 'shippingFactoryLocationProductCost',
  });

  const [steps, setSteps] = React.useState(1);
  const avanzar = () => {
    setSteps((prevSteps) => prevSteps + 1);
    const data = methods.getValues();
    console.log(data);
  };

  const onSubmit = (data) => {
    if (data.factories.length === 0) {
      alert('Debe agregar al menos una fábrica');
      return;
    }

    if (data.clients.length === 0) {
      alert('Debe agregar al menos un cliente');
      return;
    }
    const processedData = {
      ...data,
      assignationClientLocationCost: data.assignationClientLocationCost.map(
        (relation) => ({
          ...relation,
          uncertainty: relation.cost[1] !== '',
        })
      ),
      totalClientDemand: data.productClientDemand.map((relation) => ({
        client: relation.client,
        totalDemand: relation.demand,
      })),
    };
    console.log(processedData);
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
            {assignationClientLocationCostFields.map((item, index) => (
              <div key={item.id} className="flex space-x-4">
                <select
                  {...register(`assignationClientLocationCost.${index}.client`)}
                  className="border p-2"
                >
                  {methods.getValues().clients.map((client, clientIndex) => (
                    <option key={client.id} value={`c${clientIndex + 1}`}>
                      {client.name}
                    </option>
                  ))}
                </select>
                <select
                  {...register(
                    `assignationClientLocationCost.${index}.location`
                  )}
                  className="border p-2"
                >
                  {methods
                    .getValues()
                    .locations.map((location, locationIndex) => (
                      <option key={location.id} value={`d${locationIndex + 1}`}>
                        {location.name}
                      </option>
                    ))}
                </select>
                <input
                  {...register(`assignationClientLocationCost.${index}.cost.0`)}
                  type="number"
                  className="border p-2"
                />
                <input
                  {...register(`assignationClientLocationCost.${index}.cost.1`)}
                  type="number"
                  className="border p-2"
                />
                <button
                  type="button"
                  onClick={() => removeAssignationCLC(index)}
                  className="bg-red-500 text-white p-2"
                >
                  Eliminar relación
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                appendAssignationCLC({
                  client: '',
                  location: '',
                  cost: [0, 0],
                  uncertainty: false,
                })
              }
              className="bg-blue-500 text-white p-2"
            >
              Agregar relación
            </button>
          </>
        )}

        {steps === 3 && (
          <>
            {/* Relaciones Localización-Costo */}
            {selectionLocationCostFields.map((item, index) => (
              <div key={item.id} className="flex space-x-4">
                <select
                  {...register(`selectionLocationCost.${index}.location`)}
                  className="border p-2"
                >
                  {methods
                    .getValues()
                    .locations.map((location, locationIndex) => (
                      <option key={location.id} value={`d${locationIndex + 1}`}>
                        {location.name}
                      </option>
                    ))}
                </select>
                <input
                  {...register(`selectionLocationCost.${index}.cost`)}
                  type="number"
                  className="border p-2"
                />
                <button
                  type="button"
                  onClick={() => removeAssignationLC(index)}
                  className="bg-red-500 text-white p-2"
                >
                  Eliminar relación
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                appendAssignationLC({
                  location: '',
                  cost: 0,
                })
              }
              className="bg-blue-500 text-white p-2"
            >
              Agregar relación
            </button>
          </>
        )}

        {steps === 4 && (
          <>
            {/* Relación shippingFactoryLocationProductCost */}
            {shippingFactoryLocationProductCostFields.map((item, index) => (
              <div key={item.id} className="flex space-x-4">
                <select
                  {...register(
                    `shippingFactoryLocationProductCost.${index}.product`
                  )}
                  className="border p-2"
                >
                  {methods.getValues().products.map((product, productIndex) => (
                    <option key={product.id} value={`p${productIndex + 1}`}>
                      {product.name}
                    </option>
                  ))}
                </select>
                <select
                  {...register(
                    `shippingFactoryLocationProductCost.${index}.factory`
                  )}
                  className="border p-2"
                >
                  {methods
                    .getValues()
                    .factories.map((factory, factoryIndex) => (
                      <option key={factory.id} value={`f${factoryIndex + 1}`}>
                        {factory.name}
                      </option>
                    ))}
                </select>
                <select
                  {...register(
                    `shippingFactoryLocationProductCost.${index}.location`
                  )}
                  className="border p-2"
                >
                  {methods
                    .getValues()
                    .locations.map((location, locationIndex) => (
                      <option key={location.id} value={`d${locationIndex + 1}`}>
                        {location.name}
                      </option>
                    ))}
                </select>
                <input
                  {...register(
                    `shippingFactoryLocationProductCost.${index}.cost`
                  )}
                  type="number"
                  className="border p-2"
                />

                <button
                  type="button"
                  onClick={() => removeShippingFLPC(index)}
                  className="bg-red-500 text-white p-2"
                >
                  Eliminar relación
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                appendShippingFLPC({
                  product: '',
                  factory: '',
                  location: '',
                  cost: 0,
                })
              }
              className="bg-blue-500 text-white p-2"
            >
              Agregar relación
            </button>
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
                  {...register(`productClientDemand.${index}.demand`)}
                  type="number"
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
                  {...register(`locationCapacity.${index}.capacity`)}
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
            {methods.getValues().factories.map((factory, factoryIndex) =>
              methods.getValues().products.map((product, productIndex) => (
                <div
                  key={`${factoryIndex}-${productIndex}`}
                  className="flex space-x-4"
                >
                  <input
                    {...register(
                      `factoryProductCapacity.${factoryIndex}.factory`
                    )}
                    value={`f${factoryIndex + 1}`}
                    type="hidden"
                  />
                  <p>{factory.name}</p>
                  <input
                    {...register(
                      `factoryProductCapacity.${productIndex}.product`
                    )}
                    value={`p${productIndex + 1}`}
                    type="hidden"
                  />
                  <p>{product.name}</p>
                  <input
                    {...register(
                      `factoryProductCapacity.${factoryIndex}.capacity`
                    )}
                    type="number"
                    className="border p-2"
                  />
                </div>
              ))
            )}
          </>
        )}

        {steps === 8 && (
          <>
            {/* Presupuesto total */}
            <p>Presupuesto Total</p>
            <input
              {...register(`totalBudget`)}
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
