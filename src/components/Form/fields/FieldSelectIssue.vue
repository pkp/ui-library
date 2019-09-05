<template>
	<div class="pkpFormField pkpFormField--select pkpFormField--selectIssue">
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
			<span
				v-if="isPublished"
				v-html="publishedNotice"
				class="pkpFormField__description"
			/>
			<template v-else-if="isScheduled">
				<span class="pkpFormField__description">
					<span v-html="scheduledNotice" />
					<pkp-button
						class="pkpFormField--selectIssue__unscheduleButton"
						:label="unscheduleLabel"
						:isWarnable="true"
						@click="emitUnschedule"
					/>
				</span>
			</template>
			<template v-else>
				<select
					class="pkpFormField__input pkpFormField--select__input"
					v-model="currentValue"
					:id="controlId"
					:name="localizedName"
					:aria-describedby="describedByIds"
					:aria-invalid="!!errors.length"
					:required="isRequired"
				>
					<option
						v-for="option in localizedOptions"
						:key="option.value"
						v-bind="option"
					>
						{{ option.label }}
					</option>
				</select>
				<field-error
					v-if="errors.length"
					:id="describedByErrorId"
					:messages="errors"
				/>
			</template>
		</div>
	</div>
</template>

<script>
import FieldSelect from './FieldSelect.vue';
import PkpButton from '@/components/Button/Button.vue';

export default {
	name: 'FieldSelectIssue',
	extends: FieldSelect,
	components: {
		PkpButton
	},
	props: {
		publicationStatus: {
			type: Number,
			required: true
		},
		publishedNoticeBase: {
			type: String,
			required: true
		},
		scheduledNoticeBase: {
			type: String,
			required: true
		},
		unscheduleLabel: {
			type: String,
			required: true
		}
	},
	computed: {
		/**
		 * Is this publication published?
		 *
		 * @return {Boolean}
		 */
		isPublished() {
			return this.publicationStatus === pkp.const.STATUS_PUBLISHED;
		},

		/**
		 * Is this publication scheduled?
		 *
		 * @return {Boolean}
		 */
		isScheduled() {
			return this.publicationStatus === pkp.const.STATUS_SCHEDULED;
		},

		/**
		 * Text that says this issue has been published
		 *
		 * @return {String}
		 */
		publishedNotice() {
			return this.publishedNoticeBase
				.replace('__issueId__', this.value)
				.replace('{$issueName}', this.selectedIssueName);
		},

		/**
		 * Text that says this issue has been scheduled for publication
		 *
		 * @return {String}
		 */
		scheduledNotice() {
			return this.scheduledNoticeBase
				.replace('__issueId__', this.value)
				.replace('{$issueName}', this.selectedIssueName);
		},

		/**
		 * The name of the selected issue
		 *
		 * @return {String}
		 */
		selectedIssueName() {
			if (!this.value) {
				return '';
			}
			const issue = this.options.find(option => option.value === this.value);
			return issue ? issue.label : '';
		}
	},
	methods: {
		/**
		 * Emit a global event to unschedule a publication
		 */
		emitUnschedule() {
			pkp.eventBus.$emit('unpublish:publication');
		}
	}
};
</script>

<style lang="less">
@import '../../../styles/_import';

.pkpFormField--selectIssue__unscheduleButton {
	margin-left: 0.5em;
}
</style>
