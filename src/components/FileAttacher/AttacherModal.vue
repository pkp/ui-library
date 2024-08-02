<template>
	<SideModalBody>
		<template #title>
			{{ title }}
		</template>
		<SideModalLayoutBasic>
			<component
				:is="Components[currentAttacher.component] || currentAttacher.component"
				v-if="currentAttacher"
				v-bind="currentAttacher"
				@selected:files="(...args) => emit('attachFiles', ...args)"
				@cancel="(...args) => emit('cancel', ...args)"
			/>
		</SideModalLayoutBasic>
	</SideModalBody>
</template>

<script setup>
import FileAttacherFileStage from './FileAttacherFileStage.vue';
import FileAttacherLibrary from './FileAttacherLibrary.vue';
import FileAttacherReviewFiles from './FileAttacherReviewFiles.vue';
import FileAttacherUpload from './FileAttacherUpload.vue';

const Components = {
	FileAttacherFileStage,
	FileAttacherLibrary,
	FileAttacherReviewFiles,
	FileAttacherUpload,
};

import SideModalBody from '@/components/Modal/SideModalBody.vue';
import SideModalLayoutBasic from '@/components/Modal/SideModalLayoutBasic.vue';

defineProps({
	title: {type: String, required: true},
	currentAttacher: {type: Object, required: true},
});

const emit = defineEmits(['attachFiles', 'cancel']);
</script>
