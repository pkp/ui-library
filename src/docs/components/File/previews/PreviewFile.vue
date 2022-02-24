<template>
	<div class="previewFile">
		<file
			documentType="word"
			:fileId="283"
			name="influence-lactation-final-v2-edited-final.docx"
		/>
		<file
			documentType="word"
			:fileId="284"
			name="ccorino-disclosure-statement.docx"
		/>
		<file
			documentType="excel"
			:fileId="285"
			name="influence-lactation-dataset-approved.xls"
		/>
		<file :fileId="286" name="example-default-document-type-icon.srv" />
		<file
			documentType="image"
			name="journal-public-knowledge-consent-form.png"
		/>
		<file documentType="epub" name="influence-lactation-proof-reader.epub" />
	</div>
</template>

<script>
import File from '../../../../components/File/File.vue';

export default {
	components: {
		File
	}
};
</script>

<style lang="less">
.previewFile .file + .file {
	margin-top: 0.25rem;
}
</style>
