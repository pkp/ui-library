<template>
	<div class="pkpFormField pkpFormField--select pkpFormField--selectIssue">
		<div class="pkpFormField__heading">
			<form-field-label
				:controlId="controlId"
				:label="label"
				:isRequired="isRequired"
				:requiredLabel="__('common.required')"
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
				:label="__('help.help')"
			/>
		</div>
		<div
			v-if="description"
			class="pkpFormField__description"
			v-html="description"
			:id="describedByDescriptionId"
		/>
		<div class="pkpFormField__control">
			<span class="pkpFormField__description">
				<span v-html="notice" />
				<pkp-button
					v-if="button"
					v-bind="button"
					class="pkpFormField--selectIssue__button"
					@click="emitGlobal(button.event)"
				>
					{{ button.label }}
				</pkp-button>
			</span>
			<field-error
				v-if="errors && errors.length"
				:id="describedByErrorId"
				:messages="errors"
			/>
		</div>
	</div>
</template>

<script>
import FieldSelect from './FieldSelect.vue';

export default {
	name: 'FieldSelectIssue',
	extends: FieldSelect,
	props: {
		assignedNoticeBase: {
			type: String,
			required: true
		},
		assignLabel: {
			type: String,
			required: true
		},
		changeIssueLabel: {
			type: String,
			required: true
		},
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
		unscheduledNotice: {
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
		 * The button to show in the field depending on
		 * whether an issue has been selected/assigned
		 *
		 * This value is bound to the button with v-bind
		 * and the `callback` property is bound to @click
		 *
		 * @return {Object|Null}
		 */
		button() {
			let button = null;
			if (this.publicationStatus === pkp.const.STATUS_SCHEDULED) {
				button = {
					event: 'unpublish:publication',
					isWarnable: true,
					label: this.unscheduleLabel
				};
			} else if (this.publicationStatus !== pkp.const.STATUS_PUBLISHED) {
				button = {
					event: 'schedule:publication',
					label: this.value ? this.changeIssueLabel : this.assignLabel
				};
			}
			return button;
		},

		/**
		 * The notice text to show in the field depending
		 * on whether an issue has been selected/assigned
		 *
		 * @return {String}
		 */
		notice() {
			let notice = '';
			if (this.publicationStatus === pkp.const.STATUS_PUBLISHED) {
				notice = this.publishedNoticeBase;
			} else if (this.publicationStatus === pkp.const.STATUS_SCHEDULED) {
				notice = this.scheduledNoticeBase;
			} else if (this.value) {
				notice = this.assignedNoticeBase;
			} else {
				return this.unscheduledNotice;
			}
			return notice
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
		 * Emit a global event
		 *
		 * @param {String} event
		 */
		emitGlobal(event) {
			pkp.eventBus.$emit(event);
		}
	}
};
</script>

<style lang="less">
@import '../../../styles/_import';

.pkpFormField--selectIssue__button {
	margin-left: 0.5em;
}
</style>
