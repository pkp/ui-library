<template>
	<div class="pkpListPanel pkpListPanel--users">
		<div class="pkpListPanel__header -pkpClearfix">
			<div class="pkpListPanel__title">
				{{ i18n.title }}
				<span v-if="isLoading" class="pkpSpinner" aria-hidden="true"></span>
			</div>
			<ul class="pkpListPanel__actions">
				<li>
					<pkp-button
						:label="i18n.filter"
						icon="filter"
						:isActive="isFilterVisible"
						@click="toggleFilter"
					/>
				</li>
				<li>
					<pkp-button
						:id="addUserButtonId"
						:label="i18n.addUser"
						@click="openAddUser"
					/>
				</li>
			</ul>
			<list-panel-search
				@searchPhraseChanged="setSearchPhrase"
				:searchPhrase="searchPhrase"
				:i18n="i18n"
			/>
		</div>
		<div class="pkpListPanel__body -pkpClearfix pkpListPanel__body--users">
			<users-list-filter
				@filterList="updateFilter"
				:isVisible="isFilterVisible"
				:filters="filters"
				:activeFilters="activeFilters"
				:i18n="i18n"
			/>
			<div class="pkpListPanel__content pkpListPanel__content--users">
				<ul class="pkpListPanel__items" aria-live="polite">
					<users-list-item
						v-for="item in items"
						@filterList="updateFilter"
						:key="item.id"
						:item="item"
						:i18n="i18n"
						:userListId="id"
						:isSiteAdmin="isSiteAdmin"
						:filters="filters"
						:activeFilters="activeFilters"
						:loginAsUrl="loginAsUrl"
						:logoutAsUrl="logoutAsUrl"
						:sendEmailUrl="sendEmailUrl"
						:editUserUrl="editUserUrl"
						:assignUserUrl="assignUserUrl"
						:enableUserUrl="enableUserUrl"
						:disableUserUrl="disableUserUrl"
						:removeUserUrl="removeUserUrl"
						:mergeUserUrl="mergeUserUrl"
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
import ListPanel from '@/components/ListPanel/ListPanel.vue';
import ListPanelSearch from '@/components/ListPanel/ListPanelSearch.vue';
import ListPanelCount from '@/components/ListPanel/ListPanelCount.vue';
import ListPanelLoadMore from '@/components/ListPanel/ListPanelLoadMore.vue';
import UsersListFilter from '@/components/ListPanel/users/UsersListFilter.vue';
import UsersListItem from '@/components/ListPanel/users/UsersListItem.vue';
import PkpButton from '@/components/Button/Button.vue';
import openOldModal from '@/mixins/openOldModal';

export default {
	extends: ListPanel,
	name: 'UsersListPanel',
	mixins: [openOldModal],
	components: {
		ListPanelSearch,
		ListPanelCount,
		ListPanelLoadMore,
		UsersListFilter,
		UsersListItem,
		PkpButton,
	},
	data: function () {
		return {
			isSiteAdmin: false,
			filters: '',
			addUserUrl: '',
			loginAsUrl: '',
			logoutAsUrl: '',
			sendEmailUrl: '',
			editUserUrl: '',
			assignUserUrl: '',
			enableUserUrl: '',
			disableUserUrl: '',
			removeUserUrl: '',
			mergeUserUrl: '',
		};
	},
	computed: {
		/**
		 * Add user button ID
		 */
		addUserButtonId: function () {
			return 'addUserButton-' + this.id;
		},
	},
	methods: {
		/**
		 * Open a modal to add a user
		 */
		openAddUser: function () {
			this.openOldModal({
				title: this.i18n.addUser,
				url: this.addUserUrl,
				closeCallback: this.setFocusCallback('#' + this.addUserButtonId),
			});
		},
	},
	mounted: function () {

		var self = this;

		// Refresh the list when a user is updated, added or merged
		pkp.eventBus.$on(['userAdded', 'userUpdated', 'userMerged'], function (user) {
			self.get();
		});
	},
};
</script>
