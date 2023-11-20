'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@avila-tek/ui';
import { LogoutIcon } from '@avila-tek/ui/src/icons';
import Logo2 from '@avila-tek/ui/src/icons/Logo2';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Dialog, Transition } from '@headlessui/react';
import router from 'next/router';
import { SignOutResponse, signOut } from 'next-auth/react';
import { useNotify, useUser } from '../../hooks';
import { Icons } from '../icons';

export default function Navbar() {
  const [open, setOpen] = React.useState(false);
  const [user, setUser] = useUser();
  const notify = useNotify();

  const handleLogout = async () => {
    try {
      const response: SignOutResponse | undefined = await signOut();
      if (response !== undefined) {
        setUser(null);
        router.push('/sign-in');
        notify('Sesión cerrada', 'info');
      } else {
        // La respuesta no es válida, maneja el error como corresponda.
        notify('Error al cerrar la sesión', 'info');
      }
    } catch (error) {
      console.error(error);
      notify('Hubo un error cerrando la sesión', 'error');
    } finally {
      router.push('/sign-in');
    }
  };
  return (
    <div className={`bg-white sticky top-0 z-30 `}>
      {/* Mobile menu */}
      <Transition.Root show={open} as={React.Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden" onClose={setOpen}>
          <Transition.Child
            as={React.Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>
          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={React.Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
                {/* Close button */}
                <div className="flex px-4 pb-2 pt-5">
                  <button
                    type="button"
                    className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-600"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="flex justify-center pb-4">
                  <Link href="/">
                    <Logo2 className="h-[40px] text-text" />
                  </Link>
                </div>
                {/* Links */}
                <div className="space-y-6 px-4 py-6 text-center h-full  pb-20 text-gray-900 text-lg font-semibold">
                  <div className="flow-root h-full space-y-5 justify-between">
                    <div className="flow-root  hover:bg-primary-500 hover:text-primary-500  hover:bg-opacity-20">
                      <a href="/generate-decision" className="-m-2 block p-2  ">
                        Generar decisión
                      </a>
                    </div>
                    <div className="flow-root hover:bg-primary-500 hover:text-primary-500  hover:bg-opacity-20">
                      <a href="/solution-history" className="-m-2 block p-2 ">
                        Historial de soluciones
                      </a>
                    </div>
                  </div>
                  <div className="flow-root">
                    <Button
                      className="text-white inline-flex  rounded-full px-12 py-3"
                      onClick={handleLogout}
                    >
                      <span className="[vertical-align:text-bottom] [line-height:1.5]">
                        Cerrar Sesión
                      </span>
                    </Button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
      {/* Desktop menu */}
      <header className="relative bg-primary-500">
        <nav aria-label="Top" className="mx-auto px-8 py-4">
          <div className="flex h-20 items-center justify-start space-x-6 w-full ">
            {/* Hamburger Menu */}
            <button
              type="button"
              className="rounded-md bg-transparent p-2 text-primary-400 lg:hidden mr-4"
              onClick={() => setOpen(true)}
            >
              <span className="sr-only">Open menu</span>
              <Bars3Icon className="h-8 w-8" aria-hidden="true" />
            </button>

            {/* Logo */}
            <div className="flex justify-center ">
              <Link href="/">
                <Icons.Logo2 className="h-[40px] text-text hover:text-primary-400 transition-colors duration-300" />
              </Link>
            </div>
            {/* Desktop navbar */}
            <div className="hidden lg:ml-[80px] lg:block lg:self-stretch flex-1  ">
              <div className="flex h-full w-full justify-end items-center ">
                <div className="relative flex space-x-10 ">
                  <Link
                    href="/generate-decision"
                    className="relative z-10 flex items-center  font-bold transition-colors duration-200 ease-out border-transparent text-text-dark hover:text-primary-400 "
                  >
                    Generar decisión
                  </Link>
                  <Link
                    href="/solution-history"
                    className="relative z-10  flex items-center font-bold transition-colors duration-200 ease-out border-transparent text-text-dark hover:text-primary-400"
                    rel="noopener noreferrer"
                  >
                    Historial de soluciones
                  </Link>
                  <Button className="px-4 py-3 " onClick={handleLogout}>
                    <LogoutIcon className="w-6 h-6 text-white" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
}
