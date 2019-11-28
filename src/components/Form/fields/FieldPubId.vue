<template>
	<div class="pkpFormField pkpFormField--pubid">
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
				class="pkpFormField__input pkpFormField--text__input pkpFormField--pubid__input"
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
				v-if="pattern && canGenerateId && !currentValue"
				class="pkpFormField--pubid__button"
				:label="i18n.assignId"
				@click="assignId"
			/>
			<pkp-button
				v-else-if="pattern"
				class="pkpFormField--pubid__button"
				:label="i18n.clearId"
				:isWarnable="true"
				@click="() => (currentValue = '')"
			/>
			<div
				v-if="pattern && !canGenerateId && !currentValue"
				class="pkpFormField--pubid__warning"
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
		isPForPress: {
			type: Boolean,
			default() {
				return false;
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
		separator: {
			type: String,
			default() {
				return '';
			}
		},
		submissionId: {
			type: Number,
			default() {
				return '';
			}
		},
		publicationId: {
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
		 * Is all required info available to generate a pub id
		 * according to the pattern?
		 *
		 * @return {Boolean}
		 */
		canGenerateId() {
			return (
				(this.issueNumber || !this.pattern.includes('%i')) &&
				(this.issueVolume || !this.pattern.includes('%v')) &&
				((!this.isPForPress &&
					(this.contextInitials || !this.pattern.includes('%j')) &&
					(this.pages || !this.pattern.includes('%p'))) ||
					(this.isPForPress &&
						(this.contextInitials || !this.pattern.includes('%j')))) &&
				(this.publisherId || !this.pattern.includes('%x')) &&
				(this.submissionId || !this.pattern.includes('%a')) &&
				(this.submissionId || !this.pattern.includes('%m')) &&
				(this.publicationId || !this.pattern.includes('%b')) &&
				(this.year || !this.pattern.includes('%Y'))
			);
		}
	},
	methods: {
		/**
		 * Assign a pub id based on the pattern
		 */
		assignId() {
			this.currentValue = this.generateId();
		},

		/**
		 * Generate a pub id from the pattern
		 *
		 * @return {String}
		 */
		generateId() {
			let id =
				this.prefix +
				this.separator +
				this.pattern
					.replace('%i', this.issueNumber)
					.replace('%v', this.issueVolume)
					.replace('%x', this.publisherId)
					.replace('%Y', this.year);
			if (this.isPForPress) {
				id = id
					.replace('%p', this.contextInitials)
					.replace('%m', this.submissionId);
			} else {
				id = id
					.replace('%j', this.contextInitials)
					.replace('%a', this.submissionId)
					.replace('%b', this.publicationId)
					.replace('%p', this.pages);
			}
			return id;
		}
	}
};
</script>

<style lang="less">
@import '../../../styles/_import';

.pkpFormField--pubid__input {
	display: inline-block;
}

.pkpFormField--pubid__button {
	margin-left: 0.25rem;
	height: 2.5rem; // Match input height
}

.pkpFormField--pubid__warning {
	font-size: @font-tiny;
	line-height: 1.65em;
	margin-top: 0.25rem;
}
</style>
