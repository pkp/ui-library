<script type="text/javascript">
import Page from './Page.vue';

export default {
	name: 'ImportExportPage',
	extends: Page,
	data() {
		return {
			selectedSubmissions: []
		};
	},
	methods: {
		/**
		 * Submit a form
		 *
		 * @param {String} selector jQuery selector for the form to be submitted
		 */
		submit(selector) {
			$(selector).submit();
		},

		/**
		 * Select all submissions for export or select none
		 * if all are already selected.
		 */
		toggleSelectAll() {
			if (
				this.selectedSubmissions.length >= this.components.submissions.itemsMax
			) {
				this.selectedSubmissions = [];
			} else {
				this.selectedSubmissions = this.components.submissions.items.map(
					s => s.id
				);
			}
		}
	}
};
</script>

<style lang="less">
@import '../../styles/_import';

#exportXmlForm .submissionsListPanel .listPanel {
	margin-bottom: 1rem;
}

#exportXmlForm .submissionsListPanel .listPanel__item {
	padding-top: 0.25rem;
	padding-bottom: 0.25rem;
}

#exportXmlForm .submissionsListPanel input {
	margin-right: 0.25rem;
}

#exportXmlForm .submissionsListPanel label {
	font-size: @font-sml;
	font-weight: @normal;
}

#exportXmlForm .section {
	text-align: right;
}
</style>
