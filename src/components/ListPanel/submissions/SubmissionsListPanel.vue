<template>
	<div class="pkpListPanel pkpListPanel--submissions" :class="classStatus">
		<div class="pkpListPanel__header">
			<div class="pkpListPanel__title">{{ i18n.title }}</div>
			<ul class="pkpListPanel__actions">
				<li>
					<a :href="addUrl" class="pkpButton">{{ i18n.add }}</a>
				</li>
			</ul>
			<list-panel-search
				@searchPhraseChanged="setSearchPhrase"
				:searchPhrase="searchPhrase"
				:i18n="i18n"
			/>
		</div>
		<ul class="pkpListPanel__items" aria-live="polite">
			<submissions-list-item
				v-for="item in collection.items"
				:key="item.id"
				:item="item"
				:i18n="i18n"
				:apiPath="apiPath"
				:infoUrl="infoUrl"
			/>
		</ul>
		<div class="pkpListPanel__footer">
			<list-panel-load-more
				v-if="canLoadMore"
				@loadMore="loadMore"
				:isLoading="isLoading"
				:i18n="i18n"
			/>
			<list-panel-count
				:count="itemCount"
				:total="this.collection.maxItems"
				:i18n="i18n"
			/>
		</div>
	</div>
</template>

<script>
import ListPanel from './../ListPanel.vue';
import ListPanelSearch from './../ListPanelSearch.vue';
import ListPanelCount from './../ListPanelCount.vue';
import ListPanelLoadMore from './../ListPanelLoadMore.vue';
import SubmissionsListItem from './SubmissionsListItem.vue';

export default {
	extends: ListPanel,
	name: 'SubmissionsListPanel',
	components: {
		ListPanelSearch,
		ListPanelCount,
		ListPanelLoadMore,
		SubmissionsListItem,
	},
	data: function () {
		return {
			addUrl: '',
			infoUrl: '',
		};
	},
	mounted: function () {
		// Store a reference to this component for global event callbacks
		var self = this;

		// Refresh the list when a submission is updated in any way
		pkp.eventBus.$on('submissionUpdated', function (data) {
			self.get();
		});

		// Remove a submission from the list when it is deleted
		pkp.eventBus.$on('submissionDeleted', function (data) {
			if ('id' in data === false || !self.collection.items.find(item => item.id === data.id)) {
				return;
			}
			self.collection.items = self.collection.items.filter(item => {
				return item.id !== data.id;
			});
			self.collection.maxItems--;
		});
	},
};
</script>
