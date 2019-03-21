<template>
	<div class="ListPanel--emailTemplates" :class="classes">

		<!-- Header -->
    <pkp-header>
      {{ title }}
			<spinner v-if="isLoading" />
      <template slot="actions">
				<search
					:searchPhrase="searchPhrase"
					:searchLabel="i18n.search"
					:clearSearchLabel="i18n.clearSearch"
					@searchPhraseChanged="setSearchPhrase"
				/>
				<pkp-button
					:isActive="isSidebarVisible"
					icon="filter"
					:label="i18n.filter"
					@click="toggleSidebar"
				/>
				<pkp-button
					ref="addButton"
					:label="i18n.add"
          @click="openAddTemplateModal"
				/>
				<pkp-button
					ref="resetAllButton"
          :isWarnable="true"
					:label="i18n.resetAll"
          @click="openResetAllModal"
				/>
      </template>
    </pkp-header>

		<!-- Body of the panel, including items and sidebar -->
		<div class="pkpListPanel__body -pkpClearfix">

			<!-- Filters in the sidebar -->
			<div v-if="filters.length" ref="sidebar" class="pkpListPanel__sidebar" :class="{'-isVisible': isSidebarVisible}">
				<pkp-header class="pkpListPanel__sidebarHeader">
					<icon icon="filter" :inline="true" />
					{{ i18n.filter }}
				</pkp-header>
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
						@add-filter="addEmailTemplateFilter"
						@remove-filter="removeEmailTemplateFilter"
					/>
				</div>
			</div>

			<!-- Content -->
			<div class="pkpListPanel__content" aria-live="polite">

				<!-- Items -->
				<template v-if="items.length">
          <email-templates-list-item
            v-for="item in items"
            :apiUrl="apiUrl"
            :csrfToken="csrfToken"
						:editItemUrl="editItemUrl"
            :key="item.id"
            :item="item"
            :roles="roles"
            :i18n="i18n"
            @delete:item="deleteItem"
            @update:item="updateItem"
          />
				</template>

				<!-- Loading indicator when loading and no items exist -->
				<div v-else-if="isLoading" class="pkpListPanel__empty">
					<spinner />
					{{ i18n.loading }}
				</div>

				<!-- Indicator when no items exist -->
				<div v-else class="pkpListPanel__empty">
					{{ i18n.empty }}
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import ListPanel from '@/components/ListPanel/ListPanel.vue';
import PkpButton from '@/components/Button/Button.vue';
import Search from '@/components/Search/Search.vue';
import EmailTemplatesListItem from '@/components/ListPanel/emailTemplates/EmailTemplatesListItem.vue';

export default {
	extends: ListPanel,
	components: {
		EmailTemplatesListItem,
		PkpButton,
		Search
	},
	props: {
		addItemUrl: {
			type: String,
			required: true
		},
		csrfToken: {
			type: String,
			required: true
		},
		editItemUrl: {
			type: String,
			required: true
		},
		roles: {
			type: Object,
			required: true
		}
	},
	methods: {
		/**
		 * A wrapper method which calls ListPanel::addFilter()
		 * or ListPanel::setFilter() depending on whether the
		 * filter param accepts multiple values.
		 *
		 * @param {String} param
		 * @param {mixed} value
		 */
		addEmailTemplateFilter: function(param, value) {
			if (param === 'isEnabled' || param === 'isCustom') {
				this.setFilter(param, value);
			} else {
				this.addFilter(param, value);
			}
		},

		/**
		 * A wrapper method which calls ListPanel::removeFilter()
		 * or ListPanel::removeParamFilters() depending on whether
		 * the filter param accepts multiple values.
		 *
		 * @param {String} param
		 * @param {mixed} value
		 */
		removeEmailTemplateFilter: function(param, value) {
			if (param === 'isEnabled' || param === 'isCustom') {
				this.removeParamFilters(param);
			} else {
				this.removeFilter(param, value);
			}
		},

		/**
		 * Open the modal to add a new template
		 */
		openAddTemplateModal() {
			let modalHandler;

			// Assign the form success callback function
			// to a var so that we can remove the event
			// listener when the modal is closed
			const addTemplateFormSuccess = (formId, newItem) => {
				if (formId !== 'editEmailTemplate') {
					return;
				}
				this.get();
				pkp.eventBus.$emit('add:emailTemplate', newItem);
				modalHandler.modalClose();
			};

			const modalOptions = {
				modalHandler: '$.pkp.controllers.modal.AjaxModalHandler',
				url: this.addItemUrl,
				title: this.i18n.add,
				closeCleanVueInstances: ['editEmailTemplate'],
				closeCallback: () => {
					this.$refs.addButton
						? this.$refs.addButton.$el.focus()
						: this.setFocusIn(this.$el);
					pkp.eventBus.$off('form-success', addTemplateFormSuccess);
				}
			};

			const $modal = $(
				'<div id="' +
					$.pkp.classes.Helper.uuid() +
					'" ' +
					'class="pkp_modal pkpModalWrapper" tabindex="-1"></div>'
			).pkpHandler(modalOptions.modalHandler, modalOptions);

			modalHandler = $.pkp.classes.Handler.getHandler($modal);

			// Update item and close modal when the template has been edited
			pkp.eventBus.$on('form-success', addTemplateFormSuccess);
		},

		/**
		 * Open a confirmation modal to reset all templates
		 */
		openResetAllModal() {
			const modalOptions = {
				modalHandler: '$.pkp.controllers.modal.ConfirmationModalHandler',
				title: '',
				okButton: this.i18n.ok,
				cancelButton: this.i18n.cancel,
				dialogText: this.i18n.resetAllConfirm,
				callback: this.resetAll,
				closeCallback: () => this.$refs.resetAllButton.$el.focus()
			};

			const $modal = $(
				'<div id="' +
					$.pkp.classes.Helper.uuid() +
					'" ' +
					'class="pkp_modal pkpModalWrapper" tabindex="-1"></div>'
			).pkpHandler(modalOptions.modalHandler, modalOptions);

			$.pkp.classes.Handler.getHandler($modal);
		},

		/**
		 * Reset all templates
		 */
		resetAll() {
			let self = this;
			this.isLoading = true;

			$.ajax({
				url: this.apiUrl + '/restoreDefaults',
				type: 'DELETE',
				headers: {
					'X-Csrf-Token': this.csrfToken
				},
				error(r) {
					self.ajaxErrorCallback(r);
					self.isLoading = false;
				},
				success(r) {
					self.get();
				}
			});
		},

		/**
		 * Delete an item from the list
		 *
		 * @param {Object} deletedItem
		 */
		deleteItem(deletedItem) {
			this.$emit('set', this.id, {
				items: this.items.filter(item => item.key !== deletedItem.key)
			});
		},

		/**
		 * Update an item in the list
		 *
		 * @param {Object} newItem
		 */
		updateItem(newItem) {
			this.$emit('set', this.id, {
				items: this.items.map(
					item => (item.key === newItem.key ? newItem : item)
				)
			});
		}
	}
};
</script>
