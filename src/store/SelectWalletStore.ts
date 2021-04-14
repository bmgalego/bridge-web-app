import { atom } from 'recoil'

export enum SelectWalletModalType {
  terraBaseModal,
  etherBaseModal,
  terraExtInstall,
  bscInstall,
}

const isVisibleModalType = atom<SelectWalletModalType | undefined>({
  key: 'isVisibleModalType',
  default: undefined,
})

export default { isVisibleModalType }
