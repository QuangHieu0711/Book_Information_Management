import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  basePath: process.env.BASEPATH,
  redirects: async () => {
    return [
      {
        source: '/',          
        destination: '/address', 
        permanent: false,     
        locale: false
      },
      {
        source: '/home',
        destination: '/login', 
        permanent: false,
        locale: false
      }
    ]
  }
}

export default nextConfig
