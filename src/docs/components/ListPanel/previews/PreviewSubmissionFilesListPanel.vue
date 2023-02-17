<template>
	<submission-files-list-panel
		addFileLabel="Add File"
		apiUrl="http://localhost:8000/publicknowledge/api/v1/submissions/1/files"
		cancelUploadLabel="Cancel Upload"
		genrePromptLabel="What kind of file is this?"
		emptyLabel="Upload any files the editorial team will need to evaluate your submission."
		emptyAddLabel="Upload Files"
		:fileStage="2"
		:form="components.preview.form"
		:genres="components.preview.genres"
		id="preview"
		:items="components.preview.items"
		:options="components.preview.options"
		otherLabel="Other"
		primaryLocale="en"
		removeConfirmLabel="Are you sure you want to remove this file?"
		:stageId="1"
		title="Files"
		uploadProgressLabel="Uploading {$percent}% complete"
		@set="set"
	/>
</template>
<script>
import Page from '@/components/Container/Page.vue';
import SubmissionFilesListPanel from '@/components/ListPanel/submissionFiles/SubmissionFilesListPanel.vue';
import submissionFiles from '@/docs/data/submissionFiles';
import form from '@/docs/components/Form/helpers/form-submission-file';
import dropzoneOptions from '@/docs/data/dropzoneOptions';
import genres from '../../../data/genres';

export default {
	extends: Page,
	components: {
		SubmissionFilesListPanel,
	},
	data() {
		return {
			components: {
				preview: {
					items: [
						...submissionFiles,
						{
							id: 235,
							fileId: 1234,
							name: {
								en: 'file-with-no-genre-assignment-yet.docx',
								fr_CA: 'french-file-with-no-genre-assignment-yet.docx',
							},
							genre: null,
							documentType: 'word',
							url: 'https://example.com/publicknowledge/$$$call$$$/api/file/file-api/download-file?id=234&submissionId=22&stageId=2',
						},
						{
							id: '12345',
							name: 'File In Progress.docx',
							progress: 35,
							error: [],
						},
						{
							id: '123456',
							name: 'File that is too large.docx',
							progress: 100,
							error: [
								'File is too big (20mb). Files larger than 2mb can not be uploaded.',
							],
						},
					],
					options: {...dropzoneOptions},
					form: {...form},
					genres: [...genres],
				},
			},
		};
	},
};
</script>
