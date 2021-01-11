<template>
	<submission-files-list-panel
		addFileLabel="Add File"
		apiUrl="http://localhost:8000/publicknowledge/api/v1/submissions/1/files"
		cancelUploadLabel="Cancel Upload"
		genrePromptLabel="What kind of file is this?"
		:documentTypes="components.preview.documentTypes"
		emptyLabel="Upload any files the editorial team will need to evaluate your submission."
		emptyAddLabel="Upload Files"
		:fileStage="2"
		:form="components.preview.form"
		:genres="components.preview.genres"
		id="preview"
		:items="components.preview.items"
		:options="components.preview.options"
		otherLabel="Other"
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

export default {
	extends: Page,
	components: {
		SubmissionFilesListPanel
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
								en_US: 'file-with-no-genre-assignment-yet.docx',
								fr_CA: 'french-file-with-no-genre-assignment-yet.docx'
							},
							genreId: null,
							documentType: 'word',
							url:
								'https://example.com/publicknowledge/$$$call$$$/api/file/file-api/download-file?id=234&submissionId=22&stageId=2'
						},
						{
							uuid: '12345',
							name: 'File In Progress.docx',
							progress: 35,
							error: ''
						},
						{
							uuid: '123456',
							name: 'File that is too large.docx',
							progress: 100,
							error:
								'File is too big (20mb). Files larger than 2mb can not be uploaded.'
						}
					],
					options: {
						maxFilesize: 2,
						url: 'https://httpbin.org/post',
						dropzoneDictDefaultMessage: 'Drop files here to upload',
						dropzoneDictFallbackMessage:
							"Your browser does not support drag'n'drop file uploads.",
						dropzoneDictFallbackText:
							'Please use the fallback form below to upload your files.',
						dropzoneDictFileTooBig:
							'File is too big ({{filesize}}mb). Files larger than {{maxFilesize}}mb can not be uploaded.',
						dropzoneDictInvalidFileType:
							'Files of this type can not be uploaded.',
						dropzoneDictResponseError:
							'Server responded with {{statusCode}} code. Please contact the system administrator if this problem persists.',
						dropzoneDictCancelUpload: 'Cancel upload',
						dropzoneDictUploadCanceled: 'Upload canceled',
						dropzoneDictCancelUploadConfirmation:
							'Are you sure you want to cancel this upload?',
						dropzoneDictRemoveFile: 'Remove file',
						dropzoneDictMaxFilesExceeded: 'You can not upload any more files.'
					},
					documentTypes: {
						DOCUMENT_TYPE_DEFAULT: 'default',
						DOCUMENT_TYPE_EXCEL: 'excel',
						DOCUMENT_TYPE_HTML: 'html',
						DOCUMENT_TYPE_IMAGE: 'image',
						DOCUMENT_TYPE_PDF: 'pdf',
						DOCUMENT_TYPE_WORD: 'word',
						DOCUMENT_TYPE_EPUB: 'epub',
						DOCUMENT_TYPE_ZIP: 'zip'
					},
					form: {...form},
					genres: [
						{
							id: 1,
							name: 'Book Manuscript',
							isPrimary: true
						},
						{
							id: 2,
							name: 'Chapter Manuscript',
							isPrimary: true
						},
						{
							id: 3,
							name: 'Preface'
						},
						{
							id: 4,
							name: 'Index'
						},
						{
							id: 5,
							name: 'Glossary'
						},
						{
							id: 7,
							name: 'Prospectus'
						},
						{
							id: 11,
							name: 'Table'
						},
						{
							id: 8,
							name: 'Figure'
						},
						{
							id: 9,
							name: 'Audio'
						},
						{
							id: 10,
							name: 'Other'
						}
					]
				}
			}
		};
	}
};
</script>
