/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://localhost:5217/api/:path*'
            }
        ];
    },
    // Thêm cấu hình cho các route động
    async redirects() {
        return [];
    },
    // Cho phép tất cả các domain trong CORS
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'Access-Control-Allow-Origin',
                        value: '*'
                    }
                ]
            }
        ];
    }
};

module.exports = nextConfig; 