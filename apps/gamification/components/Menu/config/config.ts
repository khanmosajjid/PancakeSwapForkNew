import { ContextApi } from '@pancakeswap/localization'
import {
  AllBlogIcon,
  // CalenderIcon,
  DropdownMenuItems,
  MenuItemsType,
  TrophyFillIcon,
  TrophyIcon,
} from '@pancakeswap/uikit'

export type ConfigMenuDropDownItemsType = DropdownMenuItems & { hideSubNav?: boolean }
export type ConfigMenuItemsType = Omit<MenuItemsType, 'items'> & { hideSubNav?: boolean; image?: string } & {
  items?: ConfigMenuDropDownItemsType[]
}

const addMenuItemSupported = (item: any, chainId: any) => {
  if (!chainId || !item.supportChainIds) {
    return item
  }
  if (item.supportChainIds?.includes(chainId)) {
    return item
  }
  return {
    ...item,
    disabled: true,
  }
}

const config: (t: ContextApi['t'], chainId?: number) => ConfigMenuItemsType[] = (t, chainId) =>
  [
    {
      label: t('Dashboard'),
      href: '/dashboard',
      items: [],
      icon: AllBlogIcon,
      showOnMobile: false,
    },
    {
      label: t('Quests'),
      href: '/quests',
      items: [],
      showItemsOnMobile: false,
      icon: TrophyIcon,
      fillIcon: TrophyFillIcon,
    },
    // {
    //   label: t('Campaigns'),
    //   href: '/campaigns',
    //   items: [],
    //   icon: CalenderIcon,
    // },
  ].map((item) => addMenuItemSupported(item, chainId))

export default config
