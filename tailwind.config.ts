import type { Config } from "tailwindcss"

/**
 * "Light in Darkness" tokens, from the council ruling.
 * These are the site's own colours, not official hall colours.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.ts"],
  theme: {
    extend: {
      colors: {
        night: { DEFAULT: "#14112B", 2: "#1E1A3F", 3: "#2C2659" },
        lamp: { DEFAULT: "#F2B84B", soft: "#FBE3AE", deep: "#8A5300" },
        paper: { DEFAULT: "#FBF7EF", 2: "#F3ECDD" },
        ink: { DEFAULT: "#1B1830", muted: "#55506E" },
        mist: { DEFAULT: "#EDE9F7", muted: "#B9B3D6" },
      },
      fontFamily: {
        display: ['"Fraunces"', "Georgia", "serif"],
        sans: ['"Atkinson Hyperlegible"', "system-ui", "sans-serif"],
      },
      maxWidth: { prose: "42rem" },
    },
  },
  plugins: [],
}
export default config
