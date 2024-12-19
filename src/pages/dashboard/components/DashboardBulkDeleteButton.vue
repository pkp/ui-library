<template>
	<PkpButton
		v-if="store.bulkDeleteSelectionEnabled"
		:is-disabled="store.bulkDeleteSelectedItems.length === 0"
		:is-warnable="true"
		@click="() => store.bulkDeleteActionDelete()"
	>
		{{ t('dashboard.submissions.incomplete.bulkDelete.button') }}
	</PkpButton>
	<PkpButton
		v-if="store.bulkDeleteSelectionEnabled"
		:is-warnable="true"
		@click="() => store.bulkDeleteSelectionDisable()"
	>
		{{ t('common.cancel') }}
	</PkpButton>
</template>

<script setup>
import PkpButton from '@/components/Button/Button.vue';
import {useLocalize} from '@/composables/useLocalize';
import {useDashboardPageStore} from '../dashboardPageStore';

const store = useDashboardPageStore();
const {t} = useLocalize();
</script>
