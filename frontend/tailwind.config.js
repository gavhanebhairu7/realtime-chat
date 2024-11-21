/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx}"], // Adjust this based on your file structure
  theme: {
    extend: {
      animation: {
        fluctuate: "fluctuate 3s ease-in-out infinite", // Animation name and duration
      },
      keyframes: {
        fluctuate: {
          "0%": {
            transform: "scale(1)", // Initial size
            opacity: "1", // Fully opaque
          },
          "50%": {
            transform: "scale(1.5)", // 50% larger
            opacity: "0.4", // Slightly faded
          },
          "100%": {
            transform: "scale(1)", // Back to original size
            opacity: "1", // Fully opaque again
          },
        },
      },
    },
  },
  plugins: [require("daisyui")],
};
