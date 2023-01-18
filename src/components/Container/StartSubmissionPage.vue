<script type="text/javascript">
import Page from '@/components/Container/Page.vue';
import StartSubmissionForm from '@/components/Form/submission/StartSubmissionForm.vue';

export default {
	extends: Page,
	components: {
		StartSubmissionForm,
	},
	data() {
		return {
			form: {},
		};
	},
	methods: {
		/**
		 * Update the form values
		 */
		updateForm(formId, data) {
			let form = {...this.form};
			Object.keys(data).forEach((key) => (form[key] = data[key]));
			this.form = form;
		},
	},
};
</script>

<style lang="less">
@import '../../styles/_import';

.startSubmissionPage__form {
	.pkpFormPage__footer {
		display: block;
		padding: 2rem 0 0;
		border-top: none;

		// Saving status
		[role='status']:not(:empty) {
			display: block;
			width: 100%;
			margin: 0 0 2rem;
			text-align: center;

			.pkpFormPage__status {
				padding: 0.5rem;
				border: @bg-border;
				border-radius: 2rem;
			}
		}
	}

	.pkpFormErrors {
		display: block;
		margin: 0 0 2rem;
		padding: 1rem;
		text-align: center;
		border: 1px solid @no;
	}

	.pkpButton {
		margin: 0;
		padding: 0.5rem;
		width: 100%;
		font-size: @font-sml;
		text-align: center;
	}
}
</style>
