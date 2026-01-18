/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Configure external packages for server components
  experimental: {
    serverComponentsExternalPackages: ['@libsql/client'],
  },

  // Environment variables available to the browser
  env: {
    NEXT_PUBLIC_APP_NAME: 'GTM Foundry',
    NEXT_PUBLIC_APP_VERSION: '1.0.0',
  },
};

module.exports = nextConfig;
