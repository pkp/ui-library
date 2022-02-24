<template>
	<div class="fileAttacherUpload">
		<div class="fileAttacherUpload__wrapper">
			<div v-if="!files.length" class="fileAttacherUpload__prompt">
				<p>
					Drag and drop files here.
					<button class="-linkButton" @click="selectFile">
						Or upload a file
					</button>
				</p>
			</div>
			<div v-else class="fileAttacherUpload__files">
				<template v-for="(file, i) in files">
					<template v-if="'progress' in file">
						<file-upload-progress
							:key="i"
							cancelUploadLabel="Cancel Upload"
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
							:documentType="file.documentType || 'default'"
						/>
						<pkp-button
							:aria-describedby="'FileAttacherUpload__UploadedFile__' + i"
							class="fileAttacherUploader__uploadedFile__remove"
							:isWarnable="true"
							@click="removeFile(i)"
						>
							Remove
						</pkp-button>
					</div>
				</template>
			</div>
			<file-uploader
				ref="uploader"
				:apiUrl="temporaryFilesApiUrl"
				:files="files"
				id="previewFileUploader"
				:options="dropzoneOptions"
				uploadProgressLabel="Uploading {$percent}% complete"
				@updated:files="updateFiles"
			/>
		</div>
		<div class="fileAttacher__footer">
			<button class="fileAttacher__back -linkButton" @click="$emit('cancel')">
				<icon icon="long-arrow-left" :inline="true" />
				Back
			</button>
			<pkp-button @click="selectFile">
				Add Files
			</pkp-button>
			<pkp-button
				:isPrimary="true"
				:isDisabled="!files.length || isUploading"
				@click="$emit('selected:files', files)"
			>
				Attach Files
			</pkp-button>
		</div>
	</div>
</template>

<script>
import File from '@/components/File/File.vue';
import FileUploader from '@/components/FileUploader/FileUploader.vue';
import FileUploadProgress from '@/components/FileUploadProgress/FileUploadProgress.vue';

export default {
	name: 'FileAttacherUpload',
	components: {
		File,
		FileUploader,
		FileUploadProgress
	},
	props: {
		component: {
			type: String,
			required: true
		},
		dropzoneOptions: {
			type: Object,
			required: true
		},
		temporaryFilesApiUrl: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			files: []
		};
	},
	computed: {
		isUploading() {
			return this.files.filter(file => 'progress' in file === true).length > 1;
		}
	},
	methods: {
		removeFile(index) {
			this.files = this.files.filter((file, i) => {
				return i !== index;
			});
		},
		selectFile() {
			this.$refs.uploader.openFileBrowser();
		},
		updateFiles(files) {
			this.files = [...files];
		}
	}
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
