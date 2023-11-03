import React from 'react';

function PasswordEyeIcon({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M17.7141 9.13496C18.1091 9.65163 18.1091 10.3491 17.7141 10.865C16.4699 12.4891 13.4849 15.8333 9.99993 15.8333C6.51493 15.8333 3.52993 12.4891 2.28576 10.865C2.09358 10.6176 1.98926 10.3132 1.98926 9.99996C1.98926 9.68669 2.09358 9.38235 2.28576 9.13496C3.52993 7.51079 6.51493 4.16663 9.99993 4.16663C13.4849 4.16663 16.4699 7.51079 17.7141 9.13496V9.13496Z"
        stroke="#606060"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z"
        stroke="#606060"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="2.36941"
        y1="16.2239"
        x2="18.3694"
        y2="3.22389"
        stroke="#606060"
        strokeWidth="2"
      />
    </svg>
  );
}

export default PasswordEyeIcon;
