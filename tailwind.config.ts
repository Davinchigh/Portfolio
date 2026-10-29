import type { Config } from "tailwindcss"

/** Glee Garden: forest and cream with leaf green, a little sun, and terracotta from the pots. */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.ts"],
  theme: {
    extend: {
      colors: {
        forest: { DEFAULT: "#183A2C", deep: "#0F271D" },
        moss: "#3F6B45",
        leaf: { DEFAULT: "#7FB069", soft: "#DDEBD3" },
        sun: "#F2B84B",
        clay: { DEFAULT: "#C8673E", deep: "#9C4A27" },
        cream: "#F7F2E8",
        sand: "#EDE4D3",
        ink: "#14231B",
        stone: "#5B6B60",
      },
      fontFamily: {
        display: ['"Fraunces Variable"', "Georgia", "serif"],
        sans: ['"Manrope Variable"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
}
export default config
