<template>
	<SideModalBody :secondary="true">
		<template #header><h1 class="text-4xl-bold">Assign editors</h1></template>
		<div class="p-4">
			<div class="bg-lightest p-4">
				<AjaxModalWrapper :options="options" />
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
