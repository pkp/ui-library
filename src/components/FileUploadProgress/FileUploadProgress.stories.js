import FileUploadProgress from './FileUploadProgress.vue';
export default {
	title: 'Components/FileUploadProgress',
	component: FileUploadProgress,
	render: (args) => ({
		components: {FileUploadProgress},
		setup() {
			return {args};
		},
		template: `
			<FileUploadProgress
				v-bind="args"
			/>
		`,
	}),
};

export const InProgress = {
	args: {
		cancelUploadLabel: 'Cancel Upload',
		errors: [],
		name: 'influence-lactation-final-v2-edited-final.docx',
		progress: 85,
	},
};

export const WithError = {
	args: {
		cancelUploadLabel: 'Cancel Upload',
		errors: [
			'File is too big (20mb). Files larger than 2mb can not be uploaded.',
		],
		name: 'ccorino-disclosure-statement.docx',
		progress: 0,
	},
};
