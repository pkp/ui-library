import {onMounted, watch} from 'vue';
import {useUrl} from '@/composables/useUrl';
import {useForm} from '@/composables/useForm';
import {useFetch} from '@/composables/useFetch';
import {useLocalize} from '@/composables/useLocalize';
import {useSubmission} from '@/composables/useSubmission';
import {useWorkflowStore} from '@/pages/workflow/workflowStore';

const VERSION_MODE = {
	CREATE: 'createNewVersion',
	SEND_TO_TEXT_EDITOR: 'sendToTextEditor',
	PUBLISH: 'publish',
};

/**
 * getRequestPublicationId - Determines the publication ID to use for the request
 */
function getRequestPublicationId({
	shouldCreateNewVersion,
	versionMode,
	versionSource,
	sendToVersion,
	latestPublicationId,
	selectedPublicationId,
}) {
	if (versionMode === VERSION_MODE.PUBLISH) {
		// For PUBLISH mode (PUT), use the selected publication before publishing the submission
		return selectedPublicationId;
	}

	if (shouldCreateNewVersion) {
		// For new versions (POST), use the version source or fallback to the latest publication
		return versionSource || latestPublicationId;
	}

	// For updates (PUT) to an existing version, use the target version
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
	onSubmitFn = null,
) {
	const store = useWorkflowStore();
	const {t} = useLocalize();
	const {getLatestPublication} = useSubmission();
	let publications = [];
	let latestPublication = null;
	const isTextEditorMode = versionMode === VERSION_MODE.SEND_TO_TEXT_EDITOR;
	const isCreateMode = versionMode === VERSION_MODE.CREATE;

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
			isCreateMode || formData.sendToVersion === 'create';

		if (!shouldCreateNewVersion && !formData.versionStage) {
			// just redirect if no updates are needed for the selected version when sending to text editor
			return redirectToExistingVersion(formData.sendToVersion);
		}

		const publicationId = getRequestPublicationId({
			shouldCreateNewVersion,
			versionMode,
			versionSource: formData.versionSource,
			sendToVersion: formData.sendToVersion,
			latestPublicationId: latestPublication?.id,
			selectedPublicationId: store.selectedPublication?.id,
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

			if (versionMode !== VERSION_MODE.PUBLISH) {
				goToPublicationPage(store, {
					publicationId: shouldCreateNewVersion
						? publicationData.value?.id
						: publicationId,
				});
			}
		}

		if (typeof onSubmitFn === 'function') {
			onSubmitFn(store.selectedPublication);
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
		setFieldIsRequired,
		setFieldShowWhen,
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

		setSelectOptions(versionIsMinorField, updatedOptions);

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

		// Send To field (only visible when sending file to text editor)
		const sendToVersionField = getField(store.versionForm, 'sendToVersion');
		setFieldIsRequired(sendToVersionField, isTextEditorMode);
		setFieldShowWhen(sendToVersionField, !isTextEditorMode ? [] : undefined);
		setSelectOptions(
			sendToVersionField,
			buildPublicationOptions({withCreateOption: true}),
		);

		// Version source field (only visible when creating a new version, either via Create New Version button or Send to Text Editor when Send to File field "create" option is selected)
		const versionSourceField = getField(store.versionForm, 'versionSource');
		setFieldShowWhen(
			versionSourceField,
			!isCreateMode ? ['sendToVersion', 'create'] : undefined,
		);
		setSelectOptions(versionSourceField, buildPublicationOptions());
		setValue(
			'versionSource',
			versionMode === VERSION_MODE.CREATE ? latestPublication?.id : null,
		);

		// Version stage field is required when form is displayed before publishing an "Unassigned Version"
		const versionStageField = getField(store.versionForm, 'versionStage');
		setFieldIsRequired(versionStageField, versionMode === VERSION_MODE.PUBLISH);

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
			if (sendToVersion !== 'create' || !latestPublication?.id) {
				return;
			}

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
