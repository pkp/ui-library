import {onMounted} from 'vue';
import {useForm} from '@/composables/useForm';
import {useLocalize} from '@/composables/useLocalize';
import {useSubmission} from '@/composables/useSubmission';
import {useWorkflowStore} from '@/pages/workflow/workflowStore';

export function useWorkflowVersionForm(
	mode = 'createNewVersion',
	onSubmitFn = () => () => {},
) {
	const store = useWorkflowStore();
	const {t} = useLocalize();
	const {getLatestPublication} = useSubmission();

	const {getField, form, clearForm, setValue, setSelectOptions} = useForm(
		store.versionForm,
		{
			customSubmit: onSubmitFn,
		},
	);

	onMounted(() => {
		clearForm();

		const latestPublication = getLatestPublication(store.submission);
		const publications = store.submission?.publications || [];
		const versionSource = getField(store.versionForm, 'versionSource');

		if (versionSource) {
			if (mode === 'sendToTextEditor') {
				versionSource.isRequired = true;
				versionSource.label = t(
					'publication.versionSource.sendToTextEditor.label',
				);
				versionSource.description = null;
			} else {
				versionSource.isRequired = false;
				versionSource.label = t('publication.versionSource.create.label');
				versionSource.description = t(
					'publication.versionSource.create.description',
				);
			}

			const options = [
				...(mode === 'sendToTextEditor'
					? [{label: t('publication.createVersion'), value: ''}]
					: []),
				...publications.map((publication) => ({
					label: publication.versionString,
					value: publication.id,
				})),
			];

			setSelectOptions(store.versionForm, 'versionSource', options);
		}

		if (mode === 'createNewVersion') {
			setValue('versionSource', latestPublication?.id);
		} else {
			setValue('versionSource', null);
		}
	});

	return {
		form,
		clearForm,
		getField,
		setValue,
		setSelectOptions,
	};
}
