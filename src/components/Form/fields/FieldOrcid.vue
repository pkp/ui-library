<template>
	<div class="pkpFormField pkpFormField--html">
		<div class="pkpFormField__heading">
			<span class="pkpFormFieldLabel align-middle">
				{{ label }}
			</span>
			<Tooltip v-if="tooltip" aria-hidden="true" :tooltip="tooltip" label="" />
			<span
				v-if="tooltip"
				v-strip-unsafe-html="tooltip"
				class="-screenReader"
			/>
			<HelpButton
				v-if="helpTopic"
				:topic="helpTopic"
				:section="helpSection"
				:label="t('help.help')"
			/>
		</div>
		<div
			v-if="!isVerified && hasOrcid"
			v-strip-unsafe-html="t('orcid.field.unverified.shouldRequest')"
			class="pkpFormField__description"
		/>
		<div>
			<!-- When ORCID is present -->
			<Icon
				v-if="isVerified && hasOrcid"
				:class="'mr-2'"
				icon="Orcid"
				class="h-6 w-6"
				:inline="true"
			/>

			<Icon
				v-if="!isVerified && hasOrcid"
				:class="'mr-2'"
				icon="OrcidUnauthenticated"
				class="w-6"
				:inline="true"
			/>
			<div
				v-if="hasOrcid"
				v-strip-unsafe-html="orcidDisplayText"
				class="pkpFormField__control pkpFormField__control--html"
			/>
			<PkpButton
				v-if="hasOrcid"
				class="pkpFormField__control--html__button"
				:is-warnable="true"
				:is-disabled="isButtonDisabled"
				@click="openDeleteDialog"
			>
				{{ t('common.delete') }}
			</PkpButton>
			<!-- When ORCID is absent -->
			<div class="inline-flex">
				<PkpButton
					v-if="!hasOrcid"
					:disabled="verificationRequested || isButtonDisabled"
					:icon="verificationRequested ? 'Complete' : null"
					:is-link="verificationRequested"
					@click="openSendAuthorEmailDialog"
				>
					{{
						verificationRequested
							? t('orcid.field.verification.requested')
							: t('orcid.field.verification.request')
					}}
				</PkpButton>
				<PkpButton
					v-if="!hasOrcid && verificationRequested"
					:is-link="true"
					@click="openSendAuthorEmailDialog"
				>
					{{ t('orcid.field.verification.resendRequest') }}
				</PkpButton>
			</div>
		</div>
	</div>
</template>

<script>
import FieldBase from '@/components/Form/fields/FieldBase.vue';
import Icon from '@/components/Icon/Icon.vue';
import PkpButton from '@/components/Button/Button.vue';
import HelpButton from '@/components/HelpButton/HelpButton.vue';
import Tooltip from '@/components/Tooltip/Tooltip.vue';

import {useApiUrl} from '@/composables/useApiUrl';
import {useFetch} from '@/composables/useFetch';
import {useModal} from '@/composables/useModal';

export default {
	name: 'FieldOrcid',
	components: {Icon, PkpButton, HelpButton, Tooltip},
	extends: FieldBase,
	props: {
		/** ORCID URL that has been verified */
		orcid: {
			type: String,
			required: true,
			default: '',
		},
		/** Author ID used in ORCID related actions */
		authorId: {
			type: Number,
			required: true,
			default: 0,
		},
		/** Whether ORCID ID has been verified and authenticated by the owner */
		isVerified: {
			type: Boolean,
			required: true,
			default: false,
		},
		/** Whether an email requesting users verify their ORCID has been sent or not */
		orcidVerificationRequested: {
			type: Boolean,
			required: true,
		},
		orcidDisplayValue: {
			type: String,
			required: true,
			default: '',
		},
	},
	data() {
		return {
			/** Internal value used for displaying ORCID in component. Takes initial value from `orcid` prop */
			orcidValue: '',
			verificationRequested: this.orcidVerificationRequested,
			/** Whether request verification/delete ORCID button should be disabled or not */
			isButtonDisabled: false,
		};
	},
	computed: {
		/**
		 * Helper to see if an ORCID value is present
		 * @returns {boolean}
		 */
		hasOrcid: function () {
			return this.orcidValue.length !== 0;
		},
		/**
		 * Wraps ORCID in <a> tag for HTML display
		 * @returns {string}
		 */
		orcidDisplayText: function () {
			if (this.hasOrcid) {
				return `<a target="_blank" class="underline" href="${this.orcidValue}">${this.orcidDisplayValue}</a>`;
			} else {
				return this.orcidValue;
			}
		},
	},
	created() {
		this.orcidValue = this.orcid;
	},
	methods: {
		/**
		 * Triggers author email request via API
		 *
		 * @returns {Promise<void>}
		 */
		sendAuthorEmail: async function () {
			this.isButtonDisabled = true;

			const {apiUrl} = useApiUrl(
				`orcid/requestAuthorVerification/${this.authorId}`,
			);

			const {isSuccess, fetch} = useFetch(apiUrl, {
				method: 'POST',
				expectValidationError: true,
			});
			await fetch();

			if (isSuccess) {
				this.verificationRequested = true;
			}

			this.isButtonDisabled = false;
		},
		/**
		 * Open confirmation dialog for requesting author ORCID verification
		 */
		openSendAuthorEmailDialog: function () {
			const {openDialog} = useModal();
			openDialog({
				name: 'sendAuthorEmail',
				title: this.t('orcid.field.authorEmailModal.title'),
				message: this.t('orcid.field.authorEmailModal.message'),
				actions: [
					{
						label: this.t('common.yes'),
						isPrimary: true,
						callback: async (close) => {
							await this.sendAuthorEmail();
							close();
						},
					},
					{
						label: this.t('common.no'),
						isWarnable: true,
						callback: (close) => {
							close();
						},
					},
				],
				modalStyle: 'primary',
				close: () => {},
			});
		},
		/**
		 * Trigger API request to remove ORCID and access tokens from author/user
		 *
		 * @returns {Promise<void>}
		 */
		deleteOrcid: async function () {
			this.isButtonDisabled = true;

			const {apiUrl} = useApiUrl(`orcid/deleteForAuthor/${this.authorId}`);
			const {isSuccess, fetch} = useFetch(apiUrl, {
				method: 'POST',
				expectValidationError: true,
			});

			await fetch();

			if (isSuccess) {
				this.orcidValue = '';
			}

			this.isButtonDisabled = false;
		},
		/**
		 * Opens dialog to confirm deletion of ORCID from author/user
		 */
		openDeleteDialog: function () {
			const {openDialog} = useModal();
			openDialog({
				name: 'deleteOrcid',
				title: this.t('orcid.field.deleteOrcidModal.title'),
				message: this.t('orcid.field.deleteOrcidModal.message'),
				actions: [
					{
						label: this.t('common.yes'),
						isWarnable: true,
						callback: async (close) => {
							await this.deleteOrcid();
							close();
						},
					},
					{
						label: this.t('common.no'),
						callback: (close) => {
							close();
						},
					},
				],
				modalStyle: 'negative',
				close: () => {},
			});
		},
	},
};
</script>

<style lang="less">
@import '../../../styles/_import';

.pkpFormField__control--html {
	font-size: @font-sml;
	line-height: 1.8em;
	display: inline-block;

	p:first-child {
		margin-top: 0;
	}

	p:last-child {
		margin-bottom: 0;
	}
}

.pkpFormField__control--html__button {
	margin-inline-start: 0.25rem;
}
</style>
