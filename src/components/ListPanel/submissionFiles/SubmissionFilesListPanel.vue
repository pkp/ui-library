<template>
	<div class="submissionFilesListPanel">
		<ListPanel :items="items" class="listPanel--submissionFiles">
			<template #header>
				<PkpHeader>
					<h2>{{ title }}</h2>
					<template #actions>
						<PkpButton ref="addFileButton" @click="openFileBrowser">
							{{ addFileLabel }}
						</PkpButton>
					</template>
				</PkpHeader>
			</template>

			<template #itemsEmpty>
				{{ emptyLabel }}
				<button class="-linkButton" @click="openFileBrowser">
					{{ emptyAddLabel }}
				</button>
			</template>

			<template #item="{item}">
				<slot name="item" :item="item">
					<SubmissionFilesListItem
						:api-url="apiUrl"
						:cancel-upload-label="cancelUploadLabel"
						:genre-prompt-label="genrePromptLabel"
						:file-stage="fileStage"
						:genres="genres"
						:item="item"
						:other-label="otherLabel"
						:stage-id="stageId"
						@cancel="cancelUpload"
						@edit="edit"
						@remove="remove"
						@update="updateItem"
					/>
				</slot>
			</template>
		</ListPanel>
		<FileUploader
			:id="id + '-uploader'"
			ref="uploader"
			:api-url="apiUrl"
			:filename-locale="primaryLocale"
			:files="items"
			:options="options"
			:query-params="{fileStage}"
			:upload-progress-label="uploadProgressLabel"
			@updated:files="setFiles"
		/>
	</div>
</template>

<script>
import FileUploader from '@/components/FileUploader/FileUploader.vue';
import ListPanel from '@/components/ListPanel/ListPanel.vue';
import PkpButton from '@/components/Button/Button.vue';
import PkpHeader from '@/components/Header/Header.vue';
import SubmissionFilesListItem from '@/components/ListPanel/submissionFiles/SubmissionFilesListItem.vue';
import dialog from '@/mixins/dialog.js';
import cloneDeep from 'clone-deep';
import SubmissionFilesEditModal from './SubmissionFilesEditModal.vue';
import {useModal} from '@/composables/useModal';
export default {
	components: {
		PkpButton,
		FileUploader,
		ListPanel,
		PkpHeader,
		SubmissionFilesListItem,
	},
	mixins: [dialog],
	props: {
		/** A localized string for the button to add a file. */
		addFileLabel: {
			type: String,
			required: true,
		},
		/** The URL to upload files to. */
		apiUrl: {
			type: String,
			required: true,
		},
		/** A localized string for the button to cancel an upload while it is being uploaded. */
		cancelUploadLabel: {
			type: String,
			required: true,
		},
		/** A localized string to show when there are no items in the list. */
		emptyLabel: {
			type: String,
			required: true,
		},
		/** A localized string for the button to upload a file when there are no items in the list. */
		emptyAddLabel: {
			type: String,
			required: true,
		},
		/** The file stage to upload the submission files to. See [Submission Files](https://docs.pkp.sfu.ca/dev/documentation/en/submission-files)  */
		fileStage: {
			type: Number,
			required: true,
		},
		/** The [Form](../?path=/docs/forms-form--docs) to select a file type. */
		form: {
			type: Object,
		},
		/** A localized string for the prompt to select a file type. */
		genrePromptLabel: {
			type: String,
			required: true,
		},
		/**  An array of file types. See usage guidance below. */
		genres: {
			type: Array,
			required: true,
		},
		/**  A unique id for this component.  */
		id: {
			type: String,
			required: true,
		},
		/** An array of files uploaded or being uploaded. */
		items: {
			type: Array,
			default() {
				return [];
			},
		},
		/** Pass [options](https://www.dropzonejs.com/#configuration-options) to Dropzone.js. */
		options: {
			type: Object,
			default() {
				return {};
			},
		},
		/** A localized string to describe files types other than the primary file types. */
		otherLabel: {
			type: String,
			required: true,
		},
		/** The primary locale for the submission files uploaded. This should match the submission's locale. */
		primaryLocale: {
			type: String,
			required: true,
		},
		/** A localized string to for the confirmation modal to remove a file. */
		removeConfirmLabel: {
			type: String,
			required: true,
		},
		/** The workflow stage id to upload files to. One of the `WORKFLOW_STAGE_ID_*` constants. */
		stageId: {
			type: Number,
			required: true,
		},
		/** The title of the list panel. */
		title: {
			type: String,
			required: true,
		},
		/** A localized string to show the upload progress. */
		uploadProgressLabel: {
			type: String,
			required: true,
		},
	},
	emits: [
		/** Emitted when a prop should be changed. Payload: `(id, newProps)`  */
		'set',
	],
	data() {
		return {
			activeForm: {},
			dragEventCounter: 0,
			editingLabel: '',
			isDragging: false,
			status: '',
		};
	},
	computed: {
		formModal() {
			return this.id + 'form';
		},
	},
	methods: {
		/**
		 * Cancel an upload in progress or completed but not yet
		 * saved as a submission file
		 *
		 * This will not remove a file once it has been uploaded.
		 * Use this.remove(item).
		 */
		cancelUpload(id) {
			this.$refs.uploader.cancelUpload(id);
		},

		/**
		 * Open the editing panel for a file
		 *
		 * @param {Object} item The item to edit
		 */
		edit(item) {
			let activeForm = {...cloneDeep(this.form)};
			activeForm.action =
				activeForm.action + '/' + item.id + '?stageId=' + this.stageId;
			// Set values that match the form fields
			activeForm.fields = activeForm.fields.map((field) => {
				if (item[field.name] != null) {
					field.value = item[field.name];
				}
				return field;
			});
			this.activeForm = activeForm;
			this.editingLabel = this.t('common.editItem', {
				name: this.localize(item.name),
			});
			const {openSideModal} = useModal();
			openSideModal(SubmissionFilesEditModal, {
				title: this.editingLabel,
				activeForm: this.activeForm,
				onSetForm: this.setForm,
				onFormSuccess: this.formSuccess,
			});
		},

		/**
		 * Fired when the edit form has been saved
		 *
		 * @param {Object} item The item to update
		 */
		formSuccess(item) {
			this.updateItem(item);
			const {closeSideModal} = useModal();
			closeSideModal(SubmissionFilesEditModal);

			this.activeForm = {};
			this.$el.querySelector('#edit-' + item.id).focus();
		},

		/**
		 * Open the file browser dialog
		 */
		openFileBrowser() {
			this.$refs.uploader.openFileBrowser();
		},

		/**
		 * Remove a file
		 *
		 * @param {Object} item The file in this.items to remove
		 */
		remove(item) {
			this.openDialog({
				name: 'remove',
				title: this.t('common.remove'),
				message: this.removeConfirmLabel,
				actions: [
					{
						label: this.t('common.yes'),
						isWarnable: true,
						callback: (close) => {
							$.ajax({
								url: this.apiUrl + '/' + item.id + '?stageId=' + this.stageId,
								type: 'POST',
								context: this,
								headers: {
									'X-Csrf-Token': pkp.currentUser.csrfToken,
									'X-Http-Method-Override': 'DELETE',
								},
								error: this.ajaxErrorCallback,
								success(r) {
									const items = this.items.filter((item) => item.id !== r.id);
									this.$emit('set', this.id, {items});
									close();
									this.$refs.addFileButton.$el.focus();
								},
							});
						},
					},
					{
						label: this.t('common.no'),
						callback: (close) => close(),
					},
				],
				modalStyle: 'negative',
			});
		},

		/**
		 * Set the files
		 */
		setFiles(files) {
			this.$emit('set', this.id, {items: files});
		},

		/**
		 * Update the data in the active form
		 *
		 * @param {Number} key The id of the form
		 * @param {Object} data Key/value map of the data to be changed
		 */
		setForm(key, data) {
			if (!this.activeForm) {
				return;
			}

			let activeForm = this.activeForm;
			Object.keys(data).forEach(function (key) {
				activeForm[key] = data[key];
			});
			this.activeForm = activeForm;
		},

		/**
		 * Update one of the items in the list
		 *
		 * @param {Object} newItem The item to update
		 */
		updateItem(newItem) {
			const items = this.items.map((item) => {
				return item.id === newItem.id ? newItem : item;
			});
			this.$emit('set', this.id, {items});
		},
	},
};
</script>

<style lang="less">
@import '../../../styles/_import';

// Restrict the drag-and-drop area to the panel
.submissionFilesListPanel {
	position: relative;
}
</style>
