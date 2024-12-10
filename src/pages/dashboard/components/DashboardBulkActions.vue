<template>
	<DropdownActions
		v-if="actions.length"
		:label="t('common.moreActions')"
		:display-as-ellipsis="true"
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

	if (dashboardStore.bulkDeleteDisplayDeleteButton) {
		_actions.push({
			label: t('admin.submissions.incomplete.bulkDelete.button'),
			name: 'bulkDeleteSelectionEnable',
			isWarnable: true,
			icon: 'Cancel',
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
