<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import { onMounted, Ref, ref } from "vue"
import { ethers } from "ethers"
import abi from "./config/wavePortal.json"
import { Wave } from "./types"

declare global {
	interface Window {
		ethereum: any
	}
}

const contractAddress = "0xD3A8276E950337C1579b320dAA7b0451d2CACC16"
const contractABI = abi.abi
const currentAccount = ref("")
const message = ref("")
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

const wave = async (e: Event) => {
	e.preventDefault()
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

			const waveTxn = await wavePortalContract.wave(message.value, { gasLimit: 300000 })
			console.log("Mining...", waveTxn.hash)

			await waveTxn.wait()
			console.log("Mined -- ", waveTxn.hash)

			count = await wavePortalContract.getTotalWaves()
			console.log("Retrieved total wave count...", count.toNumber())
			message.value = ""
			await getAllWaves()
		} else {
			console.log("Ethereum object doesn't exist!")
		}
	} catch (error) {
		console.log(error)
	}
}

onMounted(checkIfWalletIsConnected)
</script>

<template>
	<div>
		<img alt="Vue logo" src="./assets/logo.png" />
		<h1>👋 Hey there!</h1>
		<div>Connect your Ethereum wallet and wave at me!</div>
		<div v-if="!currentAccount">
			<button @click="connectWallet">Connect to MetaMask</button>
		</div>
		<div v-if="currentAccount">
			<h2>Welcome, {{ currentAccount }}</h2>
			<form>
				<input type="text" v-model="message" />
				<input
					type="submit"
					@click="wave"
					value="Wave at me"
					:disabled="!message"
				/>
			</form>
		</div>
		<div v-for="(wave, i) in allWaves" :key="i">
			<div>Address: {{ wave.waver }}</div>
			<div>Time: {{ wave.timestamp.toDateString() }}</div>
			<div>Message: {{ wave.message }}</div>
		</div>
	</div>
</template>

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px;
}
</style>
