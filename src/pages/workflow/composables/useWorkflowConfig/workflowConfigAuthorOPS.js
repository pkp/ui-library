import {useLocalize} from '@/composables/useLocalize';
import {Actions} from '../useWorkflowActions';

export function getHeaderItems({
	submission,
	selectedPublication,
	publicationSettings,
}) {
	if (!submission) {
		return [];
	}
	const {t} = useLocalize();
	const actions = [];

	actions.push({
		component: 'WorkflowActionButton',
		props: {
			label: t('editor.submissionLibrary'),
			action: Actions.WORKFLOW_VIEW_LIBRARY,
		},
	});

	return actions;
}

export const WorkflowConfig = {};

export const PublicationConfig = {
	common: {
		getPrimaryControlsLeft: ({
			submission,
			selectedPublicationId,
			selectedPublication,
		}) => {
			const items = [];

			items.push([
				{
					component: 'WorkflowPublicationVersionControl',
					props: {
						submission,
						selectedPublicationId: selectedPublicationId,
					},
				},
				{
					component: 'WorkflowPublicationRelationDropdownOPS',
					props: {publication: selectedPublication},
				},
			]);

			return items;
		},
	},
	discussions: {
		getPrimaryItems: ({submission, selectedPublication, permissions}) => {
			return [
				{
					component: 'DiscussionManager',
					props: {
						submissionId: submission.id,
						stageId: pkp.const.WORKFLOW_STAGE_ID_PRODUCTION,
					},
				},
			];
		},
	},
};
