import React from 'react';
import { signIn } from 'next-auth/react';
import { useNotify } from '../hooks';

export default function SignIn() {
  const notify = useNotify();
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      const { ok } = await signIn('credentials', {
        email: formData.get('email').toString(),
        password: formData.get('password').toString(),
        callbackUrl: '/',
        redirect: false,
      });
      if (ok) {
        notify('Bienvenido', 'success');
      }
    } catch (err) {
      console.log(err);
      notify('Error', 'error');
    }
  };

  return (
    <div className="max-w-xl p-16">
      <form className="w-full flex flex-col space-y-4" onSubmit={onSubmit}>
        <input type="email" name="email" placeholder="Your email" />
        <input type="password" name="password" placeholder="Password" />
        <button type="submit">Iniciar</button>
      </form>
    </div>
  );
}
