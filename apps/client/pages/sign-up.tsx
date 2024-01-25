import React from 'react';
import Logo2 from '@avila-tek/ui/src/icons/Logo2';
import { Button } from '@avila-tek/ui/src';
import { FormProvider, useForm } from 'react-hook-form';
import Link from 'next/link';
import { useMutation } from '@apollo/client';
import router, { withRouter } from 'next/router';
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

function SignUp() {
  const methods = useForm<SignUpFields>();
  const notify = useNotify();
  const [register] = useMutation(SIGN_UP);
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (formData: SignUpFields) => {
    try {
      // Para verificar los datos que esta mandando el usuario
      // console.log({
      //   firstName: formData.firstName,
      //   lastName: formData.lastName,
      //   email: formData.email,
      //   password: formData.password,
      // });
      await createUser(formData);
    } catch (err) {
      console.log(err);
      return notify(err, 'error');
    }
  };

  const createUser = async (formData: SignUpFields) => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-waves-pattern w-screen h-screen bg-cover flex justify-center items-center bg-no-repeat ">
      <div className="bg-white h-4/5 md:h-auto overflow-y-scroll md:overflow-y-clip w-10/12 md:w-auto space-y-4 flex flex-col md:items-center md:justify-center py-8 px-7 md:py-12 md:px-14 rounded-xl">
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

              <Button
                className=" text-white font-medium px-6 py-3 w-full disabled:cursor-not-allowed"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <div className="w-full flex justify-center items-center ">
                    <div className="loader-dots block relative w-20 h-3 mt-0 mb-3">
                      <div className="absolute top-0 mt-1 w-3 h-3 rounded-full bg-white" />
                      <div className="absolute top-0 mt-1 w-3 h-3 rounded-full bg-white" />
                      <div className="absolute top-0 mt-1 w-3 h-3 rounded-full bg-white" />
                      <div className="absolute top-0 mt-1 w-3 h-3 rounded-full bg-white" />
                    </div>
                  </div>
                ) : (
                  'Registrarse'
                )}
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

export default withRouter(SignUp);
