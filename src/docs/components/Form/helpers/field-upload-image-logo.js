export default {
	name: 'logo',
	component: 'field-upload-image',
	label: 'Logo',
	options: {
		url: 'https://httpbin.org/post'
	},
	baseUrl: 'http://localhost:8000/public/journals/1/',
	altTextDescription: 'Preview of the currently selected image.',
	altTextLabel: 'Alt Text',
	uploadFileLabel: 'Add File',
	restoreLabel: 'Restore',
	thumbnailDescription: 'Preview of the currently selected image.'
};
