import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        gray: "#3D3D3D",
        darkGray: "#292929",
        yellow: "#EAB305",
        white: "#FAFAFA",
        placeholder: "#B8B9C1",
      },
      fontSize: {
        xs: "12px", 
        sm: "14px", 
        base: "16px", 
        lg: "18px", 
        xl: "20px", 
        "2xl": "24px", 
        "3xl": "30px", 
        "4xl": "36px", 
        "5xl": "48px", 
        "6xl": "60px", 
        "7xl": "72px", 
        "8xl": "96px", 
        "9xl": "128px", 
      },
    },
  },
  plugins: [],
};
export default config;
