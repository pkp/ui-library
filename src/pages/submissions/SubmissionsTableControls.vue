<template>
	<div id="table-controls" class="submissions__list__controls">
		<ButtonRow>
			<template #end>
				<pkp-button @click="$emit('openFiltersModal')">
					{{ t('common.filter') }}
				</pkp-button>
				<span v-if="isLoadingSubmissions">
					<spinner></spinner>
					{{ t('common.loading') }}
				</span>
			</template>
			<Search
				:search-phrase="searchPhrase"
				:search-label="t('editor.submission.search')"
				@search-phrase-changed="
					(...args) => $emit('searchPhraseChange', ...args)
				"
			></Search>
		</ButtonRow>
		<div v-if="activeFiltersList.length" class="submissions__list__filters">
			<Badge
				v-for="filter in activeFiltersList"
				:key="filter.name + filter.value"
			>
				<strong>{{ filter.name }}:</strong>
				{{ filter.value }}
			</Badge>
			<pkpButton
				:is-warnable="true"
				:is-link="true"
				@set="(...args) => $emit('clearFilters', ...args)"
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
	props: {
		isLoadingSubmissions: Boolean,
		activeFiltersList: {type: Object, required: true},
	},
	emits: ['openFiltersModal', 'clearFilters', 'searchPhraseChange'],
};
</script>
