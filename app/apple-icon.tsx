import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FFFFFF",
          borderRadius: 36,
        }}
      >
        <svg viewBox="0 0 42 42" width="148" height="148" fill="none">
          <defs>
            <linearGradient id="mark" x1="4" y1="4" x2="38" y2="38" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" />
              <stop offset="1" stopColor="#EFE8F3" />
            </linearGradient>
            <linearGradient id="line" x1="11" y1="14" x2="31" y2="29" gradientUnits="userSpaceOnUse">
              <stop stopColor="#623B77" />
              <stop offset="1" stopColor="#91643F" />
            </linearGradient>
          </defs>
          <rect x="1" y="1" width="40" height="40" rx="12" fill="url(#mark)" stroke="#E1DBE5" strokeWidth="1.4" />
          <path d="M10.5 13.2C15.2 10.8 18.9 10.8 21 13.2C23.1 10.8 26.8 10.8 31.5 13.2V27.4C26.8 25.1 23.1 25.1 21 27.4C18.9 25.1 15.2 25.1 10.5 27.4V13.2Z" fill="#F8F7F9" stroke="#241D2A" strokeWidth="1.25" strokeLinejoin="round" />
          <path d="M14 17.2C16.6 16.3 18.8 16.6 21 18.2C23.2 16.6 25.4 16.3 28 17.2M14 22.1C16.6 21.2 18.8 21.5 21 23.1C23.2 21.5 25.4 21.2 28 22.1" stroke="url(#line)" strokeWidth="1.7" strokeLinecap="round" />
          <path d="M21 13.6V27" stroke="#E1DBE5" strokeWidth="1.1" strokeLinecap="round" />
          <circle cx="31.5" cy="8.8" r="2.2" fill="#91643F" />
          <circle cx="10.5" cy="32.4" r="2.2" fill="#623B77" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
