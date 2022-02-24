<template>
	<div class="previewFileAttacher">
		<file-attacher :attachers="attachers" />
	</div>
</template>

<script>
import FileAttacher from './ExampleFileAttacher.vue';
import fileAttachers from '@/docs/data/fileAttachers';

export default {
	components: {
		FileAttacher
	},
	data() {
		return {
			attachers: [...fileAttachers]
		};
	}
};
</script>
