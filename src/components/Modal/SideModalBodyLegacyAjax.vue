<template>
	<SideModalBody>
		<template #title>{{ legacyOptions.title }}</template>
		<div class="p-4">
			<div class="bg-secondary p-4">
				<AjaxModalWrapper
					:key="legacyOptions.url"
					:legacy-options="legacyOptions"
				/>
			</div>
		</div>
	</SideModalBody>
</template>

<script setup>
import {defineProps} from 'vue';
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import AjaxModalWrapper from '@/components/Modal/AjaxModalWrapper.vue';

const {legacyOptions} = defineProps({
	legacyOptions: {type: Object, default: null},
});
</script>
