export default {
	name: 'css',
	component: 'field-upload',
	label: 'CSS',
	description:
		'Upload a custom CSS file to change the look and feel of your site.',
	options: {
		url: 'https://httpbin.org/post',
		acceptedFiles: '.css'
	},
	value: ''
};
