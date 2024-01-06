import React from 'react';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { Input } from '@avila-tek/ui/src/input/Input';
import Logo2 from '@avila-tek/ui/src/icons/Logo2';
import { Button } from '@avila-tek/ui';
import { useForm } from 'react-hook-form';
import { EyeIcon, PasswordEyeIcon } from '@avila-tek/ui/src/icons';
import Link from 'next/link';
import { useNotify } from '../../hooks';
import { CHANGE_PASSWORD } from '../../graphql/mutation';

export interface resetPasswordFields {
  password?: string;
  passwordConf?: string;
}

export default function ChangePassword() {
  const notify = useNotify();
  const router = useRouter();
  const routerToken = router.query.token;
  const [changePassword] = useMutation(CHANGE_PASSWORD);
  const [emailSent, setEmailSent] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = React.useState(false);
  const [showPasswordConf, setShowPasswordConf] = React.useState(false);

  const formValidations = {
    password: {
      required: 'required',
    },
    passwordConf: {
      required: 'required',
      validate: (value, formValues) => value === formValues.password,
    },
  };

  const onSubmit = async (formData: resetPasswordFields) => {
    try {
      if (loading) return;
      await handlePasswordChange(formData);
    } catch (err) {
      console.log(err);
      return notify(err, 'error');
    }
  };

  const handlePasswordChange = async (formData: resetPasswordFields) => {
    try {
      setLoading(true);
      await changePassword({
        variables: {
          data: {
            password: formData.password,
            token: routerToken,
          },
        },
      });
      notify('Contraseña cambiada con éxito', 'success');
      setEmailSent(true);
    } catch (err) {
      console.log(err);
      notify('Hubo un error', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-waves-pattern w-screen h-screen bg-cover flex justify-center items-center bg-no-repeat">
      <div className="bg-white space-y-7 flex flex-col items-center justify-center max-w-[315px] md:max-w-none py-8 px-7 md:py-12 md:px-14 rounded-xl">
        <Logo2 className="h-10 w-auto text-text" />
        <div className=" space-y-2">
          <p className="font-bold text-2xl text-text max-w-[380px] text-center">
            {emailSent ? 'Contraseña actualizada' : 'Restablece tu contraseña'}
          </p>
          <p className="font-base  text-text-light text-justify max-w-[380px]">
            {emailSent
              ? '¡Tu contraseña ha sido actualizada! Para iniciar sesión con tu nueva contraseña, vuelve a la página de inicio de sesión.'
              : 'Por favor ingresa tu nueva contraseña.'}
          </p>
        </div>
        {!emailSent ? (
          <form
            className="w-full flex flex-col space-y-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-y-2">
              <div className="">
                <Input
                  label="Contraseña"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', formValidations.password)}
                  placeholder="Ingrese su contraseña"
                  rightIcon={
                    !showPassword ? (
                      <button
                        aria-label="Mostrar contraseña"
                        id="password"
                        className=""
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <PasswordEyeIcon className="w-5 h-5" />
                      </button>
                    ) : (
                      <button
                        aria-label="Ocultar contraseña"
                        id="password"
                        className=""
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <EyeIcon className="w-5 h-5" />
                      </button>
                    )
                  }
                />
                {errors.password && (
                  <span className="text-sm text-red-500 ">
                    La contraseña es obligatoria
                  </span>
                )}
              </div>
              <div className="">
                <Input
                  label="Confirmar contraseña"
                  type={showPasswordConf ? 'text' : 'password'}
                  {...register(
                    'passwordConfirmation',
                    formValidations.passwordConf
                  )}
                  placeholder="Confirme su contraseña"
                  rightIcon={
                    !showPasswordConf ? (
                      <button
                        aria-label="Mostrar contraseña"
                        id="passwordConf"
                        className=""
                        type="button"
                        onClick={() => setShowPasswordConf(!showPasswordConf)}
                      >
                        <PasswordEyeIcon className="w-5 h-5" />
                      </button>
                    ) : (
                      <button
                        aria-label="Ocultar contraseña"
                        id="passwordConf"
                        className=""
                        type="button"
                        onClick={() => setShowPasswordConf(!showPasswordConf)}
                      >
                        <EyeIcon className="w-5 h-5" />
                      </button>
                    )
                  }
                />
                {errors.passwordConfirmation &&
                  (errors.passwordConfirmation.type === 'required' ? (
                    <span className="text-sm text-red-500">
                      Por favor, confirmar la contraseña
                    </span>
                  ) : (
                    <span className="text-sm text-red-500">
                      Las contraseñas no coinciden
                    </span>
                  ))}
              </div>
            </div>

            <Button
              className=" text-white font-medium px-6 py-3 w-full"
              type="submit"
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
                'Enviar'
              )}
            </Button>

            {/* Texto extra */}
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
        ) : (
          <Button
            className=" text-white font-medium px-6 py-3 w-full"
            onClick={() => router.push('/sign-in')}
          >
            Volver al inicio
          </Button>
        )}
      </div>
    </div>
  );
}
