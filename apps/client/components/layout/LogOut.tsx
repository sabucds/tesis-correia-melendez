import { Button } from '@avila-tek/ui/src';
import React from 'react';

const LogOut = ({ isOpen, onClose, handleConfirm }) => (
  <div className={`modal fixed inset-0 ${isOpen ? '' : 'hidden'}`}>
    <div className="modal-overlay absolute inset-0 flex items-center bg-gray-500 bg-opacity-50">
      <div className="modal-container bg-white w-10/12 md:w-[30%] mx-auto  rounded shadow-lg">
        <div className="modal-content p-6">
          {/* Contenido del modal */}
          <div className="bg-white  rounded flex flex-col space-y-2 text-text text-center">
            <p className="font-semibold text-xl ">
              ¿Está seguro que desea cerrar sesión?
            </p>
          </div>
          <div className="w-full h-0.5 bg-gray-300 my-4" />

          {/* Botones del modal */}
          <div className=" w-full flex space-x-2">
            <Button
              className="w-1/2 px-4 py-2 border border-gray-400 bg-gray-200  font-normal text-gray-600 rounded-md"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              className="w-1/2 px-4 py-2 border  font-normal text-white rounded-md"
              onClick={handleConfirm}
            >
              Si, estoy seguro
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default LogOut;
