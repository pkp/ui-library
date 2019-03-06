<template>
	<!-- Use the v-bind syntax to bind all props at once. -->
	<div class="pkpListPanel pkpListPanel--submissions" :class="classes">
		<pkp-header>
			{{ title }}
			<template slot="actions">
				<search
					:searchPhrase="searchPhrase"
					:searchLabel="i18n.search"
					:clearSearchLabel="i18n.clearSearch"
					@searchPhraseChanged="setSearchPhrase"
				/>
				<pkp-button
					v-if="currentUserCanFilter"
					:isActive="isSidebarVisible"
					icon="filter"
					:label="i18n.filter"
					@click="toggleSidebar"
				/>
				<pkp-button
					v-if="currentUserCanAddSubmission"
					element="a"
					:href="addUrl"
					:label="i18n.add"
				/>
			</template>
		</pkp-header>
		<div class="pkpListPanel__body -pkpClearfix">
			<div v-if="filters.length" class="pkpListPanel__sidebar" :class="{'-isVisible': isSidebarVisible}">
				<div v-for="(filterSet, index) in filters" :key="index" class="pkpListPanel__filterSet">
					<pkp-header v-if="filterSet.heading">
						{{ filterSet.heading }}
					</pkp-header>
					<pkp-filter
						v-for="filter in filterSet.filters"
						:key="filter.param + filter.value"
						v-bind="filter"
						:isFilterActive="isFilterActive(filter.param, filter.value)"
						:i18n="i18n"
						@add-filter="addFilter"
						@remove-filter="removeFilter"
					/>
				</div>
			</div>
			<div class="pkpListPanel__content" aria-live="polite">
				<template v-if="items.length">
					<submissions-list-item
						v-for="item in items"
						:key="item.id"
						:item="item"
						:i18n="i18n"
						:apiUrl="apiUrl"
						:infoUrl="infoUrl"
						:assignParticipantUrl="assignParticipantUrl"
						:csrfToken="csrfToken"
						@addFilter="addFilter"
					/>
				</template>
				<div v-else class="pkpListPanel__empty">
					{{ i18n.empty }}
				</div>
			</div>
		</div>
		<div v-if="lastPage > 1" class="pkpListPanel__footer">
			<pagination
				:currentPage="currentPage"
				:lastPage="lastPage"
				:i18n="i18n"
				@set-page="setPage"
			/>
		</div>
	</div>
</template>

<script>
import PkpButton from '@/components/Button/Button.vue';
import Search from '@/components/Search/Search.vue';
import ListPanel from '@/components/ListPanel/ListPanel.vue';
import SubmissionsListItem from '@/components/ListPanel/submissions/SubmissionsListItem.vue';
import SubmissionsListListeners from '@/mixins/ListPanel/submissions/listeners.js';

export default {
	extends: ListPanel,
	mixins: [SubmissionsListListeners],
	components: {
		PkpButton,
		Search,
		SubmissionsListItem
	},
	props: {
		addUrl: {
			type: String,
			required: true
		},
		infoUrl: {
			type: String,
			required: true
		},
		assignParticipantUrl: {
			type: String,
			default() {
				return '';
			}
		},
		csrfToken: {
			type: String,
			required: true
		}
	},
	computed: {
		/**
		 * Can the current user filter the list?
		 */
		currentUserCanFilter: function() {
			return pkp.userHasRole([
				pkp.const.ROLE_ID_MANAGER,
				pkp.const.ROLE_ID_SUB_EDITOR,
				pkp.const.ROLE_ID_ASSISTANT
			]);
		},

		/**
		 * Does the current user have a role which can create a new submission?
		 */
		currentUserCanAddSubmission: function() {
			return pkp.userHasRole([
				pkp.const.ROLE_ID_MANAGER,
				pkp.const.ROLE_ID_SUB_EDITOR,
				pkp.const.ROLE_ID_ASSISTANT,
				pkp.const.ROLE_ID_AUTHOR
			]);
		}
	}
};
</script>
