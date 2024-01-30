import File from './File.vue';
export default {
	title: 'Components/File',
	component: File,
	render: (args) => ({
		components: {File},
		setup() {
			return {args};
		},
		template: `
			<File
				v-bind="args"
			/>
		`,
	}),
};

export const WithLink = {
	args: {
		documentType: 'word',
		fileId: '35',
		name: 'ccorino-disclosure-statement.docx',
		url: 'https://www.google.com',
	},
};

export const Word = {
	args: {
		documentType: 'word',
		fileId: '35',
		name: 'ccorino-disclosure-statement.docx',
	},
};

export const Excel = {
	args: {
		documentType: 'excel',
		fileId: '284',
		name: 'influence-lactation-dataset-approved.xls',
	},
};

export const Image = {
	args: {
		documentType: 'image',
		fileId: '287',
		name: 'journal-public-knowledge-consent-form.png',
	},
};

export const EPub = {
	args: {
		documentType: 'epub',
		fileId: '288',
		name: 'influence-lactation-proof-reader.epub',
	},
};
