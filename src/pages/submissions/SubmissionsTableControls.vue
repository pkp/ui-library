<template>
	<div id="table-controls" class="mb-2">
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
					(...args) => $emit('searchPhraseChanged', ...args)
				"
			></Search>
		</ButtonRow>
		<div v-if="activeFiltersList.length" class="flex items-center gap-1">
			<Badge
				v-for="filter in activeFiltersList"
				:key="filter.fieldLabel + filter.label"
			>
				<strong>{{ filter.fieldLabel }}:</strong>
				{{ filter.label }}
			</Badge>
			<pkpButton
				:is-warnable="true"
				:is-link="true"
				@click="(...args) => $emit('clearFilters', ...args)"
			>
				{{ t('common.filtersClear') }}
			</pkpButton>
		</div>
	</div>
</template>

<script>
import ButtonRow from '@/components/ButtonRow/ButtonRow.vue';
import Search from '@/components/Search/Search.vue';
import PkpButton from '@/components/Button/Button.vue';

export default {
	components: {ButtonRow, Search, PkpButton},
	props: {
		searchPhrase: {type: String, required: true},
		isLoadingSubmissions: Boolean,
		activeFiltersList: {type: Object, required: true},
	},
	emits: ['openFiltersModal', 'clearFilters', 'searchPhraseChanged'],
};
</script>
