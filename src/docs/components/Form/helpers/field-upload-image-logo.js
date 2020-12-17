export default {
	name: 'logo',
	component: 'field-upload-image',
	label: 'Logo',
	options: {
		url: 'https://httpbin.org/post'
	},
	baseUrl: 'http://localhost:8000/public/journals/1/',
	altTextDescription:
		'Describe this image for visitors viewing the site in a text-only browser or with assistive devices. Example: "Our editor speaking at the PKP conference."',
	altTextLabel: 'Alt Text',
	uploadFileLabel: 'Add File',
	restoreLabel: 'Restore',
	thumbnailDescription: 'Preview of the currently selected image.'
};
