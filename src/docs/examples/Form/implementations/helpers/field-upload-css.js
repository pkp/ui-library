export default {
	name: 'css',
	component: 'field-upload',
	label: 'CSS',
	description: 'Upload a custom CSS file to change the look and feel of your site.',
	options: {
		// url: 'https://httpbin.org/post',
		url: 'http://localhost/ojs/publicknowledge/api/v1/temporaryFiles?apiToken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.IlwiZTUwNjdhY2EyOGVlZGJiMmExNWUwY2ViZTNjODgzM2JiYWVlYmJmYlwiIg.zRHE3KVv74qg53BOZvxNaoA2eRpMYV9AAK04bpZW3L4',
		acceptedFiles: '.css',
	},
	baseImageUrl: 'http://localhost/ojs/public/journals/1/',
	value: 'style.css',
};
