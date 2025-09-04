/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // 동적 라우팅 페이지의 정적 생성을 비활성화
  trailingSlash: false,
  generateBuildId: async () => {
    return 'build-' + Date.now()
  }
}

module.exports = nextConfig
