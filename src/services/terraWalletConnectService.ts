import WalletConnect from '@walletconnect/client'
import { TerraWalletconnectQrcodeModal } from 'components/WalletConnectQrCodeModal'

const connect = async (): Promise<WalletConnect> => {
  // bridge url
  const bridge = 'https://bridge.interus.net/'

  // create new connector
  const connector = new WalletConnect({
    bridge,
    qrcodeModal: new TerraWalletconnectQrcodeModal(),
  })
  // check if already connected
  if (!connector.connected) {
    // create new session
    await connector.createSession()
  }

  return connector
}

export default { connect }
