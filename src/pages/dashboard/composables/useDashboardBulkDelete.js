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

	// Display only for admins on editorial dashboard and for author dashboard, where user can delete own submissions
	const bulkDeleteDisplayDeleteButton = computed(() => {
		if (
			dashboardPage === DashboardPageTypes.EDITORIAL_DASHBOARD &&
			hasCurrentUserAtLeastOneRole([pkp.const.ROLE_ID_SITE_ADMIN])
		) {
			return true;
		} else if (dashboardPage === DashboardPageTypes.MY_SUBMISSIONS) {
			return true;
		}

		return false;
	});

	const bulkDeleteEnabled = ref(false);
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

	function bulkDeleteToggleEnabled() {
		bulkDeleteEnabled.value = !bulkDeleteEnabled.value;
	}

	const {
		hasCurrentUserAtLeastOneAssignedRoleInAnyStage,
		hasCurrentUserAtLeastOneRole,
	} = useCurrentUser();

	function canBeDeleted(submission) {
		// incomplete submission can be deleted by author of the submission or admin
		if (submission.submissionProgress)
			if (
				hasCurrentUserAtLeastOneRole([pkp.const.ROLE_ID_SITE_ADMIN]) ||
				hasCurrentUserAtLeastOneAssignedRoleInAnyStage(submission, [
					pkp.const.ROLE_ID_AUTHOR,
				])
			) {
				return true;
			}

		return false;
	}

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
		bulkDeleteEnabled.value = false;
	}

	function bulkDeleteActionDelete() {
		const {openDialog} = useModal();
		openDialog({
			title: t('admin.submissions.incomplete.bulkDelete.confirm'),
			message: t('admin.submissions.incomplete.bulkDelete.body'),
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
						close();
					},
				},
			],
			modalStyle: 'negative',
			close: () => {},
		});
	}

	return {
		bulkDeleteDisplayDeleteButton,
		bulkDeleteEnabled,
		bulkDeleteToggleEnabled,

		bulkDeleteSelectedItems,
		bulkDeleteSelectItem,
		bulkDeleteDeselectItem,
		bulkDeleteResetSelection,
		bulkDeleteActionDelete,

		bulkDeleteSubmissionIdsCanBeDeleted,
	};
}
