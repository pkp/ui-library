import {inject} from 'vue';
import {useForm} from '@/composables/useForm';
import {useUrl} from '@/composables/useUrl';
import {useFetch} from '@/composables/useFetch';
import {useLocalize} from '@/composables/useLocalize';
import {useFormChanged} from '@/composables/useFormChanged';
import {useMediaFileManagerLinkImageTypes} from './useMediaFileManagerLinkImageTypes';

/**
 * Composable for MediaFileManagerManualLinkImageFormModal component logic
 * @param {Object} mediaFile - The media file object to be linked
 * @returns {Object} - Form object and setter for the manual link image form modal
 */
export function useMediaFileManagerManualLinkImageFormModal(mediaFile = {}) {
	const {t, localize} = useLocalize();
	const closeModal = inject('closeModal');

	const {
		form,
		initEmptyForm,
		addPage,
		addGroup,
		set,
		addFieldText,
		addFieldSelect,
	} = useForm({}, {customSubmit: handleFormSubmission});

	const {
		getHighResOptionsForWebFile,
		getWebFileOptionsForHighRes,
		isWebVersion,
		linkSelections,
	} = useMediaFileManagerLinkImageTypes({mediaFile});

	const isMediaWebVersion = isWebVersion(mediaFile);

	async function handleFormSubmission(formData) {
		const {apiUrl: manualLinkImageUrl} = useUrl(
			`mediaFiles/${mediaFile.id}/link`,
		);

		const requestBody = {
			webFileId: isMediaWebVersion
				? mediaFile.id
				: parseInt(formData.webFileId, 10),
			highResFileId: isMediaWebVersion
				? parseInt(formData.highResFileId, 10)
				: mediaFile.id,
		};

		const {fetch, data, isSuccess, validationError} = useFetch(
			manualLinkImageUrl,
			{
				method: 'PUT',
				body: requestBody,
				expectValidationError: true,
			},
		);

		await fetch();

		if (isSuccess.value) {
			setInitialState(form);
			closeModal();
		}

		return {
			success: isSuccess.value,
			validationError: validationError.value,
			data: data.value,
		};
	}

	initEmptyForm('manualLinkImage', {
		showErrorFooter: false,
		spacingVariant: 'fullWidth',
	});

	addPage('default', {
		submitButton: {label: t('publication.mediaFiles.linkImage')},
		cancelButton: {label: t('common.cancel')},
	});

	addGroup('default');

	addFieldText(isMediaWebVersion ? 'webFileId' : 'highResFileId', {
		groupId: 'default',
		label: t('common.selectedFile'),
		size: 'large',
		value: localize(mediaFile.name),
		disabled: true,
	});

	addFieldSelect(isMediaWebVersion ? 'highResFileId' : 'webFileId', {
		groupId: 'default',
		label: t('publication.mediaFiles.selectMediaFileToLink'),
		description: t('publication.mediaFiles.selectMediaFileToLink.description'),
		options: isMediaWebVersion
			? getHighResOptionsForWebFile(mediaFile.id)
			: getWebFileOptionsForHighRes(mediaFile.id),
		value: linkSelections.value[mediaFile.id] || '',
		size: 'large',
	});

	const {setInitialState} = useFormChanged(form, null, {
		warnOnClose: true,
	});

	return {form, set};
}
