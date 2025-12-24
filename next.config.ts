import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  // Removed turbopack config for better Vercel compatibility
  // turbopack: {
  //   root: __dirname,
  // },
  reactStrictMode: true,
  
  // Power up Vercel deployment
  poweredByHeader: false,
  compress: true,
  
  images: {
    // Image optimization settings for better performance
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'workflo.it',
      },
      {
        protocol: 'https',
        hostname: '*.vercel.app',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
    unoptimized: false,
  },
  eslint: {
    ignoreDuringBuilds: true, // Allow build to succeed with lint warnings for Vercel
    dirs: ['app', 'components', 'lib', 'src'],
  },
  typescript: {
    ignoreBuildErrors: false, // Enable TypeScript checking during build
  },
  
  // Fix workspace root warning
  outputFileTracingRoot: __dirname,
  // Experimental features
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Basic security headers
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          // HSTS header for HTTPS enforcement
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          // Permissions Policy (formerly Feature Policy)
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), speaker=(), vibrate=()',
          },
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: process.env.NODE_ENV === 'production'
              ? "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms https://c.bing.com https://snap.licdn.com https://connect.facebook.net https://js.sentry-cdn.com https://browser.sentry-cdn.com https://js.hsforms.net https://js-eu1.hsforms.net https://js.hs-scripts.com https://js.hs-analytics.net https://js.hs-banner.com https://maps.googleapis.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https: http:; media-src 'self' data: blob:; connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net https://www.clarity.ms https://c.bing.com https://api.sentry.io https://sentry.io https://*.sentry.io https://o4505801395527680.ingest.sentry.io https://forms.hsforms.com https://forms-eu1.hsforms.com https://api.hsforms.com https://*.hs-scripts.com https://*.hs-analytics.net; frame-src 'self' https://www.youtube.com https://player.vimeo.com https://www.google.com https://maps.google.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/; object-src 'none'; base-uri 'self'; form-action 'self' https://forms.hsforms.com https://forms-eu1.hsforms.com; frame-ancestors 'none'; upgrade-insecure-requests;"
              : "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.hsforms.net https://js-eu1.hsforms.net https://js.hs-scripts.com https://js.hs-analytics.net https://js.hs-banner.com https://maps.googleapis.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https: https://fonts.gstatic.com; img-src 'self' data: blob: https: http:; media-src 'self' data: blob:; connect-src 'self' https: http: ws: wss: https://forms.hsforms.com https://forms-eu1.hsforms.com https://api.hsforms.com https://*.hs-scripts.com https://*.hs-analytics.net; frame-src 'self' https://www.google.com https://maps.google.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/; object-src 'none'; base-uri 'self'; form-action 'self' https://forms.hsforms.com https://forms-eu1.hsforms.com; upgrade-insecure-requests;",
          },
        ],
      },
      {
        // Additional security headers for API routes
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow',
          },
        ],
      },
    ];
  },
  // Bundle analyzer
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config: any) => {
      if (process.env.BUNDLE_ANALYZE) {
        const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false,
          })
        );
      }
      return config;
    },
  }),
};

// Sentry configuration
const sentryWebpackPluginOptions = {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: true,
  widenClientFileUpload: true,
  reactComponentAnnotation: {
    enabled: true,
  },
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: true,
};

// Enable Sentry in production
export default process.env.SENTRY_DSN && process.env.NODE_ENV === 'production'
  ? withSentryConfig(nextConfig, sentryWebpackPluginOptions)
  : nextConfig;
