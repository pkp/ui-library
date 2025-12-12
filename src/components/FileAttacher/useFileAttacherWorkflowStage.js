import {ref} from 'vue';
import {t} from '@/utils/i18n';
import {useFileManagerConfig} from '@/managers/FileManager/useFileManagerConfig.js';

export function useFileAttacherWorkflowStage(props) {
	const submissionStageId = ref(props.submission.stageId);
	const submission = ref(props.submission);
	const selectedStage = ref();
	const selectedFiles = ref(props.selectedFiles);

	const {getFileManagerUploadNamespaces} = useFileManagerConfig();
	const fileManagerUploadNamespaces = getFileManagerUploadNamespaces({
		submissionStageId,
		submission,
	});

	const options = [
		{
			label: t('submission.submit.submissionFiles'),
			value: pkp.const.WORKFLOW_STAGE_ID_SUBMISSION,
			disabled:
				!fileManagerUploadNamespaces[pkp.const.WORKFLOW_STAGE_ID_SUBMISSION]
					.length,
		},
		{
			label: t('reviewer.submission.reviewFiles'),
			value: pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW,
			disabled:
				!fileManagerUploadNamespaces[
					pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW
				].length,
		},
		{
			label: t('editor.submission.selectCopyedingFiles'),
			value: pkp.const.WORKFLOW_STAGE_ID_EDITING,
			disabled:
				!fileManagerUploadNamespaces[pkp.const.WORKFLOW_STAGE_ID_EDITING]
					.length,
		},
		{
			label: t('editor.submission.productionFiles'),
			value: pkp.const.WORKFLOW_STAGE_ID_PRODUCTION,
			disabled:
				!fileManagerUploadNamespaces[pkp.const.WORKFLOW_STAGE_ID_PRODUCTION]
					.length,
		},
	];

	function onStageChange(name, attr, val) {
		selectedStage.value = val;
	}

	return {
		selectedStage,
		selectedFiles,
		fileManagerUploadNamespaces,
		options,
		onStageChange,
	};
}
