import {http, HttpResponse} from 'msw';
import BodyTextEditor from './BodyTextEditor.vue';

const submissionId = 19;
const publicationId = 20;

const documentContent = {
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'This is sample body text loaded from the API for Storybook.',
				},
			],
		},
	],
};

const bodyTextResponse = {
	id: 901,
	bodyTextContent: documentContent,
	dependentFiles: [],
};

export default {
	title: 'Components/BodyTextEditor',
	component: BodyTextEditor,
	parameters: {
		msw: {
			handlers: [
				http.get(
					'https://mock/index.php/publicknowledge/api/v1/submissions/19/publications/20/bodyText',
					() => HttpResponse.json(bodyTextResponse),
				),
				http.put(
					'https://mock/index.php/publicknowledge/api/v1/submissions/19/publications/20/bodyText',
					() => HttpResponse.json(bodyTextResponse),
				),
				http.post(
					'https://mock/index.php/publicknowledge/api/v1/submissions/19/files',
					() =>
						HttpResponse.json({
							id: 3001,
							url: 'https://mock/index.php/publicknowledge/files/3001',
						}),
				),
			],
		},
	},
	decorators: [
		() => ({
			template: '<div style="height: 900px; overflow: auto"><story /></div>',
		}),
	],
};

export const Default = {
	args: {
		submissionId,
		publicationId,
		citations: [],
	},
};
