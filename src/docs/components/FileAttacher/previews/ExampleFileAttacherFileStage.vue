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
			this.items = [];
			setTimeout(() => {
				this.items = [...submissionFiles];
				this.isLoading = false;
			}, 1000);
		}
	}
};
</script>
