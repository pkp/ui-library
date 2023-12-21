import FieldUpload from './FieldUpload.vue';
import FieldBaseMock from '../mocks/field-base';
import FieldUploadCssMock from '../mocks/field-upload-css';

export default {
	title: 'Forms/FieldUpload',
	component: FieldUpload,
	render: (args) => ({
		components: {FieldUpload},
		setup() {
			function change(name, prop, newValue, localeKey) {
				if (localeKey) {
					args[prop][localeKey] = newValue;
				} else {
					args[prop] = newValue;
				}
			}

			return {args, change};
		},
		template: `
			<FieldUpload v-bind="args" @change="change" />
		`,
	}),
};

export const Base = {
	args: {
		...FieldBaseMock,
		...FieldUploadCssMock,
		uploadFileLabel: 'Add File',
		restoreLabel: 'Restore',
	},
};
