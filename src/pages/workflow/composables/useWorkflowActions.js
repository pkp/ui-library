import {useModal} from '@/composables/useModal';
import {useLocalize} from '@/composables/useLocalize';

import {useUrl} from '@/composables/useUrl';
import {useFetch} from '@/composables/useFetch';
import {useLegacyGridUrl} from '@/composables/useLegacyGridUrl';

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

	function workflowAssignToIssue(
		{submission, selectedPublication},
		finishedCallback,
	) {
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

	function workflowAssignPublicationStage(
		{selectedPublication, submission},
		finishedCallback,
	) {
		const {openSideModal, closeSideModal} = useModal();

		function onCloseFn() {
			closeSideModal(WorkflowVersionSideModal);
		}

		openSideModal(WorkflowVersionSideModal, {
			onCloseFn,
			onSubmitFn: finishedCallback,
		});
	}

	function workflowAssignToIssueAndScheduleForPublication(
		{selectedPublication, submission},
		finishedCallback,
	) {
		// if version is unassigned, we need to assign it to a publication stage first
		if (!selectedPublication.versionStage) {
			return workflowAssignPublicationStage(
				{selectedPublication, submission},
				(publicationData) =>
					workflowAssignToIssueAndScheduleForPublication(
						{submission, selectedPublication: publicationData},
						finishedCallback,
					),
			);
		}

		if (selectedPublication.issueId === null) {
			const {url} = useLegacyGridUrl({
				component: 'modals.publish.AssignToIssueHandler',
				op: 'assign',
				params: {
					submissionId: submission.id,
					publicationId: selectedPublication.id,
				},
			});
			const {openSideModal} = useModal();

			openSideModal(
				'LegacyAjax',
				{
					legacyOptions: {
						title: t('publication.selectIssue'),
						url,
						closeOnFormSuccessId: pkp.const.FORM_ASSIGN_TO_ISSUE,
					},
				},
				{
					onClose: async ({formId, data}) => {
						if (data?.issueId) {
							workflowScheduleForPublication(
								{submission, selectedPublication},
								finishedCallback,
							);
						} else {
							finishedCallback();
						}
					},
				},
			);
		} else {
			workflowScheduleForPublication(
				{submission, selectedPublication},
				finishedCallback,
			);
		}
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
