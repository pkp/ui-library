<template>
	<PkpButton
		v-if="store.bulkDeleteDisplayDeleteButton"
		:is-disabled="store.bulkDeleteSubmissionIdsCanBeDeleted.length === 0"
		:is-active="
			store.bulkDeleteEnabled && store.bulkDeleteSelectedItems.length === 0
		"
		:is-warnable="!!store.bulkDeleteSelectedItems.length"
		@click="
			() =>
				store.bulkDeleteSelectedItems.length
					? store.bulkDeleteActionDelete()
					: store.bulkDeleteToggleEnabled()
		"
	>
		{{ t('admin.submissions.incomplete.bulkDelete.button') }}
	</PkpButton>
</template>

<script setup>
import PkpButton from '@/components/Button/Button.vue';
import {useLocalize} from '@/composables/useLocalize';
import {useDashboardPageStore} from '../dashboardPageStore';

const store = useDashboardPageStore();
const {t} = useLocalize();
</script>
