import {ref} from 'vue';
import {t} from '@/utils/i18n';
import {useFileManagerConfig} from '@/managers/FileManager/useFileManagerConfig.js';
import {useCurrentUser} from '@/composables/useCurrentUser.js';

export function useFileAttacherWorkflowStage(props) {
	const submissionStageId = ref(props.submission.stageId);
	const submission = ref(props.submission);
	const selectedStage = ref();
	const selectedFileIds = ref(props.selectedFiles?.map(({id}) => id));
	const selectedFileObjects = ref(props.selectedFiles);

	const {getManagerConfig} = useFileManagerConfig();
	const {getCurrentUserRoles, hasCurrentUserAtLeastOneAssignedRoleInStage} =
		useCurrentUser();
	const userRoles = getCurrentUserRoles();

	function getFileManagerNamespace(namespaces, namespaceStageId) {
		// if user has no roles in this stage, return empty array
		if (
			!hasCurrentUserAtLeastOneAssignedRoleInStage(
				props.submission,
				namespaceStageId,
				userRoles,
			)
		) {
			return [];
		}

		const fileManagerNamespaces = [];

		namespaces.forEach((namespace) => {
			const namespaceRef = ref(namespace);
			const {permittedActions} = getManagerConfig({
				namespace: namespaceRef,
				submissionStageId,
				submission,
			});

			if (permittedActions.length) {
				fileManagerNamespaces.push(namespace);
			}
		});

		return fileManagerNamespaces;
	}

	const fileManagers = {
		[pkp.const.WORKFLOW_STAGE_ID_SUBMISSION]: getFileManagerNamespace(
			['SUBMISSION_FILES_SELECT'],
			pkp.const.WORKFLOW_STAGE_ID_SUBMISSION,
		),
		[pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW]: getFileManagerNamespace(
			['EDITOR_REVIEW_FILES_SELECT', 'WORKFLOW_REVIEW_REVISIONS_SELECT'],
			pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW,
		),
		[pkp.const.WORKFLOW_STAGE_ID_EDITING]: getFileManagerNamespace(
			['COPYEDITED_FILES_SELECT', 'FINAL_DRAFT_FILES_SELECT'],
			pkp.const.WORKFLOW_STAGE_ID_EDITING,
		),
		[pkp.const.WORKFLOW_STAGE_ID_PRODUCTION]: getFileManagerNamespace(
			['PRODUCTION_READY_FILES_SELECT'],
			pkp.const.WORKFLOW_STAGE_ID_PRODUCTION,
		),
	};

	const options = [
		{
			label: t('submission.submit.submissionFiles'),
			value: pkp.const.WORKFLOW_STAGE_ID_SUBMISSION,
			disabled: !fileManagers[pkp.const.WORKFLOW_STAGE_ID_SUBMISSION].length,
		},
		{
			label: t('reviewer.submission.reviewFiles'),
			value: pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW,
			disabled:
				!fileManagers[pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW].length,
		},
		{
			label: t('editor.submission.selectCopyedingFiles'),
			value: pkp.const.WORKFLOW_STAGE_ID_EDITING,
			disabled: !fileManagers[pkp.const.WORKFLOW_STAGE_ID_EDITING].length,
		},
		{
			label: t('editor.submission.productionFiles'),
			value: pkp.const.WORKFLOW_STAGE_ID_PRODUCTION,
			disabled: !fileManagers[pkp.const.WORKFLOW_STAGE_ID_PRODUCTION].length,
		},
	];

	function onStageChange(name, attr, val) {
		selectedStage.value = val;
	}

	return {
		selectedStage,
		selectedFileIds,
		selectedFileObjects,
		fileManagers,
		options,
		onStageChange,
	};
}
