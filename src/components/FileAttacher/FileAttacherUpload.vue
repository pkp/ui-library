<template>
	<div class="fileAttacherUpload">
		<div class="fileAttacherUpload__wrapper">
			<div v-if="!files.length" class="fileAttacherUpload__prompt">
				<p>
					{{ dragAndDropMessage }}
					<button class="-linkButton" @click="selectFile">
						{{ dragAndDropOrUploadMessage }}
					</button>
				</p>
			</div>
			<div v-else class="fileAttacherUpload__files">
				<template v-for="(file, i) in files">
					<template v-if="'progress' in file">
						<file-upload-progress
							:key="i"
							cancel-upload-label="Cancel Upload"
							:errors="file.errors"
							:name="file.name"
							:progress="file.progress"
							@cancel="removeFile(i)"
						/>
					</template>
					<div v-else :key="i" class="fileAttacherUploader__uploadedFile">
						<file
							:id="'FileAttacherUpload__UploadedFile__' + i"
							:name="file.form ? file.form.name : file.name"
							:document-type="file.documentType || 'default'"
						/>
						<pkp-button
							:aria-describedby="'FileAttacherUpload__UploadedFile__' + i"
							class="fileAttacherUploader__uploadedFile__remove"
							:is-warnable="true"
							@click="removeFile(i)"
						>
							<span class="aria-hidden">{{ t('common.remove') }}</span>
							<span class="-screenReader">
								{{
									removeItemLabel.replace(
										'{$item}',
										file.form ? file.form.name : file.name,
									)
								}}
							</span>
						</pkp-button>
					</div>
				</template>
			</div>
			<file-uploader
				id="previewFileUploader"
				ref="uploader"
				:api-url="temporaryFilesApiUrl"
				:files="files"
				:options="dropzoneOptions"
				upload-progress-label="Uploading {$percent}% complete"
				@updated:files="updateFiles"
			/>
		</div>
		<button-row class="fileAttacher__footer">
			<template #end>
				<pkp-button :is-link="true" @click="$emit('cancel')">
					<icon icon="long-arrow-left" :inline="true" />
					{{ backLabel }}
				</pkp-button>
			</template>
			<pkp-button @click="selectFile">
				{{ addFilesLabel }}
			</pkp-button>
			<pkp-button
				:is-primary="true"
				:is-disabled="!files.length || isUploading"
				@click="$emit('selected:files', files)"
			>
				{{ attachFilesLabel }}
			</pkp-button>
		</button-row>
	</div>
</template>

<script>
import ButtonRow from '@/components/ButtonRow/ButtonRow.vue';
import File from '@/components/File/File.vue';
import FileUploader from '@/components/FileUploader/FileUploader.vue';
import FileUploadProgress from '@/components/FileUploadProgress/FileUploadProgress.vue';

export default {
	name: 'FileAttacherUpload',
	components: {
		ButtonRow,
		File,
		FileUploader,
		FileUploadProgress,
	},
	props: {
		addFilesLabel: {
			type: String,
			required: true,
		},
		attachFilesLabel: {
			type: String,
			required: true,
		},
		backLabel: {
			type: String,
			required: true,
		},
		component: {
			type: String,
			required: true,
		},
		dragAndDropMessage: {
			type: String,
			required: true,
		},
		dragAndDropOrUploadMessage: {
			type: String,
			required: true,
		},
		dropzoneOptions: {
			type: Object,
			required: true,
		},
		removeItemLabel: {
			type: String,
			required: true,
		},
		temporaryFilesApiUrl: {
			type: String,
			required: true,
		},
	},
	data() {
		return {
			files: [],
		};
	},
	computed: {
		/**
		 * Is a file upload in progress?
		 */
		isUploading() {
			return (
				this.files.filter((file) => 'progress' in file === true).length > 1
			);
		},
	},
	methods: {
		/**
		 * Remove an uploaded file
		 */
		removeFile(index) {
			this.files = this.files.filter((file, i) => {
				return i !== index;
			});
		},

		/**
		 * Open the file browser
		 */
		selectFile() {
			this.$refs.uploader.openFileBrowser();
		},

		/**
		 * Update the `files` with data from the uploader
		 */
		updateFiles(files) {
			this.files = [...files];
		},
	},
};
</script>

<style lang="less">
@import '../../styles/_import';

.fileAttacherUpload__wrapper {
	position: relative;
}

.fileAttacherUpload__prompt {
	display: flex;
	justify-content: center;
	align-items: center;
	min-height: 10rem;
	border: 2px dashed @bg-border-color-light;
	font-size: @font-sml;
}

.fileAttacherUpload__files {
	padding: 0.5rem 0;
}

.fileAttacherUploader__uploadedFile {
	display: flex;
	padding: 0.5rem 0;
}

.fileAttacherUploader__uploadedFile__remove {
	margin-left: auto;
}
</style>
