import { useTranslation } from '@pancakeswap/localization'
import { Button, useModal, useToast } from '@pancakeswap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import useCatchTxError from 'hooks/useCatchTxError'
import { useERC20 } from 'hooks/useContract'
import { useAppDispatch } from 'state'

import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { fetchFarmUserDataAsync } from 'state/farms'
import { useFarmFromPid, useFarmUser } from 'state/farms/hooks'
import useUnstakeFarms from '../../../hooks/useUnstakeFarms'
import { BCakeMigrateModal } from '../../BCakeMigrateModal'

interface MigrateActionButtonPropsType {
  pid: number
}

const MigrateActionButton: React.FunctionComponent<MigrateActionButtonPropsType> = ({ pid }) => {
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError } = useCatchTxError()
  const { account, chainId } = useAccountActiveChain()
  const { onUnstake } = useUnstakeFarms(pid)
  const { stakedBalance } = useFarmUser(pid)
  const { lpAddress } = useFarmFromPid(pid) ?? {}
  const lpContract = useERC20(lpAddress)
  const dispatch = useAppDispatch()

  const handleUnstakeWithCallback = async (amount: string, callback: () => void) => {
    
    
  }

  const [onPresentMigrate] = useModal(
    <BCakeMigrateModal
      pid={pid}
      stakedBalance={stakedBalance}
      lpContract={lpContract}
      onUnStack={handleUnstakeWithCallback}
    />,
  )

  return <Button onClick={onPresentMigrate}>{t('Migrate')}</Button>
}

export default MigrateActionButton
