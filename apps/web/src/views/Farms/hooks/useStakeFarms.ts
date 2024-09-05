import { BOOSTED_FARM_V3_GAS_LIMIT } from 'config'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useMasterchef, useCrossFarmingVault, useV2SSBCakeWrapperContract } from 'hooks/useContract'
import { useCallback } from 'react'
import { useFeeDataWithGasPrice } from 'state/user/hooks'
// import { bCakeStakeFarm, crossChainStakeFarm, stakeFarm } from 'utils/calls'
import { useOraclePrice } from 'views/Farms/hooks/useFetchOraclePrice'
import { ChainId } from '@pancakeswap/chains'

const useStakeFarms = (pid: number, vaultPid?: number) => {
  const { account, chainId } = useAccountActiveChain()
  const { gasPrice } = useFeeDataWithGasPrice()
  const { gasPrice: bnbGasPrice } = useFeeDataWithGasPrice(ChainId.BSC)

  const oraclePrice = useOraclePrice(chainId ?? 0)
  const masterChefContract = useMasterchef()
  const crossFarmingVaultContract = useCrossFarmingVault()

  const handleStake = useCallback(
    async (amount: string) => {
      return 0
    },
    [masterChefContract, pid, gasPrice],
  )

  const handleStakeCrossChain = useCallback(
    async (amount: string) => {
      return 0
    },
    [crossFarmingVaultContract, vaultPid, bnbGasPrice, account, oraclePrice, chainId],
  )

  return { onStake: vaultPid ? handleStakeCrossChain : handleStake }
}

export const useBCakeStakeFarms = (bCakeWrapperAddress) => {
  const { gasPrice } = useFeeDataWithGasPrice()

  const V2SSBCakeContract = useV2SSBCakeWrapperContract(bCakeWrapperAddress)

  const handleStake = useCallback(
    async (amount: string) => {
      return 0
    },
    [V2SSBCakeContract, gasPrice],
  )

  return { onStake: handleStake }
}

export default useStakeFarms
