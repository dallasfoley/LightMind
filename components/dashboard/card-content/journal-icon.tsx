"use client";

export default function JournalIcon() {
  return (
    <svg
      viewBox="0 0 200 150"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* Dark background */}
      <rect
        x="0"
        y="0"
        width="200"
        height="150"
        fill="transparent"
        rx="0"
        ry="0"
      />

      {/* Journal outer rounded rectangle */}
      <rect
        x="10"
        y="10"
        width="180"
        height="130"
        rx="10"
        ry="10"
        fill="#6366f1"
      />

      {/* Journal inner rounded rectangle (lighter) */}
      <rect
        x="15"
        y="15"
        width="170"
        height="120"
        rx="7.5"
        ry="7.5"
        fill="#818cf8"
      />

      {/* Left page (slightly darker) */}
      <rect
        x="20"
        y="20"
        width="79.5"
        height="110"
        rx="5"
        ry="5"
        fill="#a5b4fc"
      />

      {/* Base right page */}
      <rect
        x="100.5"
        y="20"
        width="79.5"
        height="110"
        rx="5"
        ry="5"
        fill="#c7d2fe"
      />

      {/* Left page lines */}
      <rect x="30" y="45" width="60" height="4" rx="2" ry="2" fill="#4f46e5" />
      <rect x="30" y="70" width="60" height="4" rx="2" ry="2" fill="#4f46e5" />
      <rect x="30" y="95" width="60" height="4" rx="2" ry="2" fill="#4f46e5" />

      {/* Base right page lines */}
      <rect x="110" y="45" width="60" height="4" rx="2" ry="2" fill="#4f46e5" />
      <rect x="110" y="70" width="60" height="4" rx="2" ry="2" fill="#4f46e5" />
      <rect x="110" y="95" width="60" height="4" rx="2" ry="2" fill="#4f46e5" />

      {/* Animated turning page */}
      <g>
        <path d="M100.5,20 L180,20 L180,130 L100.5,130 Z" fill="#c7d2fe">
          <animate
            attributeName="d"
            dur="1.5s"
            repeatCount="indefinite"
            values="
              M100.5,20 L180,20 L180,130 L100.5,130 Z;
              M100.5,20 L140,20 Q170,75 140,130 L100.5,130 Z;
              M100.5,20 L120,20 Q130,75 120,130 L100.5,130 Z;
              M100.5,20 L100.5,20 L100.5,130 L100.5,130 Z;
              M20,20 L100.5,20 L100.5,130 L20,130 Z"
            keyTimes="0;0.25;0.5;0.75;1"
          />
          <animate
            attributeName="fill"
            dur="1.5s"
            repeatCount="indefinite"
            values="#c7d2fe;#c7d2fe;#b4bffc;#a5b4fc;#c7d2fe"
            keyTimes="0;0.25;0.5;0.75;1"
          />
        </path>

        {/* Lines for the page */}
        <g>
          <path
            d="M110,45 L170,45"
            stroke="#4f46e5"
            strokeWidth="4"
            strokeLinecap="round"
          >
            <animate
              attributeName="d"
              dur="1.5s"
              repeatCount="indefinite"
              values="
                M110,45 L170,45;
                M110,45 L140,45;
                M110,45 L120,45;
                M110,45 L110,45;
                M30,45 L90,45"
              keyTimes="0;0.25;0.5;0.75;1"
            />
          </path>
          <path
            d="M110,70 L170,70"
            stroke="#4f46e5"
            strokeWidth="4"
            strokeLinecap="round"
          >
            <animate
              attributeName="d"
              dur="1.5s"
              repeatCount="indefinite"
              values="
                M110,70 L170,70;
                M110,70 L140,70;
                M110,70 L120,70;
                M110,70 L110,70;
                M30,70 L90,70"
              keyTimes="0;0.25;0.5;0.75;1"
            />
          </path>
          <path
            d="M110,95 L170,95"
            stroke="#4f46e5"
            strokeWidth="4"
            strokeLinecap="round"
          >
            <animate
              attributeName="d"
              dur="1.5s"
              repeatCount="indefinite"
              values="
                M110,95 L170,95;
                M110,95 L140,95;
                M110,95 L120,95;
                M110,95 L110,95;
                M30,95 L90,95"
              keyTimes="0;0.25;0.5;0.75;1"
            />
          </path>
        </g>
      </g>

      {/* Journal spine */}
      <rect x="99.5" y="15" width="1" height="120" fill="#6366f1" />

      {/* Small highlight dot in top right corner */}
      <circle cx="170" cy="25" r="1.5" fill="#ffffff" opacity="0.7" />
    </svg>
  );
}
