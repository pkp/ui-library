<template>
	<div class="app__page app__page--decision width width--wide">
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
		<template v-if="!isComplete">
			<h1 class="app__pageHeading">
				Accept Submission
			</h1>
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
				<button class="-linkButton" @click="openStep(index)">
					View Error
				</button>
			</notification>

			<steps
				:current="currentStep.id"
				:initialized-steps="initializedSteps"
				label="Complete the following steps to take this decision"
				progress-label="{$current}/{$total} steps"
				show-steps-label="Show all steps"
				@step:open="openStep"
			>
				<step
					v-for="step in workflow"
					:key="step.id"
					:id="step.id"
					:label="step.name"
				>
					<template v-if="step.type === 'form'">
						<panel>
							<panel-section>
								<template slot="header">
									<h2>{{ step.name }}</h2>
									<p>{{ step.description }}</p>
								</template>
								<pkp-form
									v-bind="step.form"
									:errors="step.errors"
									@set="updateStep"
								></pkp-form>
							</panel-section>
						</panel>
					</template>
					<template v-else-if="step.type === 'email'">
						<!-- <div v-if="!sendNotifyEmail">
							This email has been skipped.
							<button class="-linkButton" @click="sendNotifyEmail = true">
								Compose Email
							</button>
						</div> -->
						<composer
							v-bind="step"
							addCCLabel="Add CC/BCC"
							attachFilesLabel="Attach Files"
							attachedFilesLabel="Attached Files:"
							bccLabel="BCC:"
							bodyLabel="Message"
							ccLabel="CC:"
							deselectLabel="Deselect"
							:email-templatesApiUrl="emailTemplatesApiUrl"
							findTemplateLabel="Find Template"
							loadTemplateLabel="Load a Template"
							moreSearchResultsLabel="{$number} more"
							removeItemLabel="Remove {$item}"
							searchingLabel="Searching"
							subjectLabel="Subject:"
							switchToLabel="Switch To:"
							toLabel="To:"
							@set="updateStep"
						>
							<template slot="description">
								<h2>{{ step.name }}</h2>
								<p v-html="step.description"></p>
							</template>
						</composer>
					</template>
					<template v-else-if="step.type === 'promoteFiles'">
						<panel>
							<panel-section>
								<template slot="header">
									<h2>{{ step.name }}</h2>
									<p>{{ step.description }}</p>
								</template>
								<list-panel
									v-for="(list, i) in step.lists"
									:key="i"
									:items="list.files"
									:title="list.name"
									class="decision_filesList"
								>
									<template slot="itemsEmpty">
										{{ __('common.noItemsFound') }}
									</template>
									<template v-slot:item="{item}">
										<div class="listPanel__itemSummary">
											<label class="listPanel__selectWrapper">
												<div class="listPanel__selector">
													<input
														type="checkbox"
														name="selected[]"
														:value="item.id"
														v-model="step.selected"
													/>
												</div>
												<div class="listPanel__itemIdentity">
													<div class="listPanel__itemSubTitle">
														<a :href="item.url">{{ localize(item.name) }}</a>
													</div>
												</div>
											</label>
										</div>
									</template>
								</list-panel>
							</panel-section>
						</panel>
					</template>
				</step>
			</steps>

			<div
				class="decision__footer"
				:class="{'decision__footer--noSteps': !workflow.length}"
			>
				<spinner v-if="isSubmitting"></spinner>
				<pkp-button
					v-if="!isOnFirstStep"
					:disabled="isSubmitting"
					:is-warnable="true"
					@click="cancel"
				>
					Cancel
				</pkp-button>
				<pkp-button
					v-if="!isOnFirstStep"
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
					<template v-if="isOnLastStep">
						Record Decision
					</template>
					<template v-else>
						Next
					</template>
				</pkp-button>
				<button
					class="decision__skipStep -linkButton"
					v-if="currentStep.type === 'email'"
					:disabled="isSubmitting"
					@click="skipStep(currentStep.id)"
				>
					Skip this email
				</button>
			</div>
		</template>

		<div v-else class="width width--narrow">
			<panel :stack="true">
				<panel-section>
					<div slot="header">
						<h1>Submission Accepted</h1>
						<p>
							The submission, "Towards Designing an Intercultural Curriculum: A
							Case Study from the Atlantic Coast of Nicaragua", has been
							accepted for publication and sent to the copyediting stage.
						</p>
						<p>
							Go
							<a href="#">back to the submission</a>
							or
							<a href="#">view all submissions</a>
							.
						</p>
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

export default {
	extends: DecisionPage,
	data() {
		return {
			currentStep: {},
			decision: 1,
			emailTemplatesApiUrl:
				'http://localhost:8000/publicknowledge/api/v1/emailTemplates',
			stepErrorMessage: 'There is a problem with the {$stepName} step.',
			initializedSteps: [],
			isComplete: false,
			isSubmitting: false,
			reviewRoundId: 2,
			skippedSteps: [],
			stageId: 3,
			submissionApiUrl:
				'http://localhost:8000/publicknowledge/api/v1/submission/1',
			workflow: [
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
										label: 'Request payment from the author (USD $150)'
									},
									{
										value: false,
										label: 'Waive the fee'
									}
								],
								groupId: 'default'
							}
						],
						groups: [
							{
								id: 'default',
								pageId: 'default'
							}
						],
						pages: [
							{
								id: 'default'
							}
						],
						primaryLocale: 'en_US',
						visibleLocales: ['en_US'],
						supportedFormLocales: [],
						errors: {}
					}
				},
				{
					id: 'notifyAuthors',
					type: 'email',
					name: 'Notify Authors',
					description:
						'Send an email to the authors to let them know that their submission has been accepted for publication.',
					errors: {},
					to: [31],
					toOptions: [
						{
							value: 31,
							label: 'Rana Baiyewu'
						}
					],
					canChangeTo: false,
					canSkip: true,
					defaultEmailTemplateKey: 'EDITOR_DECISION_ACCEPT',
					emailTemplates: [
						{
							...emailTemplate,
							subject: {
								en_US: 'Accept for Publication'
							}
						},
						{
							...emailTemplate,
							subject: {
								en_US: 'Accept with Conditions'
							}
						},
						{
							...emailTemplate,
							subject: {
								en_US: 'Accept for Early Publication'
							}
						}
					],
					emailTemplatesApiUrl: 'http://example.org'
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
							'You can not send an email to the following recipients: Alan Mwandenga.'
						]
					},
					toOptions: [
						{
							value: 10,
							label: 'Adela Gallego'
						},
						{
							value: 9,
							label: 'Aisla McCrae'
						}
					],
					canChangeTo: true,
					canSkip: true,
					defaultEmailTemplateKey: 'EDITOR_DECISION_ACCEPT',
					emailTemplates: [
						{
							...emailTemplate,
							subject: {
								en_US: 'Thank Reviewer'
							}
						},
						{
							...emailTemplate,
							subject: {
								en_US: 'Thank Reviewer and Request Feedback'
							}
						}
					],
					emailTemplatesApiUrl: 'http://example.org'
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
							files: [...submissionFiles]
						}
					],
					selected: [],
					to: 6
				}
			]
		};
	}
};
</script>

<style lang="less">
@import '../../../../styles/_import';

.component--DecisionPage .component__exampleWrapper {
	background: @bg;
	max-width: 100%; // Let the page class define the width
}
</style>
