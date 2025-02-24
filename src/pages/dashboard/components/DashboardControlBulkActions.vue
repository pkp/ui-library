<template>
	<DropdownActions
		v-if="actions.length"
		:label="t('common.moreActions')"
		button-variant="ellipsis"
		:actions="actions"
		direction="right"
		@action="handleAction"
	/>
</template>
<script setup>
import {computed} from 'vue';
import DropdownActions from '@/components/DropdownActions/DropdownActions.vue';
import {useLocalize} from '@/composables/useLocalize';

const {t} = useLocalize();

const actions = computed(() => {
	const _actions = [];

	if (dashboardStore.bulkDeleteIsAvailableForUser) {
		_actions.push({
			label: t('dashboard.submissions.incomplete.bulkDelete.button'),
			name: 'bulkDeleteSelectionEnable',
			isWarnable: true,
			icon: 'Cancel',
			disabled: dashboardStore.bulkDeleteSubmissionIdsCanBeDeleted.length === 0,
		});
	}

	return _actions;
});

import {useDashboardPageStore} from '../dashboardPageStore';

const dashboardStore = useDashboardPageStore();

function handleAction(actionName, actionArgs = {}) {
	dashboardStore[actionName](actionArgs);
}
</script>
