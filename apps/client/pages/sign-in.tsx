import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import router, { withRouter } from 'next/router';
import Logo2 from '@avila-tek/ui/src/icons/Logo2';
import { Input } from '@avila-tek/ui/src/input/Input';
import { Button } from '@avila-tek/ui/src';
import Link from 'next/link';
import { useNotify } from '../hooks';

function SignIn() {
  const notify = useNotify();

  const [email, setEmail] = useState('');
  const [emailValid, setEmailValid] = useState(true);

  const handleEmailChange = (e) => {
    const { value } = e.target;
    setEmail(value);

    // Realiza la validación del correo electrónico, por ejemplo, verifica si tiene un formato de correo electrónico válido.
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const isValid = emailRegex.test(value);
    setEmailValid(isValid);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      const { ok, error } = await signIn('credentials', {
        email: formData.get('email').toString(),
        password: formData.get('password').toString(),
        callbackUrl: '/',
        redirect: false,
      });
      if (ok) {
        notify('Bienvenido', 'success');
        router.push('/');
      } else {
        notify(error, 'error');
      }
    } catch (err) {
      console.log(err);
      notify('Error', 'error');
    }
  };

  return (
    <div className="bg-waves-pattern w-screen h-screen bg-cover flex justify-center items-center bg-no-repeat">
      <div className="bg-white space-y-7 flex flex-col items-center justify-center max-w-[315px] md:max-w-none py-8 px-7 md:py-12 md:px-14 rounded-xl">
        <Logo2 className="h-10 w-auto text-text" />
        <div className=" space-y-2">
          <p className="font-bold text-2xl text-text">Inicia Sesión</p>
          <p className="font-base  text-text-light text-justify max-w-[380px]">
            Inicia sesión en tu cuenta para que puedas utilizar nuestras
            herramientas.
          </p>
        </div>
        <form className="w-full flex flex-col space-y-4" onSubmit={onSubmit}>
          <div className="flex-col space-y-0">
            <Input
              label="Correo Electrónico"
              type="email"
              name="email"
              placeholder="Ingresa tu correo electrónico"
              value={email}
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
          <Input
            label="Contraseña"
            type="password"
            name="password"
            placeholder="Ingresa tu contraseña"
            required
          />
          <a
            href="/sign-in/forgot-password"
            className="text-primary-300 font-semibold text-sm underline hover:text-primary-400 transition-colors text-end w-full "
          >
            Olvidé mi contraseña
          </a>
          <Button
            className=" text-white font-medium px-6 py-3 w-full"
            type="submit"
          >
            Iniciar Sesión
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
          {/* <input type="email" name="email" placeholder="email" />
          <input type="password" name="password" placeholder="Password" />
          <button type="submit">Iniciar</button> */}
        </form>
      </div>
    </div>
  );
}

export default withRouter(SignIn);
