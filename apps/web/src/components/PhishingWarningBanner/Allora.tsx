import { useTranslation } from '@pancakeswap/localization'
import { ArrowForwardIcon, Box, Column, Flex, FlexGap, Link, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { VerticalDivider } from '@pancakeswap/widgets-internal'
import { ASSET_CDN } from 'config/constants/endpoints'
import NextLink from 'next/link'
import { ICampaignBanner } from './ICampaignBanner'

const ALLORA_PATH = `${ASSET_CDN}/web/banners/allora`

const learnMoreLink = 'https://www.allora.network/blog/announcing-the-allora-x-pancakeswap-points-program'
const joinNowLink =
  'https://pancakeswap.finance/prediction?token=ETH&chain=arb&utm_source=homepagebanner&utm_medium=website&utm_campaign=Arbitrum&utm_id=AlloraPointsPrediction'

export const Allora: ICampaignBanner = () => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  const content = (
   <></>
  )

  const mobileContent = (
   <></>
  )

  if (isMobile) {
    return (
     <></>
    )
  }

  return (
   <></>
  )
}

Allora.stripeImage = `${ALLORA_PATH}/top-bg.png`
Allora.stripeImageWidth = '120px'
Allora.stripeImageAlt = 'allora campaign'
Allora.background = 'radial-gradient(63.28% 84.72% at 26.41% 23.33%, #CBD7EF 0%, #A3A9D5 72.82%, #9A9FD0 100%)'
