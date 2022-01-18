<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import { reactive, ref } from "vue"
import useEthereum from "../composables/useEthereum"

const { wave } = useEthereum()

interface IForm {
	message: string
}

const form: IForm = reactive({
	message: "",
})

const loading = ref(false)

const emit = defineEmits(["submit"])

const onSubmit = async (e: Event): Promise<void> => {
  loading.value = true
  try {
    e.preventDefault()
    await wave(form.message)
    form.message = ""
    emit("submit")
  } catch (e) {
    console.log(e)
  }
  loading.value = false
}

const onCancel = (): void => {
	form.message = ""
}
</script>

<template>
	<div>
		<el-form
			v-loading="loading"
			ref="formRef"
			:model="form"
			label-width="120px"
			@submit.prevent
		>
			<el-form-item label="Message">
				<el-input
					:rows="2"
					type="textarea"
					v-model="form.message"
					clearable
					maxlength="500"
				></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="onSubmit">Wave at me</el-button>
				<el-button @click="onCancel">Cancel</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>
