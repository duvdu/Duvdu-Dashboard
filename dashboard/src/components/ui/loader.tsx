export function Loader({ className = "w-5 h-5" }: { className?: string }) {
  // replace it with this

  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
    <circle
      fill="var(--primary)"
      stroke="var(--primary)"
      stroke-width="15"
      r="15"
      cx="40"
      cy="100"
    >
      <animate
        attributeName="opacity"
        calcMode="spline"
        dur="1.4"
        values="1;0;1;"
        keySplines=".5 0 .5 1;.5 0 .5 1"
        repeatCount="indefinite"
        begin="-.4"
      ></animate>
    </circle>
    <circle
      fill="var(--primary)"
      stroke="var(--primary)"
      stroke-width="15"
      r="15"
      cx="100"
      cy="100"
    >
      <animate
        attributeName="opacity"
        calcMode="spline"
        dur="1.4"
        values="1;0;1;"
        keySplines=".5 0 .5 1;.5 0 .5 1"
        repeatCount="indefinite"
        begin="-.2"
      ></animate>
    </circle>
    <circle
      fill="var(--primary)"
      stroke="var(--primary)"
      stroke-width="15"
      r="15"
      cx="160"
      cy="100"
    >
      <animate
        attributeName="opacity"
        calcMode="spline"
        dur="1.4"
        values="1;0;1;"
        keySplines=".5 0 .5 1;.5 0 .5 1"
        repeatCount="indefinite"
        begin="0"
      ></animate>
    </circle>
  </svg>;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <circle
        fill="var(--primary)"
        stroke="var(--primary)"
        stroke-width="15"
        r="15"
        cx="40"
        cy="100"
      >
        <animate
          attributeName="opacity"
          calcMode="spline"
          dur="1.4"
          values="1;0;1;"
          keySplines=".5 0 .5 1;.5 0 .5 1"
          repeatCount="indefinite"
          begin="-.4"
        ></animate>
      </circle>
      <circle
        fill="var(--primary)"
        stroke="var(--primary)"
        stroke-width="15"
        r="15"
        cx="100"
        cy="100"
      >
        <animate
          attributeName="opacity"
          calcMode="spline"
          dur="1.4"
          values="1;0;1;"
          keySplines=".5 0 .5 1;.5 0 .5 1"
          repeatCount="indefinite"
          begin="-.2"
        ></animate>
      </circle>
      <circle
        fill="var(--primary)"
        stroke="var(--primary)"
        stroke-width="15"
        r="15"
        cx="160"
        cy="100"
      >
        <animate
          attributeName="opacity"
          calcMode="spline"
          dur="1.4"
          values="1;0;1;"
          keySplines=".5 0 .5 1;.5 0 .5 1"
          repeatCount="indefinite"
          begin="0"
        ></animate>
      </circle>
    </svg>
  );
}
