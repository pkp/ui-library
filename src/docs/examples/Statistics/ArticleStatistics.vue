<template>
	<div class="pkpStatistics">
		<page-header>
			{{ i18n.pageTitle }}
			<span v-if="isLoading" class="pkpSpinner" aria-hidden="true"></span>
			<template slot="actions">
				<pkp-button :label="i18n.dateRange" icon="calendar" />
				<pkp-button
					:label="i18n.filter"
					icon="filter"
					:isActive="isFilterVisible"
					@click="toggleFilter"
				/>
			</template>
		</page-header>
		<div class="pkpStatistics__container">
			<list-panel-filter
				:isVisible="isFilterVisible"
				:filters="filters"
				:activeFilters="activeFilters"
				:i18n="i18n"
				@filterList="updateFilter"
			/>
			<div class="pkpStatistics__main">
				<div class="pkpStatistics__graph">
					Graph
				</div>
				<div class="pkpStatistics__table">
					<div class="pkpStatistics__tableHeader">
						<h2 class="pkpStatistics__tableTitle" id="articleDetailTableLabel">
							{{ i18n.tableTitle }}
							<span v-if="isLoading" class="pkpSpinner" aria-hidden="true"></span>
						</h2>
						<div class="pkpStatistics__tableActions">
							<div class="pkpStatistics__itemsOfTotal">
								{{ __('itemsOfTotal', { count: currentRows.length, total: stats.length }) }}
								<a
								v-if="currentRows.length < stats.length"
								href="#articleDetailTablePagination"
								class="-screenReader"
								>
									{{ i18n.goToPagination }}
								</a>
							</div>
						</div>
					</div>
					<pkp-table
						labelledBy="articleDetailTableLabel"
						:columns="tableColumns"
						:rows="currentRows"
					>
						<tr slot="header">
							<th v-for="column in tableColumns"
								:key="column.name"
								scope="col"
							>
								{{ column.label }}
								<list-panel-search
									v-if="column.name === 'title'"
									:searchPhrase="searchPhrase"
									:i18n="i18n"
									@searchPhraseChanged="setSearchPhrase"
								/>
							</th>
						</tr>
					</pkp-table>
					<pagination
						id="articleDetailTablePagination"
						:currentPage="currentPage"
						:lastPage="lastPage"
						:i18n="i18n"
						@setPage="setPage"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import Statistics from '@/components/Statistics/Statistics.vue';
import articleStats from '../Table/helpers/articleStats.js';
import articleStatsColumns from '../Table/helpers/articleStatsColumns.js';

export default {
	extends: Statistics,
	data: function () {
		return {
			stats: articleStats,
			tableColumns: articleStatsColumns.filter(col => !['id', 'author'].includes(col.name)),
			currentPage: 1,
			perPage: 10,
			searchPhrase: '',
			filters: {
				example: {
					heading: 'Sections',
					filters: [
						{
							title: 'Articles',
							param: 'sectionIds',
							val: 1,
						},
						{
							title: 'Reviews',
							param: 'sectionIds',
							val: 2,
						},
						{
							title: 'Editorials',
							param: 'sectionIds',
							val: 3,
						},
					],
				},
			},
			originalStats: [],
			i18n: {
				dateRange: 'Date Range Placeholder',
				filter: 'Filter',
				filterRemove: 'Clear filter: {$filterTitle}',
				pageTitle: 'Articles',
				tableTitle: 'Article Details',
				itemsOfTotal: '{$count} of {$total} articles',
				goToPagination: 'Go to other pages',
				paginationLabel: 'Other pages of this example component',
				goToLabel: 'Go to {$page}',
				pageLabel: 'Page {$page}',
				nextPageLabel: 'Next page',
				previousPageLabel: 'Previous page',
				search: 'Search by title, author and ID',
				clearSearch: 'Clear search phrase',
			},
		};
	},
	methods: {
		get: function () {
			this.isLoading = true;

			console.log('get', {
				activeFilters: this.activeFilters,
				searchPhrase: this.searchPhrase,
			});

			setTimeout(() => {

				if (!this.originalStats.length) {
					this.originalStats = [...this.stats];
				}

				this.stats = this.originalStats.filter(row => {
					if (this.searchPhrase) {
						if (!row.object.fullTitle.en_US.includes(this.searchPhrase) &&
								row.object.id != this.searchPhrase &&
								!row.object.authorString.includes(this.searchPhrase)) {
							return false;
						}
					}
					if (this.activeFilters.sectionIds && this.activeFilters.sectionIds.length) {
						return this.activeFilters.sectionIds.includes(row.object.sectionId);
					}
					return true;
				});

				this.isLoading = false;
			}, 1000);
		},
	},
};
</script>
