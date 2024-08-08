/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-var-requires */
import BundleAnalyzer from '@next/bundle-analyzer'
import { withWebSecurityHeaders } from '@pancakeswap/next-config/withWebSecurityHeaders'
import { withSentryConfig } from '@sentry/nextjs'
import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin'
import vercelToolbarPlugin from '@vercel/toolbar/plugins/next'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const withVercelToolbar = vercelToolbarPlugin()

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const withBundleAnalyzer = BundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const withVanillaExtract = createVanillaExtractPlugin()

const sentryWebpackPluginOptions =
  process.env.VERCEL_ENV === 'production'
    ? {
        silent: false,
        validate: true,
        hideSourceMaps: false,
      }
    : {
        hideSourceMaps: false,
        silent: true,
        dryRun: !process.env.SENTRY_AUTH_TOKEN,
      }

// Manually read the smart-router package.json file
const smartRouterPkgsPath = path.resolve(__dirname, 'node_modules/@pancakeswap/smart-router/package.json')
const smartRouterPkgs = JSON.parse(fs.readFileSync(smartRouterPkgsPath, 'utf-8'))

const workerDeps = Object.keys(smartRouterPkgs.dependencies)
  .map((d) => d.replace('@pancakeswap/', 'packages/'))
  .concat(['/packages/smart-router/', '/packages/swap-sdk/', '/packages/token-lists/'])

/** @type {import('next').NextConfig} */
const config = {
  typescript: {
    tsconfigPath: 'tsconfig.json',
  },
  compiler: {
    styledComponents: true,
  },
  experimental: {
    scrollRestoration: true,
    fallbackNodePolyfills: false,
    outputFileTracingRoot: path.join(__dirname, '../../'),
    outputFileTracingExcludes: {
      '*': [],
    },
    optimizePackageImports: ['@pancakeswap/widgets-internal', '@pancakeswap/uikit'],
  },
  transpilePackages: [
    '@pancakeswap/farms',
    '@pancakeswap/position-managers',
    '@pancakeswap/localization',
    '@pancakeswap/hooks',
    '@pancakeswap/utils',
    '@pancakeswap/widgets-internal',
    '@pancakeswap/ifos',
    '@pancakeswap/uikit',
    '@tanstack/query-core',
  ],
  reactStrictMode: true,
  swcMinify: false,
  images: {
    contentDispositionType: 'attachment',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static-nft.pancakeswap.com',
        pathname: '/mainnet/**',
      },
      {
        protocol: 'https',
        hostname: 'assets.pancakeswap.finance',
        pathname: '/web/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/info/token/:address',
        destination: '/info/tokens/:address',
      },
      {
        source: '/info/pool/:address',
        destination: '/info/pools/:address',
      },
      {
        source: '/.well-known/vercel/flags',
        destination: '/api/vercel/flags',
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/favicon.ico',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, immutable, max-age=31536000',
          },
        ],
      },
      {
        source: '/logo.png',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, immutable, max-age=31536000',
          },
        ],
      },
      {
        source: '/images/:all*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, immutable, max-age=31536000',
          },
        ],
      },
      {
        source: '/images/tokens/:all*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, immutable, max-age=604800',
          },
        ],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/send',
        destination: '/swap',
        permanent: true,
      },
      {
        source: '/create/:currency*',
        destination: '/add/:currency*',
        permanent: true,
      },
      {
        source: '/farms/archived',
        destination: '/farms/history',
        permanent: true,
      },
      {
        source: '/pool',
        destination: '/liquidity',
        permanent: true,
      },
      {
        source: '/staking',
        destination: '/pools',
        permanent: true,
      },
      {
        source: '/syrup',
        destination: '/pools',
        permanent: true,
      },
      {
        source: '/collectibles',
        destination: '/nfts',
        permanent: true,
      },
      {
        source: '/info/pools',
        destination: '/info/pairs',
        permanent: true,
      },
      {
        source: '/info/pools/:address',
        destination: '/info/pairs/:address',
        permanent: true,
      },
      {
        source: '/api/v3/:chainId/farms/liquidity/:address',
        destination: 'https://farms-api.pancakeswap.com/v3/:chainId/liquidity/:address',
        permanent: false,
      },
      {
        source: '/images/tokens/:address',
        destination: 'https://tokens.pancakeswap.finance/images/:address',
        permanent: false,
      },
    ]
  },
  webpack: (webpackConfig, { webpack, isServer }) => {
    // tree shake sentry tracing
    webpackConfig.plugins.push(
      new webpack.DefinePlugin({
        __SENTRY_DEBUG__: false,
        __SENTRY_TRACING__: false,
      }),
    )
    if (!isServer && webpackConfig.optimization.splitChunks) {
      // webpack doesn't understand worker deps on quote worker, so we need to manually add them
      webpackConfig.optimization.splitChunks.cacheGroups.workerChunks = {
        chunks: 'all',
        test(module) {
          const resource = module.nameForCondition?.() ?? ''
          return resource ? workerDeps.some((d) => resource.includes(d)) : false
        },
        priority: 31,
        name: 'worker-chunks',
        reuseExistingChunk: true,
      }
    }
    return webpackConfig
  },
}

export default withVercelToolbar(
  withBundleAnalyzer(withVanillaExtract(withSentryConfig(withWebSecurityHeaders(config)), sentryWebpackPluginOptions)),
)
