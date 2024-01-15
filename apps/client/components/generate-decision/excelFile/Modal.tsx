import { Button } from '@avila-tek/ui/src';
import React from 'react';
import { Input } from '@avila-tek/ui/src/input/Input';

const Modal = ({
  isOpen,
  onClose,
  name,
  setName,
  method,
  setMethod,
  handleConfirm,
}) => {
  const handleInputChange = (e) => {
    setName(e.target.value);
  };

  const options = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
  ];

  const handleChange = (event) => {
    setMethod(event.target.value);
  };

  return (
    <div className={`modal fixed inset-0 ${isOpen ? '' : 'hidden'}`}>
      <div className="modal-overlay absolute inset-0 flex items-center bg-gray-500 bg-opacity-50">
        <div className="modal-container bg-white w-1/2 mx-auto mt-20 p-4 rounded shadow-lg">
          <div className="modal-content py-4 text-left px-6">
            {/* Contenido del modal */}
            <div className="bg-white px-3 md:px-8 py-4 rounded flex flex-col items-end space-y-4">
              <div className="flex flex-col w-full">
                <label
                  className="font-semibold text-xl text-primary-400 pb-3  w-full text-start underline"
                  htmlFor="name"
                >
                  Nombre del modelo
                </label>
                <div className="w-full">
                  <Input
                    type="text"
                    id="name"
                    placeholder="Ingrese un nombre para su modelo"
                    value={name}
                    onChange={handleInputChange}
                    required
                    className="w-full"
                  />
                </div>
              </div>
              <div className="flex flex-col w-full">
                <label
                  className="font-semibold text-xl text-primary-400 pb-3  w-full text-start underline"
                  htmlFor="name"
                >
                  Método de decisión
                </label>
                <div className="w-full">
                  <select
                    value={method}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-primary-300 rounded-md text-text-light"
                  >
                    <option value="" disabled>
                      Seleccione un método
                    </option>
                    {options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Botones del modal */}
            <div className="mt-4 flex justify-end space-x-2">
              <Button
                className="px-4 py-2 bg-gray-500 font-light text-white rounded"
                onClick={onClose}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="px-4 py-2 bg-primary-400 font-semibold text-white rounded disabled:bg-gray-400 disabled:cursor-not-allowed disabled:text-text"
                onClick={handleConfirm}
                disabled={name === '' || method === ''}
              >
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
