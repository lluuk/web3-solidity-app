<script setup lang="ts">
import { defineProps, PropType, toRefs } from "vue"
import { Wave } from "../types";

const props = defineProps({
  wave: {
    type: Object as PropType<Wave>,
    required: true
  },
});


</script>

<template>
	<el-card class="wave-info">
    <div>Address: {{ wave.waver }}</div>
    <div>Time: {{ wave.timestamp.toDateString() }}</div>
    <div>Message: {{ wave.message }}</div>
  </el-card>
</template>
