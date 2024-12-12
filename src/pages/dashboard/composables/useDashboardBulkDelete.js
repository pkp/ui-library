import {ref, computed} from 'vue';

import {useCurrentUser} from '@/composables/useCurrentUser';
import {useFetch} from '@/composables/useFetch';
import {useUrl} from '@/composables/useUrl';
import {useModal} from '@/composables/useModal';
import {useLocalize} from '@/composables/useLocalize';
import {DashboardPageTypes} from '../dashboardPageStore';

export function useDashboardBulkDelete({
	submissions,
	dashboardPage,
	onSubmissionDeleteCallback,
}) {
	const {t} = useLocalize();

	/**
	 * Enabling the checkboxes to select submissions to be deleted
	 * */
	const bulkDeleteSelectionEnabled = ref(false);
	function bulkDeleteSelectionEnable() {
		bulkDeleteSelectionEnabled.value = true;
	}

	function bulkDeleteSelectionDisable() {
		bulkDeleteSelectionEnabled.value = false;
	}

	/**
	 * Managing the list of selected items
	 * */
	const bulkDeleteSelectedItems = ref([]);
	function bulkDeleteSelectItem(submissionId) {
		if (!bulkDeleteSelectedItems.value.includes(submissionId)) {
			bulkDeleteSelectedItems.value.push(submissionId);
		}
	}

	function bulkDeleteDeselectItem(submissionId) {
		bulkDeleteSelectedItems.value = bulkDeleteSelectedItems.value.filter(
			(id) => id !== submissionId,
		);
	}

	/**
	 * Permissions
	 * */
	const {
		hasCurrentUserAtLeastOneAssignedRoleInAnyStage,
		hasCurrentUserAtLeastOneRole,
	} = useCurrentUser();

	function canBeDeleted(submission) {
		// incomplete submission can be deleted by author of the submission or admin
		if (submission.submissionProgress)
			if (
				hasCurrentUserAtLeastOneRole([
					pkp.const.ROLE_ID_SITE_ADMIN,
					pkp.const.ROLE_ID_MANAGER,
				]) ||
				hasCurrentUserAtLeastOneAssignedRoleInAnyStage(submission, [
					pkp.const.ROLE_ID_AUTHOR,
				])
			) {
				return true;
			}

		return false;
	}

	const bulkDeleteIsAvailableForUser = computed(() => {
		if (
			dashboardPage === DashboardPageTypes.EDITORIAL_DASHBOARD &&
			hasCurrentUserAtLeastOneRole([
				pkp.const.ROLE_ID_SITE_ADMIN,
				pkp.const.ROLE_ID_MANAGER,
			])
		) {
			return true;
		} else if (dashboardPage === DashboardPageTypes.MY_SUBMISSIONS) {
			return true;
		}
		return false;
	});

	const bulkDeleteSubmissionIdsCanBeDeleted = computed(() => {
		const submissionIds = [];
		if (submissions.value && submissions.value?.length) {
			submissions.value.forEach((submission) => {
				if (canBeDeleted(submission)) {
					submissionIds.push(submission.id);
				}
			});
		}
		return submissionIds;
	});

	async function apiCall() {
		const {apiUrl} = useUrl(`_submissions`);
		const {fetch} = useFetch(apiUrl, {
			query: {ids: bulkDeleteSelectedItems.value},
			method: 'DELETE',
		});

		await fetch();

		bulkDeleteResetSelection();
		onSubmissionDeleteCallback();
	}

	function bulkDeleteResetSelection() {
		bulkDeleteSelectedItems.value = [];
		bulkDeleteSelectionEnabled.value = false;
	}

	function bulkDeleteActionDelete() {
		const {openDialog} = useModal();
		openDialog({
			title: t('dashboard.submissions.incomplete.bulkDelete.confirm'),
			message: t('dashboard.submissions.incomplete.bulkDelete.body'),
			actions: [
				{
					label: t('common.confirm'),
					isPrimary: true,
					callback: async (close) => {
						await apiCall();
						close();
					},
				},
				{
					label: t('common.cancel'),
					isWarnable: true,
					callback: (close) => {
						bulkDeleteResetSelection();
						close();
					},
				},
			],
			modalStyle: 'negative',
			close: () => {},
		});
	}

	return {
		bulkDeleteIsAvailableForUser,
		bulkDeleteSelectionEnabled,
		bulkDeleteSelectionEnable,
		bulkDeleteSelectionDisable,
		bulkDeleteSelectedItems,
		bulkDeleteSelectItem,
		bulkDeleteDeselectItem,
		bulkDeleteResetSelection,
		bulkDeleteActionDelete,

		bulkDeleteSubmissionIdsCanBeDeleted,
	};
}
