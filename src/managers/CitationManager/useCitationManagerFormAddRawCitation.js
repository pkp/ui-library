import {useForm} from '@/composables/useForm';
import {useUrl} from '@/composables/useUrl';
import {useLocalize} from '@/composables/useLocalize';

export function useCitationManagerFormAddRawCitation({
	apiPathSubmissions,
	onSuccess,
}) {
	const {t} = useLocalize();
	const {apiUrl: actionUrl} = useUrl(
		`${apiPathSubmissions}/importAdditionalCitations`,
	);

	const {form, initEmptyForm, setValue, addPage, addGroup, addFieldTextArea} =
		useForm({});

	initEmptyForm('addCitations', {
		action: actionUrl.value,
		spacingVariant: 'fullWidth',
		onSuccess: () => {
			setValue('rawCitations', '');
			onSuccess();
		},
	});

	addPage('default', {
		submitButton: {label: t('common.add')},
	});

	addGroup('default');

	addFieldTextArea('rawCitations', {
		label: t('submission.citations'),
		description: t('submission.citations.structured.description'),
		size: 'small-height',
		isRequired: true,
	});

	return {form};
}
