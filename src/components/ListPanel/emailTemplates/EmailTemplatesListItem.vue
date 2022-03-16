<template>
	<div class="listPanel__item--emailTemplate">
		<div class="listPanel__itemSummary ">
			<div class="listPanel__itemIdentity">
				<div class="listPanel__itemTitle">
					<badge v-if="item.enabled === false" :isWarnable="true">
						{{ disabledLabel }}
					</badge>
					{{ localize(item.subject) }}
				</div>
				<div class="listPanel__itemSubtitle">
					{{ localize(item.description) }}
				</div>
				<span class="listPanel--emailTemplates__key">
					{{ item.key }}
				</span>
			</div>
			<div class="listPanel__itemActions">
				<expander
					:isExpanded="isExpanded"
					:itemName="localize(item.subject)"
					@toggle="isExpanded = !isExpanded"
				/>
			</div>
		</div>
		<div v-if="isExpanded" class="listPanel__itemExpanded">
			<list>
				<list-item>
					{{
						replaceLocaleParams(this.subjectLabel, {
							subject: item.subject
						})
					}}
				</list-item>
				<list-item v-if="item.fromRoleId">
					{{
						replaceLocaleParams(this.fromLabel, {
							value: getRoleLabel(item.fromRoleId)
						})
					}}
				</list-item>
				<list-item v-if="item.toRoleId">
					{{
						replaceLocaleParams(this.toLabel, {
							value: getRoleLabel(item.toRoleId)
						})
					}}
				</list-item>
				<list-item
					class="listPanel__item--emailTemplates__body"
					v-html="localize(item.body)"
				/>
			</list>
			<div class="listPanel__itemExpandedActions">
				<spinner v-if="isEnabling" />
				<pkp-button
					v-if="canEdit"
					ref="editButton"
					@click="$emit('edit:item', item.key)"
				>
					{{ __('common.edit') }}
				</pkp-button>
				<pkp-button
					v-if="item.canDisable"
					ref="toggleEnabledButton"
					:isWarnable="item.enabled !== false"
					:disabled="isEnabling"
					@click="toggleEnabled"
				>
					{{ item.enabled === false ? enableLabel : disableLabel }}
				</pkp-button>
				<pkp-button
					v-if="canReset"
					ref="resetButton"
					:isWarnable="true"
					@click="openResetModal"
				>
					{{ resetLabel }}
				</pkp-button>
				<pkp-button
					v-else-if="isCustom"
					ref="deleteButton"
					:isWarnable="true"
					@click="openDeleteModal"
				>
					{{ __('common.delete') }}
				</pkp-button>
			</div>
		</div>
		<div v-if="isLoading" class="listPanel__item--emailTemplates__loadingMask">
			<spinner />
		</div>
	</div>
</template>

<script>
import Expander from '@/components/Expander/Expander.vue';
import List from '@/components/List/List.vue';
import ListItem from '@/components/List/ListItem.vue';
import ajaxError from '@/mixins/ajaxError';
import dialog from '@/mixins/dialog';

export default {
	components: {
		Expander,
		List,
		ListItem
	},
	mixins: [dialog, ajaxError],
	props: {
		apiUrl: {
			type: String,
			required: true
		},
		deleteConfirmMessage: {
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
		enableLabel: {
			type: String,
			required: true
		},
		fromLabel: {
			type: String,
			required: true
		},
		item: {
			type: Object,
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
		toLabel: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			isEnabling: false,
			isExpanded: false,
			isLoading: false
		};
	},
	computed: {
		/**
		 * Can this template be edited?
		 *
		 * item.canEdit is only set on templates backed by a
		 * default, so fully custom templates can be edited
		 * even though the value is `null`. Anything other than
		 * false can be edited.
		 *
		 * @return {Boolean}
		 */
		canEdit() {
			return this.item.canEdit !== false;
		},

		/**
		 * Can this template be reset?
		 *
		 * Templates that have been edited from a default can
		 * be reset. Default templates that can be edited have
		 * item.canEdit=true. After editing, they have an
		 * email_id.
		 *
		 * @return {Boolean}
		 */
		canReset() {
			return this.item.canEdit === true && this.item.id;
		},

		/**
		 * Is this a fully custom template that does not have a
		 * default fallback?
		 */
		isCustom() {
			return !this.canReset && this.item.id;
		}
	},
	methods: {
		/**
		 * Get the label for a role based on its id
		 *
		 * @param {Number} roleId
		 * @return string
		 */
		getRoleLabel(roleId) {
			return this.roles[roleId] || '';
		},

		/**
		 * Open the modal to delete a template
		 */
		openDeleteModal() {
			const parentNode = this.$el.parentNode;
			this.openDialog({
				name: 'delete',
				title: this.__('common.delete'),
				message: this.deleteConfirmMessage,
				actions: [
					{
						label: this.__('common.delete'),
						isPrimary: true,
						callback: () => {
							let self = this;
							this.isLoading = true;

							$.ajax({
								url: this.apiUrl + '/' + this.item.key,
								type: 'POST',
								headers: {
									'X-Csrf-Token': pkp.currentUser.csrfToken,
									'X-Http-Method-Override': 'DELETE'
								},
								error: self.ajaxErrorCallback,
								success(r) {
									self.$modal.hide('delete');
									self.$emit('delete:item', r);
									pkp.eventBus.$emit('delete:emailTemplate', r);
									self.setFocusIn(parentNode);
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
						callback: () => this.$modal.hide('delete')
					}
				]
			});
		},

		/**
		 * Open the modal to confirm resetting a template
		 */
		openResetModal() {
			const parentNode = this.$el.parentNode;
			this.openDialog({
				name: 'reset',
				title: this.resetLabel,
				message: this.resetConfirmLabel,
				actions: [
					{
						label: this.resetLabel,
						isPrimary: true,
						callback: () => {
							let self = this;
							this.isLoading = true;
							$.ajax({
								url: this.apiUrl + '/' + this.item.key,
								type: 'POST',
								headers: {
									'X-Csrf-Token': pkp.currentUser.csrfToken,
									'X-Http-Method-Override': 'DELETE'
								},
								error: self.ajaxErrorCallback,
								success(r) {
									$.ajax({
										url: self.apiUrl + '/' + self.item.key,
										type: 'GET',
										error: self.ajaxErrorCallback,
										success(r) {
											self.$modal.hide('reset');
											self.$emit('update:item', r);
											pkp.eventBus.$emit('update:emailTemplate', r);
											pkp.eventBus.$emit(
												'notify',
												self.resetCompleteLabel,
												'success'
											);
											self.setFocusIn(parentNode);
										},
										complete() {
											self.isLoading = false;
										}
									});
								}
							});
						}
					},
					{
						label: this.__('common.cancel'),
						isWarnable: true,
						callback: () => this.$modal.hide('reset')
					}
				]
			});
		},
		/**
		 * Enable or disable this item
		 */
		toggleEnabled() {
			let self = this;
			this.isEnabling = true;

			$.ajax({
				url: this.apiUrl + '/' + this.item.key,
				type: 'POST',
				headers: {
					'X-Csrf-Token': pkp.currentUser.csrfToken,
					'X-Http-Method-Override': 'PUT'
				},
				data: {
					enabled: !this.item.enabled
				},
				error: function(r) {
					self.ajaxErrorCallback(r);
				},
				success: function(r) {
					self.$emit('update:item', r);
					pkp.eventBus.$emit('update:emailTemplate', r);
				},
				complete() {
					self.isEnabling = false;
				}
			});
		}
	}
};
</script>

<style lang="less">
@import '../../../styles/_import';

.listPanel__item--emailTemplate {
	.listPanel__itemTitle {
		// Ensure there is no jank when a disabled badge
		// is added or removed
		line-height: 27px;
	}
}

.listPanel--emailTemplates__key {
	display: inline-block;
	margin-top: 0.25rem;
	margin-right: 1rem;
	padding: 0 0.25rem;
	border: 1px solid #9fc8db;
	border-radius: 3px;
	font-family: monospace;
	font-size: 11px;
	color: @primary;
}

.listPanel__item--emailTemplates__body {
	p:first-child {
		margin-top: 0;
	}

	p:last-child {
		margin-bottom: 0;
	}
}

.listPanel__item--emailTemplate .listPanel__itemExpandedActions > .pkpSpinner {
	margin-right: 0.5rem;
}

.listPanel__item--emailTemplates__loadingMask {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(255, 255, 255, 0.5);

	.pkpSpinner {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
}
</style>
