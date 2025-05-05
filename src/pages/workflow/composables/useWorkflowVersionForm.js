import {onMounted, watch} from 'vue';
import {useForm} from '@/composables/useForm';
import {useLocalize} from '@/composables/useLocalize';
import {useSubmission} from '@/composables/useSubmission';
import {useWorkflowStore} from '@/pages/workflow/workflowStore';

export function useWorkflowVersionForm(
	versionMode = 'createNewVersion',
	onSubmitFn = () => {},
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

	const isTextEditorMode = versionMode === 'sendToTextEditor';

	const buildVersionSourceOptions = () => {
		const defaultOption = isTextEditorMode
			? [{label: t('publication.createVersion'), value: ''}]
			: [];

		const publicationOptions = publications.map((p) => ({
			label: p.versionString,
			value: p.id,
		}));

		return [...defaultOption, ...publicationOptions];
	};

	const updateMinorOptionAvailability = (newStage) => {
		const versionIsMinorField = getField(store.versionForm, 'versionIsMinor');
		if (!versionIsMinorField) return;

		const allowMinor = publications.some(
			(pub) => pub.versionStage === newStage,
		);

		const updatedOptions = (versionIsMinorField.options || []).map((option) =>
			option.value === 'true' ? {...option, disabled: !allowMinor} : option,
		);

		setSelectOptions(store.versionForm, 'versionIsMinor', updatedOptions);

		if (!allowMinor && versionIsMinorField.value === 'true') {
			setValue('versionIsMinor', 'false');
		}
	};

	onMounted(() => {
		clearForm();

		const latestPublication = getLatestPublication(store.submission);
		publications = store.submission?.publications || [];

		const versionSource = getField(store.versionForm, 'versionSource');
		if (versionSource) {
			versionSource.isRequired = isTextEditorMode;
			versionSource.label = t(
				isTextEditorMode
					? 'publication.versionSource.sendToTextEditor.label'
					: 'publication.versionSource.create.label',
			);
			versionSource.description = isTextEditorMode
				? null
				: t('publication.versionSource.create.description');

			setSelectOptions(
				store.versionForm,
				'versionSource',
				buildVersionSourceOptions(),
			);
		}

		setValue(
			'versionSource',
			versionMode === 'createNewVersion' ? latestPublication?.id : null,
		);

		enableSelectOptions(store.versionForm, 'versionIsMinor');
	});

	watch(
		() => getField(store.versionForm, 'versionStage')?.value,
		(newStage) => {
			if (!newStage) return;
			updateMinorOptionAvailability(newStage);
		},
		{immediate: true},
	);

	return {
		form,
	};
}
