import {inject} from 'vue';
import {useForm} from '@/composables/useForm';
import {useUrl} from '@/composables/useUrl';
import {useLocalize} from '@/composables/useLocalize';
import {useFormChanged} from '@/composables/useFormChanged';
import {useMediaFileManagerStore} from './mediaFileManagerStore';

/**
 * Composable for MediaFileManagerMetadataFormModal component logic
 * @param {Object} mediaFile - The media file object to edit metadata for
 * @returns {Object} - Form object and setter for the metadata form modal
 */
export function useMediaFileManagerMetadataFormModal(mediaFile = {}) {
	const {t} = useLocalize();
	const closeModal = inject('closeModal');
	const mediaFileManagerStore = useMediaFileManagerStore();
	const submissionId = mediaFileManagerStore.submission?.id;

	const {apiUrl: editMetadataUrl} = useUrl(
		`submissions/${submissionId}/mediaFiles/${mediaFile.id}`,
	);

	const {form, initEmptyForm, addPage, addGroup, set, addFieldText} = useForm();

	initEmptyForm('editMediaFileMetadata', {
		action: editMetadataUrl.value,
		method: 'PUT',
		onSuccess: () => {
			setInitialState(form);
			closeModal();
		},
		showErrorFooter: false,
	});

	addPage('default', {
		submitButton: {label: t('common.confirm')},
		cancelButton: {label: t('common.cancel')},
	});

	addGroup('default');

	addFieldText('name', {
		groupId: 'default',
		label: t('publication.mediaFiles.metadataName'),
		description: t('publication.mediaFiles.metadataNameDescription'),
		size: 'large',
		value: mediaFile.name,
		isRequired: true,
		isMultilingual: true,
	});

	addFieldText('caption', {
		groupId: 'default',
		label: t('grid.artworkFile.caption'),
		size: 'large',
		value: mediaFile.caption,
	});

	addFieldText('credit', {
		groupId: 'default',
		label: t('grid.artworkFile.credit'),
		size: 'large',
		value: mediaFile.credit,
	});

	addFieldText('copyrightOwner', {
		groupId: 'default',
		label: t('grid.artworkFile.copyrightOwner'),
		size: 'large',
		value: mediaFile.copyrightOwner,
	});

	addFieldText('terms', {
		groupId: 'default',
		label: t('grid.artworkFile.permissionTerms'),
		size: 'large',
		value: mediaFile.terms,
	});

	const {setInitialState} = useFormChanged(form, null, {
		warnOnClose: true,
	});

	return {form, set};
}
