import React from 'react';
import Logo2 from '@avila-tek/ui/src/icons/Logo2';
import { Button } from '@avila-tek/ui';
import { FormProvider, useForm } from 'react-hook-form';
import Link from 'next/link';
import { useMutation } from '@apollo/client';
import router from 'next/router';
import { useNotify } from '../hooks';
import SignUpContent from '../components/signup/SignUpContent';
import { SIGN_UP } from '../graphql/mutation';

export interface SignUpFields {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  passwordConf?: string;
}

export default function SignUp() {
  const methods = useForm<SignUpFields>();
  const notify = useNotify();
  const [register] = useMutation(SIGN_UP);

  const onSubmit = async (formData: SignUpFields) => {
    try {
      // Para verificar los datos que esta mandando el usuario
      console.log({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
      await createUser(formData);
    } catch (err) {
      console.log(err);
      return notify(err, 'error');
    }
  };

  const createUser = async (formData: SignUpFields) => {
    try {
      const { data } = await register({
        variables: {
          data: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
          },
        },
      });

      if (data) {
        notify('Registro Exitoso', 'success');
        router.push('/sign-in');
      } else {
        return notify('Ocurrió un error en el registro', 'error');
      }
    } catch (err) {
      console.log(err);
      return notify(err.message, 'error');
    }
  };

  return (
    <div className="bg-waves-pattern w-screen h-screen bg-cover flex justify-center items-center bg-no-repeat overflow-x-hidden">
      <div className="bg-white space-y-4 flex flex-col items-center justify-center max-w-[400px] md:max-w-none py-8 px-7 md:py-12 md:px-14 rounded-xl">
        <Logo2 className="h-10 w-auto text-text" />
        <div className=" space-y-2">
          <p className="font-bold text-2xl text-text">Registrarse</p>
          <p className="font-base  text-text-light text-justify max-w-[400px]">
            Por favor ingresar los datos para crear una cuenta.
          </p>
        </div>
        <div className="w-full">
          <FormProvider {...methods}>
            <form
              className="w-full flex flex-col space-y-4"
              onSubmit={methods?.handleSubmit(onSubmit)}
              method="post"
            >
              <SignUpContent />

              <Button type="submit" className=" font-medium px-6 py-3 w-full">
                Registrarse
              </Button>
              <div className="flex space-x-2 w-full justify-center">
                <p className="text-text-light text-sm">¿Ya tienes cuenta?</p>
                <Link
                  href="/sign-in"
                  className="text-primary-300 font-semibold text-sm underline hover:text-primary-400 transition-colors"
                >
                  Inicia sesión
                </Link>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}
