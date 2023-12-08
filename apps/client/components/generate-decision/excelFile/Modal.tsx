import { Button } from '@avila-tek/ui/src';
import React from 'react';
import { Input } from '@avila-tek/ui/src/input/Input';

const Modal = ({ isOpen, onClose, name, setName, handleConfirm }) => {
  const handleInputChange = (e) => {
    setName(e.target.value);
  };

  return (
    <div className={`modal fixed inset-0 ${isOpen ? '' : 'hidden'}`}>
      <div className="modal-overlay absolute inset-0 flex items-center bg-gray-500 bg-opacity-50">
        <div className="modal-container bg-white w-1/2 mx-auto mt-20 p-4 rounded shadow-lg">
          <div className="modal-content py-4 text-left px-6">
            {/* Contenido del modal */}
            <div className="bg-white px-3 md:px-8 py-4 rounded flex flex-col items-end ">
              <p className="font-semibold text-xl text-primary-400 pb-3  w-full text-start underline">
                Nombre del modelo
              </p>
              <div className="w-full">
                <Input
                  type="text"
                  placeholder="Ingrese un nombre para su modelo"
                  value={name}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                />
              </div>
            </div>

            {/* Botones del modal */}
            <div className="mt-4 flex justify-end">
              <Button
                className="px-4 py-2 bg-primary-400 font-semibold text-white rounded mr-2"
                onClick={handleConfirm}
              >
                Confirmar
              </Button>
              <Button
                className="px-4 py-2 bg-gray-500 font-light text-white rounded"
                onClick={onClose}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
