import React from "react";

export const HierarchyIcon = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="10" y="2" width="4" height="4" fill="#969696" />
      <rect x="4" y="10" width="4" height="4" fill="#969696" />
      <rect x="16" y="10" width="4" height="4" fill="#969696" />
      <rect x="10" y="18" width="4" height="4" fill="#969696" />
      <path
        d="M12 6V10"
        stroke="#969696"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M6 14V18"
        stroke="#969696"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M18 14V18"
        stroke="#969696"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M12 14H6"
        stroke="#969696"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M12 14H18"
        stroke="#969696"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};