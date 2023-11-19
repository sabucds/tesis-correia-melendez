import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import React from 'react';
import { GET_MATH_MODEL } from '../../graphql/queries';
import { DataConventions } from '../../models';

export default function ResultsPage() {
  const router = useRouter();
  const [jsonData, setJsonData] = React.useState(null);
  const [modelId, setModelId] = React.useState(null);

  // Query
  const { data } = useQuery(GET_MATH_MODEL, {
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

  // const dataConventions_ = dataConventions as DataConventions;
  // const totalBudget = jsonData?.mathModel?.data.totalBudget;
  // console.log(jsonData?.mathModel?.finalSolution);

  return (
    <main className="pt-16 px-8 md:px-0 bg-white md:min-h-screen relative flex flex-col space-y-3 md:space-y-20 items-center text-center text-text bg-[url('/img/background-design.jpg')] bg-contain md:bg-auto bg-no-repeat bg-left-bottom">
      <h1 className="w-10/12 pb-4 border-b border-primary-300 text-3xl md:text-4xl font-bold ">
        Resultado
      </h1>
      <p>{jsonData?.mathModel?.name}</p>
      <p>Resultado final: {jsonData?.mathModel?.finalSolution.result}</p>
      {/* <p>Total Budget: {totalBudget}</p> */}
      <p>{modelId}</p>
      {/* <div className=" py-5 md:py-0  w-full md:w-10/12 ">
        {jsonData && <pre>{JSON.stringify(jsonData, null, 2)}</pre>}
      </div> */}
    </main>
  );
}
