<template>
	<div class="jatsPanel">
		<slot>
			<div v-if="hasLoadedContent" class="filePanel__ready">
				<div class="filePanel__header">
					<pkp-header>
						<h2>{{ title }}</h2>
						<template #actions>
							<div v-if="isDefaultContent">
								<pkp-button 
									v-if="
										publication.status !== getConstant('STATUS_PUBLISHED') &&
										canEditPublication
									"
									ref="uploadXMLButton" @click="openFileBrowser"
								>
									{{ t('common.upload') }}
								</pkp-button>
							</div>
							<div v-else>
								<pkp-button
									v-if="
										publication.status !== getConstant('STATUS_PUBLISHED') &&
										canEditPublication
									"
									:disabled="isLoading"
									:isWarnable="true"
									@click="openDeleteModal"
								>
									{{ t('common.delete') }}
								</pkp-button>
							</div>
							<pkp-button ref="downloadJatsXMLButton" @click="downloadJatsXML">
								{{ t('common.download') }}
							</pkp-button>
						</template>
					</pkp-header>
				</div>
				<div class="filePanel__items">
					<div class="filePanel__fileContent">
						<pre v-highlightjs="workingJatsContent"><code class="xml"></code></pre>
					</div>
					<div>
						<div v-if="isDefaultContent" class="filePanel__hasData">
							<div class="filePanel__defaultContentFooter">
								<span>{{ t('publication.jats.autoCreatedMessage') }}</span>
							</div>
						</div>
						<div v-else>
							<div class="filePanel__fileContentFooter">
								<span>{{ lastModifiedAtActual }}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div v-else class="filePanel__loading">
				<span class="pkpSpinner" aria-hidden="true"></span>
			</div>
			<file-uploader
				ref="uploader"
				:apiUrl="publicationApiUrl"
				:filenameLocale="primaryLocale"
				:id="id + '-uploader'"
				:files="newJatsFiles"
				:options="options"
				:queryParams="{fileStage}"
				:uploadProgressLabel="uploadProgressLabel"
				@updated:files="setJatsFile"
			/>
		</slot>
	</div>
</template>

<script>
import Modal from '@/components/Modal/Modal.vue';
import PkpHeader from '@/components/Header/Header.vue';
import ajaxError from '@/mixins/ajaxError';
import dialog from '@/mixins/dialog.js';
import FileUploader from '@/components/FileUploader/FileUploader.vue';

export default {
	components: {
		FileUploader,
		Modal,
		PkpHeader,
	},
	mixins: [ajaxError, dialog],
	props: {
		canEditPublication: {
			type: Boolean,
			required: true,
		},
		id: {
			type: String,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		publicationApiUrlFormat: {
			type: String,
			required: true,
		},
		publication: {
			type: Object,
			required: true,
		},
		uploadProgressLabel: {
			type: String,
			required: true,
		},
		fileStage: {
			type: Number,
			required: true,
		},
		newJatsFiles: {
			type: Array,
			required: false,
			default() {
				return [];
			},
		},
		i18nConfirmDeleteFileTitle: {
			type: String,
			required: true,
		},
		i18nDeleteFileMessage: {
			type: String,
			required: true,
		},
		i18nConfirmDeleteFileButton: {
			type: String,
			required: true,
		},
		i18nLastModifiedAt: {
			type: String,
			required: true,
		},
		downloadDefaultJatsFileName: {
			type: String,
			required: false,
			default() {
				return 'submission-jats.xml';
			},
		},
	},
	data() {
		return {
			isLoading: false,
			isModalOpenedForm: false,
			workingJatsProps: [],
			hasLoadedContent: false,
		};
	},
	created() {
		this.fetchWorkingJatsFile();
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
			return this.publicationApiUrlFormat.replace(
				'{$publicationId}',
				this.publication.id,
			);
		},

		lastModifiedAtActual() {
			var actual = '';
			
			if (!this.isDefaultContent) {
				actual = this.i18nLastModifiedAt.replace(
					'{$modificationDate}',
					this.workingJatsProps.updatedAt,
				);

				actual = actual.replace(
					'{$username}',
					this.workingJatsProps.uploaderUserName,
				);
			}

			return actual;
		}
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
			this.$refs.uploader.openFileBrowser();
		},

		/**
		 * Open delete modal
		 *
		 * @param {Number} id
		 */
		openDeleteModal() {
			this.openDialog({
				name: 'delete',
				title: this.i18nConfirmDeleteFileTitle,
				message: this.i18nDeleteFileMessage,
				actions: [
					{
						label: this.i18nConfirmDeleteFileButton,
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
			});
		},

		/**
		 * Set the files
		 */
		setJatsFile(files) {
			this.$emit('set', this.id, {newJatsFiles: files});
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
				const blob = new Blob([jatsContent], { type: 'application/xml' });
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
	watch: {
		newJatsFiles(newValue, oldValue) {
			if (oldValue != null && oldValue[0] == null) {
				this.hasLoadedContent = false;
			} 

			if (newValue != null && newValue[0] != null) {
				if (newValue[0].hasOwnProperty('jatsContent')) {
					this.workingJatsProps = newValue[0];
					this.hasLoadedContent = true;
				}
			}
		},
		publication(newValue, oldValue) {
			if (newValue != null) {
				this.fetchWorkingJatsFile();
			}
		}
	}
};
</script>

<style lang="less">
@import '../../../styles/_import';

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

	.pkp-button {
		background: #007bff;
		border: none;
		padding: 10px 20px;
		color: white;
		border-radius: 5px;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}

	.pkp-button:hover {
		background: #0056b3;
	}

	.pkp-button:disabled {
		background: #ccc;
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
		white-space: pre-wrap;       /* Since CSS 2.1 */
		white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
		white-space: -pre-wrap;      /* Opera 4-6 */
		white-space: -o-pre-wrap;    /* Opera 7 */
		word-wrap: break-word;       /* Internet Explorer 5.5+ */
	}
}
</style>
