<template>
	<SideModalBody>
		<template #title>
			{{ title }}
		</template>
		<SideModalLayoutBasic>
			<FileAttacher
				:attachers="attachers"
				@attached:files="(...args) => emit('addAttachments', ...args)"
			/>
		</SideModalLayoutBasic>
	</SideModalBody>
</template>

<script setup>
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import SideModalLayoutBasic from '@/components/Modal/SideModalLayoutBasic.vue';
import FileAttacher from '@/components/FileAttacher/FileAttacher.vue';

defineProps({
	title: {type: String, required: true},
	attachers: {type: Object, required: true},
});

const emit = defineEmits(['addAttachments']);
</script>
