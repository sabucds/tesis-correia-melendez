import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

export default function ResultsPage() {
  const router = useRouter();
  const [jsonData, setJsonData] = useState(null);

  useEffect(() => {
    const jsonDataParam = router.query.jsonData;
    if (typeof jsonDataParam === 'string') {
      setJsonData(JSON.parse(decodeURIComponent(jsonDataParam)));
    } else if (Array.isArray(jsonDataParam)) {
      // Puedes manejar el array de alguna manera (por ejemplo, tomar el primer elemento)
      setJsonData(JSON.parse(decodeURIComponent(jsonDataParam[0])));
    } else {
      // Manejar otros casos
      console.error(
        'El valor de jsonDataParam no es ni un string ni un array:',
        jsonDataParam
      );
    }
  }, [router.query.jsonData]);

  return (
    <main className="pt-16 px-8 md:px-0 bg-white md:min-h-screen relative flex flex-col space-y-3 md:space-y-20 items-center text-center text-text bg-[url('/img/background-design.jpg')] bg-contain md:bg-auto bg-no-repeat bg-left-bottom">
      <h1 className="w-10/12 pb-4 border-b border-primary-300 text-3xl md:text-4xl font-bold ">
        Resultados
      </h1>
      <div className=" py-5 md:py-0  w-full md:w-10/12 ">
        {jsonData && <pre>{JSON.stringify(jsonData, null, 2)}</pre>}
      </div>
    </main>
  );
}
