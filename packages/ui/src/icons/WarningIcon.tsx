import React from 'react';

function WarningIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={className}
      {...props}
      viewBox="0 0 256 256"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        id="Round"
        d="M240.26 186.1L152.81 34.23C150.277 29.8981 146.654 26.3049 142.301 23.8079C137.949 21.3108 133.018 19.9969 128 19.9969C122.982 19.9969 118.051 21.3108 113.699 23.8079C109.346 26.3049 105.723 29.8981 103.19 34.23L15.74 186.1C13.2822 190.304 11.9868 195.086 11.9868 199.955C11.9868 204.824 13.2822 209.606 15.74 213.81C18.2448 218.163 21.8628 221.772 26.2228 224.266C30.5827 226.759 35.5275 228.048 40.5499 228H215.45C220.469 228.045 225.41 226.754 229.766 224.261C234.122 221.767 237.737 218.16 240.24 213.81C242.701 209.608 244 204.827 244.003 199.958C244.007 195.088 242.715 190.305 240.26 186.1ZM219.46 201.8C219.053 202.493 218.467 203.063 217.763 203.451C217.059 203.838 216.263 204.028 215.46 204H40.5499C39.7469 204.028 38.9512 203.838 38.2471 203.451C37.543 203.063 36.9567 202.493 36.5499 201.8C36.205 201.239 36.0223 200.593 36.0223 199.935C36.0223 199.276 36.205 198.631 36.5499 198.07L124 46.2C124.433 45.5335 125.026 44.9857 125.724 44.6065C126.423 44.2273 127.205 44.0286 128 44.0286C128.795 44.0286 129.577 44.2273 130.276 44.6065C130.974 44.9857 131.567 45.5335 132 46.2L219.44 198.07C219.788 198.629 219.974 199.274 219.978 199.932C219.981 200.591 219.802 201.237 219.46 201.8ZM116 136V104C116 100.817 117.264 97.7652 119.515 95.5147C121.765 93.2643 124.817 92 128 92C131.183 92 134.235 93.2643 136.485 95.5147C138.736 97.7652 140 100.817 140 104V136C140 139.183 138.736 142.235 136.485 144.485C134.235 146.736 131.183 148 128 148C124.817 148 121.765 146.736 119.515 144.485C117.264 142.235 116 139.183 116 136ZM144 176C144 179.165 143.062 182.258 141.303 184.889C139.545 187.52 137.047 189.571 134.123 190.782C131.199 191.993 127.982 192.31 124.879 191.693C121.775 191.075 118.924 189.551 116.686 187.314C114.449 185.076 112.925 182.225 112.307 179.121C111.69 176.018 112.007 172.801 113.218 169.877C114.429 166.953 116.48 164.455 119.111 162.696C121.742 160.938 124.835 160 128 160C132.243 160 136.313 161.686 139.314 164.686C142.314 167.687 144 171.757 144 176Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default WarningIcon;