import type { Config } from "tailwindcss"

/** Lizab tokens, from the creative council memo. Bronze is light only, never text. */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.ts"],
  theme: {
    extend: {
      colors: {
        onyx: "#0E0B09",
        espresso: "#2A1A12",
        bronze: "#C9852E",
        gold: { DEFAULT: "#C9A45C", light: "#E0C27A" },
        champagne: "#EFE4D2",
        ash: "#A89A89",
      },
      fontFamily: {
        display: ['"Bodoni Moda Variable"', "Georgia", "serif"],
        sans: ['"Jost Variable"', "system-ui", "sans-serif"],
      },
      letterSpacing: { caps: "0.2em" },
    },
  },
  plugins: [],
}
export default config
