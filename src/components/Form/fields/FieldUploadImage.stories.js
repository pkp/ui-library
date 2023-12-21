import FieldUploadImage from './FieldUploadImage.vue';
import FieldBaseMock from '../mocks/field-base';
import FieldUploadImageLogo from '../mocks/field-upload-image-logo';

export default {
	title: 'Forms/FieldUploadImage',
	component: FieldUploadImage,
	render: (args) => ({
		components: {FieldUploadImage},
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
			<FieldUploadImage v-bind="args" @change="change" />
		`,
	}),
};

export const Base = {
	args: {
		...FieldBaseMock,
		...FieldUploadImageLogo,
	},
};
