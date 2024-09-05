import { ChainId } from '@pancakeswap/chains'
import { FarmWithStakedValue } from '@pancakeswap/farms'
import { useTranslation } from '@pancakeswap/localization'
import { AutoRenewIcon, Button, useToast } from '@pancakeswap/uikit'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { getFullDisplayBalance } from '@pancakeswap/utils/formatBalance'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useCatchTxError from 'hooks/useCatchTxError'
import { useERC20 } from 'hooks/useContract'
import { usePublicNodeWaitForTransaction } from 'hooks/usePublicNodeWaitForTransaction'
import React, { useContext } from 'react'
import { useAppDispatch } from 'state'
import { fetchFarmUserDataAsync } from 'state/farms'
import { useFarmFromPid, useFarmUser } from 'state/farms/hooks'
import { pickFarmTransactionTx } from 'state/global/actions'
import { FarmTransactionStatus, CrossChainFarmStepType } from 'state/transactions/actions'
import { useCrossChainFarmPendingTransaction, useTransactionAdder } from 'state/transactions/hooks'
import { TransactionReceipt } from 'viem'
import { YieldBoosterStateContext } from 'views/Farms/components/YieldBooster/components/ProxyFarmContainer'
import useProxyStakedActions from 'views/Farms/components/YieldBooster/hooks/useProxyStakedActions'
import useUnstakeFarms from 'views/Farms/hooks/useUnstakeFarms'
import { useAccount } from 'wagmi'

export interface UnstakeButtonProps {
  pid?: number
  vaultPid?: number
  farm?: FarmWithStakedValue
}

const UnstakeButton: React.FC<React.PropsWithChildren<UnstakeButtonProps>> = ({ pid, vaultPid, farm }) => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { chainId } = useActiveChainId()
  const { toastSuccess } = useToast()
  const { lpAddress } = useFarmFromPid(pid) ?? {}
  const { loading: pendingTx, fetchTxResponse, fetchWithCatchTxError } = useCatchTxError()
  const { stakedBalance, proxy } = useFarmUser(pid)
  const { onUnstake } = useUnstakeFarms(pid, vaultPid)
  const dispatch = useAppDispatch()
  const { shouldUseProxyFarm, proxyAddress } = useContext(YieldBoosterStateContext)
  const isNeedUnstake = stakedBalance.gt(0) || proxy?.stakedBalance.gt(0)

  const [isLoading, setIsLoading] = React.useState(false)

  const lpContract = useERC20(lpAddress)
  const addTransaction = useTransactionAdder()

  const { onUnstake: onUnstakeProxyFarm, onDone } = useProxyStakedActions(pid, lpContract)

  const pendingFarm = useCrossChainFarmPendingTransaction(lpAddress)
  const { waitForTransaction } = usePublicNodeWaitForTransaction()

  // eslint-disable-next-line consistent-return
  const handleUnstake = async (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()

    
  }

  return (
    <>
      {pendingTx ? (
        <Button
          width="138px"
          marginLeft="auto"
          isLoading={pendingTx || isLoading}
          endIcon={<AutoRenewIcon spin color="currentColor" />}
        >
          {t('Confirming')}
        </Button>
      ) : (
        <Button
          width="138px"
          marginLeft="auto"
          disabled={!isNeedUnstake || pendingFarm.length > 0}
          onClick={handleUnstake}
        >
          {isNeedUnstake ? t('Unstake All') : t('Unstaked')}
        </Button>
      )}
    </>
  )
}

export default UnstakeButton
