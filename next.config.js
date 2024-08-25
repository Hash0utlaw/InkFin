/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    },
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'oaidalleapiprodscus.blob.core.windows.net',
          port: '',
          pathname: '/private/**',
        },
      ],
    },
  }
  
  module.exports = nextConfig