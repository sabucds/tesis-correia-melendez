import { useQuery } from '@apollo/client';
import React from 'react';
import { Button } from '@avila-tek/ui';
import { useRouter } from 'next/router';
// import { createColumnHelper } from '@tanstack/react-table';
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

  // const columnHelper = createColumnHelper<Record>();

  // const columns = [
  //   columnHelper.accessor('name', {
  //     header: 'Lote',
  //   }),
  //   // En children deberia ir:
  //   // children.find((hijos) => hijos.name === 'daysBorn').map((hijo) => hijo.realValue)
  //   {
  //     header: 'Días nacidas',
  //     accessorFn: (row) =>
  //       row.children.find((hijos) => hijos.name === 'daysBorn')?.realValue,
  //   },
  //   {
  //     header: '# Aves',
  //     accessorFn: (row) =>
  //       row.children.find((hijos) => hijos.name === 'totalBirds')?.realValue,
  //   },
  //   {
  //     header: '% Mortalidad',
  //     accessorFn: (row) =>
  //       row.children.find((hijos) => hijos.name === 'mortalityRate')?.realValue,
  //   },
  //   {
  //     header: 'Peso promedio (gr) ',
  //     accessorFn: (row) =>
  //       row.children.find((hijos) => hijos.name === 'averageWeight')?.realValue,
  //   },
  // ];

  const onClick = (ModelId) => {
    router.push({
      pathname: '/results',
      query: { id: ModelId },
    });
  };

  return (
    <main className="pt-16 px-8 md:px-0 bg-white md:min-h-screen relative flex flex-col space-y-3 md:space-y-20 items-center text-center text-text bg-[url('/img/background-design.jpg')] bg-contain md:bg-auto bg-no-repeat bg-left-bottom">
      <h1 className="w-10/12 pb-4 border-b border-primary-300 text-3xl md:text-4xl font-bold ">
        Historial de Soluciones
      </h1>
      <p>Cantidad de modelos generados: {models?.length}</p>
      <div className="flex flex-wrap gap-4 items-center justify-center">
        {models?.map((item) => (
          <div key={item.id}>
            <Button
              className="px-6 py-3 flex flex-col items-center justify-center "
              onClick={() => onClick(item._id)}
            >
              <span className="font-semibold">Id del Modelo: </span> {item._id}
              <span className="font-semibold">
                {' '}
                Cantidad de soluciones
              </span>{' '}
              {item.solutions.length}
            </Button>
          </div>
        ))}
      </div>
    </main>
  );
}
