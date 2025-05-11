import * as React from "react"

interface IconProps extends React.HtmlHTMLAttributes<SVGSVGElement> {
  className?: string
}

export const LampIcon: React.FunctionComponent<IconProps> = (props) => {
  const { className } = props

  return (
    <svg
      className={className}
      aria-hidden="true"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        clipRule="evenodd"
        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
        fillRule="evenodd"
      />
    </svg>
  )
}

export const VerifiedIcon: React.FunctionComponent<IconProps> = (props) => {
  const { className } = props

  return (
    <svg
      className={className}
      aria-hidden="true"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M10 1a6 6 0 00-3.815 10.631C7.237 12.5 8 13.443 8 14.456v.644a.75.75 0 00.572.729 6.016 6.016 0 002.856 0A.75.75 0 0012 15.1v-.644c0-1.013.762-1.957 1.815-2.825A6 6 0 0010 1zM8.863 17.414a.75.75 0 00-.226 1.483 9.066 9.066 0 002.726 0 .75.75 0 00-.226-1.483 7.553 7.553 0 01-2.274 0z" />
    </svg>
  )
}

export const GoogleColoredIcon: React.FunctionComponent<IconProps> = (
  props,
) => {
  const { className } = props

  return (
    <svg
      className={className}
      aria-hidden="true"
      fill="currentColor"
      stroke="currentColor"
      enableBackground="new 0 0 48 48"
      strokeWidth="0"
      version="1.1"
      x="0px"
      y="0px"
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid"
    >
      <path
        fill="#FFC107"
        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12

	c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
	c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
      ></path>
      <path
        fill="#FF3D00"
        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
	C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
      ></path>
      <path
        fill="#4CAF50"
        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36
	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
      ></path>
      <path
        fill="#1976D2"
        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571
	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
      ></path>
    </svg>
  )
}

export const IndonesiaFlag: React.FunctionComponent<IconProps> = (
  props: React.SVGAttributes<SVGSVGElement>,
) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      zoomAndPan="magnify"
      viewBox="0 0 30 30.000001"
      preserveAspectRatio="xMidYMid meet"
      version="1.0"
    >
      <defs>
        <clipPath id="id1">
          <path
            d="M 2.128906 5.222656 L 27.53125 5.222656 L 27.53125 15 L 2.128906 15 Z M 2.128906 5.222656 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="id2">
          <path
            d="M 2.128906 14 L 27.53125 14 L 27.53125 23.371094 L 2.128906 23.371094 Z M 2.128906 14 "
            clipRule="nonzero"
          />
        </clipPath>
      </defs>
      <g clipPath="url(#id1)">
        <path
          fill="rgb(86.268616%, 12.159729%, 14.898682%)"
          d="M 24.703125 5.222656 L 4.957031 5.222656 C 3.398438 5.222656 2.132812 6.472656 2.132812 8.015625 L 2.132812 14.296875 L 27.523438 14.296875 L 27.523438 8.015625 C 27.523438 6.472656 26.261719 5.222656 24.703125 5.222656 Z M 24.703125 5.222656 "
          fillOpacity="1"
          fillRule="nonzero"
        />
      </g>
      <g clipPath="url(#id2)">
        <path
          fill="rgb(93.328857%, 93.328857%, 93.328857%)"
          d="M 27.523438 20.578125 C 27.523438 22.121094 26.261719 23.371094 24.703125 23.371094 L 4.957031 23.371094 C 3.398438 23.371094 2.132812 22.121094 2.132812 20.578125 L 2.132812 14.296875 L 27.523438 14.296875 Z M 27.523438 20.578125 "
          fillOpacity="1"
          fillRule="nonzero"
        />
      </g>
    </svg>
  )
}

export const USAFlag: React.FunctionComponent<IconProps> = (
  props: React.SVGAttributes<SVGSVGElement>,
) => {
  return (
    <>
      <svg
        {...props}
        id="Layer_1"
        version="1.1"
        viewBox="0 0 55.2 38.4"
        x="0px"
        xmlSpace="preserve"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        y="0px"
      >
        <g
          style={{
            border: "0px solid rgb(229, 231, 235)",
            boxSizing: "border-box",
            borderColor: "hsl(214.3 31.8% 91.4%)",
          }}
        >
          <path
            d="M3.03,0h49.13c1.67,0,3.03,1.36,3.03,3.03v32.33c0,1.67-1.36,3.03-3.03,3.03H3.03C1.36,38.4,0,37.04,0,35.37 V3.03C0,1.36,1.36,0,3.03,0L3.03,0z"
            style={{
              border: "0px solid rgb(229, 231, 235)",
              boxSizing: "border-box",
              borderColor: "hsl(214.3 31.8% 91.4%)",
              fill: "rgb(178, 34, 52)",
            }}
          />
          <path
            d="M0.02,2.73h55.17c0.01,0.1,0.02,0.2,0.02,0.31v2.94H0V3.03C0,2.93,0.01,2.83,0.02,2.73L0.02,2.73z M55.2,8.67 v3.24H0V8.67H55.2L55.2,8.67z M55.2,14.61v3.24H0v-3.24H55.2L55.2,14.61z M55.2,20.55v3.24H0v-3.24H55.2L55.2,20.55z M55.2,26.49 v3.24H0v-3.24H55.2L55.2,26.49z M55.2,32.43v2.93c0,0.1-0.01,0.21-0.02,0.31H0.02C0.01,35.58,0,35.47,0,35.37v-2.93H55.2 L55.2,32.43z"
            style={{
              border: "0px solid rgb(229, 231, 235)",
              boxSizing: "border-box",
              borderColor: "hsl(214.3 31.8% 91.4%)",
              fill: "rgb(255, 255, 255)",
            }}
          />
          <path
            d="M20.8,0v20.68H0V3.03C0,1.36,1.36,0,3.03,0H20.8L20.8,0L20.8,0z"
            style={{
              border: "0px solid rgb(229, 231, 235)",
              boxSizing: "border-box",
              borderColor: "hsl(214.3 31.8% 91.4%)",
              fill: "rgb(60, 59, 110)",
            }}
          />
          <polygon
            points="1.23,2.86 1.92,5.01 0.1,3.68 2.36,3.68 0.53,5.01 1.23,2.86"
            style={{
              border: "0px solid rgb(229, 231, 235)",
              boxSizing: "border-box",
              borderColor: "hsl(214.3 31.8% 91.4%)",
              fill: "rgb(255, 255, 255)",
            }}
          />
          <polygon
            points="1.23,7.02 1.92,9.17 0.1,7.84 2.36,7.84 0.53,9.17 1.23,7.02"
            style={{
              border: "0px solid rgb(229, 231, 235)",
              boxSizing: "border-box",
              borderColor: "hsl(214.3 31.8% 91.4%)",
              fill: "rgb(255, 255, 255)",
            }}
          />
          <polygon
            points="1.23,11.18 1.92,13.33 0.1,12 2.36,12 0.53,13.33 1.23,11.18"
            style={{
              border: "0px solid rgb(229, 231, 235)",
              boxSizing: "border-box",
              borderColor: "hsl(214.3 31.8% 91.4%)",
              fill: "rgb(255, 255, 255)",
            }}
          />
          <polygon
            points="1.23,15.34 1.92,17.49 0.1,16.16 2.36,16.16 0.53,17.49 1.23,15.34"
            style={{
              border: "0px solid rgb(229, 231, 235)",
              boxSizing: "border-box",
              borderColor: "hsl(214.3 31.8% 91.4%)",
              fill: "rgb(255, 255, 255)",
            }}
          />
          <polygon
            points="3.67,0.78 4.37,2.93 2.54,1.6 4.81,1.6 2.97,2.93 3.67,0.78"
            style={{
              border: "0px solid rgb(229, 231, 235)",
              boxSizing: "border-box",
              borderColor: "hsl(214.3 31.8% 91.4%)",
              fill: "rgb(255, 255, 255)",
            }}
          />
          <polygon
            points="3.67,4.94 4.37,7.09 2.54,5.76 4.81,5.76 2.97,7.09 3.67,4.94"
            style={{
              border: "0px solid rgb(229, 231, 235)",
              boxSizing: "border-box",
              borderColor: "hsl(214.3 31.8% 91.4%)",
              fill: "rgb(255, 255, 255)",
            }}
          />
          <polygon
            points="3.67,9.1 4.37,11.25 2.54,9.92 4.81,9.92 2.97,11.25 3.67,9.1"
            style={{
              border: "0px solid rgb(229, 231, 235)",
              boxSizing: "border-box",
              borderColor: "hsl(214.3 31.8% 91.4%)",
              fill: "rgb(255, 255, 255)",
            }}
          />
          <polygon
            points="3.67,13.26 4.37,15.41 2.54,14.08 4.81,14.08 2.97,15.41 3.67,13.26"
            style={{
              border: "0px solid rgb(229, 231, 235)",
              boxSizing: "border-box",
              borderColor: "hsl(214.3 31.8% 91.4%)",
              fill: "rgb(255, 255, 255)",
            }}
          />
          <polygon
            points="3.67,17.42 4.37,19.57 2.54,18.24 4.81,18.24 2.97,19.57 3.67,17.42"
            style={{
              border: "0px solid rgb(229, 231, 235)",
              boxSizing: "border-box",
              borderColor: "hsl(214.3 31.8% 91.4%)",
              fill: "rgb(255, 255, 255)",
            }}
          />
          <polygon
            points="6.12,2.86 6.82,5.01 4.99,3.68 7.25,3.68 5.42,5.01 6.12,2.86"
            style={{
              border: "0px solid rgb(229, 231, 235)",
              boxSizing: "border-box",
              borderColor: "hsl(214.3 31.8% 91.4%)",
              fill: "rgb(255, 255, 255)",
            }}
          />
          <polygon
            points="6.12,7.02 6.82,9.17 4.99,7.84 7.25,7.84 5.42,9.17 6.12,7.02"
            style={{
              border: "0px solid rgb(229, 231, 235)",
              boxSizing: "border-box",
              borderColor: "hsl(214.3 31.8% 91.4%)",
              fill: "rgb(255, 255, 255)",
            }}
          />
          <polygon
            points="6.12,11.18 6.82,13.33 4.99,12 7.25,12 5.42,13.33 6.12,11.18"
            style={{
              border: "0px solid rgb(229, 231, 235)",
              boxSizing: "border-box",
              borderColor: "hsl(214.3 31.8% 91.4%)",
              fill: "rgb(255, 255, 255)",
            }}
          />
          <polygon
            points="6.12,15.34 6.82,17.49 4.99,16.16 7.25,16.16 5.42,17.49 6.12,15.34"
            style={{
              border: "0px solid rgb(229, 231, 235)",
              boxSizing: "border-box",
              borderColor: "hsl(214.3 31.8% 91.4%)",
              fill: "rgb(255, 255, 255)",
            }}
          />
          <polygon
            points="8.57,0.78 9.26,2.93 7.44,1.6 9.7,1.6 7.87,2.93 8.57,0.78"
            style={{
              border: "0px solid rgb(229, 231, 235)",
              boxSizing: "border-box",
              borderColor: "hsl(214.3 31.8% 91.4%)",
              fill: "rgb(255, 255, 255)",
            }}
          />
          <polygon
            points="8.57,4.94 9.26,7.09 7.44,5.76 9.7,5.76 7.87,7.09 8.57,4.94"
            style={{
              border: "0px solid rgb(229, 231, 235)",
              boxSizing: "border-box",
              borderColor: "hsl(214.3 31.8% 91.4%)",
              fill: "rgb(255, 255, 255)",
            }}
          />
          <polygon
            points="8.57,9.1 9.26,11.25 7.44,9.92 9.7,9.92 7.87,11.25 8.57,9.1"
            style={{
              border: "0px solid rgb(229, 231, 235)",
              boxSizing: "border-box",
              borderColor: "hsl(214.3 31.8% 91.4%)",
              fill: "rgb(255, 255, 255)",
            }}
          />
          <polygon
            points="8.57,13.26 9.26,15.41 7.44,14.08 9.7,14.08 7.87,15.41 8.57,13.26"
            style={{
              border: "0px solid rgb(229, 231, 235)",
              boxSizing: "border-box",
              borderColor: "hsl(214.3 31.8% 91.4%)",
              fill: "rgb(255, 255, 255)",
            }}
          />
          <polygon
            points="8.57,17.42 9.26,19.57 7.44,18.24 9.7,18.24 7.87,19.57 8.57,17.42"
            style={{
              border: "0px solid rgb(229, 231, 235)",
              boxSizing: "border-box",
              borderColor: "hsl(214.3 31.8% 91.4%)",
              fill: "rgb(255, 255, 255)",
            }}
          />
          <polygon
            points="11.01,2.86 11.71,5.01 9.88,3.68 12.14,3.68 10.31,5.01 11.01,2.86"
            style={{
              border: "0px solid rgb(229, 231, 235)",
              boxSizing: "border-box",
              borderColor: "hsl(214.3 31.8% 91.4%)",
              fill: "rgb(255, 255, 255)",
            }}
          />
          <polygon
            points="11.01,7.02 11.71,9.17 9.88,7.84 12.14,7.84 10.31,9.17 11.01,7.02"
            style={{
              border: "0px solid rgb(229, 231, 235)",
              boxSizing: "border-box",
              borderColor: "hsl(214.3 31.8% 91.4%)",
              fill: "rgb(255, 255, 255)",
            }}
          />
          <polygon
            points="11.01,11.18 11.71,13.33 9.88,12 12.14,12 10.31,13.33 11.01,11.18"
            style={{
              border: "0px solid rgb(229, 231, 235)",
              boxSizing: "border-box",
              borderColor: "hsl(214.3 31.8% 91.4%)",
              fill: "rgb(255, 255, 255)",
            }}
          />
          <polygon
            points="11.01,15.34 11.71,17.49 9.88,16.16 12.14,16.16 10.31,17.49 11.01,15.34"
            style={{
              border: "0px solid rgb(229, 231, 235)",
              boxSizing: "border-box",
              borderColor: "hsl(214.3 31.8% 91.4%)",
              fill: "rgb(255, 255, 255)",
            }}
          />
          <polygon
            points="13.46,0.78 14.16,2.93 12.33,1.6 14.59,1.6 12.76,2.93 13.46,0.78"
            style={{
              border: "0px solid rgb(229, 231, 235)",
              boxSizing: "border-box",
              borderColor: "hsl(214.3 31.8% 91.4%)",
              fill: "rgb(255, 255, 255)",
            }}
          />
          <polygon
            points="13.46,4.94 14.16,7.09 12.33,5.76 14.59,5.76 12.76,7.09 13.46,4.94"
            style={{
              border: "0px solid rgb(229, 231, 235)",
              boxSizing: "border-box",
              borderColor: "hsl(214.3 31.8% 91.4%)",
              fill: "rgb(255, 255, 255)",
            }}
          />
          <polygon
            points="13.46,9.1 14.16,11.25 12.33,9.92 14.59,9.92 12.76,11.25 13.46,9.1"
            style={{
              border: "0px solid rgb(229, 231, 235)",
              boxSizing: "border-box",
              borderColor: "hsl(214.3 31.8% 91.4%)",
              fill: "rgb(255, 255, 255)",
            }}
          />
          <polygon
            points="13.46,13.26 14.16,15.41 12.33,14.08 14.59,14.08 12.76,15.41 13.46,13.26"
            style={{
              border: "0px solid rgb(229, 231, 235)",
              boxSizing: "border-box",
              borderColor: "hsl(214.3 31.8% 91.4%)",
              fill: "rgb(255, 255, 255)",
            }}
          />
          <polygon
            points="13.46,17.42 14.16,19.57 12.33,18.24 14.59,18.24 12.76,19.57 13.46,17.42"
            style={{
              border: "0px solid rgb(229, 231, 235)",
              boxSizing: "border-box",
              borderColor: "hsl(214.3 31.8% 91.4%)",
              fill: "rgb(255, 255, 255)",
            }}
          />
          <polygon
            points="15.9,2.86 16.6,5.01 14.77,3.68 17.03,3.68 15.21,5.01 15.9,2.86"
            style={{
              border: "0px solid rgb(229, 231, 235)",
              boxSizing: "border-box",
              borderColor: "hsl(214.3 31.8% 91.4%)",
              fill: "rgb(255, 255, 255)",
            }}
          />
          <polygon
            points="15.9,7.02 16.6,9.17 14.77,7.84 17.03,7.84 15.21,9.17 15.9,7.02"
            style={{
              border: "0px solid rgb(229, 231, 235)",
              boxSizing: "border-box",
              borderColor: "hsl(214.3 31.8% 91.4%)",
              fill: "rgb(255, 255, 255)",
            }}
          />
          <polygon
            points="15.9,11.18 16.6,13.33 14.77,12 17.03,12 15.21,13.33 15.9,11.18"
            style={{
              border: "0px solid rgb(229, 231, 235)",
              boxSizing: "border-box",
              borderColor: "hsl(214.3 31.8% 91.4%)",
              fill: "rgb(255, 255, 255)",
            }}
          />
          <polygon
            points="15.9,15.34 16.6,17.49 14.77,16.16 17.03,16.16 15.21,17.49 15.9,15.34"
            style={{
              border: "0px solid rgb(229, 231, 235)",
              boxSizing: "border-box",
              borderColor: "hsl(214.3 31.8% 91.4%)",
              fill: "rgb(255, 255, 255)",
            }}
          />
          <polygon
            points="18.35,0.78 19.05,2.93 17.22,1.6 19.48,1.6 17.65,2.93 18.35,0.78"
            style={{
              border: "0px solid rgb(229, 231, 235)",
              boxSizing: "border-box",
              borderColor: "hsl(214.3 31.8% 91.4%)",
              fill: "rgb(255, 255, 255)",
            }}
          />
          <polygon
            points="18.35,4.94 19.05,7.09 17.22,5.76 19.48,5.76 17.65,7.09 18.35,4.94"
            style={{
              border: "0px solid rgb(229, 231, 235)",
              boxSizing: "border-box",
              borderColor: "hsl(214.3 31.8% 91.4%)",
              fill: "rgb(255, 255, 255)",
            }}
          />
          <polygon
            points="18.35,9.1 19.05,11.25 17.22,9.92 19.48,9.92 17.65,11.25 18.35,9.1"
            style={{
              border: "0px solid rgb(229, 231, 235)",
              boxSizing: "border-box",
              borderColor: "hsl(214.3 31.8% 91.4%)",
              fill: "rgb(255, 255, 255)",
            }}
          />
          <polygon
            points="18.35,13.26 19.05,15.41 17.22,14.08 19.48,14.08 17.65,15.41 18.35,13.26"
            style={{
              border: "0px solid rgb(229, 231, 235)",
              boxSizing: "border-box",
              borderColor: "hsl(214.3 31.8% 91.4%)",
              fill: "rgb(255, 255, 255)",
            }}
          />
          <polygon
            points="18.35,17.42 19.05,19.57 17.22,18.24 19.48,18.24 17.65,19.57 18.35,17.42"
            style={{
              border: "0px solid rgb(229, 231, 235)",
              boxSizing: "border-box",
              borderColor: "hsl(214.3 31.8% 91.4%)",
              fill: "rgb(255, 255, 255)",
            }}
          />
        </g>
      </svg>
    </>
  )
}

export const Icon = {
  GoogleColored: GoogleColoredIcon,
  IndonesiaFlag: IndonesiaFlag,
  Lamp: LampIcon,
  USAFlag: USAFlag,
  Verified: VerifiedIcon,
}
