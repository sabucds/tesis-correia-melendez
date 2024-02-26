import React from 'react';
import dynamic from 'next/dynamic';
import { useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { Button } from '@avila-tek/ui/src';
import { SpinnerIcon } from '@avila-tek/ui/src/icons';
import { GET_MATH_MODEL } from '../../graphql/queries';
import { DataConventions, ModelInitialData, ModelResult } from '../../models';
import { getGraphEdges, getGraphNodes } from '../graph/graphData';
import InitialData from './InitialData';
import { useNotify } from '../../hooks';
import { UPDATE_MATH_MODEL } from '../../graphql/mutation';
import DeleteModal from './DeleteModal';

const Graph = dynamic<any>(() => import('../graph/Graph') as any, {
  ssr: false,
});

export default function ResultsPage() {
  const router = useRouter();
  const notify = useNotify();
  const [updateMathModel] = useMutation(UPDATE_MATH_MODEL);
  const [jsonData, setJsonData] = React.useState(null);
  const [modelId, setModelId] = React.useState(null);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  const handleConfirm = async () => {
    try {
      const { data: dataModel } = await updateMathModel({
        variables: {
          record: {
            active: false,
          },
          filter: {
            _id: modelId,
          },
        },
      });
      if (dataModel) {
        notify(
          `Modelo ${jsonData?.mathModel?.name} eliminado con éxito`,
          'success'
        );
        setShowDeleteModal(false);
      } else {
        // La mutación falló
        return notify('Ocurrió un error al eliminar el modelo', 'error');
      }
    } catch (err) {
      console.error(err);
      return notify(err.message, 'error');
    } finally {
      router.push('/solution-history');
    }
  };

  // Query
  const { data, loading } = useQuery<{
    mathModel: {
      data: ModelInitialData;
      dataConventions: DataConventions;
      solutions: ModelResult[];
      finalSolution: ModelResult;
    };
  }>(GET_MATH_MODEL, {
    variables: {
      filter: {
        _id: modelId,
      },
    },
  });

  React.useEffect(() => {
    const idParam = router.query.id;
    // revisar la data que se muestra al usuario
    setJsonData(data);
    if (idParam) {
      setModelId(idParam);
    } else {
      console.error(
        'No se proporcionó un valor para el parámetro "id" en la URL'
      );
    }
  }, [router.query.id, data]);

  // const initialData = jsonData?.mathModel?.data;
  const dataConventions_ = data?.mathModel?.dataConventions as DataConventions;
  const finalSolution = jsonData?.mathModel?.finalSolution;
  const solutions = jsonData?.mathModel?.solutions;

  const [showSolutions, setShowSolutions] = React.useState(false);
  const [showInitialValues, setShowInitialValues] = React.useState(false);

  const switchSolution = () => {
    setShowInitialValues(false);
    setShowSolutions(!showSolutions);
    window.scrollTo(0, 0);
  };

  const showInitialData = () => {
    setShowInitialValues(!showInitialValues);
    window.scrollTo(0, 0);
    setShowSolutions(false);
  };
  // console.log('data', initialData);
  let message = '';
  if (showInitialValues) {
    message = 'Valores Iniciales';
  } else if (showSolutions) {
    message = 'Soluciones Generadas';
  } else {
    message = 'Solución Final Generada';
  }

  return (
    <main className="pt-16 px-8 md:px-0 bg-white md:min-h-screen relative flex flex-col space-y-3 md:space-y-20 items-center text-center text-text bg-[url('/img/background-design2.jpg')] bg-contain md:bg-auto bg-no-repeat bg-left-bottom">
      <h1 className="w-10/12 pb-4 border-b border-primary-300 text-3xl md:text-4xl font-bold ">
        {message}
      </h1>
      {loading && (
        <div className="w-full h-[70vh] flex  opacity-70 z-30">
          <SpinnerIcon className="m-auto w-24 h-24 text-gray-200 animate-spin  fill-primary-300" />
          <span className="sr-only">Loading...</span>
        </div>
      )}
      {showInitialValues ? (
        <InitialData />
      ) : (
        <div className="w-full flex flex-col space-y-3 md:space-y-20 items-center text-center text-text ">
          {showSolutions ? (
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
                {solutions?.map((solution, index) => (
                  <div className=" flex flex-col justify-start space-y-5 py-5 border-b-2 border-gray-600">
                    <p className="text-xl text-text-light">
                      SOLUCIÓN
                      <span className="font-semibold text-text">
                        {' '}
                        #{index + 1}{' '}
                      </span>
                      DEL MODELO
                    </p>
                    <div className="flex flex-col md:flex-row justify-between bg-white divide-y-2 md:divide-y-0 md:divide-x-2 divide-primary-300 px-3 md:px-5 py-4 rounded shadow-md">
                      <div className="flex flex-col md:w-1/2 space-y-1 text-start pt-4 md:pt-0  items-start">
                        <p className="text-lg text-text-light text-start w-full underline font-semibold">
                          Se deben seleccionar los siguientes centros de
                          distribución:{' '}
                        </p>
                        <ul className="list-disc ml-12 text-start">
                          {solution &&
                            Object.keys(dataConventions_?.yBinaryVariables).map(
                              (key) => {
                                const result = solution[key] ?? 0;
                                const { location } =
                                  dataConventions_.yBinaryVariables[key];

                                return result === 1 ? (
                                  <li
                                    key={key}
                                    className="text-lg font-semibold text-text"
                                  >
                                    {location}
                                  </li>
                                ) : null;
                              }
                            )}
                        </ul>
                      </div>
                    </div>

                    {solutions && (
                      <div className="w-full bg-white px-3 md:px-5 py-4 rounded items-center flex flex-col text-start justify-center overflow-hidden space-y-5 shadow-md">
                        <p className="text-lg text-text-light text-start w-full underline font-semibold">
                          Asignación de Clientes a Centros de Distribución:
                        </p>
                        <table className="w-3/5  bg-white rounded  text-start">
                          <thead>
                            <tr>
                              <th className="py-2 px-4 border-b text-start">
                                Cliente
                              </th>
                              <th className="py-2 px-4 border-b text-start">
                                Centro de distribución
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.keys(
                              dataConventions_?.xBinaryVariables
                            ).map((key) => {
                              const result = solution[key] ?? 0;
                              const { client, location } =
                                dataConventions_.xBinaryVariables[key];

                              return result !== 0 ? (
                                <tr key={key} className=" text-text-light">
                                  <td className="py-2 px-4 border-b">
                                    {client}
                                  </td>
                                  <td className="py-2 px-4 border-b">
                                    {location}
                                  </td>
                                </tr>
                              ) : null;
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {solutions && (
                      <div className="w-full overflow-x-scroll  md:overflow-clip bg-white px-3 md:px-5 py-4 rounded md:items-center flex flex-col text-start md:justify-center overflow-hidden space-y-5  shadow-md">
                        <p className="text-lg text-text-light text-start w-full underline font-semibold">
                          Número de unidades del producto demandado P a enviar
                          desde la fábrica F al centro de distribución D:
                        </p>
                        <table className="w-full bg-white rounded text-start overflow-auto overflow-x-scroll sm:overflow-x-auto ">
                          <thead>
                            <tr>
                              <th className="py-2 px-4 border-b text-start">
                                Producto
                              </th>
                              <th className="py-2 px-4 border-b text-start">
                                Fábrica
                              </th>
                              <th className="py-2 px-4 border-b text-start">
                                Centro de distribución
                              </th>
                              <th className="py-2 px-4 border-b text-start">
                                Unidades
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.keys(
                              dataConventions_?.zIntegerVariables
                            ).map((key) => {
                              const result = solution[key] ?? 0;
                              const { factory, product, location } =
                                dataConventions_.zIntegerVariables[key];

                              return result !== 0 ? (
                                <tr key={key} className=" text-text-light">
                                  <td className="py-2 px-4 border-b">
                                    {product}
                                  </td>
                                  <td className="py-2 px-4 border-b">
                                    {factory}
                                  </td>
                                  <td className="py-2 px-4 border-b">
                                    {location}
                                  </td>
                                  <td className="py-2 px-4 border-b">
                                    {result}
                                  </td>
                                </tr>
                              ) : null;
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                    {data && !loading && solution && (
                      <Graph
                        nodes={getGraphNodes({
                          clients: data?.mathModel?.data?.clients,
                          locations: data?.mathModel?.data?.locations,
                          factories: data?.mathModel?.data?.factories,
                        })}
                        edges={getGraphEdges({
                          totalClientDemand:
                            data?.mathModel?.data?.totalClientDemand,
                          results: solution,
                        })}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="w-11/12 md:w-10/12 flex flex-col justify-start space-y-10 ">
              <div className="flex flex-col md:flex-row justify-between bg-white divide-y-2 md:divide-y-0 md:divide-x-2 divide-primary-300 px-3 md:px-5 py-4 rounded shadow-md">
                <div className="md:w-1/2 flex flex-col justify-start space-y-2 text-left pb-4 md:pr-4">
                  <p className="text-lg text-text-light">
                    Nombre del modelo:{' '}
                    <span className="font-semibold text-text">
                      {jsonData?.mathModel?.name}
                    </span>
                  </p>
                </div>
                <div className="flex flex-col md:w-1/2 space-y-1 text-start pt-4 md:pt-0 md:pl-4 items-start">
                  <p className="text-lg text-text-light text-start w-full underline font-semibold">
                    Se deben seleccionar los siguientes centros de distribución:{' '}
                  </p>
                  <ul className="list-disc ml-12 text-start">
                    {finalSolution &&
                      Object.keys(dataConventions_?.yBinaryVariables).map(
                        (key) => {
                          const result = finalSolution[key] ?? 0;
                          const { location } =
                            dataConventions_.yBinaryVariables[key];

                          return result === 1 ? (
                            <li
                              key={key}
                              className="text-lg font-semibold text-text"
                            >
                              {location}
                            </li>
                          ) : null;
                        }
                      )}
                  </ul>
                </div>
              </div>

              {finalSolution && (
                <div className="w-full bg-white px-3 md:px-5 py-4 rounded items-center flex flex-col text-start justify-center overflow-hidden space-y-5 shadow-md">
                  <p className="text-lg text-text-light text-start w-full underline font-semibold">
                    Asignación de Clientes a Centros de Distribución:
                  </p>
                  <table className="w-3/5  bg-white rounded  text-start">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 border-b text-start">
                          Cliente
                        </th>
                        <th className="py-2 px-4 border-b text-start">
                          Centro de distribución
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(dataConventions_?.xBinaryVariables).map(
                        (key) => {
                          const result = finalSolution[key] ?? 0;
                          const { client, location } =
                            dataConventions_.xBinaryVariables[key];

                          return result !== 0 ? (
                            <tr key={key} className=" text-text-light">
                              <td className="py-2 px-4 border-b">{client}</td>
                              <td className="py-2 px-4 border-b">{location}</td>
                            </tr>
                          ) : null;
                        }
                      )}
                    </tbody>
                  </table>
                </div>
              )}
              {finalSolution && (
                <div className="w-full overflow-x-scroll md:overflow-clip bg-white px-3 md:px-5 py-4 rounded items-center flex flex-col text-start justify-center overflow-hidden space-y-5 shadow-md">
                  <p className="text-lg text-text-light text-start w-full underline font-semibold">
                    Número de unidades del producto demandado P a enviar desde
                    la fábrica F al centro de distribución D:
                  </p>
                  <table className="w-full bg-white rounded text-start overflow-auto overflow-x-scroll sm:overflow-x-auto">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 border-b text-start">
                          Producto
                        </th>
                        <th className="py-2 px-4 border-b text-start">
                          Fábrica
                        </th>
                        <th className="py-2 px-4 border-b text-start">
                          Centro de distribución
                        </th>
                        <th className="py-2 px-4 border-b text-start">
                          Unidades
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(dataConventions_?.zIntegerVariables).map(
                        (key) => {
                          const result = finalSolution[key] ?? 0;
                          const { factory, product, location } =
                            dataConventions_.zIntegerVariables[key];

                          return result !== 0 ? (
                            <tr key={key} className=" text-text-light">
                              <td className="py-2 px-4 border-b">{product}</td>
                              <td className="py-2 px-4 border-b">{factory}</td>
                              <td className="py-2 px-4 border-b">{location}</td>
                              <td className="py-2 px-4 border-b">{result}</td>
                            </tr>
                          ) : null;
                        }
                      )}
                    </tbody>
                  </table>
                </div>
              )}
              {data && !loading && finalSolution && (
                <Graph
                  nodes={getGraphNodes({
                    clients: data?.mathModel?.data?.clients,
                    locations: data?.mathModel?.data?.locations,
                    factories: data?.mathModel?.data?.factories,
                  })}
                  edges={getGraphEdges({
                    totalClientDemand: data?.mathModel?.data?.totalClientDemand,
                    results: finalSolution,
                  })}
                />
              )}
            </div>
          )}
        </div>
      )}
      <div className="pb-10 space-y-5 w-full flex flex-col items-center">
        <div className=" flex space-x-5">
          <Button
            type="button"
            onClick={() => switchSolution()}
            className="shadow-md rounded-lg bg-gray-200 hover:bg-gray-300 text-primary-400 font-medium px-6 py-3 "
          >
            {showSolutions ? 'Ver solución final' : 'Ver soluciones generadas'}
          </Button>
          <Button
            type="button"
            onClick={() => showInitialData()}
            className="shadow-md rounded-lg bg-white hover:bg-gray-300 text-primary-400 font-medium px-6 py-3 "
          >
            Ver valores iniciales
          </Button>
        </div>
        <Button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          className="shadow-md rounded-lg bg-red-600 hover:bg-red-700 text-white  text-sm font-normal px-6 py-3 "
        >
          Eliminar modelo
        </Button>
      </div>
      <DeleteModal
        isOpen={showDeleteModal}
        name={jsonData?.mathModel?.name}
        onClose={() => setShowDeleteModal(false)}
        handleConfirm={handleConfirm}
      />
    </main>
  );
}
