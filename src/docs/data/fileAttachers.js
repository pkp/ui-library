/**
 * Sample props for FileAttacher components
 */
import dropzoneOptions from '@/docs/data/dropzoneOptions';

export default [
	{
		component: 'FileAttacherUpload',
		label: 'Upload File',
		description: 'Upload a file from your computer.',
		button: 'Upload File',
		dropzoneOptions: {...dropzoneOptions},
		temporaryFilesApiUrl: 'http://example.org',
		addFilesLabel: 'Add Files',
		attachFilesLabel: 'Attach Files',
		backLabel: 'Back',
		dragAndDropMessage: 'Drag and drop files here.',
		dragAndDropOrUploadMessage: 'Or upload a file',
		removeItemLabel: 'Remove {$item}'
	},
	{
		component: 'FileAttacherReviewFiles',
		label: 'Review Files',
		description: 'Attach files that were uploaded by reviewers.',
		button: 'Attach Review File',
		attachSelectedLabel: 'Attach Selected',
		backLabel: 'Back',
		downloadLabel: 'Download',
		files: [
			{
				id: 142,
				name: {
					en_US: 'jpk-review-document.docx'
				},
				documentType: 'word',
				url: 'http://example.org',
				reviewerName: 'Adela Gallego'
			},
			{
				id: 191,
				name: {
					en_US: 'review-for-jpk.docx'
				},
				documentType: 'word',
				url: 'http://example.org',
				reviewerName: 'Aisla McCrae'
			}
		]
	},
	{
		component: 'FileAttacherFileStage',
		label: 'Submission Files',
		description:
			'Attach files uploaded during the submission workflow, such as revisions or files to be reviewed.',
		button: 'Attach Submission Files',
		submissionFilesApiUrl: 'http://example.org',
		attachSelectedLabel: 'Attach Selected',
		backLabel: 'Back',
		downloadLabel: 'Download',
		fileStages: [
			{
				label: 'Revisions',
				queryParams: {
					fileStage: 15, // SubmissionFile::SUBMISSION_FILE_REVIEW_REVISION
					reviewRoundId: 1
				}
			},
			{
				label: 'Files for Review',
				queryParams: {
					fileStage: 4, // SubmissionFile::SUBMISSION_FILE_REVIEW_FILE
					reviewRoundId: 1
				}
			}
		]
	},
	{
		component: 'FileAttacherLibrary',
		label: 'Library Files',
		description: 'Attach files from the Submission and Publisher Libraries.',
		button: 'Attach Library Files',
		libraryApiUrl: 'http://example.org',
		includeSubmissionId: 15,
		attachSelectedLabel: 'Attach Selected',
		backLabel: 'Back',
		downloadLabel: 'Download'
	}
];
