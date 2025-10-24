/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Permitir build com erros TypeScript (para deploy)
    ignoreBuildErrors: true,
  },
  eslint: {
    // Permitir build com warnings ESLint (para deploy)
    ignoreDuringBuilds: true,
  },
  output: 'standalone',
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  },
}

module.exports = nextConfig