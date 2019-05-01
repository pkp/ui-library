<template>
	<div class="pkpListPanelItem--emailTemplates -hasSummary" :class="classes">
		<div class="pkpListPanelItem__summary -pkpClearfix">
      <div class="pkpListPanelItem--emailTemplates__subject">
        <badge v-if="item.enabled === false" :isWarnable="true">{{ i18n.disabled }}</badge>
        {{ localize(item.subject) }}
      </div>
      <div v-if="localize(item.description)" class="pkpListPanelItem--emailTemplates__description">
        {{ localize(item.description) }}
      </div>
      <span class="pkpListPanelItem--emailTemplates__key">
        {{ item.key }}
      </span>
			<button
				ref="expanderButton"
				class="pkpListPanelItem__expander"
				@click="toggleExpanded"
			>
				<icon v-if="isExpanded" icon="angle-up" />
				<icon v-else icon="angle-down" />
				<span v-if="isExpanded" class="-screenReader">{{ __('viewLess', {name: localize(item.subject)}) }}</span>
				<span v-else class="-screenReader">{{ __('viewMore', {name: localize(item.subject)}) }}</span>
			</button>
		</div>
		<div
			v-if="isExpanded"
			class="pkpListPanelItem__details"
		>
			<list>
				<list-item>{{ __('subjectLabel', {subject: item.subject}) }}</list-item>
				<list-item v-if="item.fromRoleId">{{ __('from', {value: getRoleLabel(item.fromRoleId)}) }}</list-item>
				<list-item v-if="item.toRoleId">{{ __('to', {value: getRoleLabel(item.toRoleId)}) }}</list-item>
				<list-item class="pkpListPanelItem--emailTemplates__body" v-html="localize(item.body)" />
      </list>
			<div class="pkpListPanelItem__actions">
				<spinner v-if="isEnabling" />
				<pkp-button
          v-if="canEdit"
					ref="editButton"
					:label="i18n.edit"
          @click="openEditModal"
				/>
				<pkp-button
					v-if="item.canDisable"
					ref="toggleEnabledButton"
					:label="item.enabled === false ? i18n.enable : i18n.disable"
          :isWarnable="item.enabled !== false"
					:disabled="isEnabling"
          @click="toggleEnabled"
				/>
				<pkp-button
          v-if="canReset"
					ref="resetButton"
					:label="i18n.reset"
          :isWarnable="true"
          @click="openResetModal"
				/>
				<pkp-button
          v-else-if="isCustom"
					ref="deleteButton"
					:label="i18n.delete"
          :isWarnable="true"
          @click="openDeleteModal"
				/>
			</div>
		</div>
		<div v-if="isLoading" class="pkpListPanelItem--emailTemplates__loadingMask">
			<spinner />
		</div>
	</div>
</template>

<script>
import ListPanelItem from '@/components/ListPanel/ListPanelItem.vue';
import Badge from '@/components/Badge/Badge.vue';
import Icon from '@/components/Icon/Icon.vue';
import List from '@/components/List/List.vue';
import ListItem from '@/components/List/ListItem.vue';
import PkpButton from '@/components/Button/Button.vue';
import Spinner from '@/components/Spinner/Spinner.vue';

export default {
	extends: ListPanelItem,
	name: 'EmailTemplatesListItem',
	components: {
		Badge,
		Icon,
		List,
		ListItem,
		PkpButton,
		Spinner
	},
	props: {
		apiUrl: {
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
			const modalOptions = {
				modalHandler: '$.pkp.controllers.modal.ConfirmationModalHandler',
				title: '',
				okButton: this.i18n.ok,
				cancelButton: this.i18n.cancel,
				dialogText: this.i18n.deleteConfirm,
				callback: this.delete,
				closeCallback: () =>
					this.$refs.deleteButton
						? this.$refs.deleteButton.$el.focus()
						: this.setFocusIn(parentNode)
			};

			const $modal = $(
				'<div id="' +
					$.pkp.classes.Helper.uuid() +
					'" ' +
					'class="pkp_modal pkpModalWrapper" tabindex="-1"></div>'
			).pkpHandler(modalOptions.modalHandler, modalOptions);
			``;
			$.pkp.classes.Handler.getHandler($modal);
		},

		/**
		 * Delete the template
		 *
		 *
		 */
		delete() {
			let self = this;
			this.isLoading = true;

			$.ajax({
				url: this.apiUrl + '/' + this.item.key,
				type: 'DELETE',
				headers: {
					'X-Csrf-Token': this.csrfToken
				},
				error(r) {
					self.ajaxErrorCallback(r);
					self.isLoading = false;
				},
				success(r) {
					self.$emit('delete:item', r);
					pkp.eventBus.$emit('delete:emailTemplate', r);
				},
				complete(r) {
					self.isLoading = false;
				}
			});
		},

		/**
		 * Open the modal to edit a template
		 */
		openEditModal() {
			let modalHandler;

			// Assign the form success callback function
			// to a var so that we can remove the event
			// listener when the modal is closed
			const editTemplateFormSuccess = (formId, newItem) => {
				if (formId !== 'editEmailTemplate') {
					return;
				}
				this.$emit('update:item', newItem);
				pkp.eventBus.$emit('update:emailTemplate', newItem);
				modalHandler.modalClose();
			};

			const modalOptions = {
				modalHandler: '$.pkp.controllers.modal.AjaxModalHandler',
				url: this.editItemUrl.replace('__key__', this.item.key),
				title: this.i18n.editTemplate,
				closeCleanVueInstances: ['editEmailTemplate'],
				closeCallback: () => {
					this.$refs.editButton
						? this.$refs.editButton.$el.focus()
						: this.setFocusIn(this.$el);
					pkp.eventBus.$off('form-success', editTemplateFormSuccess);
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
			pkp.eventBus.$on('form-success', editTemplateFormSuccess);
		},

		/**
		 * Open the modal to confirm resetting a template
		 */
		openResetModal() {
			const parentNode = this.$el.parentNode;
			const modalOptions = {
				modalHandler: '$.pkp.controllers.modal.ConfirmationModalHandler',
				title: '',
				okButton: this.i18n.ok,
				cancelButton: this.i18n.cancel,
				dialogText: this.i18n.resetConfirm,
				callback: this.reset,
				closeCallback: () =>
					this.$refs.resetButton
						? this.$refs.resetButton.$el.focus()
						: this.setFocusIn(parentNode)
			};

			const $modal = $(
				'<div id="' +
					$.pkp.classes.Helper.uuid() +
					'" ' +
					'class="pkp_modal pkpModalWrapper" tabindex="-1"></div>'
			).pkpHandler(modalOptions.modalHandler, modalOptions);
			``;
			$.pkp.classes.Handler.getHandler($modal);
		},

		/**
		 * Reset the template
		 */
		reset() {
			let self = this;
			this.isLoading = true;

			$.ajax({
				url: this.apiUrl + '/' + this.item.key,
				type: 'DELETE',
				headers: {
					'X-Csrf-Token': this.csrfToken
				},
				error(r) {
					self.ajaxErrorCallback(r);
					self.isLoading = false;
				},
				success(r) {
					$.ajax({
						url: self.apiUrl + '/' + self.item.key,
						type: 'GET',
						error(r) {
							self.ajaxErrorCallback(r);
						},
						success(r) {
							self.$emit('update:item', r);
							pkp.eventBus.$emit('update:emailTemplate', r);
						},
						complete() {
							self.isLoading = false;
						}
					});
				}
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
				type: 'PUT',
				headers: {
					'X-Csrf-Token': this.csrfToken
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

.pkpListPanelItem--emailTemplates__subject,
.pkpListPanelItem--emailTemplates__description {
	padding-right: 1rem;
	white-space: nowrap;
	overflow-x: hidden;
	text-overflow: ellipsis;
}

.pkpListPanelItem--emailTemplates__subject {
	font-weight: @bold;
	// Ensure there is no jank when a disabled badge
	// is added or removed
	line-height: 27px;
}

.pkpListPanelItem--emailTemplates__key {
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

.pkpListPanelItem--emailTemplates__body {
	p:first-child {
		margin-top: 0;
	}

	p:last-child {
		margin-bottom: 0;
	}
}

.pkpListPanelItem--emailTemplates .pkpListPanelItem__actions > .pkpSpinner {
	margin-right: 0.5rem;
}

.pkpListPanelItem--emailTemplates__loadingMask {
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
