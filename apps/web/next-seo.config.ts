import { DefaultSeoProps } from 'next-seo'

export const SEO: DefaultSeoProps = {
  titleTemplate: 'Starswap',
  defaultTitle: 'Starswap',
  description: 'Trade, earn, and own crypto on the all-in-one multichain DEX',
  twitter: {
    cardType: 'summary_large_image',
    handle: '@Starswap',
    site: '@Starswap',
  },
  openGraph: {
    title: "Starswap - Everyone's Favorite DEX",
    description: 'Trade, earn, and own crypto on the all-in-one multichain DEX',
    images: [{ url: '' }],
  },
}
