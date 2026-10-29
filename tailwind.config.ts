import type { Config } from "tailwindcss"

/** Glee Garden v2: white and ink, one deep garden green, a quiet sage, and terracotta used sparingly. */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.ts"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#111613", soft: "#3C4540", mute: "#5E6862" },
        green: { DEFAULT: "#1F4D3A", deep: "#143326", light: "#2E6B52" },
        sage: { DEFAULT: "#E9EEE9", deep: "#D6E0D7" },
        paper: "#F6F5F1",
        clay: "#B5552F",
        line: "#E3E5E1",
      },
      fontFamily: {
        serif: ['"Instrument Serif"', "Georgia", "serif"],
        sans: ['"Inter Tight Variable"', "system-ui", "sans-serif"],
      },
      transitionTimingFunction: { out: "cubic-bezier(0.16, 1, 0.3, 1)" },
    },
  },
  plugins: [],
}
export default config
