import {t} from '@/utils/i18n';

export function getDiscussionTitleByStage(submissionStageId) {
	switch (submissionStageId) {
		case pkp.const.WORKFLOW_STAGE_ID_SUBMISSION:
			return t('submission.queries.submission');
		case pkp.const.WORKFLOW_STAGE_ID_INTERNAL_REVIEW:
		case pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW:
			return t('submission.queries.review');
		case pkp.const.WORKFLOW_STAGE_ID_EDITING:
			return t('submission.queries.editorial');
		case pkp.const.WORKFLOW_STAGE_ID_PRODUCTION:
			return t('submission.queries.production');
		default:
			return '';
	}
}
