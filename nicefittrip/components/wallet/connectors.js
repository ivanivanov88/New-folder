//importing wallets from web3 : Metamask is {injectedConnector} and all others are as the name suggest
import { InjectedConnector } from "@web3-react/injected-connector"; 
import { NetworkConnector } from '@web3-react/network-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import { LedgerConnector } from '@web3-react/ledger-connector'
import { TrezorConnector } from '@web3-react/trezor-connector'
import { FrameConnector } from '@web3-react/frame-connector'
import { AuthereumConnector } from '@web3-react/authereum-connector'
import { FortmaticConnector } from '@web3-react/fortmatic-connector'
import { MagicConnector } from '@web3-react/magic-connector'
import { PortisConnector } from '@web3-react/portis-connector'
import { SquarelinkConnector } from '@web3-react/squarelink-connector'
import { TorusConnector } from '@web3-react/torus-connector'
import { OneWalletConnector } from '@harmony-react/onewallet-connector'
import { MathWalletConnector } from '@harmony-react/mathwallet-connector'


// const POLLING_INTERVAL = 12000
// const RPC_URLS: { [chainId: number]: string } = {
//   1: process.env.RPC_URL_1 as string,
//   4: process.env.RPC_URL_4 as string
// }

//exporting different wallets to be used in index.js etc. currently have examples for some properties
export const injected = new InjectedConnector({ supportedChainIds: [1, 3, 4, 5, 42] })

export const network = new NetworkConnector({
  urls: { 1: RPC_URLS[1], 4: RPC_URLS[4] },
  defaultChainId: 1
})

export const walletconnect = new WalletConnectConnector({
  rpc: { 1: RPC_URLS[1] },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: POLLING_INTERVAL
})
//exporting different wallets to be used in index.js etc. currently have examples for some properties
export const walletlink = new WalletLinkConnector({
  url: RPC_URLS[1],
  appName: 'NiceFitTrip'
})

export const ledger = new LedgerConnector({ chainId: 1, url: RPC_URLS[1], pollingInterval: POLLING_INTERVAL })

export const trezor = new TrezorConnector({
  chainId: 1,
  url: RPC_URLS[1],
  pollingInterval: POLLING_INTERVAL,
  manifestEmail: 'dummy@abc.xyz',
  manifestAppUrl: 'http://localhost:1234'
})
//exporting different wallets to be used in index.js etc. currently have examples for some properties
export const frame = new FrameConnector({ supportedChainIds: [1] })

export const authereum = new AuthereumConnector({ chainId: 42 })

export const fortmatic = new FortmaticConnector({ apiKey: process.env.FORTMATIC_API_KEY, chainId: 4 })
//exporting different wallets to be used in index.js etc. currently have examples for some properties
export const magic = new MagicConnector({
  apiKey: process.env.MAGIC_API_KEY,
  chainId: 4,
  email: 'hello@example.org'
})

export const portis = new PortisConnector({ dAppId: process.env.PORTIS_DAPP_ID , networks: [1, 100] })
//exporting different wallets to be used in index.js etc. currently have examples for some properties
export const squarelink = new SquarelinkConnector({
  clientId: process.env.SQUARELINK_CLIENT_ID,
  networks: [1, 100]
})

export const torus = new TorusConnector({ chainId: 1 })

export const onewallet = new OneWalletConnector({ chainId: 1 })

export const mathwallet = new MathWalletConnector({ chainId: 1 })