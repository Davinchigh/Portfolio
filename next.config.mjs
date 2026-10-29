/** Static export so it can be served from any static host. */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
}
export default nextConfig
