import { ContextApi } from '@pancakeswap/localization'
import memoize from 'lodash/memoize'
import { ASSET_CDN } from './endpoints'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'Starswap',
  description: 'Trade, earn, and own crypto on the all-in-one multichain DEX',
  image: ``,
}

interface PathList {
  paths: { [path: string]: { title: string; basePath?: boolean; description?: string; image?: string } }
  defaultTitleSuffix: string
}

const getPathList = (t: ContextApi['t']): PathList => {
  return {
    paths: {
      // '/': { title: t('Home') },
      '/': { basePath: true, title: t('Exchange'), image:`` },
     
      '/liquidity': { title: t('Liquidity'), image: `${ASSET_CDN}/web/og/liquidity.jpg` },
      // '/find': { title: t('Import Pool') },
      // '/competition': { title: t('Trading Battle') },
      // '/prediction': { title: t('Prediction'), image: `${ASSET_CDN}/web/og/prediction.jpg` },
      // '/prediction/leaderboard': { title: t('Leaderboard'), image: `${ASSET_CDN}/web/og/liquidity.jpg` },
      // '/farms': { title: t('Farms'), image: `${ASSET_CDN}/web/og/farms.jpg` },
      // '/farms/auction': { title: t('Farm Auctions'), image: `${ASSET_CDN}/web/og/liquidity.jpg` },
      // '/pools': { title: t('Pools'), image: `${ASSET_CDN}/web/og/pools.jpg` },
      // '/lottery': { title: t('Lottery'), image: `${ASSET_CDN}/web/og/lottery.jpg` },
      // '/ifo': { title: t('Initial Farm Offering'), image: `${ASSET_CDN}/web/og/ifo.jpg` },
      // '/teams': { basePath: true, title: t('Leaderboard'), image: `${ASSET_CDN}/web/og/teams.jpg` },
      // '/voting': { basePath: true, title: t('Voting'), image: `${ASSET_CDN}/web/og/voting.jpg` },
      // '/voting/proposal': { title: t('Proposals'), image: `${ASSET_CDN}/web/og/voting.jpg` },
      // '/voting/proposal/create': { title: t('Make a Proposal'), image: `${ASSET_CDN}/web/og/voting.jpg` },
      // '/info': {
      //   title: `${t('Overview')} - ${t('Info')}`,
      //   description: 'View statistics for Pancakeswap exchanges.',
      //   image: ``,
      // },
      // '/info/pairs': {
      //   title: `${t('Pairs')} - ${t('Info')}`,
      //   description: 'View statistics for Pancakeswap exchanges.',
      //   image: ``,
      // },
      // '/info/tokens': {
      //   title: `${t('Tokens')} - ${t('Info')}`,
      //   description: 'View statistics for Pancakeswap exchanges.',
      //   image: ``,
      // },
      // '/nfts': { title: t('NFT Marketplace'), image: `${ASSET_CDN}/web/og/nft.jpg` },
      // '/nfts/collections': { basePath: true, title: t('Collections'), image: `${ASSET_CDN}/web/og/nft.jpg` },
      // '/nfts/activity': { title: t('Activity'), image: `${ASSET_CDN}/web/og/nft.jpg` },
      // '/profile': { basePath: true, title: t('Profile') },
      // '/pancake-squad': { basePath: true, title: t('Pancake Squad') },
      // '/pottery': { basePath: true, title: t('Pottery'), image: `${ASSET_CDN}/web/og/pottery.jpg` },
    },
    defaultTitleSuffix: t('StarSwap'),
  }
}

export const getCustomMeta = memoize(
  (path: string, t: ContextApi['t'], _: string): PageMeta | null => {
    const pathList = getPathList(t)
    const basePath = Object.entries(pathList.paths).find(([url, data]) => data.basePath && path.startsWith(url))?.[0]
    const pathMetadata = pathList.paths[path] ?? (basePath && pathList.paths[basePath])

    if (pathMetadata) {
      return {
        title: `${pathMetadata.title}`,
        ...(pathMetadata.description && { description: pathMetadata.description }),
        image: pathMetadata.image,
      }
    }
    return null
  },
  (path, t, locale) => `${path}#${locale}`,
)
