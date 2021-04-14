import { useRecoilValue, useSetRecoilState } from 'recoil'

import SelectWalletStore, {
  SelectWalletModalType,
} from 'store/SelectWalletStore'
import SendStore from 'store/SendStore'

import { BlockChainType } from 'types/network'

const useSelectWallet = (): {
  open: () => void
  closeModal: () => void
} => {
  const setIsVisibleModalType = useSetRecoilState(
    SelectWalletStore.isVisibleModalType
  )
  const fromBlockChain = useRecoilValue(SendStore.fromBlockChain)

  const open = async (): Promise<void> => {
    if (fromBlockChain === BlockChainType.terra) {
      setIsVisibleModalType(SelectWalletModalType.terraBaseModal)
    } else {
      setIsVisibleModalType(SelectWalletModalType.etherBaseModal)
    }
  }

  const closeModal = (): void => {
    setIsVisibleModalType(undefined)
  }

  return {
    open,
    closeModal,
  }
}

export default useSelectWallet
