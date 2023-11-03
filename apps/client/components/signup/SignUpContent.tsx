import React from 'react';
import { validateEmail } from 'avilatek-utils';
import { useFormContext } from 'react-hook-form';
import { Input } from '@avila-tek/ui/src/input/Input';

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
          birthDate: { required: 'required' },
          // TODO: revisar edad mínima
          /* [ACTIONS.BIRTH_DATE]: {
            required: t('required'),
            validate: {
              isAdult: (value) => {
                const date = new Date(value);
                const today = new Date();
                const age = today.getFullYear() - date.getFullYear();
                return age >= 18 || t('invalidAge');
              },
            },
          }, */
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
            validate: (value, formValues) => value === formValues.password, // TODO: revisar
          },
        }
      : {}),
  };

  return (
    <div className="flex flex-col gap-y-4">
      <div className="">
        <Input
          error={errors.firstName?.message as string}
          type="text"
          {...register('firstName', formValidations.firstName)}
          placeholder={'auth.signUp.firstName' ?? ''}
        />
      </div>
      <div className="">
        <Input
          type="text"
          {...register('lastName', formValidations.lastName)}
          placeholder={'auth.signUp.lastName' ?? ''}
          error={errors.lastName?.message as string}
        />
      </div>
      <div className="">
        <Input
          type="email"
          {...register('email', formValidations.email)}
          error={errors.email?.message as string}
          placeholder={'auth.signUp.email' ?? ''}
        />
      </div>
      <div className="">
        <Input
          required
          type="text"
          onFocus={(e) => (e.target.type = 'date')}
          error={errors?.birthDate?.message as string}
          placeholder={'auth.signUp.wizard.personal.birthDay.title' ?? ''}
          max={new Date().toISOString().split('T')[0]}
          {...register('birthDate', formValidations.birthDate)}
        />
        {/* puede que tenga que agregar el icono del calendario */}
      </div>
      <div className="">
        <Input
          type={showPassword ? 'text' : 'password'}
          {...register('password', formValidations.password)}
          placeholder={'auth.signUp.password' ?? ''}
          rightIcon={
            !showPassword ? (
              <button
                className=""
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {/* <PasswordEyeIcon className="w-5 h-5" /> */}
              </button>
            ) : (
              <button
                className=""
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {/* <EyeIcon className="w-5 h-5" /> */}
              </button>
            )
          }
        />
        {errors.password && (
          <span className="text-sm text-danger-300">
            auth.signUp.notifs.passwordRequirements
          </span>
        )}
      </div>
      <div className="">
        <Input
          type={showPasswordConf ? 'text' : 'password'}
          {...register('passwordConfirmation', formValidations.passwordConf)}
          placeholder={'auth.signUp.confirmPassword' ?? ''}
          rightIcon={
            !showPasswordConf ? (
              <button
                className=""
                type="button"
                onClick={() => setShowPasswordConf(!showPasswordConf)}
              >
                {/* <PasswordEyeIcon className="w-5 h-5" /> */}
              </button>
            ) : (
              <button
                className=""
                type="button"
                onClick={() => setShowPasswordConf(!showPasswordConf)}
              >
                {/* <EyeIcon className="w-5 h-5" /> */}
              </button>
            )
          }
        />
        {errors.passwordConfirmation &&
          (errors.passwordConfirmation.type === 'required' ? (
            <span className="text-sm text-danger-300">
              auth.signUp.notifs.confirmPassword
            </span>
          ) : (
            <span className="text-sm text-danger-300">
              auth.signUp.notifs.differentPasswordValues
            </span>
          ))}
      </div>
    </div>
  );
}
