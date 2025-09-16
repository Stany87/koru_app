import React from 'react'

interface FernFrondProps {
  className?: string
}

export const FernFrond: React.FC<FernFrondProps> = ({ className = "h-6 w-6" }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-label="Fern frond"
      role="img"
    >
      {/* Main stem */}
      <path d="M12 2v20" />

      {/* Left fronds */}
      <path d="M11 5L7.5 7.5" />
      <path d="M10.5 8L7 10.5" />
      <path d="M10 11L6.8 13" />
      <path d="M9.6 14L7 15.5" />
      <path d="M9.2 17L7.8 18" />

      {/* Right fronds */}
      <path d="M13 5L16.5 7.5" />
      <path d="M13.5 8L17 10.5" />
      <path d="M14 11L17.2 13" />
      <path d="M14.4 14L17 15.5" />
      <path d="M14.8 17L16.2 18" />
    </svg>
  )
}

export default FernFrond


