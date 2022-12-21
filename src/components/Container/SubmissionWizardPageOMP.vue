<script type="text/javascript">
import SubmissionWizardPage from './SubmissionWizardPage.vue';

export default {
	extends: SubmissionWizardPage,
	data() {
		return {
			chapters: [],
		};
	},
	created() {
		const getChapter = (data) => {
			return {
				id: data.id,
				title: data.title,
				authors: data.authors,
			};
		};
		pkp.eventBus.$on('chapter:added', (data) =>
			this.chapters.push(getChapter(data))
		);
		pkp.eventBus.$on('chapter:edited', (data) => {
			this.chapters = this.chapters.map((chapter) =>
				chapter.id === data.id ? getChapter(data) : chapter
			);
		});
		pkp.eventBus.$on(
			'chapter:deleted',
			(data) =>
				(this.chapters = this.chapters.filter(
					(chapter) => chapter.id !== data.id
				))
		);
	},
};
</script>
