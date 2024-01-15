/* eslint-disable no-restricted-globals */
import React from 'react';
import * as XLSX from 'xlsx';
import { UploadIcon } from '@avila-tek/ui/src/icons';
import { useRouter, withRouter } from 'next/router';
import { useMutation } from '@apollo/client';
import { getModelDataWithExcelJSON } from '../../../utils/getModelDataWithExcelJSON';
import { useNotify, useUser } from '../../../hooks';
import { CREATE_MATH_MODEL } from '../../../graphql/mutation';
import Modal from './Modal';
import LoadingModal from '../form/LoadingModal';

function ExcelToJsonConverter() {
  const [user] = useUser();
  // const [jsonData, setJsonData] = useState(null);
  const [disabled, setDisabled] = React.useState(false);
  const [isDraggingOver, setIsDraggingOver] = React.useState(false);
  const [selectedFileName, setSelectedFileName] = React.useState(null);
  const router = useRouter();
  const notify = useNotify();
  const [createMathModel] = useMutation(CREATE_MATH_MODEL);
  const [showModal, setShowModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [excelName, setExcelName] = React.useState('');
  const [methodValue, setMethodValue] = React.useState('');
  const [jsonData, setJsonData] = React.useState(null);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleConfirm = (inputValue) => {
    setExcelName(inputValue);
    console.log(inputValue);
    setShowModal(false);
    createMathModelWithExcelJSON(jsonData);
  };

  const processFile = (file) => {
    setSelectedFileName(file.name); // Mostrar el nombre del archivo seleccionado

    const reader = new FileReader();

    reader.onload = (e_) => {
      const data = e_.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Remove cells that end with '1' and don't contain another '1'
      Object.keys(worksheet).forEach((key) => {
        const endsWithOne = key.endsWith('1');
        const newKey = key.slice(0, -1);
        const lastCharOfNewKey = newKey.slice(-1);
        const isNumber = !isNaN(lastCharOfNewKey as any);

        if (endsWithOne && !isNumber) {
          delete worksheet[key];
        }
      });

      const jsonResult = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      const dataModel = getModelDataWithExcelJSON(jsonResult);
      console.log(dataModel);

      if (
        dataModel?.clients?.length > 0 &&
        dataModel?.products?.length > 0 &&
        dataModel?.locations?.length > 0 &&
        dataModel?.factories?.length > 0
      ) {
        setShowModal(true);
        setJsonData({ ...dataModel });
      } else {
        notify(
          'El archivo que esta subiendo esta vacío / No es la plantilla',
          'error'
        );
      }
    };

    reader.readAsBinaryString(file);
    setDisabled(false);
  };

  const createMathModelWithExcelJSON = async (dataModel) => {
    if (loading) return;
    try {
      setLoading(true);
      const { data } = await createMathModel({
        variables: {
          data: {
            user: user._id,
            data: dataModel,
            method: parseFloat(methodValue),
            name: excelName,
          },
        },
      });
      if (data) {
        // La mutación fue exitosa
        const createdModelId = data.createMathModel._id;
        notify('Creación del modelo exitosa', 'success');
        console.log('modelo creado con excel');
        console.log(dataModel);
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

  const handleFileUpload = (e) => {
    if (disabled) return;
    const file = e.target.files[0];
    setDisabled(true);

    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);

    if (e.dataTransfer.files.length > 0) {
      handleFileUpload({ target: { files: [e.dataTransfer.files[0]] } });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  if (loading) return <LoadingModal />;

  return (
    <div className="flex-col">
      <label htmlFor="file_upload">
        <div
          className={`flex flex-col space-y-4 justify-center w-full  py-6  transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none ${
            isDraggingOver
              ? 'bg-blue-100 dark:bg-blue-400 border-blue-500 dark:border-blue-600'
              : ''
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <span className="flex flex-col justify-center items-center space-y-2 px-12">
            <UploadIcon
              className={` w-6 h-6  ${
                isDraggingOver ? 'text-white' : 'text-gray-400'
              }`}
            />
            <span
              className={` font-medium  ${
                isDraggingOver ? 'text-white' : 'text-gray-600'
              }`}
            >
              {selectedFileName ? (
                `Archivo seleccionado: ${selectedFileName}`
              ) : (
                <>
                  <span
                    className={` underline ${
                      isDraggingOver ? ' text-blue-200' : 'text-blue-600'
                    }`}
                  >
                    Selecciona
                  </span>{' '}
                  o arrastra tu archivo plantilla con los datos de tipo .xlsx
                </>
              )}
            </span>
          </span>
          <p className="font-light text-xs text-gray-500  px-4">
            Por favor, asegúrate de que solo se suba un archivo que contenga el
            formato de la plantilla. En caso contrario, no podremos resolverlo a
            través de este medio.
          </p>
          <input
            type="file"
            id="file_upload"
            name="file_upload"
            className="hidden"
            accept=".xlsx"
            onChange={handleFileUpload}
            disabled={disabled}
          />
        </div>
        <Modal
          isOpen={showModal}
          onClose={handleCloseModal}
          name={excelName}
          setName={setExcelName}
          method={methodValue}
          setMethod={setMethodValue}
          handleConfirm={handleConfirm}
        />
      </label>

      {/* {jsonData && (
        <div>
          <h3>JSON Result:</h3>
          <pre>{JSON.stringify(jsonData, null, 2)}</pre>
        </div>
      )} */}
    </div>
  );
}

export default withRouter(ExcelToJsonConverter);
