<template>
	<!-- Temporary disable eslint warning about mutating prop in v-model="isSelected" -->
	<!-- eslint-disable vue/no-mutating-props -->
	<div :id="`list-item-${item.type}-${item.id}`" class="listPanel__item--doi">
		<div class="listPanel__itemSummary">
			<!-- Item selector -->
			<label class="doiListItem__selectWrapper">
				<div class="doiListItem__selector">
					<input
						type="checkbox"
						:name="`${item.type}[]`"
						:value="item.id"
						v-model="isSelected"
						@click="toggleSelected"
					/>
				</div>
			</label>

			<!-- Item overview -->

			<div class="listPanel__itemIdentity">
				<!-- Title -->
				<div class="listPanel__itemTitle doiListItem__itemTitle">
					<span class="listPanel__itemSubtitle">
						<a
							:href="item.urlPublished"
							target="_blank"
							rel="noopener noreferrer"
						>
							{{ item.title }}
						</a>
					</span>
				</div>
			</div>

			<div class="listPanel__itemActions">
				<!-- DOI item metadata -->
				{{ item.id }}
				<div class="doiListItem__itemMetadata">
					<badge
						class="doiListItem__itemMetadata--badge"
						:is-warnable="
							item.isPublished &&
							((!isDeposited && isRegistrationPluginConfigured) ||
								(isDeposited && isRegistrationPluginConfigured && isStale) ||
								hasErrors)
						"
						:is-primary="item.isPublished && isDeposited"
					>
						{{
							!item.isPublished ? publicationStatusLabel : depositStatusString
						}}
					</badge>
				</div>

				<expander
					:isExpanded="isExpanded"
					:itemName="item.id.toString()"
					@toggle="toggleExpanded"
				/>
			</div>
		</div>

		<!-- Expanded view/identifiers -->
		<div
			v-if="isExpanded"
			class="listPanel__itemExpanded listPanel__itemExpanded--doi"
		>
			<pkp-table :columns="doiListColumns" :rows="currentVersionDoiObjects">
				<template slot-scope="{row}">
					<table-cell :column="doiListColumns[0]" :row="row">
						<label :for="row.uid">{{ row.displayType }}</label>
					</table-cell>
					<table-cell :column="doiListColumns[1]" :row="row">
						<input
							class="pkpFormField__input pkpFormField--text__input"
							:id="row.uid"
							type="text"
							:readonly="!(isEditingDois && !isSaving)"
							v-model="
								mutableDois.find((doi) => doi.uid === row.uid).identifier
							"
						/>
					</table-cell>
				</template>
			</pkp-table>
			<div
				class="listPanel__itemExpandedActions doiListPanel__itemExpandedActions"
			>
				<div
					class="doiListPanel__itemExpandedActions--actionsBar"
					v-if="
						item.versions.length > 1 &&
						!isEditingDois &&
						!isSaving &&
						versionDois
					"
				>
					{{
						__('doi.manager.versions.countStatement', {
							count: item.versions.length,
						})
					}}
					<button
						:ref="versionModalName"
						:class="'-linkButton'"
						@click="isModalOpenedVersion = true"
					>
						{{ __('doi.manager.versions.view') }}
					</button>
				</div>
				<spinner v-if="isSaving" />
				<pkp-button
					:is-disabled="isDeposited || isSaving"
					@click="isEditingDois ? saveDois() : editDois()"
				>
					{{ isEditingDois ? __('common.save') : __('common.edit') }}
				</pkp-button>
			</div>

			<!-- Registration Agency Actions -->
			<div
				class="doiListItem__depositorDetails"
				v-if="isRegistrationPluginConfigured"
			>
				<div class="doiListItem__depositorName">
					{{ registrationAgencyInfo['displayName'] }}
				</div>

				<span class="doiListItem__depositorDescription" v-if="item.isPublished">
					{{
						isDeposited
							? itemRegistrationAgency === null
								? __('manager.dois.registration.manuallyMarkedRegistered')
								: __('manager.dois.registration.submittedDescription', {
										registrationAgency: itemRegistrationAgencyName,
								  })
							: __('manager.dois.registration.notSubmittedDescription', {
									registrationAgency: registrationAgencyInfo['displayName'],
							  })
					}}
				</span>
				<span class="doiListItem__depositorDescription" v-else>
					{{ __('manager.dois.registration.notPublishedDescription') }}
				</span>
				<div class="doiListItem__depositorActions">
					<pkp-button
						ref="recordedMessageModalButton"
						:is-disabled="isEditingDois"
						@click="isModalOpenedRegisteredMessage = true"
						v-if="isDeposited && hasRegisteredMessage"
					>
						{{ __('manager.dois.registration.viewRecord') }}
					</pkp-button>
					<pkp-button
						:is-disabled="isEditingDois"
						@click="handleDepositorActions"
						v-else-if="!isDeposited && item.isPublished"
					>
						{{ __('manager.dois.registration.depositDois') }}
					</pkp-button>
					<pkp-button
						ref="errorMessageModalButton"
						:is-disabled="isEditingDois"
						v-if="hasErrors && hasErrorMessage"
						@click="isModalOpenedErrorMessage = true"
					>
						{{ __('manager.dois.registration.viewError') }}
					</pkp-button>
				</div>
			</div>
		</div>
		<!-- Messages Modals -->
		<!-- Error Message Modal -->
		<modal
			:close-label="__('common.close')"
			:name="`errorMessageModal-${item.id}`"
			:title="__('manager.dois.registration.viewError.title')"
			:open="isModalOpenedErrorMessage"
			@close="isModalOpenedErrorMessage = false"
		>
			<p>{{ registrationAgencyInfo['errorMessagePreamble'] }}</p>
			<div class="depositErrorMessage">
				<pre>{{ currentVersionDoiObjects[0]['errorMessage'] }}</pre>
			</div>
		</modal>
		<!-- Recorded Message Modal -->
		<modal
			:close-label="__('common.close')"
			name="registeredMessageModal"
			:title="__('manager.dois.registration.viewError.title')"
			:open="isModalOpenedRegisteredMessage"
			@close="isModalOpenedRegisteredMessage = false"
		>
			<p>{{ registrationAgencyInfo['registeredMessagePreamble'] }}</p>
			<p>{{ currentVersionDoiObjects[0]['registeredMessage'] }}</p>
		</modal>
		<!-- Version Modal -->
		<modal
			:close-label="__('common.close')"
			:name="versionModalName"
			:title="__('doi.manager.versions.modalTitle')"
			:open="isModalOpenedVersion"
			@close="isModalOpenedVersion = false"
		>
			<div
				class="doiListItem__versionContainer"
				v-for="version in item.versions"
				:key="version.id"
			>
				<a
					:href="version.urlPublished"
					target="_blank"
					rel="noopener noreferrer"
				>
					{{ getVersionHeader(version) }}
				</a>
				<pkp-table
					:columns="doiListColumns"
					:rows="
						item.doiObjects.filter(
							(doiObject) => doiObject.versionNumber === version.versionNumber
						)
					"
				>
					<template slot-scope="{row}">
						<table-cell :column="doiListColumns[0]" :row="row">
							<label :for="row.uid">{{ row.displayType }}</label>
						</table-cell>
						<table-cell :column="doiListColumns[1]" :row="row">
							<input
								class="pkpFormField__input pkpFormField--text__input"
								:id="row.uid"
								type="text"
								:readonly="!(isEditingDois && !isSaving)"
								v-model="
									mutableDois.find((doi) => doi.uid === row.uid).identifier
								"
							/>
						</table-cell>
					</template>
				</pkp-table>
			</div>

			<div class="doiListItem__versionContainer--actionsBar">
				<spinner v-if="isSaving" />
				<pkp-button
					:is-disabled="isDeposited || isSaving"
					@click="isEditingDois ? saveDois() : editDois()"
				>
					{{ isEditingDois ? __('common.save') : __('common.edit') }}
				</pkp-button>
			</div>
		</modal>
	</div>
</template>

<script>
import Expander from '@/components/Expander/Expander.vue';
import Modal from '@/components/Modal/Modal.vue';
import PkpTable from '@/components/Table/Table.vue';
import TableCell from '@/components/Table/TableCell';

export default {
	name: 'DoiListItem',
	components: {
		Expander,
		Modal,
		PkpTable,
		TableCell,
	},
	props: {
		apiUrl: {
			type: String,
			required: true,
		},
		doiApiUrl: {
			type: String,
			required: true,
		},
		doiPrefix: {
			type: String,
			default() {
				return '';
			},
		},
		/**
		 * Publication version info
		 * @typedef {Object} PublicationVersionInfo
		 * @property {Number} id
		 * @property {boolean} isCurrentVersion
		 * @property {Number} versionNumber
		 * @property {string} urlPublished
		 * @property {?string} datePublished
		 */
		/**
		 * Publication Object with a DOI
		 * @typedef {Object} DoiObject
		 * @property {Number} depositStatus - One of Doi::STATUS_* constants
		 * @property {string} displayType - Item type to display to user, localized
		 * @property {Number} doiId - Doi object ID
		 * @property {?string} errorMessage - Deposit error message, if any
		 * @property {Number} id - Publication object ID
		 * @property {string} identifier - DOI
		 * @property {boolean} isCurrentVersion - Whether DOI belongs to currently published version. Defaults to true for issues.
		 * @property {?string} registeredMessage - Deposit registration message, if any
		 * @property {string} type - Item type for internal use
		 * @property {string} uid - Unique identifier for item in list
		 * @property {string} updateWithNewDoiEndpoint - API endpoint to add new DOI to item if none exists
		 * @property {string} registrationAgency - Name of registration agency if registered, null if marked manually registered
		 */
		/**
		 * Details about top-level publication object and its DOIs
		 * @typedef {Object} DoiListItemData
		 * @property {Number} id - Top-level publication object ID
		 * @property {string} type - Top-level item type
		 * @property {string} title - Display title
		 * @property {string} urlPublished - URL for item
		 * @property {boolean} isPublished - Whether item published
		 * @property {PublicationVersionInfo} versions - Info on publication version
		 * @property {DoiObject[]} doiObjects - All associated publication objects than can have a DOI
		 */
		/** @type {DoiListItemData} */
		item: {
			type: Object,
			required: true,
		},
		isExpanded: {
			type: Boolean,
		},
		isSelected: {
			type: Boolean,
		},
		enabledDoiTypes: {
			type: Array,
			default() {
				return [];
			},
		},
		versionDois: {
			type: Boolean,
			required: true,
		},
		registrationAgencyInfo: {
			type: Object,
			required: true,
		},
		registrationAgencyNames: {
			type: Object,
			default() {
				return {};
			},
		},
	},
	data() {
		return {
			doiListColumns: [
				{
					name: 'type',
					label: this.__('common.type'),
					value(row) {
						return row.displayType;
					},
				},
				{
					name: 'doi',
					label: this.__('manager.dois.title'),
					value: 'value',
				},
			],
			isEditingDois: false,
			isEditingDoisEnabled: false,
			isSaving: false,
			mutableDois: [],
			itemsToUpdate: {},
			isModalOpenedErrorMessage: false,
			isModalOpenedRegisteredMessage: false,
			isModalOpenedVersion: false,
		};
	},
	computed: {
		/**
		 * Gets DOI objects for current publication version only
		 * @returns {DoiObject[]}
		 */
		currentVersionDoiObjects() {
			return this.item.doiObjects.filter(
				(doiObject) => doiObject.isCurrentVersion
			);
		},
		/**
		 * Gets string for DOI deposit display
		 *
		 * @return {String}
		 */
		depositStatusString() {
			switch (this.itemDepositStatus) {
				case pkp.const.DOI_STATUS_UNREGISTERED:
					return this.needsDoi
						? this.__('manager.dois.status.needsDoi')
						: this.__('manager.dois.status.unregistered');
				case pkp.const.DOI_STATUS_SUBMITTED:
					return this.__('manager.dois.status.submitted');
				case pkp.const.DOI_STATUS_REGISTERED:
					return this.__('manager.dois.status.registered');
				case pkp.const.DOI_STATUS_ERROR:
					return this.__('manager.dois.status.error');
				case pkp.const.DOI_STATUS_STALE:
					return this.__('manager.dois.status.stale');
				default:
					return '';
			}
		},
		/**
		 * Has the current item been deposited.
		 *
		 * @return {Boolean}
		 */
		isDeposited() {
			const depositedStatuses = [
				pkp.const.DOI_STATUS_SUBMITTED,
				pkp.const.DOI_STATUS_REGISTERED,
			];
			return depositedStatuses.includes(this.itemDepositStatus);
		},
		/**
		 * Whether registration agency plugin is enabled and configured
		 */
		isRegistrationPluginConfigured() {
			return this.registrationAgencyInfo['isConfigured'];
		},
		/**
		 * Whether deposited metadata is out of sync with current metadata
		 */
		isStale() {
			return this.itemDepositStatus === pkp.const.DOI_STATUS_STALE;
		},
		/**
		 * Gets the deposit status for the item as a whole to display when in collapsed view.
		 * NB: Uses current publication as reference.
		 * FIXME: Handle different statuses for a single item (not possible with Crossref plugin currently)
		 */
		itemDepositStatus() {
			return this.currentVersionDoiObjects.length !== 0
				? this.currentVersionDoiObjects[0]['depositStatus']
				: pkp.const.DOI_STATUS_UNREGISTERED;
		},
		/**
		 * Returns a machine-readable key indicating how this DOI was registered, if at all
		 * @return {string|null}
		 */
		itemRegistrationAgency: function () {
			return this.item.doiObjects.length !== 0
				? this.item.doiObjects[0]['registrationAgency']
				: null;
		},
		/**
		 * Returns the localized name of a given registration agency, falling back to the machine-readable key
		 * @return {string}
		 */
		itemRegistrationAgencyName: function () {
			const key = this.itemRegistrationAgency;

			return this.registrationAgencyNames.hasOwnProperty(key)
				? this.registrationAgencyNames[key]
				: `[${key}]`;
		},
		/**
		 * Whether item has the DOI_STATUS_ERROR status
		 */
		hasErrors() {
			return this.itemDepositStatus === pkp.const.DOI_STATUS_ERROR;
		},
		/**
		 * Checks whether DOI object has an associated error message
		 */
		hasErrorMessage() {
			const messageField = this.currentVersionDoiObjects[0]['errorMessage'];
			return (
				messageField !== null &&
				messageField !== undefined &&
				messageField !== ''
			);
		},
		/**
		 * Checks whether DOI object has an associated registration message
		 * @returns {boolean}
		 */
		hasRegisteredMessage() {
			const messageField =
				this.currentVersionDoiObjects[0]['registeredMessage'];
			return (
				messageField !== null &&
				messageField !== undefined &&
				messageField !== ''
			);
		},
		/**
		 * Whether this object still needs to have DOIs assigned
		 *
		 * @return {boolean}
		 */
		needsDoi() {
			const hasAnyDois = this.item.doiObjects.some(
				(doiObject) => doiObject.doiId !== null
			);
			return !hasAnyDois;
		},
		/**
		 * Display string for publication status
		 *
		 * @return {String}
		 */
		publicationStatusLabel() {
			if (this.item.isPublished) {
				return this.__('publication.status.published');
			} else {
				return this.__('publication.status.unpublished');
			}
		},
		/**
		 * ID for versions modal
		 * @returns {string}
		 */
		versionModalName() {
			return this.item.type + '-versionsModal-' + this.item.id;
		},
	},
	methods: {
		updateMutableDois(doiObjects) {
			let dois = [];
			doiObjects.forEach((item) => {
				dois.push({
					uid: item.uid,
					doiId: item.doiId,
					identifier: item.identifier,
					pubObjectType: item.type,
					pubObjectId: item.id,
				});
			});

			this.mutableDois = dois;
		},
		editDois() {
			this.isEditingDois = true;
		},
		saveDois() {
			this.mutableDois.forEach((mutableDoi) => {
				const oldDoiItem = this.item.doiObjects.find(
					(item) => item.uid === mutableDoi.uid
				);
				if (oldDoiItem.identifier !== mutableDoi.identifier) {
					let items = {...this.itemsToUpdate};
					items[mutableDoi.uid] = {
						isFinished: false,
						isSuccess: false,
						...mutableDoi,
					};
					this.itemsToUpdate = items;
				}
			});

			this.isSaving = true;
			if (Object.keys(this.itemsToUpdate).length !== 0) {
				Object.keys(this.itemsToUpdate).forEach((itemId) => {
					this.postUpdatedDoi(this.itemsToUpdate[itemId]);
				});
			} else {
				this.isSaving = false;
				this.isEditingDois = false;
			}
		},
		postUpdatedDoi(itemToUpdate) {
			// Check if this is the first time a DOI is being added to the object
			if (itemToUpdate.doiId === null) {
				// If so we need to add the DOI and associate with the pub object
				$.when(this.addNewDoi(itemToUpdate))
					.then(() => {
						this.addDoiToPubObject(itemToUpdate);
					})
					.catch((response) => {
						// Complete called here instead of in addDoiToPubObject since it will never be called
						this.postUpdatedDoiComplete(response, itemToUpdate.uid);
					});
			} else if (itemToUpdate.identifier === '') {
				// Otherwise, if the DOI identifier field is empty, the whole DOI object should be deleted
				this.deleteDoi(itemToUpdate);
			} else {
				this.editDoi(itemToUpdate);
			}
		},
		/**
		 * AJAX call to create a brand-new DOI object
		 */
		addNewDoi(itemToUpdate) {
			return $.ajax({
				url: `${this.doiApiUrl}`,
				type: 'POST',
				headers: {
					'X-Csrf-Token': pkp.currentUser.csrfToken,
					contentType: 'application/x-www-form-urlencoded',
				},
				data: {
					contextId: this.item.contextId,
					doi: `${itemToUpdate.identifier}`,
				},
				success(response) {
					itemToUpdate.doiId = response.id;
				},
				error: (response) =>
					this.postUpdatedDoiError(response, itemToUpdate.uid),
			});
		},
		/**
		 * Add newly created DOI ID to associated pubObject
		 */
		addDoiToPubObject(itemToUpdate) {
			return $.ajax({
				url: this.item.doiObjects.find((item) => item.uid === itemToUpdate.uid)
					.updateWithNewDoiEndpoint,
				type: 'POST',
				headers: {
					'X-Csrf-Token': pkp.currentUser.csrfToken,
					'X-Http-Method-Override': 'PUT',
					contentType: 'application/x-www-form-urlencoded',
				},
				data: {doiId: itemToUpdate.doiId},
				success: (response) =>
					this.postUpdatedDoiSuccess(response, itemToUpdate.uid),
				error: (response) =>
					this.postUpdatedDoiError(response, itemToUpdate.uid),
				complete: (response) =>
					this.postUpdatedDoiComplete(response, itemToUpdate.uid),
			});
		},
		/**
		 * Edit a DOI object directly
		 */
		editDoi(itemToUpdate) {
			let data = {
				doi: itemToUpdate.identifier,
			};

			// Handle editing of DOIs differently when versioning is enabled.
			// See PKP\API\v1\dois\PKPDoiHandler::edit() for more details.
			if (this.versionDois) {
				data.pubObjectType = itemToUpdate.pubObjectType;
				data.pubObjectId = itemToUpdate.pubObjectId;
			}

			return $.ajax({
				url: `${this.doiApiUrl}/${itemToUpdate.doiId}`,
				type: 'POST',
				headers: {
					'X-Csrf-Token': pkp.currentUser.csrfToken,
					'X-Http-Method-Override': 'PUT',
					contentType: 'application/x-www-form-urlencoded',
				},
				data,
				success: (response) =>
					this.postUpdatedDoiSuccess(response, itemToUpdate.uid),
				error: (response) =>
					this.postUpdatedDoiError(response, itemToUpdate.uid),
				complete: (response) =>
					this.postUpdatedDoiComplete(response, itemToUpdate.uid),
			});
		},
		/**
		 * Delete a DOI object directly
		 */
		deleteDoi(itemToUpdate) {
			let data = {};

			// Handle editing of DOIs differently when versioning is enabled.
			// See PKP\API\v1\dois\PKPDoiHandler::delete() for more details.
			if (this.versionDois) {
				data.pubObjectType = itemToUpdate.pubObjectType;
				data.pubObjectId = itemToUpdate.pubObjectId;
			}

			return $.ajax({
				url: `${this.doiApiUrl}/${itemToUpdate.doiId}`,
				type: 'POST',
				headers: {
					'X-Csrf-Token': pkp.currentUser.csrfToken,
					'X-Http-Method-Override': 'DELETE',
				},
				data,
				success: (response) =>
					this.postUpdatedDoiSuccess(response, itemToUpdate.uid),
				error: (response) =>
					this.postUpdatedDoiError(response, itemToUpdate.uid),
				complete: (response) =>
					this.postUpdatedDoiComplete(response, itemToUpdate.uid),
			});
		},
		/**
		 * Callback to fire when the form submission's ajax request has been
		 * returned successfully
		 *
		 * @param {Object} response The response to the AJAX request
		 * @param {String} itemUid Unique ID to identify object change requested
		 */
		postUpdatedDoiSuccess(response, itemUid) {
			let items = {...this.itemsToUpdate};
			items[itemUid].isSuccess = true;
			this.itemsToUpdate = items;
		},
		/**
		 * Callback to fire when the form submission's ajax request has been
		 * returned with errors
		 *
		 * @param {Object} response The response to the AJAX request
		 * @param {String} itemUid Unique ID to identify object change requested
		 */
		postUpdatedDoiError(response, itemUid) {
			let items = {...this.itemsToUpdate};
			items[itemUid].isSuccess = false;
			this.itemsToUpdate = items;
		},
		/**
		 * Callback to fire when the form submission's ajax request has been
		 * returned, and the success or error callbacks have already been fired
		 *
		 * @param {Object} response The response to the AJAX request
		 * @param {String} itemUid Unique ID to identify object change requested
		 */
		postUpdatedDoiComplete(response, itemUid) {
			let items = {...this.itemsToUpdate};
			items[itemUid].isFinished = true;
			this.itemsToUpdate = items;

			const isAllDoisUpdated = Object.keys(this.itemsToUpdate).every(
				(itemUid) => this.itemsToUpdate[itemUid].isFinished === true
			);

			if (isAllDoisUpdated) {
				let items = {...this.itemsToUpdate};
				let didUpdatesFail = false;

				Object.keys(items).forEach((itemUid) => {
					if (!items[itemUid].isSuccess) {
						didUpdatesFail = true;
						delete items[itemUid];
					}
				});
				this.itemsToUpdate = items;

				if (didUpdatesFail) {
					pkp.eventBus.$emit(
						'notify',
						this.__('manager.dois.update.partialFailure'),
						'warning'
					);
				}

				if (Object.keys(this.itemsToUpdate).length !== 0) {
					let self = this;

					// Get updated submission or issue
					$.ajax({
						url: `${this.apiUrl}/${this.item.id}`,
						type: 'GET',
						success(response) {
							self.$emit('update-successful-doi-edits', response);
						},
						error(response) {
							self.ajaxErrorCallback(response);
							// Or tell DOI list panel reload everything
							// or force reload entire page
						},
						complete(response) {
							self.itemsToUpdate = {};
						},
					});
				} else {
					// If there were no successful updates, something has failed and we need to
					// manually refresh the DOIs in the text boxes.
					this.updateMutableDois(this.item.doiObjects);
				}

				this.isSaving = false;
				this.isEditingDois = false;
			}
		},
		handleDepositorActions() {
			return this.isDeposited ? this.viewRecord() : this.triggerDeposit();
		},
		viewRecord() {
			this.isModalOpenedRegisteredMessage = true;
		},
		triggerDeposit() {
			this.$emit('deposit-triggered', [this.item.id], 'deposit');
		},
		/**
		 * Toggles item as selected and notifies DoiListPanel
		 */
		toggleSelected() {
			this.$emit('select-item', this.item.id);
		},
		toggleExpanded() {
			this.$emit('expand-item', this.item.id);
		},
		/**
		 * @param {PublicationVersionInfo} version
		 */
		getVersionHeader(version) {
			const dateInfo =
				version.datePublished !== null
					? `(${version.datePublished})`
					: this.__('publication.status.unpublished');
			return `${this.__('publication.version', {
				version: version.versionNumber,
			})} ${dateInfo}`;
		},
	},
	mounted() {
		this.updateMutableDois(this.item.doiObjects);
	},
	watch: {
		item: function () {
			this.updateMutableDois(this.item.doiObjects);
		},
	},
};
</script>

<style lang="less">
@import '../../../styles/_import';

.depositErrorMessage {
	background: rgb(234, 237, 238);
	> pre {
		white-space: pre-wrap;
	}
}

.doiListItem__depositorDetails {
	//width: 100%;
	//max-width: 100%;
	border: 1px solid #eee;
	//border-collapse: collapse;
	//border-radius: 2px;
	padding: 1rem;
	margin-top: 0.5rem;
}

.doiListItem__depositorName {
	margin: 0;
	font-size: @font-base;
	font-weight: @bold;
}

.doiListItem__depositorDescription {
	font-size: @font-sml;
	line-height: 1.5rem;
	flex: 1;
	min-width: 0;
}

.doiListItem__depositorActions {
	margin-top: 0.5rem;
	text-align: right;

	> button {
		margin-left: 0.25rem;
	}
}

.doiListItem__doiDetail {
	display: flex;
	flex: 1;
	min-width: 0;

	> * {
		white-space: nowrap;
	}

	// Space between each button or action
	> * + * {
		margin-left: 0.25rem;
	}
}

.doiListItem__doiDetail--editButton {
	margin-top: 0.25rem;
	margin-left: 0.25rem;
	margin-right: 0.25rem;
}

.doiListItem__emphasis {
	font-weight: 700;
}

.doiListItem__itemTitle {
	font-weight: 400;
}

.doiListItem__itemMetadata {
	font-size: @font-tiny;
	line-height: 1.5em;
	color: @text;
	margin-left: 0.75rem;
}

.doiListItem__selectWrapper {
	display: flex;
	align-items: center;
	margin-left: -1rem;
}

.doiListItem__selector {
	line-height: 100%;
	width: 3rem;
	padding-left: 1rem;
}

.doiListItem__itemMetadata--badge {
	margin-right: 0.25rem;
}

.listPanel__itemExpanded--doi {
	margin-left: 2.25rem;
}

.listPanel__item--doi .listPanel__itemExpanded .pkpTable {
	margin-top: 0.5rem;
}

.doiListItem__versionContainer {
	margin-top: 0.5rem;
}

.doiListItem__versionContainer--actionsBar {
	display: flex;
	align-items: center;
	justify-content: end;
	margin-top: 0.5rem;
}

.doiListPanel__itemExpandedActions {
	display: flex;
	align-items: center;
	justify-content: end;
}

.doiListPanel__itemExpandedActions--actionsBar {
	padding-right: 0.5rem;
}
</style>
