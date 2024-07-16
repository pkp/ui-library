import DecisionPage from './DecisionPage.vue';

import EmailTemplateMock from '@/mocks/emailTemplate';
import SubmissionFilesMock from '@/mocks/submissionFiles';
import InsertContentMock from '@/mocks/insertContent';

export default {
	title: 'Pages/DecisionPage',
	component: DecisionPage,
};

const DecisionPageWithDataAndTemplate = {
	extends: DecisionPage,
	template: `<div class="app__page width width--wide">
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
					<h1 ref="pageTitle" class="app__pageHeading">
						Accept Submission:
						<template v-if="steps.length > 1">
							{{ currentStep.name }}
						</template>
					</h1>
					<p class="app__pageDescription">
						This submission will be accepted for publication and sent for
						copyediting.
					</p>

					<Notification
						v-for="(error, index) in errors"
						:key="index"
						type="warning"
						class="decision__error"
						role="alert"
					>
						{{ error }}
						<button class="-linkButton" @click="openStep(index)">View Error</button>
					</Notification>

					<Steps
						v-if="steps.length"
						:current="currentStep.id"
						:started-steps="startedSteps"
						label="Complete the following steps to take this decision"
						progress-label="{$current}/{$total} steps"
						:scroll-to="$refs.pageTitle"
						show-steps-label="Show all steps"
						@step:open="openStep"
					>
						<Step
							v-for="step in steps"
							:id="step.id"
							:key="step.id"
							:label="step.name"
						>
							<Panel class="decision__stepPanel">
								<PanelSection class="decision__stepHeader">
									<h2>{{ step.name }}</h2>
									<p>{{ step.description }}</p>
								</PanelSection>
								<template v-if="step.type === 'form'">
									<PanelSection>
										<PkpForm v-bind="step.form" @set="updateStep"></PkpForm>
									</PanelSection>
								</template>
								<template v-else-if="step.type === 'email'">
									<PanelSection v-if="skippedSteps.includes(step.id)">
										<Notification type="warning">
											This email has been skipped.
											<button
												class="-linkButton"
												:disabled="isSubmitting"
												@click="toggleSkippedStep(step.id)"
											>
												Don't skip email
											</button>
										</Notification>
									</PanelSection>
									<PanelSection v-else>
										<Composer
											:id="step.id"
											add-c-c-label="Add CC/BCC"
											:attachers="step.attachers"
											attached-files-label="Attached Files:"
											attach-files-label="Attach Files"
											:attachments="step.attachments"
											:bcc="step.bcc"
											bcc-label="BCC:"
											:body="step.body"
											body-label="Message"
											:can-change-recipients="step.canChangeRecipients"
											cc-label="CC:"
											:cc="step.cc"
											confirm-switch-locale-label="Are you sure you want to change to {$localeName} to compose this email? Any changes you have made to the subject and body of the email will be lost."
											deselect-label="Deselect"
											:email-templates="step.EmailTemplateMocks"
											:email-templates-api-url="EmailTemplateMocksApiUrl"
											:errors="step.errors"
											find-template-label="Find Template"
											:initial-template-key="step.initialTemplateKey"
											insert-label="Insert"
											insert-modal-label="Insert Content"
											insert-content-label="Content"
											insert-search-label="Find content to insert"
											load-template-label="Email Templates"
											:locale="step.locale"
											:locales="step.locales"
											more-search-results-label="{$number} more"
											:recipient-options="step.recipientOptions"
											:recipients="step.recipients"
											recipients-label="To:"
											remove-item-label="Remove {$item}"
											searching-label="Searching"
											search-results-label="Search Results"
											:subject="step.subject"
											subject-label="Subject:"
											switch-to-label="Switch To:"
											switch-to-named-language-label="Switch to {$name}"
											:variables="step.variables"
											@set="updateStep"
										></Composer>
									</PanelSection>
								</template>
								<template v-else-if="step.type === 'promoteFiles'">
									<PanelSection>
										<ListPanel
											v-for="(list, i) in step.lists"
											:key="i"
											:items="list.files"
											:title="list.name"
											class="decision_filesList"
										>
											<template #item="{item}">
												<SelectSubmissionFileListItem
													:created-at="item.createdAt"
													:document-type="item.documentType"
													download-label="Download"
													:genre-name="
														item.genreName ? localize(item.genreName) : ''
													"
													:genre-is-primary="
														item.genreId &&
														!item.genreIsDependent &&
														!item.genreIsSupplementary
													"
													:file-id="item.id"
													:name="localize(item.name)"
													:uploaded-by="item.uploaderUserName"
													:url="item.url"
												>
													<input
														v-model="step.selected"
														type="checkbox"
														:name="'promoteFile' + item.id"
														:value="item.id"
													/>
												</SelectSubmissionFileListItem>
											</template>
										</ListPanel>
									</PanelSection>
								</template>
							</Panel>
						</Step>
					</Steps>

					<Panel class="decision__footer__panel">
						<PanelSection>
							<template #header>
								<span>
									<!-- empty on purpose -->
								</span>
							</template>
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
								<Spinner v-if="isSubmitting"></Spinner>
								<PkpButton
									:disabled="isSubmitting"
									:is-warnable="true"
									@click="cancel"
								>
									Cancel
								</PkpButton>
								<PkpButton
									v-if="!isOnFirstStep && steps.length > 1"
									:disabled="isSubmitting"
									@click="previousStep"
								>
									Previous
								</PkpButton>
								<PkpButton
									:disabled="isSubmitting"
									:is-primary="isOnLastStep"
									@click="nextStep"
								>
									<template v-if="isOnLastStep">Record Decision</template>
									<template v-else>Continue</template>
								</PkpButton>
							</div>
						</PanelSection>
					</Panel>
				</div>

				<div
					ref="notifications"
					aria-live="polite"
					aria-atomic="true"
					class="app__notifications"
					role="status"
				>
					<TransitionGroup name="app__notification">
						<Notification
							v-for="notification in notifications"
							:key="notification.key"
							:type="notification.type"
							:can-dismiss="true"
							@dismiss="dismissNotification(notification.key)"
						>
							{{ notification.message }}
						</Notification>
					</TransitionGroup>
				</div>
				<transition name="app__loading">
					<div v-if="isLoading" class="app__loading" role="alert">
						<div class="app__loading__content">
							<Spinner></Spinner>
							Loading
						</div>
					</div>
				</transition>
			</div>
`,
	data() {
		return {
			abandonDecisionLabel: 'Cancel Decision',
			cancelConfirmationPrompt:
				'Are you sure you want to cancel this decision?',
			currentStep: {},
			decision: 1,
			EmailTemplateMocksApiUrl:
				'https://httbin.org/publicknowledge/api/v1/EmailTemplateMocks',
			keepWorkingLabel: 'Keep Working',
			isComplete: false,
			isSubmitting: false,
			reviewRoundId: 2,
			skippedSteps: [],
			stageId: 3,
			stepErrorMessage: 'There is a problem with the {$stepName} step.',
			startedSteps: [],
			submissionApiUrl:
				'https://httbin.org/publicknowledge/api/v1/submission/1',
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
					defaultEmailTemplateMockKey: 'EDITOR_DECISION_ACCEPT',
					EmailTemplateMocks: [
						{
							...EmailTemplateMock,
							name: {
								en: 'Accept for Publication',
							},
							subject: {
								en: 'Accept for Publication',
							},
						},
						{
							...EmailTemplateMock,
							key: 'EDITOR_DECISION_ACCEPT_CONDITIONS',
							name: {
								en: 'Accept with Conditions',
							},
							subject: {
								en: 'Accept with Conditions',
							},
						},
						{
							...EmailTemplateMock,
							key: 'EDITOR_DECISION_ACCEPT_EARLY',
							name: {
								en: 'Accept for Early Publication',
							},
							subject: {
								en: 'Accept for Early Publication',
							},
						},
					],
					EmailTemplateMocksApiUrl: 'http://example.org',
					variables: {
						en: [...InsertContentMock],
						fr_CA: [...InsertContentMock],
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
					defaultEmailTemplateMockKey: 'EDITOR_DECISION_THANK_REVIEWERS',
					EmailTemplateMocks: [
						{
							...EmailTemplateMock,
							key: 'EDITOR_DECISION_THANK_REVIEWERS',
							subject: {
								en: 'Thank Reviewer',
							},
						},
						{
							...EmailTemplateMock,
							key: 'EDITOR_DECISION_THANK_REVIEWERS_REQUEST',
							subject: {
								en: 'Thank Reviewer and Request Feedback',
							},
						},
					],
					EmailTemplateMocksApiUrl: 'http://example.org',
					variables: {
						en: [...InsertContentMock],
						fr_CA: [...InsertContentMock],
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
							files: [...SubmissionFilesMock],
						},
					],
					selected: [],
					to: 6,
				},
			],
		};
	},
};

export const Default = {
	render: (args) => ({
		components: {
			DecisionPageWithDataAndTemplate,
		},
		setup() {
			return {...args};
		},
		template: `
			<DecisionPageWithDataAndTemplate />
		`,
	}),

	args: {},
};
