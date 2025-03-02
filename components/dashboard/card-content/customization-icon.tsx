"use client";

export default function CustomizationIcon() {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full max-w-[85%] max-h-[85%]"
    >
      {/* Outer rotating ring */}
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="8 8"
        className="text-primary/20 dark:text-primary/10"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 50 50"
          to="360 50 50"
          dur="60s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Middle ring with gradient */}
      <circle cx="50" cy="50" r="35" fill="url(#gradient1)">
        <animate
          attributeName="r"
          values="35;37;35"
          dur="3s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Inner rotating segments */}
      <g>
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 50 50"
          to="-360 50 50"
          dur="30s"
          repeatCount="indefinite"
        />
        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <path
            key={angle}
            d={`M 50 50 L ${
              50 +
              Math.round(25 * Math.cos((angle * Math.PI) / 180) * 1000) / 1000
            } ${
              50 +
              Math.round(25 * Math.sin((angle * Math.PI) / 180) * 1000) / 1000
            } A 25 25 0 0 1 ${
              50 +
              Math.round(25 * Math.cos(((angle + 30) * Math.PI) / 180) * 1000) /
                1000
            } ${
              50 +
              Math.round(25 * Math.sin(((angle + 30) * Math.PI) / 180) * 1000) /
                1000
            } Z`}
            fill={`url(#segment${i + 1})`}
            className="opacity-90"
          >
            <animate
              attributeName="opacity"
              values="0.9;0.7;0.9"
              dur="3s"
              begin={`${i * 0.5}s`}
              repeatCount="indefinite"
            />
          </path>
        ))}
      </g>

      {/* Center circle */}
      <circle
        cx="50"
        cy="50"
        r="15"
        fill="white"
        className="dark:fill-gray-900"
      >
        <animate
          attributeName="r"
          values="15;17;15"
          dur="3s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Center dot */}
      <circle cx="50" cy="50" r="3" className="fill-primary">
        <animate
          attributeName="r"
          values="3;4;3"
          dur="3s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Gradients */}
      <defs>
        <radialGradient id="gradient1">
          <stop
            offset="0%"
            className="text-primary/10"
            style={{ stopColor: "currentColor" }}
          />
          <stop
            offset="100%"
            className="text-primary/5"
            style={{ stopColor: "currentColor" }}
          />
        </radialGradient>

        <linearGradient
          id="segment1"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
          gradientTransform="rotate(30)"
        >
          <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.9" />
        </linearGradient>

        <linearGradient
          id="segment2"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
          gradientTransform="rotate(90)"
        >
          <stop offset="0%" stopColor="#34D399" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0.9" />
        </linearGradient>

        <linearGradient
          id="segment3"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
          gradientTransform="rotate(150)"
        >
          <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.9" />
        </linearGradient>

        <linearGradient
          id="segment4"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
          gradientTransform="rotate(210)"
        >
          <stop offset="0%" stopColor="#F472B6" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#EC4899" stopOpacity="0.9" />
        </linearGradient>

        <linearGradient
          id="segment5"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
          gradientTransform="rotate(270)"
        >
          <stop offset="0%" stopColor="#818CF8" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#6366F1" stopOpacity="0.9" />
        </linearGradient>

        <linearGradient
          id="segment6"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
          gradientTransform="rotate(330)"
        >
          <stop offset="0%" stopColor="#FB7185" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#E11D48" stopOpacity="0.9" />
        </linearGradient>
      </defs>
    </svg>
  );
}
