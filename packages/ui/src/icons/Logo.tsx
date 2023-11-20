import React from 'react';

function Logo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      //   width="19"
      //   height="25"
      className={className}
      {...props}
      viewBox="0 0 19 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <rect y="0.5" width="18.0531" height="24" fill="url(#pattern0)" />
      <defs>
        <pattern
          id="pattern0"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use
            xlinkHref="#image0_17_680"
            transform="scale(0.0117647 0.00884956)"
          />
        </pattern>
        <image
          id="image0_17_680"
          width="85"
          height="113"
          xlinkHref="data:image/png;base64,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"
        />
      </defs>
    </svg>
  );
}

export default Logo;
