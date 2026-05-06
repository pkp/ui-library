import FileTypeIcon from './FileTypeIcon.vue';

export default {
	title: 'Components/FileTypeIcon',
	component: FileTypeIcon,
	render: (args) => ({
		components: {FileTypeIcon},
		setup() {
			return {args};
		},
		template: `
			<FileTypeIcon v-bind="args" />
		`,
	}),
};

export const Image = {
	args: {documentType: 'image', class: 'h-6 w-6 text-primary'},
};

export const Pdf = {
	args: {documentType: 'pdf', class: 'h-6 w-6 text-primary'},
};

export const UnknownTypeFallback = {
	args: {documentType: 'something-unknown', class: 'h-6 w-6 text-primary'},
};

export const Large = {
	args: {documentType: 'image', class: 'h-12 w-12 text-primary'},
};
