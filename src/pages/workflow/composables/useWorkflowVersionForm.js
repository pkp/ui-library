import {onMounted, watch} from 'vue';
import {useUrl} from '@/composables/useUrl';
import {useForm} from '@/composables/useForm';
import {useFetch} from '@/composables/useFetch';
import {useLocalize} from '@/composables/useLocalize';
import {useSubmission} from '@/composables/useSubmission';
import {useWorkflowStore} from '@/pages/workflow/workflowStore';

const VERSION_MODE = {
	CREATE: 'createNewVersion', // the "Create New Version" action in the publication workflow menu
	SEND_TO_TEXT_EDITOR: 'sendToTextEditor', // the "Send to Text Editor" action from the dropdown options on a submission file
	PUBLISH: 'publish', // the "Schedule for Publication" on the workflow page (applies only to OJS), user must assign a publication stage before scheduling the version for an issue
};

/**
 * getRequestPublicationId - Determines the publication ID to use for the request
 */
function getRequestPublicationId({
	shouldCreateNewVersion,
	isPublishMode,
	versionSource,
	sendToVersion,
	latestPublicationId,
	selectedPublicationId,
}) {
	if (isPublishMode) {
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

	// Determine the mode based on the versionMode parameter
	// versionMode can be one of 'createNewVersion', 'sendToTextEditor', or 'publish'
	const modeState = {
		isCreateMode: versionMode === VERSION_MODE.CREATE,
		isTextEditorMode: versionMode === VERSION_MODE.SEND_TO_TEXT_EDITOR,
		isPublishMode: versionMode === VERSION_MODE.PUBLISH,
	};

	function redirectToExistingVersion(versionId) {
		closeDialog(false);
		goToPublicationPage(store, {publicationId: versionId});

		return {
			data: null,
			validationError: null,
		};
	}

	async function handleVersionSubmission(formData) {
		const shouldCreateNewVersion =
			modeState.isCreateMode || formData.sendToVersion === 'create';

		if (!shouldCreateNewVersion && !formData.versionStage) {
			// just redirect if no updates are needed for the selected version when sending to text editor
			return redirectToExistingVersion(formData.sendToVersion);
		}

		const publicationId = getRequestPublicationId({
			shouldCreateNewVersion,
			isPublishMode: modeState.isPublishMode,
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

			if (!modeState.isPublishMode) {
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
	}

	const {
		form,
		initEmptyForm,
		addFieldSelect,
		addPage,
		addGroup,
		set,
		setValue,
		getField,
		removeFieldError,
	} = useForm({}, {customSubmit: handleVersionSubmission});

	function buildPublicationOptions({withCreateOption} = {}) {
		const defaultOption =
			modeState.isTextEditorMode && withCreateOption
				? [{label: t('publication.createVersion'), value: 'create'}]
				: [];

		const publicationOptions = publications.map((p) => ({
			label: p.versionString,
			value: p.id,
		}));

		return [...defaultOption, ...publicationOptions];
	}

	function getVersionIsMinorField({allowMinorVersion, currentValue}) {
		return {
			label: t('publication.revisionSignificance.label'),
			description: t('publication.revisionSignificance.description'),
			options: [
				{label: t('publication.revisionSignificance.major'), value: 'false'},
				{
					label: t('publication.revisionSignificance.minor'),
					value: 'true',
					disabled: !allowMinorVersion,
				},
			],
			size: 'large',
			isRequired: modeState.isPublishMode,
			value:
				currentValue === 'true' && !allowMinorVersion ? 'false' : currentValue,
			showWhen: modeState.isTextEditorMode
				? ['sendToVersion', getUnassignedVersions()]
				: undefined,
		};
	}

	function updateMinorOptionAvailability(newStage) {
		const allowMinorVersion = publications.some(
			(pub) => pub.versionStage === newStage,
		);

		// Update the versionIsMinor field with the updated options availability
		addFieldSelect(
			'versionIsMinor',
			getVersionIsMinorField({
				allowMinorVersion,
				currentValue: allowMinorVersion.toString(),
			}),
			{override: true},
		);

		// Remove the field error for versionIsMinor, as there is a value assigned
		removeFieldError('versionIsMinor');
	}

	function resetVersionStageValues(sendToVersion) {
		// versionStage and revisionSignificance are hidden in sendToTextEditor mode
		// when the selected version already has a version stage assigned
		// reset their values to null
		if (
			modeState.isTextEditorMode &&
			!getUnassignedVersions().includes(sendToVersion)
		) {
			setValue('versionStage', null);
			setValue('versionIsMinor', null);
		}
	}

	// returns all the ids of unassigned versions and the "create" value for "Create New Version" option
	function getUnassignedVersions() {
		const unassignedVersionIds = publications
			.filter((pub) => !pub.versionStage)
			?.map(({id}) => id);
		return ['create', ...unassignedVersionIds];
	}

	initEmptyForm('version', {
		showErrorFooter: false,
		spacingVariant: 'fullWidth',
	});
	addPage('default', {
		submitButton: {label: t('common.confirm')},
		cancelButton: {label: t('common.cancel')},
	});
	addGroup('default');

	onMounted(() => {
		latestPublication = getLatestPublication(store.submission);
		publications = store.submission?.publications || [];

		// Send To field (only visible when sending file to text editor)
		if (modeState.isTextEditorMode) {
			addFieldSelect('sendToVersion', {
				label: t('publication.sendToTextEditor.label'),
				options: buildPublicationOptions({withCreateOption: true}),
				size: 'large',
				isRequired: modeState.isTextEditorMode,
				showWhen: !modeState.isTextEditorMode ? [] : undefined,
			});
		}

		// Version source field (only visible when creating a new version, either via Create New Version button or Send to Text Editor when Send to File field "create" option is selected)
		addFieldSelect('versionSource', {
			label: t('publication.versionSource.create.label'),
			description: t('publication.versionSource.create.description'),
			options: buildPublicationOptions(),
			size: 'large',
			showWhen: !modeState.isCreateMode
				? ['sendToVersion', 'create']
				: undefined,
		});

		// Version stage field is required when form is in publish mode for "Unassigned Version"
		// If sendToEditor mode, only show this field if the selected sendTo version is an "Unassigned version"
		addFieldSelect('versionStage', {
			label: t('publication.versionStage.label'),
			description: t('publication.versionStage.description'),
			options: store.versionStageOptions,
			size: 'large',
			isRequired: modeState.isPublishMode,
			showWhen: modeState.isTextEditorMode
				? ['sendToVersion', getUnassignedVersions()]
				: undefined,
		});

		// Version significance field
		// If sendToEditor mode, only show this field if the selected sendTo version is an "Unassigned version"
		addFieldSelect(
			'versionIsMinor',
			getVersionIsMinorField({
				allowMinorVersion: true,
				currentValue: '',
			}),
		);

		setValue(
			'versionSource',
			modeState.isCreateMode ? latestPublication?.id : null,
		);
	});

	watch(
		() => getField('versionStage')?.value,
		(newStage) => {
			if (!newStage) return;
			updateMinorOptionAvailability(newStage);
		},
		{immediate: true},
	);

	watch(
		() => getField('sendToVersion')?.value,
		(sendToVersion) => {
			if (modeState.isTextEditorMode) {
				resetVersionStageValues(sendToVersion);
			}

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
		set,
	};
}
