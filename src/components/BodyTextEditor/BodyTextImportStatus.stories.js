import BodyTextImportStatus from './BodyTextImportStatus.vue';

export default {
	title: 'Components/BodyTextEditor/ImportStatus',
	component: BodyTextImportStatus,
	render: (args) => ({
		components: {BodyTextImportStatus},
		setup() {
			return {args};
		},
		template:
			'<div style="max-width: 800px"><BodyTextImportStatus v-bind="args" /></div>',
	}),
};

export const Downloading = {
	args: {stage: 'download'},
};

export const LoadingConverter = {
	args: {stage: 'load'},
};

export const Converting = {
	args: {stage: 'convert'},
};

export const UploadingImages = {
	args: {stage: 'upload'},
};

export const Failed = {
	args: {
		error: 'Download failed: HTTP 404',
	},
};

export const FailedConversion = {
	args: {
		error:
			'pandoc: paper.docx: openBinaryFile: does not exist (No such file or directory)',
	},
};

export const WithWarnings = {
	args: {
		warnings: [
			'Block 12 (Table): nested tables are not supported and the inner table was flattened.',
			'Block 27 (Para): a paragraph holding several images was split into separate figures; check their order.',
			'The image media/media/image3.emf could not be extracted from the document and was replaced by a placeholder.',
			'The image media/media/image5.tiff could not be uploaded (The file type is not allowed.) and was replaced by a placeholder.',
		],
	},
};

export const SingleWarning = {
	args: {
		warnings: [
			'The image media/media/image5.tiff could not be uploaded (The file type is not allowed.) and was replaced by a placeholder.',
		],
	},
};
