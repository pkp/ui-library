<template>
	<div class="contributorsListPanel">
		<slot>
			<list-panel
				:items="items"
				class="listPanel--contributor"
				:class="isOrdering ? '-isOrdering' : ''"
			>
				<pkp-header slot="header">
					<h2>{{ title }}</h2>
					<spinner v-if="isLoading" />
					<template slot="actions">
						<pkp-button
							class="listPanel--contributor__orderToggle"
							icon="sort"
							:isActive="isOrdering"
							@click="toggleOrdering"
						>
							<!-- {{ orderingLabel }} -->
							{{ __('common.order') }}
						</pkp-button>
						<pkp-button
							v-if="isOrdering"
							class="listPanel--contributor__orderCancel"
							:isWarnable="true"
							@click="cancelOrdering"
						>
							{{ __('common.cancel') }}
						</pkp-button>
						<pkp-button @click="openAddModal">
							{{ addContributorLabel }}
						</pkp-button>
					</template>
				</pkp-header>
				<template v-slot:itemTitle="{item}">
					{{ localize(item.givenName) }} {{ localize(item.familyName) }}
				</template>
				<template v-slot:itemSubtitle="{item}">
					{{ item.email }}
				</template>
				<template v-slot:itemActions="{item}">
					<!-- if the primaryAuthorId if the item.id -->
					<badge v-if="primaryAuthorId == item.id">
						Primary Contact
					</badge>

					<div v-if="isOrdering">
						<orderer
							@up="$emit('order-up', item)"
							@down="$emit('order-down', item)"
							:itemId="item.id"
							:itemTitle="item.title"
						/>
					</div>
					<div v-else>
						<pkp-button @click="openEditModal(item.id)">
							{{ __('common.edit') }}
						</pkp-button>
						<pkp-button :isWarnable="true" @click="openDeleteModal(item.id)">
							{{ __('common.delete') }}
						</pkp-button>
					</div>
				</template>
			</list-panel>
			<modal v-bind="MODAL_PROPS" name="form" @closed="formModalClosed">
				<modal-content
					:closeLabel="__('common.close')"
					modalName="form"
					:title="activeFormTitle"
				>
					<pkp-form
						v-bind="activeForm"
						@set="updateForm"
						@success="formSuccess"
					/>
				</modal-content>
			</modal>
		</slot>
	</div>
</template>

<script>
import ListPanel from '@/components/ListPanel/ListPanel.vue';
import PkpForm from '@/components/Form/Form.vue';
import PkpHeader from '@/components/Header/Header.vue';
import ajaxError from '@/mixins/ajaxError';
import fetch from '@/mixins/fetch';
import modal from '@/mixins/modal';
import cloneDeep from 'clone-deep';
import Orderer from '@/components/Orderer/Orderer.vue';

export default {
	components: {
		ListPanel,
		PkpForm,
		PkpHeader,
		Orderer
	},
	mixins: [fetch, modal, ajaxError],
	props: {
		addContributorLabel: {
			type: String,
			required: true
		},
		confirmDeleteMessage: {
			type: String,
			required: true
		},
		deleteContributorLabel: {
			type: String,
			required: true
		},
		editContributorLabel: {
			type: String,
			required: true
		},
		form: {
			type: Object,
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
		title: {
			type: String,
			required: true
		},
		primaryAuthorId: {
			type: Number,
			required: true
		},
		publicationId: {
			type: Number,
			required: true
		}
	},
	data() {
		return {
			activeForm: null,
			activeFormTitle: '',
			resetFocusTo: null,
			isOrdering: false
		};
	},
	computed: {
		/**
		 * Return the appropriate label for the ordering button depending on
		 * if we're ordering or not.
		 *
		 * @return {String}
		 */
		orderingLabel() {
			return this.isOrdering
				? this.__('grid.action.order')
				: this.__('grid.action.order');
		}
	},
	methods: {
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
				this.$emit('added', item);
			} else {
				this.setItems(
					this.items.map(i => (i.id === item.id ? item : i)),
					this.itemsMax
				);
				this.$emit('edited', item);
			}
			this.$modal.hide('form');
		},

		/**
		 * Open the modal to add an item
		 */
		openAddModal() {
			const sourceUrl = this.apiUrl.replace(
				'__publicationId__',
				this.publicationId
			);

			this.resetFocusTo = document.activeElement;
			let activeForm = cloneDeep(this.form);
			activeForm.action = sourceUrl;
			activeForm.method = 'POST';
			this.activeForm = activeForm;
			this.activeFormTitle = this.addContributorLabel;
			this.$modal.show('form');
		},

		/**
		 * Open delete modal
		 *
		 * @param {Number} id
		 */
		openDeleteModal(id) {
			const sourceUrl = this.apiUrl.replace(
				'__publicationId__',
				this.publicationId
			);

			const author = this.items.find(a => a.id === id);
			if (typeof author === 'undefined') {
				this.openDialog({
					confirmLabel: this.__('common.ok'),
					modalName: 'unknownError',
					message: this.__('common.unknownError'),
					title: this.__('common.error'),
					callback: () => {
						this.$modal.hide('unknownError');
					}
				});
				return;
			}
			this.openDialog({
				cancelLabel: this.__('common.no'),
				modalName: 'delete',
				title: this.deleteContributorLabel,
				message: this.replaceLocaleParams(this.confirmDeleteMessage, {
					title: this.localize(author.title)
				}),
				callback: () => {
					var self = this;
					$.ajax({
						url: sourceUrl + '/' + id,
						type: 'POST',
						headers: {
							'X-Csrf-Token': pkp.currentUser.csrfToken,
							'X-Http-Method-Override': 'DELETE'
						},
						error: self.ajaxErrorCallback,
						success: function(r) {
							self.setItems(
								self.items.filter(i => i.id !== id),
								self.itemsMax
							);
							self.$modal.hide('delete');
							self.setFocusIn(self.$el);
							self.$emit('deleted', author);
						}
					});
				}
			});
		},

		/**
		 * Open the modal to edit an item
		 *
		 * @param {Number} id
		 */
		openEditModal(id) {
			const sourceUrl = this.apiUrl.replace(
				'__publicationId__',
				this.publicationId
			);

			var t = this;

			this.resetFocusTo = document.activeElement;

			$.ajax({
				url: sourceUrl + '/' + id,
				type: 'GET',
				error: self.ajaxErrorCallback,
				success: function(r) {
					var author = r;

					if (!author) {
						t.openDialog({
							confirmLabel: t.__('common.ok'),
							modalName: 'unknownError',
							message: t.__('common.unknownError'),
							callback: () => {
								t.$modal.hide('unknownError');
							}
						});
					}

					let activeForm = cloneDeep(t.form);
					activeForm.action = sourceUrl + '/' + id;
					activeForm.method = 'PUT';
					activeForm.fields = activeForm.fields.map(field => {
						if (Object.keys(author).includes(field.name)) {
							field.value = author[field.name];
						}
						return field;
					});
					t.activeForm = activeForm;
					t.activeFormTitle = t.editContributorLabel;
					t.$modal.show('form');
				}
			});
		},

		/**
		 * Set the list of items
		 *
		 * @see @/mixins/fetch.js
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
		 * Toggle the ordering and save a new order
		 */
		toggleOrdering() {
			if (this.isOrdering) {
				this.setItemOrderSequence();
			}
			this.isOrdering = !this.isOrdering;
		},

		/**
		 * Cancel changes made by ordering items
		 */
		cancelOrdering() {
			this.isOrdering = false;
			this.$emit('set', this.id, {offset: 0});
			this.$nextTick(() => this.get());
		},

		/**
		 * Update the order sequence property for items in this list based on
		 * the new order of items
		 */
		setItemOrderSequence() {
			const sourceUrl = this.apiUrl.replace(
				'__publicationId__',
				this.publicationId
			);

			let seq = 0;
			for (const item of this.items) {
				item.seq = seq;
				seq++;
			}

			this.isLoading = true;

			let self = this;
			$.ajax({
				url: sourceUrl + '/saveOrder',
				type: 'POST',
				headers: {
					'X-Csrf-Token': pkp.currentUser.csrfToken
				},
				data: {
					sortedAuthors: this.items
				},
				error(r) {
					self.ajaxErrorCallback(r);
				},
				complete() {
					self.isLoading = false;
				}
			});
		}
	}
};
</script>

<style lang="less">
@import '../../../styles/_import';

.listPanel__itemIdentity--contributor,
.listPanel__itemExpanded--contributor {
	padding-left: 2.5rem;
}

.listPanel__item--contributor__id {
	position: absolute;
	top: 0;
	left: 0;
	font-size: @font-tiny;
	line-height: 22px; // Match baseline of title
	color: @text;
}

.listPanel__item--contributor__title {
	display: block;
	padding-right: 2em;
}

[dir='rtl'] {
	.listPanel__itemIdentity--contributor {
		padding-left: 0rem;
		padding-right: 2.5rem;
	}

	.listPanel__item--contributor__id {
		position: absolute;
		left: auto;
		right: 0;
		text-align: left;
	}
}

.listPanel--contributor.-isOrdering {
	.pkpHeader__actions
		> button:not(.listPanel--contributor__orderToggle):not(.listPanel--contributor__orderCancel),
	.pkpSearch,
	.listPanel__itemActions--contributor,
	.listPanel__item--contributor:not(.-isFeatured),
	.orderer__dragDrop,
	.listPanel--contributor__headings {
		display: none;
	}

	.listPanel__itemSummary {
		margin-right: 8rem;
	}
}
</style>
