import {ref} from 'vue';
import FileUploader from './FileUploader.vue';
import FileUploadProgress from '@/components/FileUploadProgress/FileUploadProgress.vue';
import dropzoneOptions from '@/mocks/dropzoneOptions';
import {http, HttpResponse} from 'msw';

import './FileUploader.stories.less';

export default {
	title: 'Components/FileUploader',
	component: FileUploader,
};

export const Default = {
	render: (args) => ({
		components: {FileUploader, FileUploadProgress},
		setup() {
			const files = ref([]);
			const options = ref({...dropzoneOptions});
			// dom ref
			const uploader = ref(null);

			function remove(index) {
				files.value = files.value.filter((file, i) => i !== index);
			}

			function selectFile() {
				uploader.value.openFileBrowser();
			}

			function updateFiles(_files) {
				console.log('FILES:', JSON.stringify(_files, null, 2));
				files.value = [..._files];
			}

			return {args, files, options, uploader, remove, selectFile, updateFiles};
		},
		template: `
			<div class="previewFileUploader">
				<span v-if="!files.length" class="previewFileUploader__prompt">
					<p>
						Drag and drop files here or
						<button class="-linkButton" @click="selectFile">upload a file</button>
					</p>
				</span>
				<template v-else>
					<FileUploadProgress
						v-for="(file, i) in files"
						:key="i"
						cancel-upload-label="Cancel Upload"
						:errors="file.errors || []"
						:name="file.name"
						:progress="file.progress"
						@cancel="remove(i)"
					/>
				</template>
				<FileUploader
					id="previewFileUploader"
					ref="uploader"
					api-url="https://example.org"
					:files="files"
					:options="options"
					upload-progress-label="Uploading {$percent}% complete"
					@updated:files="updateFiles"
				/>
			</div>
		`,
	}),

	args: {},
	parameters: {
		// http://localhost:7003/index.php/publicknowledge/api/v1/temporaryFiles
		msw: {
			handlers: [
				http.post(
					'https://mock/index.php/publicknowledge/api/v1/temporaryFiles',
					async () => {
						return HttpResponse.json({
							id: 5,
							name: 'i-see-you-theme-from-avatar-violin-1.pdf',
							mimetype: 'application/pdf',
							documentType: 'pdf',
						});
					},
				),
			],
		},
	},
};
