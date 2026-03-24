/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    return config;
  },
  output: 'export',
  distDir: 'out',
}

module.exports = nextConfig
