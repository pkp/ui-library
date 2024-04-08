<template>
	<SideModalBody>
		<template #title>{{ options.title }}</template>
		<div class="p-4">
			<div class="bg-secondary p-4">
				<AjaxModalWrapper :key="options.url" :options="options" />
			</div>
		</div>
	</SideModalBody>
</template>

<script setup>
import {defineProps} from 'vue';
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import AjaxModalWrapper from '@/components/Modal/AjaxModalWrapper.vue';

const {options} = defineProps({options: {type: Object, default: null}});
console.log('side modal body ajax:', options);
</script>
