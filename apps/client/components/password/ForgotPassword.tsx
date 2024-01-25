import { Button } from '@avila-tek/ui';
import { Input } from '@avila-tek/ui/src/input/Input';
import Link from 'next/link';
import React from 'react';
import Logo2 from '@avila-tek/ui/src/icons/Logo2';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { useNotify } from '../../hooks';
import { RESET_PASSWORD } from '../../graphql/mutation';

export default function ForgotPassword() {
  const notify = useNotify();
  const router = useRouter();

  const [userEmail, setUserEmail] = React.useState('');
  const [emailValid, setEmailValid] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [emailSent, setEmailSent] = React.useState(false);

  const [resetPassword] = useMutation(RESET_PASSWORD);

  const handleEmailChange = (e) => {
    const { value } = e.target;
    setUserEmail(value);

    // Realiza la validación del correo electrónico, por ejemplo, verifica si tiene un formato de correo electrónico válido.
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const isValid = emailRegex.test(value);
    setEmailValid(isValid);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setUserEmail(formData.get('email').toString());
    if (loading) return;
    try {
      setLoading(true);
      const { data } = await resetPassword({
        variables: {
          data: {
            email: userEmail,
          },
        },
      });
      if (data) {
        notify('Correo de recuperación enviado con éxito', 'success');
        setEmailSent(true);
      } else {
        // La mutación falló
        return notify(
          'Ocurrió un error al enviar el correo de recuperación',
          'error'
        );
      }
    } catch (err) {
      // Manejo de errores
      console.error(err);
      return notify(err.message, 'error');
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
            {emailSent
              ? '¡Tu solicitud de recuperación de contraseña ha sido enviada!'
              : '¿Olvidaste tu contraseña?'}
          </p>
          <p className="font-base  text-text-light text-justify max-w-[380px]">
            {emailSent
              ? `Se ha enviado un correo electrónico con instrucciones para restablecer la contraseña a: ${userEmail}`
              : 'Introduzca la dirección de correo electrónico asociada a su cuenta y le enviaremos un enlace para restablecer su contraseña.'}
          </p>
        </div>
        {!emailSent ? (
          <form className="w-full flex flex-col space-y-4" onSubmit={onSubmit}>
            <div className="flex-col space-y-0">
              <Input
                label="Correo Electrónico"
                type="email"
                name="email"
                placeholder="Ingresa tu correo electrónico"
                value={userEmail}
                onChange={handleEmailChange}
                className={emailValid ? '' : 'border-red-500'} // Cambia el estilo si el campo es inválido
                required
              />
              {!emailValid && (
                <p className="text-red-500 max-w-[380px] text-justify text-sm">
                  Por favor, ingresa un correo electrónico válido.
                </p>
              )}
            </div>
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
                'Enviar'
              )}
            </Button>
            <div className="flex text-white space-x-2 w-full justify-center">
              <p className="text-text-light text-sm">
                ¿Todavía no tienes cuenta?
              </p>
              <Link
                href="/sign-up"
                className="text-primary-300 font-semibold text-sm underline hover:text-primary-400 transition-colors"
              >
                Regístrate
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
