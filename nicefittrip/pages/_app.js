import '../styles/globals.css'
import {Web3ReactProveder} from '@web3-react/core'
import Web3 from 'web3'

function getLibrary(provider){
  return new Web3(provider)
}

function MyApp({ Component, pageProps }) {
  return (
  <Web3ReactProveder getLibrary = {getLibrary}>
  <Component {...pageProps} />
  </Web3ReactProveder>
  
  )
  }

export default MyApp