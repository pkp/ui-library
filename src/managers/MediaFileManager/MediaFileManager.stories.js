import {within, userEvent} from 'storybook/test';
import {http, HttpResponse, delay} from 'msw';
import MediaFileManager from './MediaFileManager.vue';
import {MediaFilesDataMock} from '@/mockFactories/mediaFileMock';
import {getSubmissionMock} from '@/mockFactories/submissionMock';
import {getPublicationMock} from '@/mockFactories/publicationMock';

export default {
	title: 'Managers/MediaFileManager',
	component: MediaFileManager,
};

const baseArgs = {
	mediaFiles: MediaFilesDataMock,
	submission: getSubmissionMock({
		stages: [
			{
				id: pkp.const.WORKFLOW_STAGE_ID_PRODUCTION,
				currentUserAssignedRoles: [16, 1],
			},
		],
	}),
	publication: getPublicationMock(),
};

const renderComponent = (args) => ({
	components: {MediaFileManager},
	setup() {
		return {args};
	},
	template: `<MediaFileManager v-bind="args" />`,
});

const mswHandlers = [
	http.get(
		'https://mock/index.php/publicknowledge/api/v1/submissions/:submissionId/mediaFiles',
		() => {
			return HttpResponse.json({
				itemsMax: baseArgs.mediaFiles.length,
				items: baseArgs.mediaFiles,
			});
		},
	),
	http.post(
		'https://mock/index.php/publicknowledge/api/v1/temporaryFiles',
		async ({request}) => {
			await delay(1500);

			const formData = await request.formData();
			const file = formData.get('file');
			const fileName = file?.name || formData.get('name') || 'uploaded-file';

			return HttpResponse.json({
				id: Math.floor(Math.random() * 1000) + 1,
				name: fileName,
				mimetype: file?.type || 'application/octet-stream',
				documentType: 'default',
			});
		},
	),
	http.post(
		'https://mock/index.php/publicknowledge/api/v1/submissions/:submissionId/mediaFiles',
		async ({request, params}) => {
			await delay(500);

			const body = await request.json();
			console.log('Media files upload request:', body);

			return HttpResponse.json(
				(body.files || []).map((file, index) => ({
					id: Math.floor(Math.random() * 1000) + index,
					fileId: Math.floor(Math.random() * 1000) + index,
					fileStage: 23,
					name: {en: file.name || 'uploaded-file'},
					submissionId: Number(params.submissionId),
					variantGroupId: null,
					variantType: 'web',
				})),
			);
		},
	),
	http.post(
		'https://mock/index.php/publicknowledge/api/v1/submissions/:submissionId/mediaFiles/link',
		async ({request}) => {
			await delay(500);

			const body = await request.json();
			console.log('Media files link request:', body);

			const linkedIds = (body.links || []).map(
				(link) => link.primarySubmissionFileId,
			);
			return HttpResponse.json(
				baseArgs.mediaFiles.filter((file) => linkedIds.includes(file.id)),
			);
		},
	),
	http.post(
		'https://mock/index.php/publicknowledge/api/v1/submissions/:submissionId/mediaFiles/:submissionFileId',
		async ({request, params}) => {
			await delay(500);

			const methodOverride = request.headers.get('X-Http-Method-Override');

			if (methodOverride === 'DELETE') {
				console.log(
					'Media file delete request for ID:',
					params.submissionFileId,
				);
				return HttpResponse.json({
					id: Number(params.submissionFileId),
					fileId: 100,
					fileStage: 23,
					name: {en: 'deleted-file'},
					submissionId: Number(params.submissionId),
					variantGroupId: null,
				});
			}

			const formData = await request.formData();
			const body = Object.fromEntries(formData.entries());
			console.log('Media files metadata update request:', body);

			return HttpResponse.json({
				id: Number(params.submissionFileId),
				fileId: 100,
				fileStage: 23,
				submissionId: Number(params.submissionId),
				...body,
				variantGroupId: null,
			});
		},
	),
	http.post(
		'https://mock/index.php/publicknowledge/api/v1/submissions/:submissionId/mediaFiles/:submissionFileId/link',
		async ({request, params}) => {
			await delay(500);

			const body = await request.json();
			console.log('Media file manual link request:', body);

			return HttpResponse.json([
				{
					id: Number(params.submissionFileId),
					fileId: 100,
					fileStage: 23,
					name: {en: 'image-web.png'},
					submissionId: Number(params.submissionId),
					variantGroupId: 10,
					variantType: 'web',
				},
				{
					id: Number(body.targetSubmissionFileId),
					fileId: 101,
					fileStage: 23,
					name: {en: 'image-high-res.tiff'},
					submissionId: Number(params.submissionId),
					variantGroupId: 10,
					variantType: 'high_resolution',
				},
			]);
		},
	),
];

export const Default = {
	render: renderComponent,
	args: baseArgs,
	parameters: {
		msw: {
			handlers: mswHandlers,
		},
	},
};

export const AddMediaFile = {
	render: renderComponent,
	args: baseArgs,
	parameters: {
		msw: {
			handlers: mswHandlers,
		},
	},
	play: async ({canvasElement}) => {
		const canvas = within(canvasElement);
		const user = userEvent.setup();

		await user.click(canvas.getByText('Add Media File'));
	},
};

export const BatchLinkImages = {
	render: renderComponent,
	args: baseArgs,
	parameters: {
		msw: {
			handlers: mswHandlers,
		},
	},
	play: async ({canvasElement}) => {
		const canvas = within(canvasElement);
		const user = userEvent.setup();

		await user.click(canvas.getByText('Batch Link Images'));
	},
};
