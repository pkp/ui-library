<template>
	<div class="pkpFormField pkpFormField--select pkpFormField--selectIssue">
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
			<span class="pkpFormField__description">
				<span v-strip-unsafe-html="notice" />
				<PkpButton
					v-if="button"
					v-bind="button"
					class="pkpFormField--selectIssue__button"
					@click="selectIssue"
				>
					{{ button.label }}
				</PkpButton>
			</span>
			<FieldError
				v-if="errors && errors.length"
				:id="describedByErrorId"
				:messages="errors"
			/>
		</div>
	</div>
</template>

<script>
import FieldSelect from './FieldSelect.vue';
import Tooltip from '@/components/Tooltip/Tooltip.vue';
import FormFieldLabel from '@/components/Form/FormFieldLabel.vue';
import HelpButton from '@/components/HelpButton/HelpButton.vue';
import FieldError from '@/components/Form/FieldError.vue';
import PkpButton from '@/components/Button/Button.vue';

export default {
	name: 'FieldSelectIssue',
	components: {Tooltip, FormFieldLabel, HelpButton, FieldError, PkpButton},
	extends: FieldSelect,
	props: {
		assignedNoticeBase: {
			type: String,
			required: true,
		},
		assignLabel: {
			type: String,
			required: true,
		},
		changeIssueLabel: {
			type: String,
			required: true,
		},
		/** One of the `PKPSubmission::STATUS_` constants. When set to `PKPSubmission::STATUS_QUEUED` or `PKPSubmission::STATUS_PUBLISHED` the issue selection will be hidden. */
		publicationStatus: {
			type: Number,
			required: true,
		},
		/** Text to be displayed when the publication is published in an issue. A string replace will be called to replace `{$issueId}` and `{$issueName}` params with the selected issue. */
		publishedNoticeBase: {
			type: String,
			required: true,
		},
		/** Text to be displayed when the publication is scheduled for publication in an issue. A string replace will be called to replace `{$issueId}` and `{$issueName}` params with the selected issue. */
		scheduledNoticeBase: {
			type: String,
			required: true,
		},
		/** The label for the button to unschedule a scheduled publication. */
		unscheduledNotice: {
			type: String,
			required: true,
		},
		unscheduleLabel: {
			type: String,
			required: true,
		},
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
			if (this.publicationStatus !== pkp.const.STATUS_PUBLISHED) {
				button = {
					label: this.value ? this.changeIssueLabel : this.assignLabel,
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
			const issue = this.options.find((option) => option.value === this.value);
			return issue ? issue.label : '';
		},
	},
	methods: {
		async selectIssue() {
			// workaround to avoid circular dependencies in storybook
			// There is chain if imports, and some of them imported form
			// which seems to be causing circular dependency
			const {useWorkflowStore} = await import(
				'@/pages/workflow/workflowStore.js'
			);

			const workflowSotre = useWorkflowStore();

			workflowSotre.workflowAssignToIssue({}, (finishedData) => {
				if (finishedData.data.issueId) {
					this.currentValue = finishedData.data.issueId;
				}
			});
		},

		/**
		 * Emit a global event
		 *
		 * @param {String} event
		 */
		emitGlobal(event) {
			pkp.eventBus.$emit(event);
		},
	},
};
</script>

<style lang="less">
@import '../../../styles/_import';

.pkpFormField--selectIssue__button {
	margin-inline-start: 0.5em;
}
</style>
