/* eslint-disable react/button-has-type */
import React from 'react';

export default function Button({
  className,
  children,
  ...props
}: React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) {
  return (
    <button
      className={` rounded-lg w-fit h-fit ${className} ${
        !className.includes('bg') ? 'bg-primary-300 hover:bg-primary-400' : ''
      }`}
      {...props}
    >
      {children}
    </button>
  );
}
