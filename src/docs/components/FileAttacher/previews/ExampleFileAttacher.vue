<script>
/**
 * This example implementation replaces file attachers that communicate
 * with the REST API with examples that load dummy data.
 */
import FileAttacher from '@/components/FileAttacher/FileAttacher.vue';
import FileAttacherFileStage from './ExampleFileAttacherFileStage.vue';

export default {
	extends: FileAttacher,
	components: {
		FileAttacherFileStage
	}
};
</script>
