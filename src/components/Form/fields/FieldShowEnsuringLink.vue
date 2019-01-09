<script>
import FieldOptions from './FieldOptions.vue';

export default {
	name: 'FieldShowEnsuringLink',
	extends: FieldOptions,
	props: {
		message: String,
	},
	computed: {
		/**
		 * Get classes for the wrapper element
		 *
		 * @return array
		 */
		classes: function () {
			return ['pkpFormField--showEnsuringLink'];
		},
	},
	mounted: function () {
		/**
		 * Show the requested message in a modal when the link in the messgae is
		 * clicked.
		 */
		$('.pkpFormField--options__option button', this.$el).click(() => {
			const modalOptions = {
				modalHandler: '$.pkp.controllers.modal.ConfirmationModalHandler',
				title: '',
				okButton: $.pkp.locale.common_ok,
				cancelButton: false,
				dialogText: this.message,
			};

			const $modal = $(
				'<div id="' + $.pkp.classes.Helper.uuid() + '" ' +
				'class="pkp_modal pkpModalWrapper" tabindex="-1"></div>')
				.pkpHandler(modalOptions.modalHandler, modalOptions);

			const modalHandler = $.pkp.classes.Handler.getHandler($modal);

			modalHandler.modalBuild();
			modalHandler.modalOpen();

			return false;
		});
	},
	beforeDestroy: function () {
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
