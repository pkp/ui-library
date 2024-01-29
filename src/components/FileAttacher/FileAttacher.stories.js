import {ref} from 'vue';
import {http, HttpResponse, delay} from 'msw';
import FileAttacher from './FileAttacher.vue';
import fileAttachers from '@/mocks/fileAttachers';
import submissionFiles from '@/mocks/submissionFiles';

export default {
	title: 'Components/FileAttacher',
	component: FileAttacher,
};

export const Default = {
	render: (args) => ({
		components: {FileAttacher},
		setup() {
			const attachers = ref([...fileAttachers]);
			return {args, attachers};
		},
		template: `
			<FileAttacher :attachers="attachers" />
		`,
	}),

	args: {},
	parameters: {
		msw: {
			handlers: [
				http.get(
					'https://mock/index.php/publicknowledge/api/v1/submissions/26/files',
					async () => {
						await delay(500);

						const files = [
							...submissionFiles,
							{
								...submissionFiles[0],
								id: 235,
								name: {
									en: submissionFiles[0].name.en.repeat(3),
								},
							},
						];

						return HttpResponse.json({itemsMax: files.length, items: files});
					},
				),
				http.get(
					'https://mock/index.php/publicknowledge/api/v1/_library',
					async () => {
						await delay(500);

						const file = {
							id: 1,
							filename: 'example-file.pdf',
							name: {
								en: 'Example File',
							},
							mimetype: 'application/pdf',
							documentType: 'pdf',
							submissionId: 1,
							type: 1,
							typeName: 'Marketing',
							url: 'https://example.org',
						};

						const files = [
							{...file},
							{
								...file,
								id: 2,
								filename: file.filename.repeat(6),
								name: {
									en: file.name.en.repeat(6),
								},
							},
						];

						return HttpResponse.json({itemsMax: files.length, items: files});
					},
				),
			],
		},
	},
};
