// eslint-disable jsx-a11y/label-has-associated-control
import React from 'react';
import { validateEmail } from 'avilatek-utils';
import { useFormContext } from 'react-hook-form';
import { Input } from '@avila-tek/ui/src/input/Input';
import { PasswordEyeIcon, EyeIcon } from '@avila-tek/ui/src/icons';

export default function SignUpContent() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showPasswordConf, setShowPasswordConf] = React.useState(false);

  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext();

  const passwordValue = watch('password', '');

  const formValidations = {
    firstName: { required: 'required' },
    lastName: { required: 'required' },
    email: {
      required: 'required',
      validate: (value) => validateEmail(value),
    },
    password: {
      required: 'required',
      validate: (value) => /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(value),
    },
    passwordConf: {
      required: 'required',
      validate: (value, formValues) => value === formValues.password,
    },
  };

  return (
    <div className="flex flex-col gap-y-2 text-sm">
      <div className="">
        <Input
          label="Nombre"
          type="text"
          {...register('firstName', formValidations.firstName)}
          placeholder="Ingrese su nombre"
          required
        />
        {errors.firstName && (
          <span className="text-xs text-red-500">El nombre es obligatorio</span>
        )}
      </div>
      <div className="">
        <Input
          label="Apellido"
          type="text"
          {...register('lastName', formValidations.lastName)}
          placeholder="Ingrese su apellido"
          required
        />
        {errors.lastName && (
          <span className="text-xs text-red-500">
            El apellido es obligatorio
          </span>
        )}
      </div>
      <div className="">
        <Input
          label="Correo Electrónico"
          type="email"
          {...register('email', formValidations.email)}
          placeholder="Ingrese su correo electrónico"
          required
        />
        {errors.email && (
          <span className="text-xs text-red-500">
            El correo electrónico es obligatorio
          </span>
        )}
      </div>
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
          <div>
            <span className="text-xs text-red-500">
              La contraseña es obligatoria y debe cumplir con:
            </span>
            <ul className="list-disc list-inside">
              {passwordValue.length < 8 && (
                <li className="text-xs text-red-500">
                  Al menos 8 caracteres de longitud
                </li>
              )}
              {!/(?=.*[A-Z])/.test(passwordValue) && (
                <li className="text-xs text-red-500">
                  Al menos una letra mayúscula
                </li>
              )}
              {!/(?=.*\d)/.test(passwordValue) && (
                <li className="text-xs text-red-500">Al menos un número</li>
              )}
            </ul>
          </div>
        )}
      </div>
      <div className="">
        <Input
          label="Confirmar contraseña"
          type={showPasswordConf ? 'text' : 'password'}
          {...register('passwordConfirmation', formValidations.passwordConf)}
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
            <span className="text-xs text-red-500">
              Por favor, confirmar la contraseña
            </span>
          ) : (
            <span className="text-xs text-red-500">
              Las contraseñas no coinciden
            </span>
          ))}
      </div>
    </div>
  );
}
