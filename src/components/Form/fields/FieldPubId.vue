<template>
	<div class="pkpFormField pkpFormField--pubid">
		<div class="pkpFormField__heading">
			<FormFieldLabel
				:control-id="controlId"
				:label="label"
				:is-required="isRequired"
				:required-label="t('common.required')"
				class="align-middle"
			/>
			<Tooltip v-if="tooltip" aria-hidden="true" :tooltip="tooltip" label="" />
			<span
				v-if="tooltip"
				:id="describedByTooltipId"
				v-strip-unsafe-html="tooltip"
				class="-screenReader"
			/>
			<HelpButton
				v-if="helpTopic"
				:id="describedByHelpId"
				:topic="helpTopic"
				:section="helpSection"
				:label="t('help.help')"
			/>
		</div>
		<div
			v-if="description"
			:id="describedByDescriptionId"
			v-strip-unsafe-html="description"
			class="pkpFormField__description"
		/>
		<div class="pkpFormField__control">
			<input
				:id="controlId"
				ref="input"
				v-model="currentValue"
				class="pkpFormField__input pkpFormField--text__input pkpFormField--pubid__input"
				:name="localizedName"
				:aria-describedby="describedByIds"
				:aria-invalid="errors && errors.length"
				:disabled="!!pattern"
				:required="isRequired"
			/>
			<PkpButton
				v-if="pattern && canGenerateId && !currentValue"
				class="pkpFormField--pubid__button"
				@click="assignId"
			>
				{{ assignIdLabel }}
			</PkpButton>
			<PkpButton
				v-else-if="pattern && currentValue"
				class="pkpFormField--pubid__button"
				:is-warnable="true"
				@click="() => (currentValue = '')"
			>
				{{ clearIdLabel }}
			</PkpButton>
			<div
				v-if="pattern && !canGenerateId && !currentValue"
				:id="describedByDescriptionId"
				class="mt-1 text-base-normal"
			>
				<Icon icon="Error" class="h-4 w-4" :inline="true" />
				<span class="align-middle">{{ missingPartsLabel }}</span>
			</div>
			<FieldError
				v-if="errors && errors.length"
				:id="describedByErrorId"
				:messages="errors"
			/>
		</div>
	</div>
</template>

<script>
import FieldBase from './FieldBase.vue';
import FormFieldLabel from '@/components/Form/FormFieldLabel.vue';
import Tooltip from '@/components/Tooltip/Tooltip.vue';
import PkpButton from '@/components/Button/Button.vue';
import Icon from '@/components/Icon/Icon.vue';
import FieldError from '@/components/Form/FieldError.vue';
import HelpButton from '@/components/HelpButton/HelpButton.vue';

export default {
	name: 'FieldPubId',
	components: {
		FormFieldLabel,
		Tooltip,
		PkpButton,
		Icon,
		FieldError,
		HelpButton,
	},
	extends: FieldBase,
	props: {
		assignIdLabel: {
			type: String,
			required: true,
		},
		clearIdLabel: {
			type: String,
			required: true,
		},
		contextInitials: {
			type: String,
			default() {
				return '';
			},
		},
		/** Whether or not a `%p` in the `pattern` stands for the context initials or page numbers. This is used in OMP when generating a pub id. */
		isPForPress: {
			type: Boolean,
			default() {
				return false;
			},
		},
		/** The number of the issue this publication is assigned to. Used when generating a pub id. */
		issueNumber: {
			type: [String, Number],
			default() {
				return '';
			},
		},
		/** The volume of the issue this publication is assigned to. Used when generating a pub id. */
		issueVolume: {
			type: [String, Number],
			default() {
				return '';
			},
		},
		missingPartsLabel: {
			type: String,
			required: true,
		},
		/** The pages of this publication. Used when generating a pub id. */
		pages: {
			type: String,
			default() {
				return '';
			},
		},
		/** The pattern to use when generating a pub id. This is configured in the pub id plugin settings. */
		pattern: {
			type: String,
			required: true,
		},
		/** The pub id prefix to use when generating a pub id. This is configured in the pub id plugin settings. */
		prefix: {
			type: String,
			required: true,
		},
		/** The publisher id of this publication. Used when generating a pub id. */
		publisherId: {
			type: String,
			default() {
				return '';
			},
		},
		/** An optional separator to be added between the pub id prefix and suffix when generating the pub id. */
		separator: {
			type: String,
			default() {
				return '';
			},
		},
		/** The id of the submission for which a pub id will be generated. Used when generating a pub id. */
		submissionId: {
			type: Number,
			default() {
				return 0;
			},
		},
		/** The id of the publication for which a pub id will be generated. Used when generating a pub id. */
		publicationId: {
			type: Number,
			default() {
				return 0;
			},
		},
		/** The year this publication was published. Will represent the issue's publication date if no `datePublished` exists for the publication. Used when generating a pub id. */
		year: {
			type: [String, Number],
			default() {
				return '';
			},
		},
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
		},
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
		},
	},
};
</script>

<style lang="less">
@import '../../../styles/_import';

.pkpFormField--pubid__input {
	display: inline-block;
}

.pkpFormField--pubid__button {
	margin-inline-start: 0.25rem;
	height: 2.5rem; // Match input height
}
</style>
