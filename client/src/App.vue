<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import { onMounted } from "vue"
import useEthereum from "./composables/useEthereum"

const {
	checkIfWalletIsConnected,
	currentAccount,
	connectWallet,
	allWaves,
	getAllWaves,
} = useEthereum()

const handleSubmit = async (): Promise<void> => {
	await getAllWaves()
}

onMounted(checkIfWalletIsConnected)
</script>

<template>
	<div>
		<el-container>
			<el-main class="container">
				<img alt="Vue logo" src="./assets/logo.png" />
				<h1>👋 Hey there!</h1>
				<div>Connect your Ethereum wallet and wave at me!</div>
				<div v-if="!currentAccount">
					<el-button @click="connectWallet">Connect to MetaMask</el-button>
				</div>
				<div v-if="currentAccount">
					<h2>Welcome, {{ currentAccount }}</h2>
					<wave-form @submit="handleSubmit" />
				</div>
				<wave-info
					class="wave-info"
					v-for="(wave, i) in allWaves"
					:key="i"
					:wave="wave"
				/>
			</el-main>
		</el-container>
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
.container {
	max-width: 960px;
	margin: 0 auto;
}

.wave-info {
	max-width: 600px;
	margin: 10px auto;
}
</style>
