<template>
	<SideModalBody>
		<template #header>
			<h2>{{ t('common.filter') }}</h2>
		</template>
		<Panel>
			<PanelSection>
				<pkp-form
					v-bind="submissionsStore.filtersForm"
					@set="submissionsStore.setFiltersForm"
					@success="submissionsStore.saveFilters"
				></pkp-form>
			</PanelSection>
		</Panel>
	</SideModalBody>
</template>

<script>
import {mapStores} from 'pinia';

import SideModalBody from '@/components/Modal/SideModalBody.vue';
import Panel from '@/components/Panel/Panel.vue';
import PanelSection from '@/components/Panel/PanelSection.vue';

import {useSubmissionsStore} from '@/pages/submissions/submissionsStore';

export default {
	components: {SideModalBody, Panel, PanelSection},
	computed: {...mapStores(useSubmissionsStore)},
};
</script>
