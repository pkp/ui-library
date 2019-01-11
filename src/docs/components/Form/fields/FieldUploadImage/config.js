import fieldUpload from '../FieldUpload/config';
import fieldUploadImage from '../../helpers/field-upload-image-logo';

export let props = {
	...fieldUpload.props,
	...fieldUploadImage
};

export const propDocs = [
	...fieldUpload.propDocs,
	{
		key: 'baseUrl',
		description:
			'The `baseUrl` is prepended to the filename to display previews. For example, the `baseURL` for the logo of a journal with an ID of `2` would be `http://yoursite.com/public/journals/2/`.'
	}
];

export const emitDocs = [...fieldUpload.emitDocs];

export default {
	props,
	propDocs,
	emitDocs
};
