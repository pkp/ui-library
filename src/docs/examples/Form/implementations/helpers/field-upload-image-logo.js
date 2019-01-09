export default {
	name: 'logo',
	component: 'field-upload-image',
	label: 'Logo',
	description: 'Add a logo to display across all pages on your site.',
	options: {
		// url: 'https://httpbin.org/post',
		url: 'http://localhost/ojs/publicknowledge/api/v1/temporaryFiles?apiToken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.IlwiZTUwNjdhY2EyOGVlZGJiMmExNWUwY2ViZTNjODgzM2JiYWVlYmJmYlwiIg.zRHE3KVv74qg53BOZvxNaoA2eRpMYV9AAK04bpZW3L4',
	},
	isMultilingual: true,
	baseUrl: 'http://localhost/ojs/public/journals/1/',
	value: {
		en_US: {
			name: 'logo.png',
			uploadName: 'pageHeaderLogoImage_en_US.png',
			width: 200,
			height: 30,
			dateUploaded: '2018-08-27 10:26:02',
			altText: 'This is my alt text stuff.',
		},
		fr_CA: {
			name: 'logo.png',
			uploadName: 'pageHeaderLogoImage_en_US.png',
			width: 200,
			height: 30,
			dateUploaded: '2018-08-27 10:26:02',
			altText: 'This is my alt text stuff.',
		},
	},
};
