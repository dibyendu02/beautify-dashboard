import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Production optimizations
  poweredByHeader: false, // Remove X-Powered-By header

  // TypeScript and ESLint configuration
  typescript: {
    // In development, allow build despite errors for faster development
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },
  eslint: {
    // In development, ignore during builds for faster development
    ignoreDuringBuilds: process.env.NODE_ENV === 'development',
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000',
    NEXT_PUBLIC_CDN_URL: process.env.NEXT_PUBLIC_CDN_URL || '',
  },

  // Image optimization
  images: {
    domains: [
      'localhost',
      'beautify-api.com',
      'res.cloudinary.com',
      'images.unsplash.com',
      'picsum.photos'
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 1 week
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    
    // Image optimization for performance
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Compression
  compress: true,

  // HTTP headers for security and performance
  async headers() {
    const headers = [
      {
        source: '/(.*)',
        headers: [
          // Security headers
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      },
      {
        // Cache static assets aggressively
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        // Cache API routes appropriately
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=300'
          }
        ]
      }
    ];

    // Add CSP header for production
    if (process.env.NODE_ENV === 'production') {
      headers[0].headers.push({
        key: 'Content-Security-Policy',
        value: `
          default-src 'self';
          script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com;
          style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
          font-src 'self' https://fonts.gstatic.com;
          img-src 'self' data: https: http:;
          connect-src 'self' https://api.stripe.com wss: ws:;
          frame-src https://js.stripe.com;
        `.replace(/\s+/g, ' ').trim()
      });
    }

    return headers;
  },

  // Redirects for better SEO and user experience
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/dashboard/overview',
        permanent: false
      }
    ];
  },

  // Webpack optimizations
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Production optimizations
    if (!dev) {
      // Optimize bundle size
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: 10,
              reuseExistingChunk: true,
            },
            common: {
              name: 'common',
              minChunks: 2,
              priority: 5,
              reuseExistingChunk: true,
            },
          },
        },
      };

      // Add bundle analyzer in production if enabled
      if (process.env.ANALYZE === 'true') {
        const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false,
          })
        );
      }
    }

    // Ignore certain modules to reduce bundle size
    config.resolve.alias = {
      ...config.resolve.alias,
      // Reduce lodash bundle size
      'lodash': 'lodash-es',
    };

    return config;
  },

  // Output configuration for static export if needed
  output: process.env.BUILD_STANDALONE === 'true' ? 'standalone' : undefined,


  // Compiler options
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
    
    // Enable styled-components SSR
    styledComponents: true,
  },


  // Configure build output
  generateBuildId: async () => {
    // Use git commit hash for build ID in production
    if (process.env.NODE_ENV === 'production' && process.env.VERCEL_GIT_COMMIT_SHA) {
      return process.env.VERCEL_GIT_COMMIT_SHA;
    }
    return null; // Use default
  },

  // Custom server configuration
  serverRuntimeConfig: {
    // Server-only configuration
    mySecret: process.env.SECRET_KEY,
  },

  publicRuntimeConfig: {
    // Available on both server and client
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
  },

  // Rewrites for API proxy (development)
  async rewrites() {
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/:path*',
          destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
        },
      ];
    }
    return [];
  },

  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Configure trailing slash behavior
  trailingSlash: false,

  // Configure page extensions
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],

};

export default nextConfig;