import {t} from '@/utils/i18n';

const defaultDropzoneOptions = {
	maxFilesize: 2,
	url: '',
	dropzoneDictDefaultMessage: t('form.dropzone.dictDefaultMessage'),
	dropzoneDictFallbackMessage: t('form.dropzone.dictFallbackMessage'),
	dropzoneDictFallbackText: t('form.dropzone.dictFallbackText'),
	dropzoneDictFileTooBig: t('form.dropzone.dictFileTooBig'),
	dropzoneDictInvalidFileType: t('form.dropzone.dictInvalidFileType'),
	dropzoneDictResponseError: t('form.dropzone.dictResponseError'),
	dropzoneDictCancelUpload: t('form.dropzone.dictCancelUpload'),
	dropzoneDictUploadCanceled: t('form.dropzone.dictUploadCanceled'),
	dropzoneDictCancelUploadConfirmation: t(
		'form.dropzone.dictCancelUploadConfirmation',
	),
	dropzoneDictRemoveFile: t('form.dropzone.dictRemoveFile'),
	dropzoneDictMaxFilesExceeded: t('form.dropzone.dictMaxFilesExceeded'),
};

export function createDropzoneOptions(overrides = {}) {
	return {
		...defaultDropzoneOptions,
		...overrides,
	};
}
