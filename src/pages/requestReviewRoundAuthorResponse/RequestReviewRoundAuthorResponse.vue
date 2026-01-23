<template>
	<div class="app__page--requestAuthorResponse">
		<RequestResponseHeader
			:page-title="t('editor.submission.reviewRound.requestAuthorResponse')"
			:page-title-description="
				t('editor.submission.reviewRound.aboutToRequestAuthorReviewResponse')
			"
		/>

		<Panel class="border-none">
			<PanelSection>
				<h2 class="uppercase text-heading">
					{{ t('emails.modifyEmailSharedWithUser') }}
				</h2>
			</PanelSection>
			<PanelSection>
				<Composer
					:add-c-c-label="t('common.addCCBCC')"
					:bcc-label="t('email.bcc')"
					:body-label="t('stageParticipants.notify.message')"
					:can-change-recipients="canChangeRecipients"
					:cc-label="t('email.cc')"
					:confirm-switch-locale-label="t('email.confirmSwitchLocale')"
					:deselect-label="t('common.deselect')"
					:email-templates="emailTemplates"
					:email-templates-api-url="emailTemplatesApiUrl"
					:find-template-label="t('common.findTemplate')"
					:initial-template-key="initialTemplateKey"
					:insert-label="t('common.insert')"
					:insert-modal-label="t('common.insertContent')"
					:insert-content-label="t('common.content')"
					:insert-search-label="t('common.insertContentSearch')"
					:load-template-label="t('discussion.form.templatesLabel')"
					:locale="locale"
					:locales="locales"
					:attachers="attachers"
					:more-search-results-label="t('common.numberedMore')"
					:recipient-options="recipientOptions"
					:recipients="recipients"
					:recipients-label="t('email.to')"
					:remove-item-label="t('common.removeItem')"
					:searching-label="t('common.searching')"
					:search-results-label="t('search.searchResults')"
					:subject-label="t('email.subject')"
					:switch-to-label="t('common.switchTo')"
					:switch-to-named-language-label="t('common.switchToNamedItem')"
					:variables="variables"
					:attach-files-label="t('common.attachFiles')"
					v-bind="emailComposer"
					@set="(componentName, update) => updateEmail(update)"
				></Composer>
			</PanelSection>
		</Panel>

		<div class="border-top-0 bg-secondary p-8">
			<ButtonRow>
				<PkpButton :is-warnable="true" @click="cancelResponseRequest">
					{{ t('common.cancel') }}
				</PkpButton>

				<PkpButton :is-primary="true" :is-disabled="isLoading" @click="submit">
					{{
						t(
							'editor.submission.reviewRound.authorReviewResponse.submitRequest',
						)
					}}
				</PkpButton>
			</ButtonRow>
		</div>
	</div>
</template>

<script setup>
import Composer from '@/components/Composer/Composer.vue';
import {useLocalize} from '@/composables/useLocalize';
import {computed, ref} from 'vue';
import PkpButton from '@/components/Button/Button.vue';
import ButtonRow from '@/components/ButtonRow/ButtonRow.vue';
import {useUrl} from '@/composables/useUrl';
import {useFetch} from '@/composables/useFetch';
import {useModal} from '@/composables/useModal';
import RequestResponseHeader from './RequestResponseHeader.vue';
import Panel from '@/components/Panel/Panel.vue';
import PanelSection from '@/components/Panel/PanelSection.vue';

const {t} = useLocalize();
const props = defineProps({
	/** @see Composer.props.emailTemplatesApiUrl */
	emailTemplatesApiUrl: {type: String, required: true},
	/** @see Composer.props.canChangeRecipients */
	canChangeRecipients: {type: Boolean, required: true},
	/** @see Composer.props.initialTemplateKey */
	initialTemplateKey: {type: String, required: true},
	/** @see Composer.props.locale */
	locale: {type: String, required: true},
	/** @see Composer.props.locales */
	locales: {type: Array, required: true},
	/** @see Composer.props.recipients */
	recipients: {type: Array, required: true},
	/** @see Composer.props.recipientOptions */
	recipientOptions: {type: Array, required: true},
	/** @see Composer.props.emailTemplates */
	emailTemplates: {type: Array, required: true},
	/** @see Composer.props.variables */
	variables: {type: Array, required: true},
	/** @see Composer.props.attachers */
	attachers: {type: Array, required: false, default: () => []},
	// The URL to the submission
	submissionUrl: {type: String, required: true},
	// The ID of the review round that the request is being sent for
	reviewRoundId: {type: Number, required: true},
	// Localized title of the submission
	submissionTitle: {type: String, required: true},
	// The ID of the submission that the reviews belong to
	submissionId: {type: Number, required: true},
});

const emailComposer = ref({});

const {apiUrl} = useUrl(
	`reviews/${props.submissionId}/${props.reviewRoundId}/authorResponse/requestResponse`,
);

/**
 * Update the email composer data.
 */
function updateEmail(update) {
	emailComposer.value = {...emailComposer.value, ...update};
}

const getEmailDataAsPayload = computed(() => {
	const bcc = emailComposer.value.bcc?.trim();
	const cc = emailComposer.value.cc?.trim();

	return {
		bcc: bcc ? bcc.split(',').map((item) => item.trim()) : [],
		cc: cc ? cc.split(',').map((item) => item.trim()) : [],
		locale: emailComposer.value.locale || props.locale,
		// If changing recipients is not allowed, then backend will determine recipients
		recipients: props.canChangeRecipients ? emailComposer.value.recipients : [],
		subject: emailComposer.value.subject,
		body: emailComposer.value.body,
		attachments: emailComposer.value.attachments || [],
	};
});

const {
	fetch: submitRequest,
	isSuccess,
	isLoading,
} = useFetch(apiUrl, {
	method: 'POST',
	body: getEmailDataAsPayload,
});

/**
 * Submit the email to API
 */
async function submit() {
	if (isLoading.value) {
		return;
	}

	await submitRequest();

	if (isSuccess.value) {
		const {openDialog} = useModal();

		const actionLabel = getReturnUrlToSubmissionSummary()
			? t('submission.list.viewSubmissionSummary')
			: t('submission.list.viewSubmission');

		openDialog({
			title: t('editor.submission.reviewRound.authorReviewResponseRequestSent'),
			message: t(
				'editor.submission.reviewRound.authorReviewResponseRequestSent.description',
				{
					submissionTitle: props.submissionTitle,
				},
			),

			actions: [
				{
					label: actionLabel,
					element: 'a',
					href: getReturnUrlToSubmissionSummary(),
				},
			],
			close: () => {
				window.location = getReturnUrlToSubmissionSummary();
			},
			modalStyle: 'success',
		});
	}
}

/**
 * Get the URL, if available, to navigate to the submission's summary page.
 */
function getReturnUrlToSubmissionSummary() {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const ret = urlParams.get('ret');

	if (ret) {
		return `${pkp?.context?.pageBaseUrl}${decodeURIComponent(ret)}`;
	}

	return null;
}

/**
 * Cancel the request
 */
function cancelResponseRequest() {
	window.location.href = getReturnUrlToSubmissionSummary();
}
</script>

<style lang="less">
.app__page--requestAuthorResponse .panel.composer,
.app__page--requestAuthorResponse .panel {
	border: none;
}
</style>
