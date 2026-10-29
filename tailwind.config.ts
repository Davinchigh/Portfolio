import type { Config } from "tailwindcss"

/** Lizab tokens, from the creative council memo. Bronze is light only, never text. */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.ts"],
  theme: {
    extend: {
      colors: {
        // Ink, ivory and champagne gold: a near-monochrome base so the clothes carry the colour.
        onyx: "#0D0C0B",
        espresso: "#1C1A17",
        bronze: "#B98A45",
        gold: { DEFAULT: "#C9A45C", light: "#E2C78F", deep: "#7E6029" },
        champagne: "#F1EBE1",
        ash: "#A69D93",
        ivory: "#F4EFE7",
        linen: "#E9E1D5",
        ink: "#171513",
        stone: "#6E665E",
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
