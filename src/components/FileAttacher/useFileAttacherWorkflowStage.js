import {ref} from 'vue';
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

	const options = props.submission?.stages.map((stage) => {
		return {
			label: stage.label,
			value: stage.id,
			disabled: !fileManagerUploadNamespaces[stage.id]?.length,
		};
	});

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
