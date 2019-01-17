import fieldBase from '../FieldBase/config';
import fieldUploadCss from '../../helpers/field-upload-css';
import i18n from '../../helpers/i18n';

export let props = {
	...fieldBase.props,
	...fieldUploadCss,
	i18n: {
		...i18n,
		uploadFile: 'Add File',
		remove: 'Remove',
		restore: 'Restore',
		dropzoneDictDefaultMessage: 'Drop files here to upload',
		dropzoneDictFallbackMessage:
			"Your browser does not support drag'n'drop file uploads.",
		dropzoneDictFallbackText:
			'Please use the fallback form below to upload your files.',
		dropzoneDictFileTooBig:
			'File is too big ({{filesize}}mb). Files larger than {{maxFilesize}}mb can not be uploaded.',
		dropzoneDictInvalidFileType: 'Files of this type can not be uploaded.',
		dropzoneDictResponseError:
			'Server responded with {{statusCode}} code. Please contact the system administrator if this problem persists.',
		dropzoneDictCancelUpload: 'Cancel upload',
		dropzoneDictUploadCanceled: 'Upload canceled',
		dropzoneDictCancelUploadConfirmation:
			'Are you sure you want to cancel this upload?',
		dropzoneDictRemoveFile: 'Remove file',
		dropzoneDictMaxFilesExceeded: 'You can not upload any more files.'
	}
};

export const propDocs = [
	{
		key: '...',
		description:
			'Supports all props in [FieldBase](#/component/Form/fields/FieldBase).'
	},
	{
		key: 'value',
		description: 'The current value for this field.'
	},
	{
		key: 'options',
		description:
			'Pass [options](https://www.dropzonejs.com/#configuration-options) to Dropzone.js.'
	}
];

export const emitDocs = [
	...fieldBase.emitDocs,
	{
		key: 'set-errors',
		description:
			'When error messages for this control should be added, removed or changed.',
		value: {
			name: 'fieldName',
			errors: [],
			localeKey: 'en_US'
		}
	}
];

export default {
	props,
	propDocs,
	emitDocs
};
