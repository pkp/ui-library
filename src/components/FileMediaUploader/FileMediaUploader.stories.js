import FileMediaUploader from './FileMediaUploader.vue';
import {http, HttpResponse, delay} from 'msw';
import dropzoneOptions from '@/mocks/dropzoneOptions';

export default {
	title: 'Components/FileMediaUploader',
	component: FileMediaUploader,
};

const mediaTypeOptions = [
	{value: 'image', label: 'Image'},
	{value: 'audio', label: 'Audio'},
	{value: 'video', label: 'Video'},
	{value: 'document', label: 'Document'},
	{value: 'supplementary', label: 'Supplementary'},
];

export const Default = {
	render: (args) => ({
		components: {FileMediaUploader},
		setup() {
			function onUploaded(files) {
				console.log('Uploaded files:', JSON.stringify(files, null, 2));
				alert(
					`Uploaded ${files.length} file(s):\n${files.map((f) => `- ${f.name} (${f.mediaType})`).join('\n')}`,
				);
			}

			return {args, onUploaded};
		},
		template: `
			<FileMediaUploader
				v-bind="args"
				@uploaded="onUploaded"
			/>
		`,
	}),
	args: {
		id: 'fileMediaUploader',
		apiUrl: 'https://mock/index.php/publicknowledge/api/v1/temporaryFiles',
		mediaTypeOptions,
		supportedFileTypesLabel:
			'PNG, JPG, JPEG, GIF, BMP, WEBP (web); TIFF, SVG, EPS, AI, PDF (hi-res); MP4, MOV, AVI, WMV, MPEG, WEBM (video)',
		options: dropzoneOptions,
	},
	parameters: {
		msw: {
			handlers: [
				http.post(
					'https://mock/index.php/publicknowledge/api/v1/temporaryFiles',
					async ({request}) => {
						// Simulate upload delay
						await delay(1500);

						const formData = await request.formData();
						const file = formData.get('file');
						const fileName =
							file?.name || formData.get('name') || 'uploaded-file';

						return HttpResponse.json({
							id: Math.floor(Math.random() * 1000) + 1,
							name: fileName,
							mimetype: file?.type || 'application/octet-stream',
							documentType: 'default',
						});
					},
				),
			],
		},
	},
};
