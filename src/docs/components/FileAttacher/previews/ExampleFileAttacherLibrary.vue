<script>
/**
 * This example implementation overrides the API request to load
 * submission files so that the preview works in the UI Library.
 */
import FileAttacherLibrary from '@/components/FileAttacher/FileAttacherLibrary.vue';

const file = {
	id: 1,
	filename: 'example-file.pdf',
	name: {
		en: 'Example File',
	},
	mimetype: 'application/pdf',
	documentType: 'pdf',
	submissionId: 1,
	type: 1,
	typeName: 'Marketing',
	url: 'https://example.org',
};

export default {
	extends: FileAttacherLibrary,
	methods: {
		getFiles() {
			this.isLoading = true;
			this.files = [];
			setTimeout(() => {
				this.files = [
					{...file},
					{
						...file,
						id: 2,
						filename: file.filename.repeat(6),
						name: {
							en: file.name.en.repeat(6),
						},
					},
				];
				this.isLoading = false;
			}, 1000);
		},
	},
};
</script>
