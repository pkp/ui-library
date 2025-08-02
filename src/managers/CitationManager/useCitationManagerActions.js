import {useLegacyGridUrl} from '@/composables/useLegacyGridUrl';
import {useUrl} from '@/composables/useUrl';
import {useModal} from '@/composables/useModal';
import {useLocalize} from '@/composables/useLocalize';
import {useSubmission} from '@/composables/useSubmission';
import {useFetch, getCSRFToken} from '@/composables/useFetch';
import WorkflowLogResponseModal from '@/managers/ReviewerManager/modals/WorkflowLogResponseModal.vue';

export const Actions = {
	CITATION_SEARCH_CITATION: 'citationSearch',
	CITATION_TOGGLE_ALL_CITATION: 'citationToggleAll',
	CITATION_TOGGLE_CITATION: 'citationToggleCitation',
	CITATION_EDIT_CITATION: 'citationEditCitation',
	CITATION_DELETE_CITATION: 'citationDeleteCitation'
};

export function useCitationManagerActions() {
	const {t, localizeSubmission} = useLocalize();

	function citationEditCitation(
		{submission, reviewAssignment, submissionStageId},
		finishedCallback,
	) {
		// http://localhost:8000/index.php/publicknowledge/$$$call$$$/grid/users/reviewer/reviewer-grid/edit-review?submissionId=7&reviewAssignmentId=12&stageId=3
		const {openLegacyModal} = useLegacyGridUrl({
			component: 'grid.users.reviewer.ReviewerGridHandler',
			op: 'editReview',
			params: {
				submissionId: submission.id,
				publicationId: publication.id
			},
		});
		openLegacyModal(
			{title: t('editor.submissionReview.editReview')},
			finishedCallback,
		);
	}

	function citationDeleteCitation(
		{submission, reviewAssignment, submissionStageId},
		finishedCallback,
	) {
		// http://localhost:8000/index.php/publicknowledge/$$$call$$$/grid/users/reviewer/reviewer-grid/edit-review?submissionId=7&reviewAssignmentId=12&stageId=3
		const {openLegacyModal} = useLegacyGridUrl({
			component: 'grid.users.reviewer.ReviewerGridHandler',
			op: 'editReview',
			params: {
				submissionId: submission.id,
				publicationId: publication.id
			},
		});
		openLegacyModal(
			{title: t('editor.submissionReview.editReview')},
			finishedCallback,
		);
	}

	return {
		citationEditCitation,
		citationDeleteCitation
	};
}
