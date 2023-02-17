<template>
	<div class="app__page width width--wide">
		<nav role="navigation" aria-label="You are here:" class="app__breadcrumbs">
			<ol>
				<li>
					<a href="#">Submissions</a>
					<span aria-hidden="true" class="app__breadcrumbsSeparator">/</span>
				</li>
				<li>
					<a href="#">Daniel, Towards Designing an Intercultural...</a>
					<span aria-hidden="true" class="app__breadcrumbsSeparator">/</span>
				</li>
				<li>
					<span aria-current="page">Accept Submission</span>
				</li>
			</ol>
		</nav>
		<div class="app__page--decision">
			<h1 class="app__pageHeading" ref="pageTitle">Accept Submission</h1>
			<p class="app__pageDescription">
				This submission will be accepted for publication and sent for
				copyediting.
			</p>

			<notification
				v-for="(error, index) in errors"
				:key="index"
				type="warning"
				class="decision__error"
				role="alert"
			>
				{{ error }}
				<button class="-linkButton" @click="openStep(index)">View Error</button>
			</notification>

			<steps
				:current="currentStep.id"
				:started-steps="startedSteps"
				label="Complete the following steps to take this decision"
				progress-label="{$current}/{$total} steps"
				:scroll-to="$refs.pageTitle"
				show-steps-label="Show all steps"
				@step:open="openStep"
			>
				<step
					v-for="step in steps"
					:key="step.id"
					:id="step.id"
					:label="step.name"
				>
					<panel class="decision__stepPanel">
						<panel-section class="decision__stepHeader">
							<h2>{{ step.name }}</h2>
							<p>{{ step.description }}</p>
						</panel-section>
						<template v-if="step.type === 'form'">
							<panel-section>
								<pkp-form
									v-bind="step.form"
									:errors="step.errors"
									@set="updateStep"
								></pkp-form>
							</panel-section>
						</template>
						<template v-else-if="step.type === 'email'">
							<panel-section v-if="skippedSteps.includes(step.id)">
								<notification type="warning">
									This email has been skipped.
									<button
										class="-linkButton"
										:disabled="isSubmitting"
										@click="toggleSkippedStep(step.id)"
									>
										Don't skip email
									</button>
								</notification>
							</panel-section>
							<panel-section v-else>
								<composer
									v-bind="step"
									addCCLabel="Add CC/BCC"
									attachFilesLabel="Attach Files"
									attachedFilesLabel="Attached Files:"
									bccLabel="BCC:"
									bodyLabel="Message"
									ccLabel="CC:"
									confirmSwitchLocaleLabel="Are you sure you want to change to {$localeName} to compose this email? Any changes you have made to the subject and body of the email will be lost."
									deselectLabel="Deselect"
									:email-templatesApiUrl="emailTemplatesApiUrl"
									findTemplateLabel="Find Template"
									insertLabel="Insert"
									insertModalLabel="Insert Content"
									insertContentLabel="Content"
									insertSearchLabel="Find content to insert"
									loadTemplateLabel="Email Templates"
									:locale="step.locale"
									:locales="step.locales"
									moreSearchResultsLabel="{$number} more"
									removeItemLabel="Remove {$item}"
									searchingLabel="Searching"
									searchResultsLabel="Search Results"
									subjectLabel="Subject:"
									switchToLabel="Switch To:"
									switchToNamedLanguageLabel="Switch to {$name}"
									recipientsLabel="To:"
									@set="updateStep"
								></composer>
							</panel-section>
						</template>
						<template v-else-if="step.type === 'promoteFiles'">
							<panel-section>
								<list-panel
									v-for="(list, i) in step.lists"
									:key="i"
									:items="list.files"
									:title="list.name"
									class="decision_filesList"
								>
									<template v-slot:item="{item}">
										<select-submission-file-list-item
											:document-type="item.documentType"
											download-label="Download"
											:genreName="
												item.genreName ? localize(item.genreName) : ''
											"
											:genreIsPrimary="
												item.genreId &&
												!item.genreIsDependent &&
												!item.genreIsSupplementary
											"
											:file-id="item.id"
											:name="localize(item.name)"
											:url="item.url"
										>
											<input
												type="checkbox"
												:name="'promoteFile' + item.id"
												:value="item.id"
												v-model="step.selected"
											/>
										</select-submission-file-list-item>
									</template>
								</list-panel>
							</panel-section>
						</template>
					</panel>
				</step>
			</steps>

			<panel class="decision__footer__panel">
				<panel-section>
					<span slot="header">
						<!-- empty on purpose -->
					</span>
					<div
						class="decision__footer"
						:class="{'decision__footer--noSteps': !steps.length}"
					>
						<button
							v-if="
								currentStep.type === 'email' &&
								currentStep.canSkip &&
								!skippedSteps.includes(currentStep.id)
							"
							class="decision__skipStep -linkButton"
							:disabled="isSubmitting"
							@click="toggleSkippedStep(currentStep.id)"
						>
							Skip email
						</button>
						<spinner v-if="isSubmitting"></spinner>
						<pkp-button
							:disabled="isSubmitting"
							:is-warnable="true"
							@click="cancel"
						>
							Cancel
						</pkp-button>
						<pkp-button
							v-if="!isOnFirstStep && steps.length > 1"
							:disabled="isSubmitting"
							@click="previousStep"
						>
							Previous
						</pkp-button>
						<pkp-button
							:disabled="isSubmitting"
							:is-primary="isOnLastStep"
							@click="nextStep"
						>
							<template v-if="isOnLastStep">Record Decision</template>
							<template v-else>Continue</template>
						</pkp-button>
					</div>
				</panel-section>
			</panel>
		</div>

		<div
			aria-live="polite"
			aria-atomic="true"
			class="app__notifications"
			ref="notifications"
			role="status"
		>
			<transition-group name="app__notification">
				<notification
					v-for="notification in notifications"
					:key="notification.key"
					:type="notification.type"
					:can-dismiss="true"
					@dismiss="dismissNotification(notification.key)"
				>
					{{ notification.message }}
				</notification>
			</transition-group>
		</div>
		<transition name="app__loading">
			<div v-if="isLoading" class="app__loading" role="alert">
				<div class="app__loading__content">
					<spinner></spinner>
					Loading
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
import DecisionPage from '@/components/Container/DecisionPage.vue';
import emailTemplate from '@/docs/data/emailTemplate';
import submissionFiles from '@/docs/data/submissionFiles';
import insertContent from '../../../data/insertContent';

export default {
	extends: DecisionPage,
	data() {
		return {
			currentStep: {},
			decision: 1,
			emailTemplatesApiUrl:
				'http://localhost:8000/publicknowledge/api/v1/emailTemplates',
			stepErrorMessage: 'There is a problem with the {$stepName} step.',
			startedSteps: [],
			isComplete: false,
			isSubmitting: false,
			reviewRoundId: 2,
			skippedSteps: [],
			stageId: 3,
			submissionApiUrl:
				'http://localhost:8000/publicknowledge/api/v1/submission/1',
			steps: [
				{
					id: 'payment',
					type: 'form',
					name: 'Request Payment',
					description:
						'Ask the author to pay the Article Processing Charge (USD $150) now or waive the fee.',
					errors: {},
					form: {
						id: 'requestPayment',
						method: '',
						action: 'emit',
						fields: [
							{
								name: 'payment',
								component: 'field-options',
								label: 'Article Processing Charge',
								value: [],
								type: 'radio',
								options: [
									{
										value: true,
										label: 'Request payment from the author (USD $150)',
									},
									{
										value: false,
										label: 'Waive the fee',
									},
								],
								groupId: 'default',
							},
						],
						groups: [
							{
								id: 'default',
								pageId: 'default',
							},
						],
						pages: [
							{
								id: 'default',
							},
						],
						primaryLocale: 'en',
						visibleLocales: ['en'],
						supportedFormLocales: [],
						errors: {},
					},
				},
				{
					id: 'notifyAuthors',
					type: 'email',
					name: 'Notify Authors',
					description:
						'Send an email to the authors to let them know that their submission has been accepted for publication.',
					errors: {},
					to: [31],
					recipientOptions: [
						{
							value: 31,
							label: {
								en: 'Rana Baiyewu',
								fr_CA: 'Rana Fr Baiyewu',
							},
						},
					],
					canChangeRecipients: false,
					canSkip: true,
					defaultEmailTemplateKey: 'EDITOR_DECISION_ACCEPT',
					emailTemplates: [
						{
							...emailTemplate,
							name: {
								en: 'Accept for Publication',
							},
							subject: {
								en: 'Accept for Publication',
							},
						},
						{
							...emailTemplate,
							key: 'EDITOR_DECISION_ACCEPT_CONDITIONS',
							name: {
								en: 'Accept with Conditions',
							},
							subject: {
								en: 'Accept with Conditions',
							},
						},
						{
							...emailTemplate,
							key: 'EDITOR_DECISION_ACCEPT_EARLY',
							name: {
								en: 'Accept for Early Publication',
							},
							subject: {
								en: 'Accept for Early Publication',
							},
						},
					],
					emailTemplatesApiUrl: 'http://example.org',
					variables: {
						en: [...insertContent],
						fr_CA: [...insertContent],
					},
					locale: 'en',
					locales: [
						{
							locale: 'en',
							name: 'English',
						},
						{
							locale: 'fr_CA',
							name: 'French',
						},
					],
				},
				{
					id: 'notifyReviewers',
					type: 'email',
					name: 'Notify Reviewers',
					description:
						'Send an email to the reviewers to thank them for their review and let them know that a decision was taken.',
					errors: {
						body: ['This field is required.'],
						subject: ['This field is required.'],
						to: [
							'You can not send an email to the following recipients: Alan Mwandenga.',
						],
					},
					recipientOptions: [
						{
							value: 10,
							label: {
								en: 'Adela Gallego',
								fr_CA: 'Adela Gallego',
							},
						},
						{
							value: 9,
							label: {
								en: 'Aisla McCrae',
								fr_CA: 'Aisla McCrae',
							},
						},
					],
					canChangeRecipients: true,
					canSkip: true,
					defaultEmailTemplateKey: 'EDITOR_DECISION_THANK_REVIEWERS',
					emailTemplates: [
						{
							...emailTemplate,
							key: 'EDITOR_DECISION_THANK_REVIEWERS',
							subject: {
								en: 'Thank Reviewer',
							},
						},
						{
							...emailTemplate,
							key: 'EDITOR_DECISION_THANK_REVIEWERS_REQUEST',
							subject: {
								en: 'Thank Reviewer and Request Feedback',
							},
						},
					],
					emailTemplatesApiUrl: 'http://example.org',
					variables: {
						en: [...insertContent],
						fr_CA: [...insertContent],
					},
					locale: 'en',
					locales: [
						{
							locale: 'en',
							name: 'English',
						},
						{
							locale: 'fr_CA',
							name: 'French ',
						},
					],
				},
				{
					id: 'promoteFiles',
					type: 'promoteFiles',
					name: 'Select Files',
					description:
						'Select files that should be sent to the copyediting stage.',
					errors: {},
					lists: [
						{
							name: 'Revisions',
							files: [...submissionFiles],
						},
					],
					selected: [],
					to: 6,
				},
			],
		};
	},
};
</script>

<style lang="less">
@import '../../../../styles/_import';

.component--DecisionPage .component__exampleWrapper {
	background: @bg;
	max-width: 100%; // Let the page class define the width
}
</style>
