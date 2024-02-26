import React from 'react';
import { useQuery } from '@apollo/client';
import router from 'next/router';
import { GET_MATH_MODEL } from '../../graphql/queries';
import { DataConventions, ModelInitialData, ModelResult } from '../../models';

export default function InitialData() {
  const [jsonData, setJsonData] = React.useState(null);

  // Query
  const { data, refetch, loading } = useQuery<{
    mathModel: {
      data: ModelInitialData;
      dataConventions: DataConventions;
      solutions: ModelResult[];
      finalSolution: ModelResult;
    };
  }>(GET_MATH_MODEL, {
    variables: {
      filter: {
        _id: router.query.id || null,
      },
    },
    skip: !router.query.id, // Saltar la consulta si no hay ID en la URL
  });

  // Actualizar los datos JSON cuando cambie la data de la consulta
  React.useEffect(() => {
    if (data) {
      setJsonData(data);
    }
  }, [data]);

  // Manejar los cambios en la ID de la ruta
  React.useEffect(() => {
    if (router.query.id) {
      // Realizar la consulta nuevamente si cambia la ID en la URL
      refetch(); // Necesitarás definir refetch en tu hook de useQuery
    }
  }, [router.query.id]);

  // Obtener los datos iniciales
  const initialData = jsonData?.mathModel?.data;

  if (loading) {
    return <p className="h-screen font-semibold">Cargando...</p>;
  }

  return (
    <div className="w-10/12 ">
      <div className="w-full flex flex-col justify-start text-left ">
        <p className="text-xl text-text-light">
          Nombre del modelo:{' '}
          <span className="font-semibold text-text">
            {jsonData?.mathModel?.name}
          </span>
        </p>
      </div>

      <div className="w-full flex flex-col space-y-10">
        <div className=" flex flex-col justify-start space-y-5 py-5 border-b-2 border-gray-600">
          <div className="w-full overflow-x-scroll md:overflow-clip bg-white px-3 md:px-5 py-4 rounded items-center flex flex-col text-start justify-center overflow-hidden space-y-5  shadow-md">
            <p className="text-lg text-text-light text-start w-full underline font-semibold">
              Elementos principales (nombres o códigos):
            </p>
            <table className="w-full bg-white rounded text-start overflow-auto overflow-x-scroll sm:overflow-x-auto">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-start">Fabricas</th>
                  <th className="py-2 px-4 border-b text-start">Clientes</th>
                  <th className="py-2 px-4 border-b text-start">
                    Centro de distribución
                  </th>
                  <th className="py-2 px-4 border-b text-start">Productos</th>
                </tr>
              </thead>
              <tbody>
                {Array(
                  Math.max(
                    initialData?.factories.length || 0,
                    initialData?.clients.length || 0,
                    initialData?.products.length || 0,
                    initialData?.locations.length || 0
                  )
                )
                  .fill({ name: '' })
                  .map((_, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4 border-b">
                        {initialData?.factories[index]?.name || ''}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {initialData?.clients[index]?.name || ''}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {initialData?.locations[index]?.name || ''}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {initialData?.products[index]?.name || ''}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Costo de asignación Localización-cliente */}
      <div className="w-full flex flex-col space-y-10">
        <div className=" flex flex-col md:justify-start space-y-5 py-5 border-b-2 border-gray-600">
          <div className="w-full overflow-x-scroll md:overflow-clip bg-white px-3 md:px-5 py-4 rounded md:items-center flex flex-col text-start justify-center overflow-hidden space-y-5  shadow-md">
            <p className="text-lg text-text-light text-start w-full underline font-semibold">
              Costo de asignación Localización-Cliente:
            </p>
            <table className="w-full bg-white rounded text-start overflow-auto overflow-x-scroll sm:overflow-x-auto">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-start">Cliente</th>
                  <th className="py-2 px-4 border-b text-start">
                    Localización
                  </th>
                  <th className="py-2 px-4 border-b text-start">
                    Costo mínimo
                  </th>
                  <th className="py-2 px-4 border-b text-start">
                    Costo máximo{' '}
                    <span className="font-semibold text-xs">(OPCIONAL)</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {initialData?.assignationClientLocationCost.map(
                  (value, index) => {
                    const client = initialData?.clients.find(
                      (c) => c.id === value.client
                    );
                    const clientName = client
                      ? client.name
                      : 'Cliente no encontrado';

                    const location = initialData?.locations.find(
                      (c) => c.id === value.location
                    );
                    const locationName = location
                      ? location.name
                      : 'Localización no encontrada';

                    return (
                      <tr key={index}>
                        <td className="py-2 px-4 border-b">{clientName}</td>
                        <td className="py-2 px-4 border-b">{locationName}</td>
                        <td className="py-2 px-4 border-b">{value.cost[0]}</td>
                        <td className="py-2 px-4 border-b">
                          {value.cost[value.cost.length - 1] === 0
                            ? ''
                            : value.cost[value.cost.length - 1]}
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Costo de seleccionar la localización */}
      <div className="w-full flex flex-col space-y-10">
        <div className=" flex flex-col md:justify-start space-y-5 py-5 border-b-2 border-gray-600">
          <div className="w-full overflow-x-scroll md:overflow-clip bg-white px-3 md:px-5 py-4 rounded md:items-center flex flex-col text-start justify-center overflow-hidden space-y-5  shadow-md">
            <p className="text-lg text-text-light text-start w-full underline font-semibold">
              Costo de seleccionar la localización:
            </p>
            <table className="w-full bg-white rounded text-start overflow-auto overflow-x-scroll sm:overflow-x-auto">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-start">
                    Localización
                  </th>
                  <th className="py-2 px-4 border-b text-start">Costo</th>
                </tr>
              </thead>
              <tbody>
                {initialData?.selectionLocationCost.map((value, index) => {
                  const location = initialData?.locations.find(
                    (c) => c.id === value.location
                  );
                  const locationName = location
                    ? location.name
                    : 'Localización no encontrada';

                  return (
                    <tr key={index}>
                      <td className="py-2 px-4 border-b">{locationName}</td>
                      <td className="py-2 px-4 border-b">{value.cost}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Costo de envío de cada producto desde cada fabrica a cada localización */}
      <div className="w-full flex flex-col space-y-10">
        <div className=" flex flex-col md:justify-start space-y-5 py-5 border-b-2 border-gray-600">
          <div className="w-full overflow-x-scroll md:overflow-clip bg-white px-3 md:px-5 py-4 rounded md:items-center flex flex-col text-start justify-center overflow-hidden space-y-5  shadow-md">
            <p className="text-lg text-text-light text-start w-full underline font-semibold">
              Costo de envío de cada producto desde cada fabrica a cada
              localización:
            </p>
            <table className="w-full bg-white rounded text-start overflow-auto overflow-x-scroll sm:overflow-x-auto">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-start">Producto</th>
                  <th className="py-2 px-4 border-b text-start">Fábrica</th>
                  <th className="py-2 px-4 border-b text-start">
                    Localización
                  </th>
                  <th className="py-2 px-4 border-b text-start">Costo</th>
                </tr>
              </thead>
              <tbody>
                {initialData?.shippingFactoryLocationProductCost.map(
                  (value, index) => {
                    const product = initialData?.products.find(
                      (c) => c.id === value.product
                    );
                    const productName = product
                      ? product.name
                      : 'Producto no encontrado';

                    const location = initialData?.locations.find(
                      (c) => c.id === value.location
                    );
                    const locationName = location
                      ? location.name
                      : 'Localización no encontrada';

                    const factory = initialData?.factories.find(
                      (c) => c.id === value.factory
                    );
                    const factoryName = factory
                      ? factory.name
                      : 'Fábrica no encontrada';

                    return (
                      <tr key={index}>
                        <td className="py-2 px-4 border-b">{productName}</td>
                        <td className="py-2 px-4 border-b">{factoryName}</td>
                        <td className="py-2 px-4 border-b">{locationName}</td>
                        <td className="py-2 px-4 border-b">{value.cost}</td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Demanda de cada producto para cada cliente y Demanda total de cada cliente */}
      <div className="w-full flex flex-col md:flex-row  md:space-x-10 border-b-2 border-gray-600">
        <div className="md:w-3/5 py-5 ">
          <div className="w-full overflow-x-scroll md:overflow-clip bg-white px-3 md:px-5 py-4 rounded md:items-center flex flex-col text-start justify-center overflow-hidden space-y-5  shadow-md">
            <p className="text-lg text-text-light text-start w-full underline font-semibold">
              Demanda de cada producto para cada cliente:
            </p>
            <table className="w-full bg-white rounded text-start overflow-auto overflow-x-scroll sm:overflow-x-auto">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-start">Producto</th>
                  <th className="py-2 px-4 border-b text-start">Cliente</th>
                  <th className="py-2 px-4 border-b text-start">Demanda</th>
                </tr>
              </thead>
              <tbody>
                {initialData?.productClientDemand.map((value, index) => {
                  const product = initialData?.products.find(
                    (c) => c.id === value.product
                  );
                  const productName = product
                    ? product.name
                    : 'Producto no encontrado';

                  const client = initialData?.clients.find(
                    (c) => c.id === value.client
                  );
                  const clientName = client
                    ? client.name
                    : 'Cliente no encontrado';

                  return (
                    <tr key={index}>
                      <td className="py-2 px-4 border-b">{productName}</td>
                      <td className="py-2 px-4 border-b">{clientName}</td>
                      <td className="py-2 px-4 border-b">{value.demand}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className=" md:w-2/5 py-5 ">
          <div className="w-full overflow-x-scroll md:overflow-clip bg-white px-3 md:px-5 py-4 rounded items-center flex flex-col text-start justify-center overflow-hidden space-y-5  shadow-md">
            <p className="text-lg text-text-light text-start w-full underline font-semibold">
              Demanda total de cada cliente:
            </p>
            <table className="w-full bg-white rounded text-start overflow-auto overflow-x-scroll sm:overflow-x-auto">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-start">Cliente</th>
                  <th className="py-2 px-4 border-b text-start">
                    Demanda Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {initialData?.totalClientDemand.map((value, index) => {
                  const client = initialData?.clients.find(
                    (c) => c.id === value.client
                  );
                  const clientName = client
                    ? client.name
                    : 'Cliente no encontrado';

                  return (
                    <tr key={index}>
                      <td className="py-2 px-4 border-b">{clientName}</td>
                      <td className="py-2 px-4 border-b">
                        {value.totalDemand}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Capacidad de cada localización	 */}
      <div className="w-full flex flex-col space-y-10">
        <div className=" flex flex-col md:justify-start space-y-5 py-5 border-b-2 border-gray-600">
          <div className="w-full  md:overflow-clip bg-white px-3 md:px-5 py-4 rounded md:items-center flex flex-col text-start justify-center overflow-hidden space-y-5  shadow-md">
            <p className="text-lg text-text-light text-start w-full underline font-semibold">
              Capacidad de cada localización:
            </p>
            <table className="w-full bg-white rounded text-start overflow-auto overflow-x-scroll sm:overflow-x-auto">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-start">
                    Localización
                  </th>
                  <th className="py-2 px-4 border-b text-start">Capacidad</th>
                </tr>
              </thead>
              <tbody>
                {initialData?.locationCapacity.map((value, index) => {
                  const location = initialData?.locations.find(
                    (c) => c.id === value.location
                  );
                  const locationName = location
                    ? location.name
                    : 'Localización no encontrada';

                  return (
                    <tr key={index}>
                      <td className="py-2 px-4 border-b">{locationName}</td>
                      <td className="py-2 px-4 border-b">{value.capacity}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Capacidad de producción de cada fabrica por cada producto */}
      <div className="w-full flex flex-col space-y-10">
        <div className=" flex flex-col md:justify-start space-y-5 py-5 border-b-2 border-gray-600">
          <div className="w-full overflow-x-scroll md:overflow-clip bg-white px-3 md:px-5 py-4 rounded md:items-center flex flex-col text-start justify-center overflow-hidden space-y-5  shadow-md">
            <p className="text-lg text-text-light text-start w-full underline font-semibold">
              Capacidad de producción de cada fábrica por cada producto:
            </p>
            <table className="w-full bg-white rounded text-start overflow-auto overflow-x-scroll sm:overflow-x-auto">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-start">Fábrica</th>
                  <th className="py-2 px-4 border-b text-start">Producto</th>
                  <th className="py-2 px-4 border-b text-start">Capacidad</th>
                </tr>
              </thead>
              <tbody>
                {initialData?.factoryProductCapacity.map((value, index) => {
                  const product = initialData?.products.find(
                    (c) => c.id === value.product
                  );
                  const productName = product
                    ? product.name
                    : 'Producto no encontrado';

                  const factory = initialData?.factories.find(
                    (c) => c.id === value.factory
                  );
                  const factoryName = factory
                    ? factory.name
                    : 'Fábrica no encontrada';

                  return (
                    <tr key={index}>
                      <td className="py-2 px-4 border-b">{factoryName}</td>
                      <td className="py-2 px-4 border-b">{productName}</td>
                      <td className="py-2 px-4 border-b">{value.capacity}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Presupuesto total */}
      {initialData?.totalBudget && (
        <div className="w-full flex flex-col space-y-10">
          <div className="flex justify-center space-y-5 py-5 ">
            <div className="md:w-2/5  md:overflow-clip bg-white px-3 md:px-5 py-4 rounded md:items-center flex flex-col text-start justify-center overflow-hidden space-y-5  shadow-md">
              <p className="text-lg text-text-light text-start w-full underline font-semibold">
                Presupuesto total:
              </p>
              <table className="w-full bg-white rounded text-start overflow-auto overflow-x-scroll sm:overflow-x-auto">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b text-start">
                      Presupuesto total{' '}
                      <span className="font-semibold text-xs">(OPCIONAL)</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 px-4 border-b">
                      {initialData?.totalBudget}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
