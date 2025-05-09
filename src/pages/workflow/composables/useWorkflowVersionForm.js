import {onMounted, watch} from 'vue';
import {useUrl} from '@/composables/useUrl';
import {useForm} from '@/composables/useForm';
import {useFetch} from '@/composables/useFetch';
import {useLocalize} from '@/composables/useLocalize';
import {useSubmission} from '@/composables/useSubmission';
import {useWorkflowStore} from '@/pages/workflow/workflowStore';

/**
 * getRequestPublicationId - Determines the publication ID to use for the request
 */
function getRequestPublicationId({
	shouldCreateNewVersion,
	versionSource,
	sendToVersion,
	latestPublicationId,
}) {
	// POST: if the user chose to create a new version, we need to use the selected version source or the latest publication id by default
	if (shouldCreateNewVersion) {
		return versionSource || latestPublicationId;
	}

	// PUT: publicationId to use should be the sendToVersion id
	return sendToVersion;
}

/**
 * goToPublicationPage - Navigates to the publication page
 */
function goToPublicationPage(store, {publicationId}) {
	store.navigateToMenu(`publication_${publicationId}_titleAbstract`);
}

export function useWorkflowVersionForm(
	versionMode = 'createNewVersion',
	closeDialog = () => {},
) {
	const store = useWorkflowStore();
	const {t} = useLocalize();
	const {getLatestPublication} = useSubmission();
	let publications = [];
	let latestPublication = null;
	const isTextEditorMode = versionMode === 'sendToTextEditor';

	const redirectToExistingVersion = (versionId) => {
		closeDialog(false);
		goToPublicationPage(store, {publicationId: versionId});

		return {
			data: null,
			validationError: null,
		};
	};

	const handleVersionSubmission = async (formData) => {
		const shouldCreateNewVersion =
			!isTextEditorMode || formData.sendToVersion === 'create';

		if (!shouldCreateNewVersion && !formData.versionStage) {
			// just redirect if no updates are needed for the selected version when sending to text editor
			return redirectToExistingVersion(formData.sendToVersion);
		}

		const publicationId = getRequestPublicationId({
			shouldCreateNewVersion,
			versionSource: formData.versionSource,
			sendToVersion: formData.sendToVersion,
			latestPublicationId: latestPublication?.id,
		});

		const {apiUrl: versionUrl} = useUrl(
			`submissions/${store.submission.id}/publications/${publicationId}/version`,
		);

		const {
			fetch,
			data: publicationData,
			validationError,
			isSuccess,
		} = useFetch(versionUrl, {
			method: shouldCreateNewVersion ? 'POST' : 'PUT',
			body: {
				versionStage: formData.versionStage,
				versionIsMinor: formData.versionIsMinor,
			},
			expectValidationError: true,
		});

		await fetch();
		await store.triggerDataChange();

		if (isSuccess.value) {
			closeDialog(false);
			goToPublicationPage(store, {
				publicationId: shouldCreateNewVersion
					? publicationData.value?.id
					: publicationId,
			});
		}

		// return result to Form component handler
		return {
			data: publicationData.value,
			validationError: validationError.value,
		};
	};

	const {
		getField,
		form,
		clearForm,
		setValue,
		setSelectOptions,
		enableSelectOptions,
	} = useForm(store.versionForm, {
		customSubmit: handleVersionSubmission,
	});

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
