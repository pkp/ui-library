<template>
	<div class="pkpListPanel pkpListPanel--select pkpListPanel--selectSubmissions" :class="classStatus">
		<div class="pkpListPanel__header">
			<div class="pkpListPanel__title">{{ i18n.title }}</div>
			<list-panel-search
				@searchPhraseChanged="setSearchPhrase"
				:searchPhrase="searchPhrase"
				:i18n="i18n"
			/>
		</div>
		<ul class="pkpListPanel__items" aria-live="polite">
			<select-submissions-list-item
				v-for="item in collection.items"
				:key="item.id"
				:item="item"
				:i18n="i18n"
				:inputName="inputName"
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
import SelectListPanel from '../SelectListPanel.vue';
import SelectSubmissionsListItem from './SelectSubmissionsListItem.vue';
import ListPanelSearch from './../../ListPanel/ListPanelSearch.vue';
import SubmissionsListListeners from './../../../mixins/ListPanel/submissions/listeners.js';

export default {
	extends: SelectListPanel,
	name: 'SelectSubmissionsListPanel',
	mixins: [SubmissionsListListeners],
	components: {
		ListPanelSearch,
		SelectSubmissionsListItem,
	},
	data: function () {
		return {
			inputName: '',
		};
	},
};
</script>
