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
      className={` text-white bg-primary-300 hover:bg-primary-400 rounded-lg w-fit h-fit ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
