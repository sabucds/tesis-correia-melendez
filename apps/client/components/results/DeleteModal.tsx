import { Button } from '@avila-tek/ui/src';
import React from 'react';
import { WarningIcon } from '@avila-tek/ui/src/icons';

const DeleteModal = ({ isOpen, onClose, name, handleConfirm }) => (
  <div className={`modal fixed inset-0 ${isOpen ? '' : 'hidden'}`}>
    <div className="modal-overlay absolute inset-0 flex items-center bg-gray-500 bg-opacity-50">
      <div className="modal-container bg-white w-1/3 mx-auto  rounded shadow-lg">
        <div className="modal-content p-6">
          {/* Contenido del modal */}
          <div className="bg-white  rounded flex items-center space-x-5 ">
            <div className="bg-red-200 rounded-full p-3">
              <WarningIcon className="w-12 h-12  text-red-500" />
            </div>
            <div className="flex flex-col space-y-2 text-text text-start">
              <p className="font-semibold text-xl ">
                ¿Está seguro que desea eliminar el modelo "{name}"?
              </p>
              <p>Esta acción no se puede deshacer. </p>
            </div>
          </div>
          <div className="w-full h-0.5 bg-gray-300 my-4" />

          {/* Botones del modal */}
          <div className=" w-full flex space-x-2 ">
            <Button
              className="w-1/2 px-4 py-2 border border-gray-400 bg-gray-200  font-normal text-gray-600 rounded-md"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              className="w-1/2 px-4 py-2 border bg-red-600 hover:bg-red-700 font-normal text-white rounded-md"
              onClick={handleConfirm}
            >
              Eliminar
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default DeleteModal;
