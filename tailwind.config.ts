import type { Config } from "tailwindcss"

/**
 * Editorial, light and quiet. One restrained accent (lamplight brass) carries the "Light in Darkness" motto.
 * These are this site's own colours, not official hall colours.
 * Token names are kept from the first version so every page picks up the new look.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.ts"],
  theme: {
    extend: {
      colors: {
        night: { DEFAULT: "#0F1115", 2: "#171A20", 3: "#22262E" },
        lamp: { DEFAULT: "#D4B26A", soft: "#F3E6C4", deep: "#7A5A17" },
        paper: { DEFAULT: "#FAF9F6", 2: "#F1EFE9" },
        ink: { DEFAULT: "#15171C", muted: "#5C606A" },
        mist: { DEFAULT: "#F3F1EC", muted: "#A8ACB4" },
        line: "#E3E0D8",
      },
      fontFamily: {
        display: ['"Newsreader Variable"', "Georgia", "serif"],
        sans: ['"Inter Variable"', "system-ui", "sans-serif"],
      },
      maxWidth: { prose: "40rem" },
      letterSpacing: { label: "0.16em" },
    },
  },
  plugins: [],
}
export default config
