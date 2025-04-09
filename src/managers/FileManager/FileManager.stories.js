import {http, HttpResponse} from 'msw';

import FileManager from './FileManager.vue';
import {getFileMock} from '@/mockFactories/fileMock';
import {getSubmissionMock} from '@/mockFactories/submissionMock';
export default {
	title: 'Managers/FileManager',
	component: FileManager,
};

export const Default = {
	render: (args) => ({
		components: {FileManager},
		setup() {
			return {args};
		},
		template: `
            <FileManager v-bind="args"/>`,
	}),
	parameters: {
		// mock date to consistently show sensible editorial activity popups
		msw: {
			handlers: [
				http.get(
					'https://mock/index.php/publicknowledge/api/v1/submissions/19/files',
					({request}) => {
						const Files = [
							getFileMock({
								id: 1,
								name: 'long-name-response-evaluation-all-team-members-draft-after-edits-final-version-final-lets-make-it-even-longer-keep-going-this-is-supposed-to-be-really-long-to-see-result-in-storybook.ods',
								createdAt: '2025-02-06 05:59:08',
								documentType: 'default',
							}),
							getFileMock({
								id: 2,
								documentType: 'audio',
								name: 'document.mp3',
								genreName: 'Data Set',
								genreIsSupplementary: true,
							}),
							getFileMock({
								id: 3,
								documentType: 'epub',
								name: 'document.epub',
								genreName: 'Other',
								genreIsSupplementary: true,
							}),
							getFileMock({
								id: 4,
								documentType: 'excel',
								name: 'document.xsl',
								genreName: 'Other',
								genreIsSupplementary: true,
							}),
							getFileMock({
								id: 5,
								documentType: 'html',
								name: 'document.html',
								genreName: 'Other',
								genreIsSupplementary: true,
							}),
							getFileMock({
								id: 6,
								documentType: 'image',
								name: 'document.png',
								genreName: 'Other',
								genreIsSupplementary: true,
							}),
							getFileMock({
								id: 7,
								documentType: 'pdf',
								name: 'document.pdf',
								genreName: 'Other',
								genreIsSupplementary: true,
							}),
							getFileMock({
								id: 8,
								documentType: 'word',
								name: 'document.doc',
								genreName: 'Other',
								genreIsSupplementary: true,
							}),
							getFileMock({
								id: 9,
								documentType: 'video',
								name: 'document.mp4',
								genreName: 'Other',
								genreIsSupplementary: true,
							}),
							getFileMock({
								id: 10,
								documentType: 'zip',
								name: 'archiv.zip',
								genreName: 'Other',
								genreIsSupplementary: true,
							}),
							getFileMock({
								id: 11,
								documentType: 'url',
								name: 'link.url',
								genreName: 'Other',
								genreIsSupplementary: true,
							}),
						];

						return HttpResponse.json({
							itemsMax: Files.length,
							items: Files,
						});
					},
				),
			],
		},
	},
	args: {
		namespace: 'SUBMISSION_FILES',
		submission: getSubmissionMock({
			stages: [
				{
					id: pkp.const.WORKFLOW_STAGE_ID_SUBMISSION,
					currentUserAssignedRoles: [16, 1],
				},
			],
		}),
		submissionStageId: pkp.const.WORKFLOW_STAGE_ID_SUBMISSION,
	},
};
