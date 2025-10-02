import {useForm} from '@/composables/useForm';
import {useLocalize} from '@/composables/useLocalize';
import {watch} from 'vue';
import {useModal} from '@/composables/useModal';

export function useCitationManagerFormEnableLookup({
	citationsMetadataLookup,
	onCitationMetadataLookupChange,
} = {}) {
	const {t} = useLocalize();

	const {
		form,
		setValue,
		initEmptyForm,
		addFieldOptions,
		addPage,
		addGroup,
		getField,
	} = useForm({});

	initEmptyForm('enableLookup', {
		action: 'emit',
		spacingVariant: 'fullWidth',
	});

	addPage('default', {
		submitButton: null,
	});

	addGroup('default');

	addFieldOptions('metadataLookup', 'checkbox', {
		label: t('submission.citations.structured'),
		description: t(
			'submission.citations.structured.citationsMetadataLookup.description',
		),
		value: citationsMetadataLookup.value,
		options: [
			{
				label: t(
					'submission.citations.structured.enableCitationsMetadataLookup',
				),
				value: true,
			},
		],
	});

	watch(citationsMetadataLookup, (newValue) => {
		setValue('metadataLookup', newValue);
	});

	watch(
		() => getField('metadataLookup')?.value,
		(newValue) => {
			// skip when the value is being rollback in cancel
			if (newValue === citationsMetadataLookup.value) {
				return;
			}

			const {openDialog} = useModal();
			openDialog({
				title: citationsMetadataLookup.value
					? t('submission.citations.structured.disableModal.title')
					: t('submission.citations.structured.enableModal.title'),
				message: citationsMetadataLookup.value
					? t('submission.citations.structured.disableModal.confirm')
					: t('submission.citations.structured.enableModal.confirm'),
				actions: [
					{
						label: t('common.ok'),
						isPrimary: true,
						callback: async (close) => {
							await onCitationMetadataLookupChange(
								!citationsMetadataLookup.value,
							);
							close();
						},
					},
					{
						label: t('common.cancel'),
						isWarnable: true,
						callback: (close) => {
							setValue('metadataLookup', citationsMetadataLookup.value);
							close();
						},
					},
				],
				close: () => {},
			});
		},
	);

	return {form};
}
