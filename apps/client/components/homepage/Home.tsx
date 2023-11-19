import React from 'react';
import { Button } from '@avila-tek/ui';
import { useRouter } from 'next/router';
import { useUser } from '../../hooks';
import { Icons } from '../icons';

export default function Home() {
  const [user] = useUser();
  const router = useRouter();

  const handleButtonClick = () => {
    router.push('/generate-decision');
  };

  return (
    <main className="pt-16 px-8 md:px-0 bg-white md:min-h-screen relative flex flex-col space-y-3 md:space-y-20 items-center text-center text-text bg-[url('/img/background-design.jpg')] bg-contain md:bg-auto bg-no-repeat bg-left-bottom">
      {user !== null && (
        <p className="text-4xl font-semibold text-primary-400">
          Bienvenido/a, {user.firstName} {user.lastName}
        </p>
      )}
      <div className="flex flex-col-reverse gap-y-8 space-y-14 md:space-y-10 md:flex-row items-center justify-end md:justify-center md:space-x-32 ">
        <Icons.IllustrationHome className="h-72 w-auto md:h-auto pt-10 md:pt-0" />
        <div className="space-y-6 md:space-y-10 flex flex-col justify-end items-center md:items-end">
          <p className="text-3xl text-text font-semibold max-w-[376px] md:text-end">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industrys standard
          </p>
          <Button
            className="font-semibold  text-white px-6 py-3"
            onClick={handleButtonClick}
          >
            Generar nueva decisión
          </Button>
        </div>
      </div>
    </main>
  );
}
