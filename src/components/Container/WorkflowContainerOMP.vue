<script type="text/javascript">
import WorkflowContainer from './WorkflowContainer.vue';

export default {
	name: 'WorkflowContainerOMP',
	extends: WorkflowContainer,
	data() {
		return {
			chaptersGridUrl: '',
			isLoadingWorkType: false,
		};
	},
	computed: {
		/**
		 * The name of the work type (Edited Volume or Monograph)
		 *
		 * @return string
		 */
		workTypeLabel() {
			if (this.submission.workType === pkp.const['WORK_TYPE_EDITED_VOLUME']) {
				return this.i18n.editedVolume;
			}
			return this.i18n.monograph;
		}
	},
	methods: {
		/**
		 * Load/reload the chapters grid
		 *
		 * @param Object publication Load chapters for this publication
		 */
		loadChaptersGrid(publication) {
			if (!this.$refs.chapters) {
				return;
			}
			const $chaptersEl = $(this.$refs.chapters);
			const sourceUrl = this.chaptersGridUrl.replace(
				'__publicationId__',
				this.workingPublication.id
			);
			if (!$.pkp.classes.Handler.hasHandler($chaptersEl)) {
				$chaptersEl.pkpHandler('$.pkp.controllers.UrlInDivHandler', {
					sourceUrl: sourceUrl,
					refreshOn: 'form-success'
				});
			} else {
				const chaptersHandler = $.pkp.classes.Handler.getHandler(
					$chaptersEl
				);
				chaptersHandler.setSourceUrl(sourceUrl);
				chaptersHandler.reload();
			}
		},

		/**
		 * Update the work type to be an authored work
		 */
		setAsAuthoredWork() {
			this.updateWorkType(this.getConstant('WORK_TYPE_AUTHORED_WORK'));
		},

		/**
		 * Update the work type to be an edited volume
		 */
		setAsEditedVolume() {
			this.updateWorkType(this.getConstant('WORK_TYPE_EDITED_VOLUME'));
		},

		/**
		 * Update the submission's work type
		 *
		 * @param String workType One of the WORK_TYPE_ constants.
		 */
		updateWorkType(workType) {
			this.isLoadingWorkType = true;
			var self = this;
			$.ajax({
				url: this.submissionApiUrl,
				type: 'PUT',
				data: {
					workType: workType
				},
				headers: {
					'X-Csrf-Token': this.csrfToken
				},
				error(r) {
					self.isLoadingWorkType = false;
					self.ajaxErrorCallback(r);
				},
				success(submission) {
					self.submission = {};
					self.submission = submission;
					self.isLoadingWorkType = false;
				}
			});
		}
	},
	watch: {
		workingPublication(newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}
			this.loadChaptersGrid(newVal);
		}
	},
	mounted() {
		this.loadChaptersGrid(this.workingPublication);
	}
};
</script>

<style lang="less">
@import '../../styles/_import';

// Integrate the grids in the publication tab
#chapters-grid {
	padding-top: @double;
}
</style>
