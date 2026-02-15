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
			return HttpResponse.json({items: baseArgs.mediaFiles});
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
		async ({request}) => {
			await delay(500);

			const body = await request.json();
			console.log('Media files upload request:', body);

			return HttpResponse.json({
				success: true,
				message: 'Files uploaded successfully',
				files: body.files,
			});
		},
	),
	http.post(
		'https://mock/index.php/publicknowledge/api/v1/mediaFiles/link',
		async ({request}) => {
			await delay(500);

			const body = await request.json();
			console.log('Media files link request:', body);

			return HttpResponse.json({
				success: true,
				message: 'Images linked successfully',
				links: body.links,
			});
		},
	),
	http.post(
		'https://mock/index.php/publicknowledge/api/v1/mediaFiles/:id/metadata',
		async ({request, params}) => {
			await delay(500);

			const formData = await request.formData();
			const body = Object.fromEntries(formData.entries());
			console.log('Media files metadata update request:', body);

			return HttpResponse.json({
				success: true,
				message: 'Metadata updated successfully',
				mediaFile: {
					id: params.id,
					...body,
				},
			});
		},
	),
	http.post(
		'https://mock/index.php/publicknowledge/api/v1/mediaFiles/:id/link',
		async ({request}) => {
			await delay(500);

			const body = await request.json();
			console.log('Media file link request:', body);

			return HttpResponse.json({
				success: true,
				message: 'Images linked successfully',
				link: body,
			});
		},
	),
	http.post(
		'https://mock/index.php/publicknowledge/api/v1/mediaFiles/:id',
		async ({params}) => {
			await delay(500);

			console.log('Media file delete request for ID:', params.id);
			return new HttpResponse(null, {status: 204});
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
