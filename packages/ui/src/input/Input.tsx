import React from 'react';

export interface InputProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label?: string;
  children?: React.ReactNode;
  error?: string;
  rightIcon?: React.ReactNode;
}
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function _Input(
    {
      label = '',
      children,
      rightIcon,
      className = '',
      error = '',
      onChange,
      id, // Agrega un ID como prop
      ...props
    },
    ref
  ) {
    // Genera un ID único si no se proporciona
    const inputId = id || `input-${Math.floor(Math.random() * 10000)}`;

    return (
      <label className="block" htmlFor={inputId}>
        {label !== '' ? (
          <span className="font-semibold text-text mb-2">{label}</span>
        ) : null}
        <div className={`w-full rounded flex items-center py-2  `}>
          {children}
          <input
            id={inputId} // Asocia el campo de entrada con el ID
            className={`${
              label !== '' ? ' ' : ''
            } w-full px-3 py-1.5 text-base border border-primary-300 rounded-md text-text-light ${className} ${
              rightIcon && 'mr-4'
            }`}
            ref={ref}
            onChange={onChange}
            aria-label={label}
            {...props}
          />
          {rightIcon}
        </div>
        {error ? (
          <span className="text-sm text-danger-300 capitalize">{error}</span>
        ) : null}
      </label>
    );
  }
);
