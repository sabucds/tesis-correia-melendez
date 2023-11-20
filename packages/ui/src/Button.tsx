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
    <button className={` rounded-lg w-fit h-fit ${className}`} {...props}>
      {children}
    </button>
  );
}
