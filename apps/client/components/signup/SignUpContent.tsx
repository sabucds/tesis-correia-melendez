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

  const formValidations = {
    ...(watch('type') === 'talent'
      ? {
          firstName: { required: 'required' },
          lastName: { required: 'required' },
          email: {
            required: 'required',
            validate: (value, formValues) => validateEmail(value),
          },
          password: {
            required: 'required',
            pattern:
              /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!"#$%&'()*+,-.\\/:;<=>?\\@[\]^_`{|}~]).{8,}$/,
          },
          passwordConf: {
            required: 'required',
            validate: (value, formValues) => value === formValues.password,
          },
        }
      : {}),
  };

  return (
    <div className="flex flex-col gap-y-2">
      <div className="">
        <Input
          label="Nombre"
          error={errors.firstName?.message as string}
          type="text"
          {...register('firstName', formValidations.firstName)}
          placeholder="Ingrese su nombre"
          required
        />
      </div>
      <div className="">
        <Input
          label="Apellido"
          type="text"
          {...register('lastName', formValidations.lastName)}
          placeholder="Ingrese su apellido"
          error={errors.lastName?.message as string}
          required
        />
      </div>
      <div className="">
        <Input
          label="Correo Electrónico"
          type="email"
          {...register('email', formValidations.email)}
          error={errors.email?.message as string}
          placeholder="Ingrese su correo electrónico"
          required
        />
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
                className=""
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                <PasswordEyeIcon className="w-5 h-5" />
              </button>
            ) : (
              <button
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
          <span className="text-sm text-danger-300">
            La contraseña es obligatoria
          </span>
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
                className=""
                type="button"
                onClick={() => setShowPasswordConf(!showPasswordConf)}
              >
                <PasswordEyeIcon className="w-5 h-5" />
              </button>
            ) : (
              <button
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
            <span className="text-sm text-danger-300">
              Por favor, confirmar la contraseña
            </span>
          ) : (
            <span className="text-sm text-danger-300">
              Las contraseñas no coinciden
            </span>
          ))}
      </div>
    </div>
  );
}
