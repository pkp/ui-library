<template>
	<TableCell>
		<PkpButton
			v-if="showButton"
			class="-ms-3"
			:aria-describedby="'submission-title-' + item.id"
			:is-link="true"
			@click="handleAction"
		>
			{{ t('common.view') }}
		</PkpButton>
	</TableCell>
</template>
<script setup>
import {defineProps, computed} from 'vue';
import PkpButton from '@/components/Button/Button.vue';
import TableCell from '@/components/Table/TableCell.vue';
import {useCurrentUser} from '@/composables/useCurrentUser';

import {
	DashboardPageTypes,
	useDashboardPageStore,
} from '@/pages/dashboard/dashboardPageStore.js';

const {
	hasCurrentUserAtLeastOneAssignedRoleInAnyStage,
	isCurrentUserAssignedAsReviewer,
} = useCurrentUser();

const props = defineProps({
	item: {type: Object, required: true},
});

const showButton = computed(() => {
	if (props.item.submissionProgress) {
		return false;
	}

	if (
		dashboardPageStore.dashboardPage === DashboardPageTypes.EDITORIAL_DASHBOARD
	) {
		// Don't show View button, when being author/reviewer on editorial dashboard while not being explicitely assigned to editorial role

		const isCurrentUserAssignedAsAuthorOrReviewer =
			isCurrentUserAssignedAsReviewer(props.item) ||
			hasCurrentUserAtLeastOneAssignedRoleInAnyStage(props.item, [
				pkp.const.ROLE_ID_AUTHOR,
			]);
		if (
			isCurrentUserAssignedAsAuthorOrReviewer &&
			!hasCurrentUserAtLeastOneAssignedRoleInAnyStage(props.item, [
				pkp.const.ROLE_ID_MANAGER,
				pkp.const.ROLE_ID_SUB_EDITOR,
				pkp.const.ROLE_ID_ASSISTANT,
			])
		) {
			return false;
		}
	}

	return true;
});
function handleAction() {
	dashboardPageStore.openWorkflowModal(props.item.id);
}

const dashboardPageStore = useDashboardPageStore();
</script>
