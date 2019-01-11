<template>
	<div class="pkpListPanel pkpListPanel--select pkpListPanel--selectSubmissions" :class="classStatus">
		<div class="pkpListPanel__header -pkpClearfix">
			<div class="pkpListPanel__title">
				{{ i18n.title }}
				<span v-if="isLoading" class="pkpSpinner" aria-hidden="true"></span>
			</div>
			<list-panel-search
				@searchPhraseChanged="setSearchPhrase"
				:searchPhrase="searchPhrase"
				:i18n="i18n"
			/>
		</div>
		<div class="pkpListPanel__body -pkpClearfix">
			<select-list-panel-select-all
				v-if="showSelectAll"
				:label="i18n.selectAllLabel"
				:checked="selectAllChecked"
				@toggle="toggleSelectAll"
			/>
			<div class="pkpListPanel__content">
				<ul class="pkpListPanel__items" aria-live="polite">
					<select-submissions-list-item
						v-for="item in items"
						:key="item.id"
						:item="item"
						:i18n="i18n"
						:inputName="inputName"
						:selected="selected"
						@toggle="toggleItemSelection"
					/>
				</ul>
			</div>
		</div>
		<div class="pkpListPanel__footer -pkpClearfix">
			<list-panel-load-more
				v-if="canLoadMore"
				@loadMore="loadMore"
				:isLoading="isLoading"
				:i18n="i18n"
			/>
			<list-panel-count
				:count="itemCount"
				:total="this.itemsMax"
				:i18n="i18n"
			/>
		</div>
	</div>
</template>

<script>
import SelectListPanel from '@/components/SelectListPanel/SelectListPanel.vue';
import SelectSubmissionsListItem from '@/components/SelectListPanel/submissions/SelectSubmissionsListItem.vue';
import ListPanelSearch from '@/components/ListPanel/ListPanelSearch.vue';
import ListPanelCount from '@/components/ListPanel/ListPanelCount.vue';
import ListPanelLoadMore from '@/components/ListPanel/ListPanelLoadMore.vue';
import SubmissionsListListeners from '@/mixins/ListPanel/submissions/listeners.js';

export default {
	extends: SelectListPanel,
	name: 'SelectSubmissionsListPanel',
	mixins: [SubmissionsListListeners],
	components: {
		ListPanelSearch,
		ListPanelCount,
		ListPanelLoadMore,
		SelectSubmissionsListItem
	},
	data: function() {
		return {
			inputName: '',
			showSelectAll: true
		};
	}
};
</script>
