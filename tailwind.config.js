const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Montserrat"],
      },
    },
    margin: (theme, { negative }) => ({
      auto: "auto",
      "2": "2px",
      "4": "0.25rem",
      "6": "0.375rem",
      "8": "0.5rem",
      "10": "0.6rem",

      "12": "0.75rem", // FOR CONTAINER PADDING ONLY ABOVE TABLET
      "14": "0.875rem", //14px
      "16": "1rem", // 16px
      "20": "1.25rem", // 20px
      "24": "1.5rem", // 24px
      "28": "1.75rem", // 24px
      "32": "2rem", // 32px
      "40": "2.5rem", //40px
      "48": "3rem", //48px
      "56": "3.5rem", // 56px
      "60": "3.75rem", // 56px
      "1/12": "8.333333%",
      "1/6": "16.666667%",
      "-4": "-0.25rem",
      "-6": "-0.375rem",
      "-8": "-0.5rem",
      "-12": "-0.75rem",
      "-16": "-1rem",
      "-20": "-1.25rem", //20px
      "-24": "-1.5rem",
      "-28": "-1.75rem", // 28px
      "-32": "-2rem", // 32px
      "-40": "-2.5rem", //40px
      "-48": "-3rem", //48px
      "-56": "-3.5rem", // 56px
      "-60": "-3.75rem", // 56px
      "-64": "-4rem", // 64px
      "-76": "-4.75rem", // 76px
      "-80": "-5rem", // 80px
      "-96": "-6rem", // 96px
      "-112": "-7rem", // 112px
      "-144": "-9rem" // 144px
    }),
   
    screens: {
      xs: "465px",
      ...defaultTheme.screens,
    },
 
  },
  plugins: [],
};
