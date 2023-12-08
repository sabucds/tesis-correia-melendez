import React from 'react';
import { Button } from '@avila-tek/ui/src';
import { DownloadIcon } from '@avila-tek/ui/src/icons';
import UploadExcelButton from './excelFile/UploadExcelButton';
import UploadInfoForm from './form/UploadInfoForm';

export default function GenerateDecisionPage() {
  return (
    <main className="pt-16 px-8 md:px-0 bg-white md:min-h-screen relative flex flex-col space-y-3 md:space-y-20 items-center text-center text-text bg-[url('/img/background-design.jpg')] bg-contain md:bg-auto bg-no-repeat bg-left-bottom">
      <h1 className="w-10/12 pb-4 border-b border-primary-300 text-3xl md:text-4xl font-bold ">
        Generar Decisión
      </h1>
      {/* Division en 2 columnas: lado izq Form - lado der UploadExcelButton y
      descargar plantilla */}
      <div className="flex flex-col py-5 md:py-0 divide-y-2  md:flex-row w-full md:w-10/12 md:divide-x-2 md:divide-y-0 divide-gray-400">
        <div className="md:w-3/5 mb-4 md:mb-0 md:mr-4 ">
          <UploadInfoForm />
        </div>
        <div className="flex flex-col md:w-2/5 py-4 md:py-0 md:pl-4 space-y-4 ">
          <UploadExcelButton />
          <a href="/PLANTILLA EXCEL OPTIDECIDE.xlsx" download>
            <Button className="font-semibold px-6 py-3 w-full flex items-center justify-center text-white">
              <DownloadIcon className="w-6 h-6 mr-2" />
              Descargar plantilla
            </Button>
          </a>
        </div>
      </div>
    </main>
  );
}
