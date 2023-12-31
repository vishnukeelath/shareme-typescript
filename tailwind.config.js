/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        dmsans: ["DM Sans", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
      },
      colors: {
        "background-50": "#FFF2F2",
        "background-100": "#fef6f6",
        "primary-100": "#fdecec",
        "primary-200": "#f47c7c",
        "primary-300": "#ef4444",
        "primary-400": "#a73030",
        "tag-green": "#d6f0e0",
        "tag-red": "#f9e1e5",
        "tag-warning": "#fbf0da",
      },
      textColor: {
        lightGray: "#F1EFEE",
        primary: "#FAFAFA",
        secColor: "#efefef",
        navColor: "#BEBEBE",
        tagGreen: "#0d6832",
        tagRed: "#af233a",
        tagWarning: "#73510d",
      },
      backgroundColor: {
        mainColor: "#FBF8F9",
        secondaryColor: "#F0F0F0",
        blackOverlay: "rgba(0, 0 ,0 ,0.7)",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
