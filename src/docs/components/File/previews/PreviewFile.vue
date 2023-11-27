<template>
	<div class="previewFile">
		<file
			document-type="word"
			:file-id="283"
			name="influence-lactation-final-v2-edited-final.docx"
		/>
		<file
			document-type="word"
			:file-id="284"
			name="ccorino-disclosure-statement.docx"
		/>
		<file
			document-type="excel"
			:file-id="285"
			name="influence-lactation-dataset-approved.xls"
		/>
		<file :file-id="286" name="example-default-document-type-icon.srv" />
		<file
			document-type="image"
			name="journal-public-knowledge-consent-form.png"
		/>
		<file document-type="epub" name="influence-lactation-proof-reader.epub" />
	</div>
</template>

<script>
import File from '../../../../components/File/File.vue';

export default {
	components: {
		File,
	},
};
</script>

<style lang="less">
.previewFile .file + .file {
	margin-top: 0.25rem;
}
</style>
