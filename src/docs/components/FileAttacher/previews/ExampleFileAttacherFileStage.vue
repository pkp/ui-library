<script>
/**
 * This example implementation overrides the API request to load
 * submission files so that the preview works in the UI Library.
 */
import FileAttacherFileStage from '@/components/FileAttacher/FileAttacherFileStage.vue';
import submissionFiles from '@/docs/data/submissionFiles';

export default {
	extends: FileAttacherFileStage,
	methods: {
		getFiles() {
			this.isLoading = true;
			this.files = [];
			setTimeout(() => {
				this.files = [
					...submissionFiles,
					{
						...submissionFiles[0],
						id: 235,
						name: {
							en: submissionFiles[0].name.en.repeat(3),
						},
					},
				];
				this.isLoading = false;
			}, 1000);
		},
	},
};
</script>
