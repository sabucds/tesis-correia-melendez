import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import Logo2 from '@avila-tek/ui/src/icons/Logo2';
import { Input } from '@avila-tek/ui/src/input/Input';
import { Button } from '@avila-tek/ui';
import { useNotify } from '../hooks';

export default function SignUp() {
  const notify = useNotify();
  const router = useRouter();

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

  const onSubmit = async (e) => {
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
          <p className="font-bold text-2xl text-text">Registrarse</p>
          <p className="font-base  text-text-light text-justify max-w-[420px]">
            Por favor ingresar los datos para crear una cuenta.
          </p>
        </div>
        <form className="w-full flex flex-col space-y-2" onSubmit={onSubmit}>
          <div className="flex-col ">
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
              <p className="text-red-500 max-w-[420px] text-justify text-sm">
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
          <Button className=" font-medium px-6 py-3 w-full" type="submit">
            Registrarme
          </Button>
          <div className="flex space-x-2 w-full justify-center">
            <p className="text-text-light text-sm">¿Ya tienes cuenta?</p>
            <a
              href="/sign-up"
              className="text-primary-300 font-semibold text-sm underline hover:text-primary-400 transition-colors"
            >
              Inicia sesión
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
