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

	const {
		form,
		initEmptyForm,
		addPage,
		addGroup,
		set,
		addFieldDate,
		addFieldText,
	} = useForm();

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
		submitButton: {label: t('common.save')},
		cancelButton: {label: t('common.cancel')},
	});

	addGroup('default');

	// Name field is common to all metadata types
	addFieldText('name', {
		groupId: 'default',
		label: t('publication.mediaFiles.metadataName'),
		description: t('publication.mediaFiles.metadataNameDescription'),
		size: 'large',
		value: mediaFile.name,
		isRequired: true,
		isMultilingual: true,
	});

	const metadataType = mediaFile.genreMetadataType;

	if (metadataType === pkp.const.GENRE_CATEGORY_ARTWORK) {
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
	}

	if (metadataType === pkp.const.GENRE_CATEGORY_SUPPLEMENTARY) {
		addFieldText('description', {
			groupId: 'default',
			label: t('common.description'),
			size: 'large',
			value: mediaFile.description,
			isMultilingual: true,
		});

		addFieldText('creator', {
			groupId: 'default',
			label: t('submission.supplementary.creator'),
			size: 'large',
			value: mediaFile.creator,
			isMultilingual: true,
		});

		addFieldText('publisher', {
			groupId: 'default',
			label: t('submission.supplementary.publisher'),
			size: 'large',
			value: mediaFile.publisher,
			isMultilingual: true,
		});

		addFieldText('source', {
			groupId: 'default',
			label: t('common.source'),
			size: 'large',
			value: mediaFile.source,
			isMultilingual: true,
		});

		addFieldText('subject', {
			groupId: 'default',
			label: t('submission.supplementary.subject'),
			size: 'large',
			value: mediaFile.subject,
			isMultilingual: true,
		});

		addFieldText('sponsor', {
			groupId: 'default',
			label: t('submission.supplementary.sponsor'),
			size: 'large',
			value: mediaFile.sponsor,
			isMultilingual: true,
		});

		addFieldDate('dateCreated', {
			groupId: 'default',
			label: t('common.date'),
			size: 'normal',
			value: mediaFile.dateCreated,
		});

		addFieldText('language', {
			groupId: 'default',
			label: t('common.language'),
			size: 'large',
			value: mediaFile.language,
		});
	}

	// Document metadata type: only the name field (already added above)

	const {setInitialState} = useFormChanged(form, null, {
		warnOnClose: true,
	});

	return {form, set};
}
