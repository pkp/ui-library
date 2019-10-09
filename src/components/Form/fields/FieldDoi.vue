<template>
	<div class="pkpFormField pkpFormField--doi">
		<div class="pkpFormField__heading">
			<form-field-label
				:controlId="controlId"
				:label="label"
				:isRequired="isRequired"
				:requiredLabel="i18n.required"
			/>
			<tooltip v-if="tooltip" aria-hidden="true" :tooltip="tooltip" label="" />
			<span
				v-if="tooltip"
				class="-screenReader"
				:id="describedByTooltipId"
				v-html="tooltip"
			/>
			<help-button
				v-if="helpTopic"
				:id="describedByHelpId"
				:topic="helpTopic"
				:section="helpSection"
				:label="i18n.help"
			/>
		</div>
		<div
			v-if="description"
			class="pkpFormField__description"
			v-html="description"
			:id="describedByDescriptionId"
		/>
		<div class="pkpFormField__control">
			<input
				class="pkpFormField__input pkpFormField--doi__input"
				ref="input"
				v-model="currentValue"
				:id="controlId"
				:name="localizedName"
				:aria-describedby="describedByIds"
				:aria-invalid="!!errors.length"
				:disabled="!!pattern"
				:required="isRequired"
			/>
			<pkp-button
				v-if="pattern && canGenerateDoi && !currentValue"
				class="pkpFormField--doi__button"
				:label="i18n.assignDoi"
				@click="assignDoi"
			/>
			<pkp-button
				v-else-if="pattern && canGenerateDoi"
				class="pkpFormField--doi__button"
				:label="i18n.clearDoi"
				:isWarnable="true"
				@click="() => (currentValue = '')"
			/>
			<div
				v-if="pattern && !canGenerateDoi && !currentValue"
				class="pkpFormField--doi__warning"
				:id="describedByDescriptionId"
			>
				<icon icon="exclamation-triangle" :inline="true" />
				{{ i18n.missingParts }}
			</div>
			<field-error
				v-if="errors.length"
				:id="describedByErrorId"
				:messages="errors"
			/>
		</div>
	</div>
</template>

<script>
import FieldBase from './FieldBase.vue';
import Icon from '@/components/Icon/Icon.vue';
import PkpButton from '@/components/Button/Button.vue';

export default {
	name: 'FieldPubId',
	extends: FieldBase,
	components: {
		Icon,
		PkpButton
	},
	props: {
		contextInitials: {
			type: String,
			default() {
				return '';
			}
		},
		issueNumber: {
			type: [String, Number],
			default() {
				return '';
			}
		},
		issueVolume: {
			type: [String, Number],
			default() {
				return '';
			}
		},
		pages: {
			type: String,
			default() {
				return '';
			}
		},
		pattern: {
			type: String,
			required: true
		},
		publisherId: {
			type: String,
			default() {
				return '';
			}
		},
		prefix: {
			type: String,
			required: true
		},
		submissionId: {
			type: Number,
			default() {
				return '';
			}
		},
		year: {
			type: [String, Number],
			default() {
				return '';
			}
		}
	},
	computed: {
		/**
		 * Is all required info available to generate a DOI
		 * according to the pattern?
		 *
		 * @return {Boolean}
		 */
		canGenerateDoi() {
			return (
				(this.contextInitials || !this.pattern.includes('%j')) &&
				(this.issueNumber || !this.pattern.includes('%i')) &&
				(this.issueVolume || !this.pattern.includes('%v')) &&
				(this.pages || !this.pattern.includes('%p')) &&
				(this.publisherId || !this.pattern.includes('%x')) &&
				(this.year || !this.pattern.includes('%Y'))
			);
		}
	},
	methods: {
		/**
		 * Assign a DOI based on the pattern
		 */
		assignDoi() {
			// Check that all requirements to build the pattern are met
			if (!this.canGenerateDoi) {
				const modalOptions = {
					modalHandler: '$.pkp.controllers.modal.ConfirmationModalHandler',
					title: $.pkp.locale.common_error,
					okButton: $.pkp.locale.common_ok,
					cancelButton: false,
					dialogText: this.i18n.missingIssue
				};

				const $modal = $(
					'<div id="' +
						$.pkp.classes.Helper.uuid() +
						'" ' +
						'class="pkp_modal pkpModalWrapper" tabindex="-1"></div>'
				).pkpHandler(modalOptions.modalHandler, modalOptions);

				const modalHandler = $.pkp.classes.Handler.getHandler($modal);
				modalHandler.modalBuild();
				modalHandler.modalOpen();

				return;
			}

			this.currentValue = this.generateDoi();
		},

		/**
		 * Generate a DOI from the pattern
		 *
		 * @return {String}
		 */
		generateDoi() {
			return (
				this.prefix +
				'/' +
				this.pattern
					.replace('%j', this.contextInitials)
					.replace('%i', this.issueNumber)
					.replace('%v', this.issueVolume)
					.replace('%p', this.pages)
					.replace('%x', this.publisherId)
					.replace('%Y', this.year)
					.replace('%a', this.submissionId)
			);
		}
	}
};
</script>

<style lang="less">
@import '../../../styles/_import';

.pkpFormField--doi__input {
	display: inline-block;
	width: 15em;
}

.pkpFormField--doi__button {
	margin-left: 0.25rem;
	height: 2.5rem; // Match input height
}

.pkpFormField--doi__warning {
	font-size: @font-tiny;
	line-height: 1.65em;
	margin-top: 0.25rem;
}
</style>
