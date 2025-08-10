import {useModal} from '@/composables/useModal';
import {useLocalize} from '@/composables/useLocalize';

import {useUrl} from '@/composables/useUrl';
import {useFetch} from '@/composables/useFetch';
import {useLegacyGridUrl} from '@/composables/useLegacyGridUrl';
import {useApp} from '@/composables/useApp';

import WorkflowModalChangeSubmissionLanguage from '@/pages/workflow/modals/WorkflowChangeSubmissionLanguageModal.vue';
import WorkflowVersionDialogBody from '@/pages/workflow/components/publication/WorkflowVersionDialogBody.vue';
import WorkflowVersionSideModal from '@/pages/workflow/components/publication/WorkflowVersionSideModal.vue';

export const Actions = {
	WORKFLOW_VIEW_PUBLISHED_SUBMISSION: 'workflowViewPublishedSubmission',
	WORKFLOW_ASSIGN_TO_ISSUE: 'workflowAssignToIssue',
	WORKFLOW_VIEW_ACTIVITY_LOG: 'workflowViewActivityLog',
	WORKFLOW_VIEW_LIBRARY: 'workflowViewLibrary',
	WORKFLOW_ASSIGN_TO_ISSUE_AND_SCHEDULE_FOR_PUBLICATION:
		'workflowAssignToIssueAndScheduleForPublication',
	WORKFLOW_SCHEDULE_FOR_PUBLICATION: 'workflowScheduleForPublication',
	WORKFLOW_PREVIEW_PUBLICATION: 'workflowPreviewPublication',
	WORKFLOW_UNSCHEDULE_PUBLICATION: 'workflowUnschedulePublication',
	WORKFLOW_UNPUBLISH_PUBLICATION: 'workflowUnpublishPublication',
	WORKFLOW_CREATE_NEW_VERSION: 'workflowCreateNewVersion',
	WORKFLOW_CHANGE_SUBMISSION_LANGUAGE: 'workflowChangeSubmissionLanguage',
	WORKFLOW_DELETE_SUBMISSION: 'workflowDeleteSubmission',

	// OMP
	WORKFLOW_CHANGE_WORKTYPE: 'workflowChangeWorktype',
};

export function useWorkflowActions() {
	const {t} = useLocalize();

	function workflowViewPublishedSubmission({submission}, finishedCallback) {
		const {redirectToPage} = useUrl(submission.urlPublished);

		redirectToPage();
	}

	/**
	 * TODO: need this anymore ?
	 * Legacy function to assign a publication to an issue.
	 *
	 * NOTE: This function is kept for backward compatibility.
	 * For new implementations, consider using the combined version assignment
	 * and issue assignment functionality in workflowAssignPublicationStage.
	 *
	 * @param {Object} params - Parameters object
	 * @param {Object} params.submission - The submission object
	 * @param {Object} params.selectedPublication - The selected publication
	 * @param {Function} finishedCallback - Callback function to execute when finished
	 */
	function workflowAssignToIssue(
		{submission, selectedPublication},
		finishedCallback,
	) {
		console.log('Legacy workflowAssignToIssue called');
		const {openLegacyModal} = useLegacyGridUrl({
			component: 'modals.publish.AssignToIssueHandler',
			op: 'assign',
			params: {
				submissionId: submission.id,
				publicationId: selectedPublication.id,
			},
		});

		openLegacyModal(
			{
				title: t('publication.selectIssue'),
				closeOnFormSuccessId: pkp.const.FORM_ASSIGN_TO_ISSUE,
			},
			finishedCallback,
		);
	}

	function workflowViewActivityLog({submission}, finishedCallback) {
		const {openLegacyModal} = useLegacyGridUrl({
			component: 'informationCenter.SubmissionInformationCenterHandler',
			op: 'viewInformationCenter',
			params: {
				submissionId: submission.id,
			},
		});
		openLegacyModal({title: t('submission.list.infoCenter')}, finishedCallback);
	}

	function workflowViewLibrary({submission}, finishedCallback) {
		const {openLegacyModal} = useLegacyGridUrl({
			component: 'modals.documentLibrary.documentLibraryHandler',
			op: 'documentLibrary',
			params: {
				submissionId: submission.id,
			},
		});
		openLegacyModal(
			{title: t('grid.libraryFiles.submission.title')},
			finishedCallback,
		);
	}

	/**
	 * Open a modal to assign publication stage and optionally assign to an issue.
	 *
	 * This function combines version assignment with issue assignment in a single modal.
	 * The modal will show:
	 * - Version stage selection (required for unassigned versions)
	 * - Version significance selection (major/minor)
	 * - Issue assignment options (only if issues exist in the journal)
	 *
	 * Issue assignment options include:
	 * - No issue assignment (publish immediately)
	 * - Assign to future issue and publish immediately
	 * - Assign to future issue and schedule only
	 * - Assign to current/back issue (publish immediately)
	 *
	 * @param {Object} params - Parameters object
	 * @param {Object} params.selectedPublication - The selected publication
	 * @param {Object} params.submission - The submission object
	 * @param {Object} params.pageInitConfig - Page initialization config containing issue count
	 * @param {Function} finishedCallback - Callback function to execute when finished
	 */
	function workflowAssignPublicationStage(
		{selectedPublication, submission, pageInitConfig},
		finishedCallback,
	) {
		const {openSideModal, closeSideModal} = useModal();

		function onCloseFn() {
			closeSideModal(WorkflowVersionSideModal);
		}

		// Get issue count from pageInitConfig if available
		// This determines whether to show issue assignment options
		const issueCount = pageInitConfig?.publicationSettings?.countIssues || 0;

		openSideModal(WorkflowVersionSideModal, {
			onCloseFn,
			onSubmitFn: finishedCallback,
			issueCount,
		});
	}

	function workflowAssignToIssueAndScheduleForPublication(
		{pageInitConfig, selectedPublication, submission},
		finishedCallback,
	) {
		const {isOJS} = useApp();

		// if version is unassigned
		// or OJS specific the publication status not to
		// STATUS_READY_TO_PUBLISH or STATUS_READY_TO_SCHEDULE,
		// we need to assign the publication stage and status (for issue or issueless context)
		const requirePublicationStage = isOJS()
			? !selectedPublication.versionStage ||
				![
					pkp.const.STATUS_READY_TO_PUBLISH,
					pkp.const.STATUS_READY_TO_SCHEDULE,
				].includes(selectedPublication.status)
			: !selectedPublication.versionStage;

		// TODO: remove this after testing
		console.log(requirePublicationStage);

		if (requirePublicationStage) {
			return workflowAssignPublicationStage(
				{selectedPublication, submission, pageInitConfig},
				(publicationData) =>
					workflowAssignToIssueAndScheduleForPublication(
						{pageInitConfig, selectedPublication: publicationData, submission},
						finishedCallback,
					),
			);
		}

		workflowScheduleForPublication(
			{submission, selectedPublication},
			finishedCallback,
		);

		// TODO : Rest of the codes are dead code, need cleanup

		// if there are no issues, we can schedule the publication immediately
		// if (pageInitConfig.publicationSettings.countIssues === 0) {
		// 	workflowScheduleForPublication(
		// 		{submission, selectedPublication},
		// 		finishedCallback,
		// 	);

		// 	return;
		// }

		// If the publication is marked as ready to publish,
		// and not assigned to an issue, or assigned to an issue that is not published (e.g. future issue),
		// we can publish the publication immediately as issueless or continuous publication
		// if (
		// 	selectedPublication.status === pkp.const.STATUS_READY_TO_PUBLISH &&
		// 	(selectedPublication.issueId === null ||
		// 		!pageInitConfig.publicationSettings.issuePublishedStatus[
		// 			selectedPublication.issueId
		// 		])
		// ) {
		// 	workflowScheduleForPublication(
		// 		{submission, selectedPublication},
		// 		finishedCallback,
		// 	);
		// 	return;
		// }

		// if (
		// 	selectedPublication.issueId === null ||
		// 	selectedPublication.status === pkp.const.STATUS_READY_TO_PUBLISH
		// ) {
		// 	const {url} = useLegacyGridUrl({
		// 		component: 'modals.publish.AssignToIssueHandler',
		// 		op: 'assign',
		// 		params: {
		// 			submissionId: submission.id,
		// 			publicationId: selectedPublication.id,
		// 		},
		// 	});
		// 	const {openSideModal} = useModal();

		// 	openSideModal(
		// 		'LegacyAjax',
		// 		{
		// 			legacyOptions: {
		// 				title: t('publication.selectIssue'),
		// 				url,
		// 				closeOnFormSuccessId: pkp.const.FORM_ASSIGN_TO_ISSUE,
		// 			},
		// 		},
		// 		{
		// 			onClose: async ({formId, data}) => {
		// 				if (
		// 					data?.issueId ||
		// 					data?.status === pkp.const.STATUS_READY_TO_PUBLISH
		// 				) {
		// 					workflowScheduleForPublication(
		// 						{submission, selectedPublication},
		// 						finishedCallback,
		// 					);
		// 				} else {
		// 					finishedCallback();
		// 				}
		// 			},
		// 		},
		// 	);
		// } else {
		// 	workflowScheduleForPublication(
		// 		{submission, selectedPublication},
		// 		finishedCallback,
		// 	);
		// }
	}

	function workflowScheduleForPublication(
		{submission, selectedPublication},
		finishedCallback,
	) {
		const {openLegacyModal} = useLegacyGridUrl({
			component: 'modals.publish.PublishHandler',
			op: 'publish',
			params: {
				submissionId: submission.id,
				publicationId: selectedPublication.id,
			},
		});

		openLegacyModal(
			{
				title: t('editor.submission.schedulePublication'),
				closeOnFormSuccessId: pkp.const.FORM_PUBLISH,
			},
			finishedCallback,
		);
	}

	function workflowUnschedulePublication(
		{submission, selectedPublication},
		finishedCallback,
	) {
		const {openDialog} = useModal();
		openDialog({
			title: t('publication.unschedule'),
			message: t('publication.unschedule.confirm'),
			actions: [
				{
					label: t('publication.unschedule'),
					isWarnable: true,
					callback: async (close) => {
						const {apiUrl: unschedulePublicationApiUrl} = useUrl(
							`submissions/${submission.id}/publications/${selectedPublication.id}/unpublish`,
						);
						const {fetch} = useFetch(unschedulePublicationApiUrl, {
							method: 'PUT',
						});
						await fetch();
						close();
						finishedCallback();
					},
				},
				{
					label: t('common.cancel'),
					callback: (close) => close(),
				},
			],
			modalStyle: 'negative',
		});
	}

	function workflowUnpublishPublication(
		{submission, selectedPublication},
		finishedCallback,
	) {
		const {openDialog} = useModal();
		openDialog({
			title: t('publication.unpublish'),
			message: t('publication.unpublish.confirm'),
			actions: [
				{
					label: t('publication.unpublish'),
					isWarnable: true,
					callback: async (close) => {
						const {apiUrl: unschedulePublicationApiUrl} = useUrl(
							`submissions/${submission.id}/publications/${selectedPublication.id}/unpublish`,
						);
						const {fetch} = useFetch(unschedulePublicationApiUrl, {
							method: 'PUT',
						});
						await fetch();
						close();
						finishedCallback();
					},
				},
				{
					label: t('common.cancel'),
					callback: (close) => close(),
				},
			],
			modalStyle: 'negative',
		});
	}

	function workflowCreateNewVersion() {
		const {openDialog, closeDialog} = useModal();

		openDialog({
			title: t('publication.createVersion'),
			bodyComponent: WorkflowVersionDialogBody,
			bodyProps: {
				mode: 'createNewVersion',
				displayDefaultFooter: false,
				onCloseFn: () => closeDialog(),
			},
			showCloseButton: false,
			modalStyle: 'basic',
		});
	}

	function workflowPreviewPublication({selectedPublication}) {
		const {redirectToPage} = useUrl(selectedPublication.urlPublished);

		redirectToPage();
	}

	function workflowChangeSubmissionLanguage({submission}) {
		const {openSideModal} = useModal();
		openSideModal(WorkflowModalChangeSubmissionLanguage, {
			publicationId: submission.currentPublicationId,
			submissionId: submission.id,
		});
	}

	function workflowDeleteSubmission({submission, store}) {
		const {apiUrl} = useUrl(`_submissions/${submission.id}`);
		const {fetch: fetchDelete} = useFetch(apiUrl, {method: 'DELETE'});
		const {openDialog} = useModal();

		openDialog({
			title: t('common.delete'),
			message: t('editor.submissionArchive.confirmDelete'),
			actions: [
				{
					label: t('common.confirm'),
					isPrimary: true,
					callback: async (close) => {
						await fetchDelete();
						close();
						store.closeWorkflowModal();
					},
				},
				{
					label: t('common.cancel'),
					isWarnable: true,
					callback: (close) => close(),
				},
			],
			modalStyle: 'negative',
		});
	}

	// OMP - might be moved to separate file
	async function workflowChangeWorktype(
		{submission, workType},
		finishedCallback,
	) {
		const {apiUrl} = useUrl(`submissions/${submission.id}`);

		const {fetch} = useFetch(apiUrl, {method: 'PUT', body: {workType}});

		await fetch();

		finishedCallback();
	}

	return {
		workflowViewPublishedSubmission,
		workflowAssignToIssue,
		workflowViewActivityLog,
		workflowViewLibrary,
		workflowAssignToIssueAndScheduleForPublication,
		workflowScheduleForPublication,
		workflowUnschedulePublication,
		workflowCreateNewVersion,
		workflowUnpublishPublication,
		workflowPreviewPublication,
		workflowChangeSubmissionLanguage,
		workflowDeleteSubmission,
		// OMP
		workflowChangeWorktype,
	};
}
