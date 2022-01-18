<template>
	<div class="previewFileUploadProgress">
		<file-upload-progress
			cancelUploadLabel="Cancel Upload"
			:errors="[]"
			name="influence-lactation-final-v2-edited-final.docx"
			:progress="85"
		/>
		<file-upload-progress
			cancelUploadLabel="Cancel Upload"
			:errors="[]"
			name="ccorino-disclosure-statement.docx"
			:progress="65"
		/>
		<file-upload-progress
			cancelUploadLabel="Cancel Upload"
			:errors="[]"
			name="example-default-document-type-icon.srv"
			:progress="fastValue"
		/>
		<file-upload-progress
			cancelUploadLabel="Cancel Upload"
			:errors="[]"
			name="influence-lactation-proof-reader.epub"
			:progress="slowValue"
		/>
		<file-upload-progress
			cancelUploadLabel="Cancel Upload"
			:errors="[
				'File is too big (20mb). Files larger than 2mb can not be uploaded.'
			]"
			name="ccorino-disclosure-statement.docx"
			:progress="0"
		/>
		<pkp-button @click="start">Restart</pkp-button>
	</div>
</template>

<script>
import FileUploadProgress from '../../../../components/FileUploadProgress/FileUploadProgress.vue';
import PreviewProgressBar from '../../ProgressBar/previews/PreviewProgressBar.vue';

export default {
	extends: PreviewProgressBar,
	components: {
		FileUploadProgress
	}
};
</script>

<style lang="less">
.previewFileUploadProgress {
	.pkpButton {
		margin-top: 1rem;
	}
}
</style>
