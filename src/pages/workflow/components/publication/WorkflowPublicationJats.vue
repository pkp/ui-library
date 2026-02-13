<template>
	<div class="jatsPanel">
		<slot>
			<div v-if="hasLoadedContent" class="filePanel__ready">
				<div class="filePanel__header">
					<PkpHeader>
						<h2>{{ t('publication.jats') }}</h2>
						<template #actions>
							<!-- Upload button - always visible when publication is not published -->
							<PkpButton
								v-if="
									publication.status !== getConstant('STATUS_PUBLISHED') &&
									canEdit
								"
								ref="uploadXMLButton"
								@click="openFileBrowser"
							>
								{{ t('common.upload') }}
							</PkpButton>

							<!-- These only show when user-uploaded file exists (not default content) -->
							<template v-if="!isDefaultContent">
								<!-- More Information Button - opens FileInformationCenterHandler -->
								<PkpButton
									ref="moreInfoButton"
									@click="openFileInformationCenter"
								>
									{{ t('grid.action.moreInformation') }}
								</PkpButton>

								<!-- Delete button - deletes ALL revisions and reverts to default -->
								<PkpButton
									v-if="
										publication.status !== getConstant('STATUS_PUBLISHED') &&
										canEdit
									"
									:disabled="isLoading"
									:is-warnable="true"
									@click="openDeleteModal"
								>
									{{ t('common.delete') }}
								</PkpButton>
							</template>

							<!-- Download - always visible when no loading error -->
							<PkpButton
								v-if="workingJatsProps['loadingContentError'] == null"
								ref="downloadJatsXMLButton"
								@click="downloadJatsXML"
							>
								{{ t('common.download') }}
							</PkpButton>

							<!-- JATS Public Visibility Checkbox -->
							<label
								v-if="workingJatsProps['loadingContentError'] == null"
								class="jats-visibility-label"
							>
								<input
									type="checkbox"
									:checked="jatsPublicVisibility"
									:disabled="isUpdatingVisibility"
									@change="handleVisibilityChange($event)"
								/>
								<span>{{ t('publication.jats.makePublic') }}</span>
							</label>
						</template>
					</PkpHeader>
				</div>
				<div class="filePanel__items">
					<div class="filePanel__fileContent">
						<div v-if="workingJatsProps['loadingContentError']">
							{{ workingJatsProps['loadingContentError'] }}
						</div>
						<div v-else>
							<CodeHighlighter :code="workingJatsContent" language="xml" />
						</div>
					</div>
					<div v-if="workingJatsProps['loadingContentError'] == null">
						<div v-if="isDefaultContent" class="filePanel__hasData">
							<div class="filePanel__defaultContentFooter">
								<span>{{ t('publication.jats.autoCreatedMessage') }}</span>
							</div>
						</div>
						<div v-else>
							<div class="filePanel__fileContentFooter">
								<span>
									{{
										t('publication.jats.lastModified', {
											modificationDate: workingJatsProps.updatedAt,
											username: workingJatsProps.uploaderUserName,
										})
									}}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div v-else class="filePanel__loading">
				<span class="pkpSpinner" aria-hidden="true"></span>
			</div>
			<FileUploader
				:id="id + '-uploader'"
				ref="uploader"
				:api-url="publicationApiUrl"
				:files="newJatsFiles"
				:query-params="{fileStage}"
				:upload-progress-label="t('submission.upload.percentComplete')"
				@updated:files="setJatsFile"
			/>
		</slot>
	</div>
</template>

<script>
import {useId} from 'vue';
import PkpButton from '@/components/Button/Button.vue';
import PkpHeader from '@/components/Header/Header.vue';
import ajaxError from '@/mixins/ajaxError';
import dialog from '@/mixins/dialog.js';
import FileUploader from '@/components/FileUploader/FileUploader.vue';
import CodeHighlighter from '@/components/CodeHighlighter/CodeHighlighter.vue';
import {useUrl} from '@/composables/useUrl';
import {useLegacyGridUrl} from '@/composables/useLegacyGridUrl';
import {useLocalize} from '@/composables/useLocalize';
import {useNotify} from '@/composables/useNotify';
export default {
	components: {
		PkpButton,
		FileUploader,
		PkpHeader,
		CodeHighlighter,
	},
	mixins: [ajaxError, dialog],
	props: {
		canEdit: {
			type: Boolean,
			required: true,
		},
		submission: {
			type: Object,
			required: true,
		},
		publication: {
			type: Object,
			required: true,
		},
	},
	data() {
		return {
			isLoading: false,
			isModalOpenedForm: false,
			workingJatsProps: [],
			hasLoadedContent: false,
			newJatsFiles: [],
			id: useId(),
			isUpdatingVisibility: false,
			jatsPublicVisibility: false,
		};
	},
	computed: {
		isDefaultContent() {
			return this.workingJatsProps['isDefaultContent'];
		},
		workingJatsContent() {
			return this.workingJatsProps['jatsContent'];
		},
		/**
		 * URL to the API endpoint for the current publication
		 */
		publicationApiUrl() {
			const {apiUrl} = useUrl(this.publicationApiUrlRelative);

			return apiUrl.value;
		},
		publicationApiUrlRelative() {
			return `submissions/${this.submission.id}/publications/${this.publication.id}/jats`;
		},
		fileStage() {
			return pkp.const.SUBMISSION_FILE_JATS;
		},
		downloadDefaultJatsFileName() {
			const now = new Date();
			const dateString =
				now.getFullYear() +
				String(now.getMonth() + 1).padStart(2, '0') +
				String(now.getDate()).padStart(2, '0') +
				'-' +
				String(now.getHours()).padStart(2, '0') +
				String(now.getMinutes()).padStart(2, '0') +
				String(now.getSeconds()).padStart(2, '0');
			return `jats-${this.publication.id}-${dateString}.xml`;
		},
	},
	watch: {
		newJatsFiles(newValue, oldValue) {
			if (newValue != null && newValue.length > 0) {
				// Find the last item that is an API response (has isDefaultContent property)
				// On revisions, FileUploader appends new files to the array, so we need the last one
				const lastApiResponse = [...newValue]
					.reverse()
					.find((item) =>
						Object.prototype.hasOwnProperty.call(item, 'isDefaultContent'),
					);
				if (lastApiResponse) {
					this.workingJatsProps = lastApiResponse;
					this.hasLoadedContent = true;

					const {notify} = useNotify();
					notify(this.t('submission.uploadSuccessful'), 'success');
				}
			}
		},
		publication(newValue, oldValue) {
			if (newValue != null) {
				// Sync visibility state from publication
				this.jatsPublicVisibility = newValue.jatsPublicVisibility || false;
				this.fetchWorkingJatsFile();
			}
		},
	},
	created() {
		this.jatsPublicVisibility = this.publication?.jatsPublicVisibility || false;
		this.fetchWorkingJatsFile();
	},
	methods: {
		fetchWorkingJatsFile() {
			this.hasLoadedContent = false;

			$.ajax({
				url: this.publicationApiUrl,
				type: 'GET',
				context: this,
				headers: {
					'X-Csrf-Token': pkp.currentUser.csrfToken,
				},
				error: this.ajaxErrorCallback,
				success(r) {
					this.workingJatsProps = r;
				},
				complete(r) {
					this.hasLoadedContent = true;
				},
			});
		},
		/**
		 * Helper method to access a global constant in the template
		 *
		 * @return {Object}
		 */
		getConstant(constant) {
			return pkp.const[constant];
		},

		/**
		 * Open the file browser dialog
		 */
		openFileBrowser() {
			this.newJatsFiles = []; // Clear previous files before new upload
			this.$refs.uploader.openFileBrowser();
		},

		/**
		 * Open the File Information Center modal for the current JATS file
		 * Shows revision history, notes, and file metadata
		 */
		openFileInformationCenter() {
			const {localize} = useLocalize();
			const {openLegacyModal} = useLegacyGridUrl({
				component: 'informationCenter.FileInformationCenterHandler',
				op: 'viewInformationCenter',
				params: {
					submissionFileId: this.workingJatsProps.id,
					submissionId: this.submission.id,
					stageId: pkp.const.WORKFLOW_STAGE_ID_PRODUCTION,
				},
			});

			openLegacyModal(
				{
					title: `${this.t('informationCenter.informationCenter')}: ${localize(this.workingJatsProps.name)}`,
				},
				() => {
					// Refresh JATS file data on modal close
					// in case notes were added or other changes made
					this.fetchWorkingJatsFile();
				},
			);
		},

		/**
		 * Open delete modal
		 *
		 * @param {Number} id
		 */
		openDeleteModal() {
			this.openDialog({
				name: 'delete',
				title: this.t('publication.jats.confirmDeleteFileTitle'),
				message: this.t('publication.jats.confirmDeleteFileMessage'),
				actions: [
					{
						label: this.t('publication.jats.confirmDeleteFileButton'),
						isWarnable: true,
						callback: (close) => {
							this.isLoading = true;
							this.hasLoadedContent = false;

							$.ajax({
								url: this.publicationApiUrl,
								type: 'DELETE',
								context: this,
								headers: {
									'X-Csrf-Token': pkp.currentUser.csrfToken,
									'X-Http-Method-Override': 'DELETE',
								},
								error: this.ajaxErrorCallback,
								success(r) {
									close();
									this.setFocusIn(this.$el);

									this.workingJatsProps = r;
								},
								complete(r) {
									this.isLoading = false;
									this.hasLoadedContent = true;
								},
							});
						},
					},
					{
						label: this.t('common.cancel'),
						callback: (close) => close(),
					},
				],
				modalStyle: 'negative',
			});
		},

		/**
		 * Set the files
		 */
		setJatsFile(files) {
			this.newJatsFiles = files;
		},

		/**
		 * Handle visibility checkbox change with confirmation modal
		 */
		handleVisibilityChange(event) {
			const newValue = event.target.checked;

			this.openDialog({
				name: 'jatsVisibility',
				title: newValue
					? this.t('publication.jats.enableVisibilityTitle')
					: this.t('publication.jats.disableVisibilityTitle'),
				message: newValue
					? this.t('publication.jats.enableVisibilityMessage')
					: this.t('publication.jats.disableVisibilityMessage'),
				actions: [
					{
						label: this.t('common.confirm'),
						callback: (close) => {
							this.updateVisibility(newValue);
							close();
						},
					},
					{
						label: this.t('common.cancel'),
						callback: (close) => {
							// Reset checkbox to previous state
							event.target.checked = this.jatsPublicVisibility;
							close();
						},
					},
				],
			});
		},

		/**
		 * Update visibility setting via API
		 */
		updateVisibility(newValue) {
			this.isUpdatingVisibility = true;

			$.ajax({
				url: this.publicationApiUrl + '/visibility',
				type: 'POST',
				data: JSON.stringify({jatsPublicVisibility: newValue}),
				contentType: 'application/json',
				headers: {
					'X-Csrf-Token': pkp.currentUser.csrfToken,
					'X-Http-Method-Override': 'PUT',
				},
				context: this,
				error: (xhr) => {
					this.ajaxErrorCallback(xhr);
					// Reset checkbox on error
					this.jatsPublicVisibility = !newValue;
				},
				success: (response) => {
					this.jatsPublicVisibility = response.jatsPublicVisibility;
				},
				complete: () => {
					this.isUpdatingVisibility = false;
				},
			});
		},

		/**
		 * Download the Contents of the file
		 */
		downloadJatsXML() {
			// Ensure existingJatsFile.url is available and is a string containing the URL
			if (!this.workingJatsProps.isDefaultContent) {
				const downloadUrl = this.workingJatsProps.url;

				// Create a link element
				const link = document.createElement('a');
				link.href = downloadUrl;
				link.setAttribute('download', '');
				link.style.display = 'none';

				// Append to the DOM
				document.body.appendChild(link);

				// Programmatically click the link to trigger the download
				link.click();

				// Remove the link from the DOM
				document.body.removeChild(link);
			} else {
				const jatsContent = this.workingJatsProps.jatsContent;
				const blob = new Blob([jatsContent], {type: 'application/xml'});
				const blobUrl = URL.createObjectURL(blob);

				const link = document.createElement('a');
				link.href = blobUrl;
				link.setAttribute('download', this.downloadDefaultJatsFileName);
				link.style.display = 'none';
				document.body.appendChild(link);
				link.click();

				// Clean up the URL object
				URL.revokeObjectURL(blobUrl);
				document.body.removeChild(link);
			}
		},
	},
};
</script>

<style lang="less">
@import '../../../../styles/_import';

.jatsPanel {
	.filePanel__header {
		grid-column: span 12;
		background: #f3f3f3;
	}

	.filePanel__items {
		grid-column: span 12;
		background: white;
		padding: 20px;
	}

	.filePanel__fileContent {
		background: #f9f9f9;
		padding: 15px;
		border-radius: 5px;
	}

	.filePanel__fileContentFooter {
		margin-top: 10px;
		font-size: 0.9em;
		color: #666;
	}

	.center-div {
		text-align: center;
	}

	/* Add responsive design adjustments */
	@media (max-width: 768px) {
		.jatsPanel {
			grid-template-columns: repeat(1, 1fr);
		}
	}

	pre {
		white-space: pre-wrap; /* Since CSS 2.1 */
		white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
		white-space: -pre-wrap; /* Opera 4-6 */
		white-space: -o-pre-wrap; /* Opera 7 */
		word-wrap: break-word; /* Internet Explorer 5.5+ */
	}

	.jats-visibility-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
		font-size: 0.875rem;
		color: #333;
		margin-left: 1rem;
		white-space: nowrap;
	}

	.jats-visibility-label input[type='checkbox'] {
		width: 1.125rem;
		height: 1.125rem;
		cursor: pointer;
	}

	.jats-visibility-label input[type='checkbox']:disabled {
		cursor: wait;
		opacity: 0.6;
	}
}
</style>
