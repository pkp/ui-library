<script>
import FieldOptions from './FieldOptions.vue';
import dialog from '@/mixins/dialog';

export default {
	name: 'FieldShowEnsuringLink',
	extends: FieldOptions,
	mixins: [dialog],
	props: {
		/**  The message to display in the popup when the button in the confirmation message is clicked. */
		message: String,
		modalTitle: String,
	},
	computed: {
		/**
		 * Get classes for the wrapper element
		 *
		 * @return {Array}
		 */
		classes() {
			return ['pkpFormField--showEnsuringLink'];
		},
	},
	mounted() {
		/**
		 * Show the requested message in a modal when the link in the message is
		 * clicked.
		 */
		$('.pkpFormField--options__option button', this.$el).click(() => {
			this.openDialog(
				{
					name: 'ensureAnonymousReview',
					confirmLabel: this.t('common.ok'),
					message: this.message,
					title: this.modalTitle,
					callback: (close) => {
						close();
					},
					modalStyle: 'primary',
				},
				{
					height: 'auto',
					scrollable: true,
				},
			);
			return false;
		});
	},
	beforeUnmount() {
		/**
		 * Clean up modal event listener
		 */
		$('.pkpFormField--options__option button', this.$el).off();
	},
};
</script>

<style lang="less">
@import '../../../styles/_import';

.pkpFormField--showEnsuringLink .pkpFormField--options__option button {
	display: inline;
	padding: 0;
	border: none;
	background: transparent;
	color: @primary;
	text-decoration: underline;
	cursor: pointer;

	&:hover,
	&:focus {
		color: @primary-lift;
	}
}
</style>
