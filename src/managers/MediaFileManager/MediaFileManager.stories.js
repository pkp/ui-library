import {http, HttpResponse} from 'msw';
import MediaFileManager from './MediaFileManager.vue';
import {MediaFilesDataMock} from '@/mockFactories/mediaFileMock';

export default {
	title: 'Managers/MediaFileManager',
	component: MediaFileManager,
};

const baseArgs = {
	mediaFiles: MediaFilesDataMock,
};

const renderComponent = (args) => ({
	components: {MediaFileManager},
	setup() {
		return {args};
	},
	template: `<MediaFileManager v-bind="args" />`,
});

const mswHandlers = [
	http.get('https://mock/index.php/publicknowledge/api/v1/mediaFiles', () => {
		return HttpResponse.json({items: baseArgs.mediaFiles});
	}),
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
