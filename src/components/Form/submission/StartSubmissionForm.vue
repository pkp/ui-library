<script>
import Form from '../Form.vue';

export default {
	name: 'StartSubmissionForm',
	extends: Form,
	computed: {
		/**
		 * Don't submit the title to the submission API endpoint
		 */
		submitValues() {
			let values = Form.computed.submitValues.apply(this);
			delete values.title;
			return values;
		},
	},
	methods: {
		/**
		 * Save the title to the publication in the submission's
		 * language after it has been created.
		 */
		success(submission) {
			this.isSaving = true;
			const titleField = this.fields.find((field) => field.name === 'title');
			if (!titleField || !titleField.value) {
				window.location = submission.urlSubmissionWizard;
				return;
			}
			let data = {title: {}};
			data.title[submission.locale] = titleField.value;
			$.ajax({
				url: submission.publications[0]._href,
				method: 'POST',
				context: this,
				headers: {
					'X-Csrf-Token': pkp.currentUser.csrfToken,
					'X-Http-Method-Override': 'PUT',
				},
				data: data,
				complete() {
					window.location = submission.urlSubmissionWizard;
				},
			});
		},

		/**
		 * Override the complete callback to keep
		 * isSaving set to true after the form is
		 * submitted successfully. This ensures that
		 * the form's loading spinner continues to
		 * show while the user is sent to a new page
		 */
		complete(xhr, status) {
			this.isSaving = status === 'success';
		},
	},
};
</script>
