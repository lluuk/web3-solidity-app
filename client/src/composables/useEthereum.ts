import { ethers } from "ethers"
import { Ref, ref } from "vue"
import abi from "../config/wavePortal.json"

import { Wave } from "../types"

declare global {
	interface Window {
		ethereum: any
	}
}

export default function useEthereum() {
  const contractAddress = "0x57717A475822daB32aB1aF33D8CeA7C47C163A8c"
  const contractABI = abi.abi

  const currentAccount = ref("")
  const allWaves: Ref<Wave[]> = ref([])


  const getAllWaves = async (): Promise<void> => {
    try {
      const { ethereum } = window
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        )
  
        const waves = await wavePortalContract.getAllWaves()
  
        let wavesCleaned: Wave[] = []
        waves.forEach(
          (wave: { waver: string; timestamp: number; message: string }) => {
            wavesCleaned.push({
              waver: wave.waver,
              timestamp: new Date(wave.timestamp * 1000),
              message: wave.message,
            })
          }
        )
        allWaves.value = wavesCleaned
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const setCurrentAccount = (account: string): void => {
    currentAccount.value = account
  }
  
  const checkIfWalletIsConnected = async (): Promise<void> => {
    try {
      const { ethereum } = window
  
      if (!ethereum) {
        console.log("Make sure you have metamask!")
      } else {
        console.log("We have the ethereum object", ethereum)
      }
  
      const accounts = await ethereum.request({ method: "eth_accounts" })
      if (accounts.length) {
        const account = accounts[0]
        console.log("Found an authorized account:", account)
        setCurrentAccount(account)
        await getAllWaves()
      } else {
        console.log("No authorized account found")
      }
    } catch (e) {
      console.log(e)
    }
  }
  
  const connectWallet = async () => {
    try {
      const { ethereum } = window
  
      if (!ethereum) {
        alert("Get MetaMask!")
        return
      }
  
      const accounts = await ethereum.request({ method: "eth_requestAccounts" })
  
      console.log("Connected", accounts[0])
      setCurrentAccount(accounts[0])
    } catch (error) {
      console.log(error)
    }
  }
  
  const wave = async (message: string): Promise<void> => {
    try {
      const { ethereum } = window
  
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        )
  
        let count = await wavePortalContract.getTotalWaves()
        console.log("Retrieved total wave count...", count.toNumber())
  
        const waveTxn = await wavePortalContract.wave(message, {
          gasLimit: 300000,
        })
        console.log("Mining...", waveTxn.hash)
  
        await waveTxn.wait()
        console.log("Mined -- ", waveTxn.hash)
  
        count = await wavePortalContract.getTotalWaves()
        console.log("Retrieved total wave count...", count.toNumber())
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error)
    }
  }


  return {
    getAllWaves,
    allWaves,
    currentAccount,
    wave,
    connectWallet,
    checkIfWalletIsConnected
  }
}