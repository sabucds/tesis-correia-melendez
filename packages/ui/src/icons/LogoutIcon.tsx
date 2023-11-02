import React from 'react';

function LogoutIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 18 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.74984 1.66667C2.51972 1.66667 2.33317 1.85321 2.33317 2.08333V12.9167C2.33317 13.1468 2.51972 13.3333 2.74984 13.3333H8.58317C8.81329 13.3333 8.99984 13.5199 8.99984 13.75V14.5833C8.99984 14.8135 8.81329 15 8.58317 15H2.33317C1.4165 15 0.666504 14.25 0.666504 13.3333V1.66667C0.666504 0.75 1.4165 0 2.33317 0H8.58317C8.81329 0 8.99984 0.186548 8.99984 0.416667V1.25C8.99984 1.48012 8.81329 1.66667 8.58317 1.66667H2.74984Z"
        fill="#A6A6A6"
      />
      <path
        d="M12.8719 3.62796L12.2856 4.21427C12.1231 4.37677 12.1228 4.64015 12.285 4.80296L14.1415 6.66667H6.08317C5.85305 6.66667 5.6665 6.85321 5.6665 7.08333V7.91667C5.6665 8.14678 5.85305 8.33333 6.08317 8.33333H14.1415L12.2851 10.1897C12.1228 10.3521 12.1223 10.6151 12.2841 10.778L12.8719 11.37C13.0344 11.5337 13.2991 11.5341 13.4622 11.371L17.0385 7.79463C17.2013 7.63191 17.2013 7.36809 17.0385 7.20537L13.4611 3.62796C13.2984 3.46524 13.0346 3.46524 12.8719 3.62796Z"
        fill="#A6A6A6"
      />
    </svg>
  );
}

export default LogoutIcon;
