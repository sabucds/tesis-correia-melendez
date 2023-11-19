import { useQuery } from '@apollo/client';
import React from 'react';
import { useRouter } from 'next/router';
import { GET_MATH_MODELS } from '../../graphql/queries';
import { useUser } from '../../hooks';

export default function SolutionHistoryPage() {
  const [user] = useUser();
  const router = useRouter();
  // Query
  const { data } = useQuery(GET_MATH_MODELS, {
    variables: {
      filter: {
        user: user?._id,
      },
    },
  });
  const models = data?.mathModels;

  const onClick = (ModelId) => {
    router.push({
      pathname: '/results',
      query: { id: ModelId },
    });
  };

  return (
    <main className="pt-16 px-8 md:px-0 bg-white md:min-h-screen relative flex flex-col space-y-3 md:space-y-6 items-center text-center text-text bg-[url('/img/background-design.jpg')] bg-contain md:bg-auto bg-no-repeat bg-left-bottom">
      <h1 className="w-10/12 pb-4 border-b border-primary-300 text-3xl md:text-4xl font-bold ">
        Historial de Soluciones
      </h1>
      <p className="text-lg text-text-light">
        Cantidad de modelos generados:{' '}
        <span className="font-semibold text-text">{models?.length}</span>
      </p>
      <div className="w-10/12 p-5 bg-white rounded">
        <div className="w-full overflow-auto overflow-x-scroll sm:overflow-x-auto text-start">
          <table className="w-full bg-white rounded text-start">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-start">
                  Nombre del Modelo
                </th>
                <th className="py-2 px-4 border-b text-start">Id del Modelo</th>
                <th className="py-2 px-4 border-b text-start">
                  Cantidad de Soluciones
                </th>
              </tr>
            </thead>
            <tbody>
              {models?.map((item) => (
                <React.Fragment key={item.id}>
                  <tr
                    key={item.id}
                    className="hover:bg-gray-100 hover:cursor-pointer"
                    onClick={() => onClick(item._id)}
                  >
                    <td className="py-2 px-4 border-b">{item.name}</td>
                    <td className="py-2 px-4 border-b">{item._id}</td>
                    <td className="py-2 px-4 border-b">
                      {item.solutions.length}
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
