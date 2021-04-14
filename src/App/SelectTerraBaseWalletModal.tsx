import { Fragment, ReactElement, useEffect } from 'react'
import styled from 'styled-components'
import { useRecoilState } from 'recoil'

import { COLOR, STYLE } from 'consts'

import useAuth from 'hooks/useAuth'
import Button from 'components/Button'
import Text from 'components/Text'
import DefaultModal from 'components/Modal'

import terraWalletConnectService from 'services/terraWalletConnectService'
import terraService from 'services/terraService'

import SelectWalletStore, {
  SelectWalletModalType,
} from 'store/SelectWalletStore'

import { WalletEnum } from 'types/wallet'
import WalletLogo from 'components/WalletLogo'

const StyledContainer = styled.div`
  padding: 0 25px 40px;
`

const StyledWalletButton = styled(Button)`
  border-radius: ${STYLE.css.borderRadius};
  padding: 16px;
  margin: 8px 0px;
  border: 1px solid #1e2026;
  transition: all 0.3s ease 0s;
  background: ${COLOR.darkGray};
  color: ${COLOR.white};
  overflow: hidden;

  :hover {
    border-color: ${COLOR.terraSky};
    background: ${COLOR.darkGray};
  }
`

const StyledButtonContents = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const SelectEtherBaseWalletModal = (): ReactElement => {
  const { login, getLoginStorage, setLoginStorage } = useAuth()

  const [isVisibleModalType, setIsVisibleModalType] = useRecoilState(
    SelectWalletStore.isVisibleModalType
  )

  const onClickTerraExtension = async (): Promise<void> => {
    const terraExtInstalled = terraService.checkInstalled()
    if (terraExtInstalled) {
      const result = await terraService.connect()

      await login({
        user: {
          address: result.address,
          walletType: WalletEnum.TerraStation,
        },
      })
    } else {
      setIsVisibleModalType(SelectWalletModalType.terraExtInstall)
    }
  }

  const onClickTerraWalletConnect = async (): Promise<void> => {
    try {
      const connector = await terraWalletConnectService.connect()
      if (connector.connected) {
        login({
          user: {
            address: connector.accounts[0],
            walletConnect: connector,
            walletType: WalletEnum.TerraWalletConnect,
          },
        })
      } else {
        connector.on('connect', (error, payload) => {
          if (error) {
            throw error
          }
          const address = payload.params[0].accounts[0]
          login({
            user: {
              address,
              walletConnect: connector,
              walletType: WalletEnum.TerraWalletConnect,
            },
          })
        })
      }
    } catch (e) {
      // if user close connect modal then error
      console.log(e)
    }
  }

  const buttons = [
    {
      logo: <WalletLogo walleEnum={WalletEnum.TerraStation} />,
      label: 'Terra Extension',
      onClick: onClickTerraExtension,
    },
    {
      logo: <WalletLogo walleEnum={WalletEnum.TerraWalletConnect} />,
      label: 'Terra WalletConnect',
      onClick: onClickTerraWalletConnect,
    },
  ]

  useEffect(() => {
    const { lastWalletType } = getLoginStorage()
    if (
      isVisibleModalType === SelectWalletModalType.terraBaseModal &&
      lastWalletType
    ) {
      switch (lastWalletType) {
        case WalletEnum.TerraStation:
          onClickTerraExtension()
          break
        case WalletEnum.TerraWalletConnect:
          onClickTerraWalletConnect()
          break
      }
      setLoginStorage()
      setIsVisibleModalType(undefined)
    }
  }, [isVisibleModalType])

  return (
    <DefaultModal
      {...{
        isOpen: isVisibleModalType === SelectWalletModalType.terraBaseModal,
        close: (): void => {
          setIsVisibleModalType(undefined)
        },
      }}
      header={<Text style={{ justifyContent: 'center' }}>Connect Wallet</Text>}
    >
      <StyledContainer>
        {buttons.map(({ logo, label, onClick }) => (
          <Fragment key={label}>
            <StyledWalletButton
              onClick={(): void => {
                setIsVisibleModalType(undefined)
                onClick()
              }}
            >
              <StyledButtonContents>
                <span>{label}</span>
                {logo}
              </StyledButtonContents>
            </StyledWalletButton>
          </Fragment>
        ))}
      </StyledContainer>
    </DefaultModal>
  )
}

export default SelectEtherBaseWalletModal
