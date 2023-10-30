<template>
	<div id="table-controls" class="submissions__list__controls">
		<ButtonRow>
			<template #end>
				<pkp-button @click="$store.submissions.openFiltersModal">
					{{ t('common.filter') }}
				</pkp-button>
				<span v-if="$store.submissions.isLoadingSubmissions">
					<spinner></spinner>
					{{ t('common.loading') }}
				</span>
			</template>
			<Search
				:search-phrase="$store.submissions.searchPhrase"
				:search-label="t('editor.submission.search')"
				@search-phrase-changed="$store.submissions.setSearchPhrase"
			></Search>
		</ButtonRow>
		<div
			v-if="$store.submissions.activeFiltersList.length"
			class="submissions__list__filters"
		>
			<Badge
				v-for="filter in $store.submissions.activeFiltersList"
				:key="filter.name + filter.value"
			>
				<strong>{{ filter.name }}:</strong>
				{{ filter.value }}
			</Badge>
			<pkpButton
				:is-warnable="true"
				:is-link="true"
				@click="$store.submissions.clearFilters"
			>
				{{ t('common.filtersClear') }}
			</pkpButton>
		</div>
	</div>
</template>

<script>
import ButtonRow from '@/components/ButtonRow/ButtonRow.vue';
import Search from '@/components/Search/Search.vue';

export default {
	components: {ButtonRow, Search},
};
</script>
