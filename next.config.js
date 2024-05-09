/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    BASE_API_URL: process.env.BASE_API_URL,
    FETCH_COUNT: Number(process.env.FETCH_COUNT ?? 20),
    LOCK_CREATE_EXAM: process.env.LOCK_CREATE_EXAM == 'true',
  },
  rewrites() {
    return [{
      source: '/',// ^(?!.*(?:vi|en)).*$
      destination: '/vi',
    },
      //  {
      //   source: '/media/:path*',
      //   destination: 'https://dev.kenchikunokaze.com/media/:path*',
      // }
    ];
  },
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.vietqr.io',
      },
      {
        protocol: 'https',
        hostname: 'dev.kenchikunokaze.com',
      },
      {
        protocol: 'https',
        hostname: 'http://195.35.45.33:9000',
      },
    ],
  },
  webpack(config) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg'),
    );

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ['@svgr/webpack'],
      },
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
  output: 'standalone',
};

module.exports = nextConfig;
