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
      ...props
    },
    ref
  ) {
    return (
      <label className="block">
        {label !== '' ? (
          <span className="font-semibold text-text mb-2">{label}</span>
        ) : null}
        <div
          className={`w-full border-[0.5px] border-solid border-neutral-100 rounded flex items-center py-2 `}
        >
          {children}
          <input
            className={`${
              label !== '' ? ' ' : ''
            } w-full px-4 py-2 border border-primary-300 rounded-md text-text-light ${className}`}
            ref={ref}
            onChange={onChange}
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
