import { ChainId } from '@pancakeswap/chains'
import { bscTokens } from '@pancakeswap/tokens'
import { useQuery } from '@tanstack/react-query'

import { publicClient } from 'utils/wagmi'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { VECAKE_VOTING_POWER_BLOCK, getVeVotingPower, getVotingPower } from '../helpers'

interface State {
  cakeBalance?: number
  cakeVaultBalance?: number
  cakePoolBalance?: number
  poolsBalance?: number
  cakeBnbLpBalance?: number
  ifoPoolBalance?: number
  total: number
  lockedCakeBalance?: number
  lockedEndTime?: number
  veCakeBalance?: number
}

const useGetVotingPower = (block?: number): State & { isLoading: boolean; isError: boolean } => {
  const { address: account } = useAccount()
  const { data, status, error } = useQuery({
    queryKey: [account, block, 'votingPower'],

    queryFn: async () => {
      if (!account) {
        throw new Error('No account')
      }
      const blockNumber = block ? BigInt(block) : await publicClient({ chainId: ChainId.BSC }).getBlockNumber()
      if (blockNumber >= VECAKE_VOTING_POWER_BLOCK) {
        return getVeVotingPower(account, blockNumber)
      }
      const eligiblePools = 0;
      const poolAddresses: Address[] = ['0xea377177257520480ee9afba6bff76f9daf563beece84d8178be68e54cbd3842']
      const {
        cakeBalance,
        cakeBnbLpBalance,
        cakePoolBalance,
        total,
        poolsBalance,
        cakeVaultBalance,
        ifoPoolBalance,
        lockedCakeBalance,
        lockedEndTime,
      } = await getVotingPower(account, poolAddresses, blockNumber)
      return {
        cakeBalance,
        cakeBnbLpBalance,
        cakePoolBalance,
        poolsBalance,
        cakeVaultBalance,
        ifoPoolBalance,
        total,
        lockedCakeBalance,
        lockedEndTime,
      }
    },

    enabled: Boolean(account),
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })
  if (error) console.error(error)

  return { total: 0, ...data, isLoading: status !== 'success', isError: status === 'error' }
}

export default useGetVotingPower
