/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      { source: "/techtriumph", destination: "/", permanent: true },
      { source: "/about", destination: "/#experience", permanent: false },
      { source: "/contact", destination: "/#contact", permanent: false },
      { source: "/figma-designs", destination: "/#designs", permanent: false },
      { source: "/blog", destination: "/", permanent: false },
    ]
  },
}

export default nextConfig
