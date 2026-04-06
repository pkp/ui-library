import {useFetch} from '@/composables/useFetch';
import {useUrl} from '@/composables/useUrl';

const mailableKeys = {
	[pkp.const.WORKFLOW_STAGE_ID_SUBMISSION]:
		'DISCUSSION_NOTIFICATION_SUBMISSION',
	[pkp.const.WORKFLOW_STAGE_ID_INTERNAL_REVIEW]:
		'DISCUSSION_NOTIFICATION_REVIEW',
	[pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW]:
		'DISCUSSION_NOTIFICATION_REVIEW',
	[pkp.const.WORKFLOW_STAGE_ID_EDITING]: 'DISCUSSION_NOTIFICATION_COPYEDITING',
	[pkp.const.WORKFLOW_STAGE_ID_PRODUCTION]:
		'DISCUSSION_NOTIFICATION_PRODUCTION',
};

export function useTaskTemplateManagerEmails({
	stage = null,
	taskTemplate = null,
} = {}) {
	const stageId = taskTemplate?.stageId || stage?.key;
	if (!stageId) {
		throw new Error('Stage ID is required to fetch the email templates.');
	}

	const mailableKey = mailableKeys[stageId];
	if (!mailableKey) {
		throw new Error(`No mailable key found for stageId: ${stageId}`);
	}

	const {apiUrl: taskApiUrl} = useUrl(`mailables/${mailableKey}`);

	const {
		data: emailTemplatesData,
		fetch: fetchTaskData,
		isLoading: isLoadingEmailTemplates,
	} = useFetch(taskApiUrl);

	fetchTaskData();

	return {
		emailTemplatesData,
		isLoadingEmailTemplates,
	};
}
