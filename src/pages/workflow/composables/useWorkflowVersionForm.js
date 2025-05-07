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
	let latestPublication = null;

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

	const buildPublicationOptions = ({withCreateOption} = {}) => {
		const defaultOption =
			isTextEditorMode && withCreateOption
				? [{label: t('publication.createVersion'), value: 'create'}]
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

	const updateForm = (formId, data) => {
		let versionForm = {...form.value};
		Object.keys(data).forEach((key) => (versionForm[key] = data[key]));
		form.value = versionForm;
	};

	onMounted(() => {
		clearForm();

		latestPublication = getLatestPublication(store.submission);
		publications = store.submission?.publications || [];

		const sendToVersionField = getField(store.versionForm, 'sendToVersion');
		if (sendToVersionField) {
			sendToVersionField.isRequired = isTextEditorMode;
			setSelectOptions(
				store.versionForm,
				'sendToVersion',
				buildPublicationOptions({withCreateOption: true}),
			);

			sendToVersionField.showWhen = !isTextEditorMode ? [] : undefined;
		}

		const versionSource = getField(store.versionForm, 'versionSource');
		if (versionSource) {
			setSelectOptions(
				store.versionForm,
				'versionSource',
				buildPublicationOptions(),
			);

			versionSource.showWhen = isTextEditorMode
				? ['sendToVersion', 'create']
				: undefined;
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

	watch(
		() => getField(store.versionForm, 'sendToVersion')?.value,
		(sendToVersion) => {
			if (sendToVersion !== 'create' || !latestPublication?.id) return;
			// if sendToVersion should create a new version, set the versionSource to the latest publication
			setValue('versionSource', latestPublication.id);
		},
		{immediate: true},
	);

	return {
		form,
		updateForm,
	};
}
