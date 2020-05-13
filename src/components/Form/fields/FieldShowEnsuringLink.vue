<script>
import FieldOptions from './FieldOptions.vue';
import modal from '@/mixins/modal';

export default {
	name: 'FieldShowEnsuringLink',
	extends: FieldOptions,
	mixins: [modal],
	props: {
		message: String,
		modalTitle: String
	},
	computed: {
		/**
		 * Get classes for the wrapper element
		 *
		 * @return {Array}
		 */
		classes() {
			return ['pkpFormField--showEnsuringLink'];
		}
	},
	mounted() {
		/**
		 * Show the requested message in a modal when the link in the messgae is
		 * clicked.
		 */
		$('.pkpFormField--options__option button', this.$el).click(() => {
			this.openDialog(
				{
					modalName: 'ensureBlindReview',
					confirmLabel: this.__('common.ok'),
					message: this.message,
					title: this.modalTitle,
					callback: () => {
						this.$modal.hide('ensureBlindReview');
					}
				},
				{
					height: 'auto',
					scrollable: true
				}
			);
			return false;
		});
	},
	beforeDestroy() {
		/**
		 * Clean up modal event listener
		 */
		$('.pkpFormField--options__option button', this.$el).off();
	}
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
