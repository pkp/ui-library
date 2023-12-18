import SubmissionFilesListPanel from './SubmissionFilesListPanel.vue';

import FormSubmissionFileMock from '@/components/Form/mocks/form-submission-file';
import DropzoneOptionsMock from '@/mocks/dropzoneOptions';
import SubmissionFilesMock from '@/mocks/submissionFiles';

import GenresMock from '@/mocks/genres';

export default {
	title: 'ListPanel/SubmissionFilesListPanel',
	component: SubmissionFilesListPanel,
};

const yesterday = new Date();
yesterday.setDate(new Date().getDate() - 1);

export const Base = {
	render: (args) => ({
		components: {SubmissionFilesListPanel},
		setup() {
			function get(key) {
				return args[key] ? args[key] : {};
			}

			function set(key, data) {
				let component = {...get(key)};
				Object.keys(data).forEach(function (dataKey) {
					args[dataKey] = data[dataKey];
				});
				args[key] = component;
			}

			return {args, set};
		},
		template: `
				<SubmissionFilesListPanel
					v-bind="args"
					@set="set"
				/>
		`,
	}),

	args: {
		id: 'preview',
		addFileLabel: 'Add File',
		apiUrl: 'https://httbin.org/publicknowledge/api/v1/submissions/1/files',
		cancelUploadLabel: 'Cancel Upload',
		genrePromptLabel: 'What kind of file is this?',
		emptyLabel:
			'Upload any files the editorial team will need to evaluate your submission.',
		emptyAddLabel: 'Upload Files',
		fileStage: 2,
		otherLabel: 'Other',
		primaryLocale: 'en',
		removeConfirmLabel: 'Are you sure you want to remove this file?',
		stageId: 1,
		title: 'Files',
		uploadProgressLabel: 'Uploading {$percent}% complete',

		items: [
			...SubmissionFilesMock,
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
		options: {...DropzoneOptionsMock},
		form: {...FormSubmissionFileMock},
		genres: [...GenresMock],
	},
};
