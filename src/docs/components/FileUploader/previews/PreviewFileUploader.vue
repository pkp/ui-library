<template>
	<div class="previewFileUploader">
		<span v-if="!files.length" class="previewFileUploader__prompt">
			<p>
				Drag and drop files here or
				<button class="-linkButton" @click="selectFile">upload a file</button>
			</p>
		</span>
		<template v-else>
			<file-upload-progress
				v-for="(file, i) in files"
				:key="i"
				cancelUploadLabel="Cancel Upload"
				:errors="file.errors"
				:name="file.name"
				:progress="file.progress"
				@cancel="remove(i)"
			/>
		</template>
		<file-uploader
			ref="uploader"
			apiUrl="http://localhost:8000/publicknowledge/api/v1/submissions/1/files"
			:files="files"
			id="previewFileUploader"
			:options="options"
			uploadProgressLabel="Uploading {$percent}% complete"
			@updated:files="updateFiles"
		/>
	</div>
</template>

<script>
import FileUploadProgress from '@/components/FileUploadProgress/FileUploadProgress.vue';
import FileUploader from '@/components/FileUploader/FileUploader.vue';
import dropzoneOptions from '@/docs/data/dropzoneOptions';

export default {
	components: {
		FileUploader,
		FileUploadProgress
	},
	data() {
		return {
			files: [],
			options: {...dropzoneOptions}
		};
	},
	methods: {
		remove(index) {
			this.files = this.files.filter((file, i) => i !== index);
		},
		selectFile() {
			this.$refs.uploader.openFileBrowser();
		},
		updateFiles(files) {
			this.files = [...files];
		}
	}
};
</script>

<style lang="less">
@import '../../../../styles/_import';

.previewFileUploader {
	position: relative;
	min-height: 20em;
	font-size: @font-sml;

	.previewFileUploader__prompt {
		position: absolute;
		top: 50%;
		left: 50%;
		max-width: 50%;
		transform: translate(-50%, -50%);
	}
}
</style>
