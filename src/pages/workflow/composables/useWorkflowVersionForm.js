import {onMounted, watch} from 'vue';
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
	let publications = [];

	const {
		getField,
		form,
		clearForm,
		setValue,
		setSelectOptions,
		enableSelectOptions,
	} = useForm(store.versionForm, {
		customSubmit: onSubmitFn,
	});

	onMounted(() => {
		clearForm();

		const latestPublication = getLatestPublication(store.submission);
		publications = store.submission?.publications || [];
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

		enableSelectOptions(store.versionForm, 'versionIsMinor');
	});

	watch(
		() => getField(store.versionForm, 'versionStage')?.value,
		(newStage) => {
			if (!newStage) return;

			const versionIsMinorField = getField(store.versionForm, 'versionIsMinor');
			if (!versionIsMinorField) return;

			const allowMinor = publications.some(
				(option) => option.versionStage === newStage,
			);

			const currentOptions =
				getField(store.versionForm, 'versionIsMinor')?.options || [];

			// Update the disabled status of the "Minor" option if version stage selected doesn't exist on any publication
			const updatedOptions = currentOptions.map((option) =>
				option.value === 'true' ? {...option, disabled: !allowMinor} : option,
			);

			setSelectOptions(store.versionForm, 'versionIsMinor', updatedOptions);

			// reset the field if "Minor" is selected and now disabled
			if (!allowMinor && versionIsMinorField.value === 'true') {
				setValue('versionIsMinor', 'false');
			}
		},
		{immediate: true},
	);

	return {
		form,
		clearForm,
		getField,
		setValue,
		setSelectOptions,
	};
}
