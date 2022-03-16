<template>
	<div>
		<list-panel
			:isSidebarVisible="isSidebarVisible"
			:items="items"
			class="listPanel--emailTemplates"
		>
			<pkp-header slot="header">
				<h2>{{ title }}</h2>
				<spinner v-if="isLoading" />
				<template slot="actions">
					<search
						:searchPhrase="searchPhrase"
						@search-phrase-changed="setSearchPhrase"
					/>
					<pkp-button
						:isActive="isSidebarVisible"
						@click="isSidebarVisible = !isSidebarVisible"
					>
						<icon icon="filter" :inline="true" />
						{{ __('common.filter') }}
					</pkp-button>
					<pkp-button @click="openAddTemplateModal">{{ addLabel }}</pkp-button>
					<pkp-button :isWarnable="true" @click="openResetAllModal">
						{{ resetAllLabel }}
					</pkp-button>
				</template>
			</pkp-header>
			<template slot="sidebar">
				<pkp-header :isOneLine="false">
					<h3>
						<icon icon="filter" :inline="true" />
						{{ __('common.filter') }}
					</h3>
				</pkp-header>
				<div
					v-for="(filterSet, index) in filters"
					:key="index"
					class="listPanel__block"
				>
					<pkp-header v-if="filterSet.heading">
						<h4>{{ filterSet.heading }}</h4>
					</pkp-header>
					<pkp-filter
						v-for="filter in filterSet.filters"
						:key="filter.param + filter.value"
						v-bind="filter"
						:isFilterActive="isFilterActive(filter.param, filter.value)"
						@add-filter="addFilter"
						@remove-filter="removeFilter"
					/>
				</div>
			</template>

			<template v-if="isLoading" slot="itemsEmpty">
				<spinner />
				{{ __('common.loading') }}
			</template>

			<template v-slot:item="{item}">
				<email-templates-list-item
					:apiUrl="apiUrl"
					:deleteConfirmMessage="deleteConfirmMessage"
					:disableLabel="disableLabel"
					:disabledLabel="disabledLabel"
					:enableLabel="enableLabel"
					:fromLabel="fromLabel"
					:resetCompleteLabel="resetCompleteLabel"
					:resetConfirmLabel="resetConfirmLabel"
					:resetLabel="resetLabel"
					:subjectLabel="subjectLabel"
					:toLabel="toLabel"
					:item="item"
					:roles="roles"
					@delete:item="removeItem"
					@edit:item="openEditTemplateModal"
					@update:item="updateItem"
				/>
			</template>
		</list-panel>
		<modal
			:closeLabel="closeLabel"
			name="form"
			:title="activeFormTitle"
			@closed="formModalClosed"
		>
			<pkp-form v-bind="activeForm" @set="updateForm" @success="formSuccess" />
		</modal>
	</div>
</template>

<script>
import EmailTemplatesListItem from '@/components/ListPanel/emailTemplates/EmailTemplatesListItem.vue';
import ListPanel from '@/components/ListPanel/ListPanel.vue';
import PkpFilter from '@/components/Filter/Filter.vue';
import PkpForm from '@/components/Form/Form.vue';
import PkpHeader from '@/components/Header/Header.vue';
import Modal from '@/components/Modal/Modal.vue';
import Search from '@/components/Search/Search.vue';
import ajaxError from '@/mixins/ajaxError';
import fetch from '@/mixins/fetch';
import cloneDeep from 'clone-deep';

export default {
	components: {
		EmailTemplatesListItem,
		ListPanel,
		Modal,
		PkpFilter,
		PkpForm,
		PkpHeader,
		Search
	},
	mixins: [ajaxError, fetch],
	props: {
		addLabel: {
			type: String,
			required: true
		},
		deleteConfirmMessage: {
			type: String,
			required: true
		},
		descriptionLabel: {
			type: String,
			required: true
		},
		disableLabel: {
			type: String,
			required: true
		},
		disabledLabel: {
			type: String,
			required: true
		},
		editTemplateLabel: {
			type: String,
			required: true
		},
		enableLabel: {
			type: String,
			required: true
		},
		filters: {
			type: Array,
			default() {
				return [];
			}
		},
		form: {
			type: Object,
			required: true
		},
		fromLabel: {
			type: String,
			required: true
		},
		id: {
			type: String,
			required: true
		},
		items: {
			type: Array,
			default() {
				return [];
			}
		},
		itemsMax: {
			type: Number,
			defaut() {
				return 0;
			}
		},
		resetAllLabel: {
			type: String,
			required: true
		},
		resetAllCompleteLabel: {
			type: String,
			required: true
		},
		resetAllConfirmLabel: {
			type: String,
			required: true
		},
		resetCompleteLabel: {
			type: String,
			required: true
		},
		resetConfirmLabel: {
			type: String,
			required: true
		},
		resetLabel: {
			type: String,
			required: true
		},
		roles: {
			type: Object,
			required: true
		},
		subjectLabel: {
			type: String,
			required: true
		},
		title: {
			type: String,
			default() {
				return '';
			}
		},
		toLabel: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			activeForm: null,
			activeFormTitle: '',
			isSidebarVisible: false,
			resetFocusTo: null
		};
	},
	computed: {
		closeLabel() {
			return this.__('common.close');
		}
	},
	methods: {
		/**
		 * Add a filter
		 *
		 * @param {String} param
		 * @param {mixed} value
		 */
		addFilter: function(param, value) {
			if (this.isFilterActive(param, value)) {
				return;
			}
			let newFilters = {...this.activeFilters};
			if (param === 'isEnabled' || param === 'isCustom') {
				newFilters[param] = value;
			} else {
				if (!Object.keys(newFilters).includes(param)) {
					newFilters[param] = [value];
				} else {
					newFilters[param].push(value);
				}
			}
			this.activeFilters = newFilters;
			this.get();
		},

		/**
		 * Clear the active form when the modal is closed
		 *
		 * @param {Object} event
		 */
		formModalClosed(event) {
			this.activeForm = null;
			this.activeFormTitle = '';
			if (this.resetFocusTo) {
				this.resetFocusTo.focus();
			}
		},

		/**
		 * The add/edit form has been successfully
		 * submitted.
		 *
		 * @param {Object} item
		 */
		formSuccess(item) {
			if (this.activeForm.method === 'POST') {
				this.offset = 0;
				this.get();
				pkp.eventBus.$emit('add:emailTemplate', item);
			} else {
				this.setItems(
					this.items.map(i => (i.id === item.id ? item : i)),
					this.itemsMax
				);
				pkp.eventBus.$emit('update:emailTemplate', item);
			}
			setTimeout(() => {
				this.$modal.hide('form');
			}, 1500);
		},

		/**
		 * Is a filter currently active?
		 *
		 * @param {string} param The filter param
		 * @param {mixed} value The filter value
		 * @return {Boolean}
		 */
		isFilterActive(param, value) {
			if (!Object.keys(this.activeFilters).includes(param)) {
				return false;
			} else if (Array.isArray(this.activeFilters[param])) {
				return this.activeFilters[param].includes(value);
			} else {
				return this.activeFilters[param] === value;
			}
		},

		/**
		 * Open the modal to add a new template
		 */
		openAddTemplateModal() {
			this.resetFocusTo = document.activeElement;
			let activeForm = cloneDeep(this.form);
			activeForm.action = this.apiUrl;
			activeForm.method = 'POST';
			this.activeForm = activeForm;
			this.activeFormTitle = this.addLabel;
			this.$modal.show('form');
		},

		/**
		 * Open the modal to edit a template
		 *
		 * @param {String} key Email template key
		 */
		openEditTemplateModal(key) {
			this.resetFocusTo = document.activeElement;

			const emailTemplate = this.items.find(
				emailTemplate => emailTemplate.key === key
			);
			if (!emailTemplate) {
				this.ajaxErrorCallback({});
			}

			let activeForm = cloneDeep(this.form);
			activeForm.action = this.apiUrl + '/' + key;
			activeForm.method = 'PUT';

			// Remove the key field, which is only used for new templates
			activeForm.fields = activeForm.fields.filter(
				field => field.name !== 'key'
			);

			// Add a description field if the email template includes a description
			if (this.localize(emailTemplate.description)) {
				activeForm.fields.unshift({
					component: 'field-html',
					name: 'description',
					description: this.localize(emailTemplate.description),
					label: this.descriptionLabel,
					groupId: 'default',
					isMultilingual: true
				});
			}

			activeForm.fields = activeForm.fields.map(field => {
				if (
					Object.keys(emailTemplate).includes(field.name) &&
					field.name !== 'description'
				) {
					field.value = emailTemplate[field.name];
				}
				return field;
			});

			this.activeForm = activeForm;
			this.activeFormTitle = this.editTemplateLabel;
			this.$modal.show('form');
		},

		/**
		 * Open a confirmation modal to reset all templates
		 */
		openResetAllModal() {
			const resetFocusTo = document.activeElement;
			this.openDialog({
				name: 'resetAll',
				title: this.resetAllLabel,
				message: this.resetAllConfirmLabel,
				actions: [
					{
						label: this.resetAllLabel,
						isPrimary: true,
						callback: () => {
							let self = this;
							this.isLoading = true;
							$.ajax({
								url: this.apiUrl + '/restoreDefaults',
								type: 'POST',
								headers: {
									'X-Csrf-Token': pkp.currentUser.csrfToken,
									'X-Http-Method-Override': 'DELETE'
								},
								error: self.ajaxErrorCallback,
								success(r) {
									self.$modal.hide('resetAll');
									self.get();
									pkp.eventBus.$emit(
										'notify',
										self.resetAllCompleteLabel,
										'success'
									);
									resetFocusTo.focus();
								},
								complete(r) {
									self.isLoading = false;
								}
							});
						}
					},
					{
						label: this.__('common.cancel'),
						isWarnable: true,
						callback: () => this.$modal.hide('resetAll')
					}
				]
			});
		},

		/**
		 * Remove a filter
		 *
		 * @param {String} param
		 * @param {mixed} value
		 */
		removeFilter: function(param, value) {
			if (!Object.keys(this.activeFilters).includes(param)) {
				return;
			}
			let newFilters = {...this.activeFilters};
			if (param === 'isEnabled' || param === 'isCustom') {
				delete newFilters[param];
			} else {
				newFilters[param] = newFilters[param].filter(
					filterValue => filterValue !== value
				);
			}
			this.activeFilters = newFilters;
			this.get();
		},

		/**
		 * Remove an item from the list
		 *
		 * @param {Object} item
		 */
		removeItem(item) {
			this.$emit('set', this.id, {
				items: this.items.filter(i => i.key !== item.key)
			});
		},

		/**
		 * Update the list of items
		 *
		 * @param {Array} items
		 * @param {Number} itemsMax
		 */
		setItems(items, itemsMax) {
			this.$emit('set', this.id, {
				items,
				itemsMax
			});
		},

		/**
		 * Update form values when they change
		 *
		 * @param {String} formId
		 * @param {Object} data
		 */
		updateForm(formId, data) {
			let activeForm = {...this.activeForm};
			Object.keys(data).forEach(function(key) {
				activeForm[key] = data[key];
			});
			this.activeForm = activeForm;
		},

		/**
		 * Update an item in the list
		 *
		 * @param {Object} item
		 */
		updateItem(item) {
			this.$emit('set', this.id, {
				items: this.items.map(i => (i.key === item.key ? item : i))
			});
		}
	},
	watch: {
		/**
		 * Update list whenever a filter is applied
		 */
		activeFilters(newVal, oldVal) {
			this.offset = 0;
			if (newVal && Object.keys(newVal).length) {
				this.isSidebarVisible = true;
			}
		}
	}
};
</script>
