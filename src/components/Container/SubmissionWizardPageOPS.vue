<script type="text/javascript">
import SubmissionWizardPage from './SubmissionWizardPage.vue';

export default {
	extends: SubmissionWizardPage,
	data() {
		return {
			galleys: [],
		};
	},
	methods: {
		addGalley(galley) {
			this.galleys.push(galley);
		},
		editGalley(galley) {
			this.galleys = this.galleys.map((g) => {
				return g.id === galley.id ? galley : g;
			});
		},
		deleteGalley(data) {
			this.galleys = this.galleys.filter((g) => g.id !== data.id);
		},
		setSubmissionFile(submissionFile) {
			this.galleys = this.galleys.map((g) => {
				if (g.id === submissionFile.assocId) {
					g.submissionFileId = submissionFile.id;
					g.file = {...submissionFile};
				}
				return g;
			});
		},
	},
	created() {
		pkp.eventBus.$on('galley:added', this.addGalley);
		pkp.eventBus.$on('galley:edited', this.editGalley);
		pkp.eventBus.$on('galley:deleted', this.deleteGalley);
		pkp.eventBus.$on('submissionFile:added', this.setSubmissionFile);
		pkp.eventBus.$on('submissionFile:edited', this.setSubmissionFile);
	},
	destroyed() {
		pkp.eventBus.$off('galley:added');
		pkp.eventBus.$off('galley:edited');
		pkp.eventBus.$off('submissionFile:added');
		pkp.eventBus.$off('submissionFile:edited');
	},
};
</script>
