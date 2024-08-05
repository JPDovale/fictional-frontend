/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'pub-e7010998082d4cf29f84e4d3aa1f737f.r2.dev',
      },
      {
        hostname: 'pub-bc859334a56d4d2cb71576b27afa453e.r2.dev',
      },
      {
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
}

export default nextConfig
