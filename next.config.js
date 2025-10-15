/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'images.unsplash.com', 'via.placeholder.com'],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
    }
    return config
  },
  experimental: {
    outputFileTracingExcludes: {
      '*': ['./mobile-app/**/*'],
    },
  },
}

module.exports = nextConfig
