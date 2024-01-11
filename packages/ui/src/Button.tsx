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
      className={` rounded-lg h-fit ${className} ${
        !className.includes('bg') ? 'bg-primary-300 hover:bg-primary-400' : ''
      } ${!className.includes('w-') ? 'w-fit' : ''}`}
      {...props}
    >
      {children}
    </button>
  );
}
