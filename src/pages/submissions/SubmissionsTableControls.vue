<template>
	<div id="table-controls" class="submissions__list__controls">
		<ButtonRow>
			<template #end>
				<pkp-button @click="submissionsStore.openFiltersModal">
					{{ t('common.filter') }}
				</pkp-button>
				<span v-if="submissionsStore.isLoadingSubmissions">
					<spinner></spinner>
					{{ t('common.loading') }}
				</span>
			</template>
			<Search
				:search-phrase="submissionsStore.searchPhrase"
				:search-label="t('editor.submission.search')"
				@search-phrase-changed="submissionsStore.setSearchPhrase"
			></Search>
		</ButtonRow>
		<div
			v-if="submissionsStore.activeFiltersList.length"
			class="submissions__list__filters"
		>
			<Badge
				v-for="filter in submissionsStore.activeFiltersList"
				:key="filter.name + filter.value"
			>
				<strong>{{ filter.name }}:</strong>
				{{ filter.value }}
			</Badge>
			<pkpButton
				:is-warnable="true"
				:is-link="true"
				@click="submissionsStore.clearFilters"
			>
				{{ t('common.filtersClear') }}
			</pkpButton>
		</div>
	</div>
</template>

<script>
import ButtonRow from '@/components/ButtonRow/ButtonRow.vue';
import Search from '@/components/Search/Search.vue';
import {useSubmissionsStore} from '@/pages/submissions/submissionsStore';
import {mapStores} from 'pinia';

export default {
	components: {ButtonRow, Search},
	computed: {...mapStores(useSubmissionsStore)},
};
</script>
