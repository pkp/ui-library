import SubmissionWizardPage from './SubmissionWizardPage.vue';

import ContributorsListPanel from '@/components/ListPanel/contributors/ContributorsListPanel.vue';
import File from '@/components/File/File.vue';
import PkpForm from '@/components/Form/Form.vue';
import SubmissionFilesListPanel from '@/components/ListPanel/submissionFiles/SubmissionFilesListPanel.vue';
import categories from '@/mocks/categories';
import confirmForm from '@/components/Form/mocks/form-confirm';
import dropzoneOptions from '@/mocks/dropzoneOptions';
import forTheEditorsForm from '@/components/Form/mocks/form-for-the-editors';
import fieldKeywords from '@/components/Form/mocks/field-controlled-vocab-keywords';
import formChangeSubmission from '@/components/Form/mocks/form-change-submission';
import genres from '@/mocks/genres';
import submission from '@/mocks/submission';
import submissionFiles from '@/mocks/submissionFiles';
import submissionFileForm from '@/components/Form/mocks/form-submission-file';
import titleAbstractForm from '@/components/Form/mocks/form-title-abstract';

export default {
	title: 'Pages/SubmissionWizardPage',
	component: SubmissionWizardPage,
};

const SubmissionWizardPageWithDataAndTemplate = {
	extends: SubmissionWizardPage,
	components: {ContributorsListPanel, File, PkpForm, SubmissionFilesListPanel},
	template: `
	<div class="app__page width width--wide">
		<div class="submissionWizard">
			<div class="submissionWizard__submissionDetails">
				{{ submission.id }}
				<span class="app__breadcrumbsSeparator" aria-hidden="true">/</span>
				{{ publication.authorsStringShort }}
				<span class="app__breadcrumbsSeparator" aria-hidden="true">/</span>
				{{ localize(publication.title) }}
			</div>
			<h1 ref="pageTitle" class="app__pageHeading">
				Make Submission
				<PkpButton
					:is-disabled="isDisconnected"
					@click="openAlert('Saves the submission for later')"
				>
					Save for Later
				</PkpButton>
			</h1>
			<div class="submissionWizard__submissionConfiguration">
				Submitting to the
				<strong>Articles</strong>
				section in
				<strong>English</strong>
				.
				<button class="-linkButton" @click="isModalOpenedConfig = true">
					Change
				</button>
			</div>
			<Steps
				class="submissionWizard__steps"
				:current="currentStep.id"
				:started-steps="startedSteps"
				label="Complete the steps to make a submission"
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
					<Panel>
						<PanelSection v-for="section in step.sections" :key="section.id">
							<template #header>
								<h2>{{ section.name }}</h2>
								<div v-strip-unsafe-html="section.description" />
							</template>
							<PkpForm
								v-if="section.type === 'form'"
								v-bind="section.form"
								ref="autosaveForms"
								class="submissionWizard__stepForm"
								@set="updateForm"
							/>
							<SubmissionFilesListPanel
								v-else-if="section.type === 'files'"
								v-bind="components.submissionFiles"
								@set="set"
							/>
							<ContributorsListPanel
								v-else-if="section.type === 'contributors'"
								v-bind="components.contributors"
								:items="publication.authors"
								:publication="publication"
								@updated:contributors="setContributors"
								@updated:publication="setPublication"
							/>
							<template v-else-if="section.type === 'review'">
								<Notification
									v-if="Object.keys(errors).length"
									type="warning"
									class="submissionWizard__review_errors"
								>
									There are one or more problems that need to be fixed before
									you can submit. Please review the information below and make
									the requested changes.
								</Notification>
								<div
									v-for="reviewStep in steps.filter(
										(iStep) => iStep.id !== step.id,
									)"
									:key="reviewStep.id"
									class="submissionWizard__reviewPanel"
								>
									<div class="submissionWizard__reviewPanel__header">
										<h3 :id="'review-' + reviewStep.id">
											{{ reviewStep.name }}
										</h3>
										<PkpButton
											:aria-describedby="'review-' + reviewStep.id"
											class="submissionWizard__reviewPanel__edit"
											@click="openStep(reviewStep.id)"
										>
											Edit
										</PkpButton>
									</div>
									<div
										v-for="section in reviewStep.sections"
										:key="section.id"
										class="submissionWizard__reviewPanel__section"
										:class="
											'submissionWizard__reviewPanel__section--' + section.type
										"
									>
										<template v-if="section.id === 'files'">
											<Notification
												v-for="(error, i) in errors.files"
												:key="i"
												type="warning"
												class="submissionWizard__reviewEmptyWarning"
											>
												<Icon icon="Error" class="h-5 w-5" :inline="true"></Icon>
												{{ error }}
											</Notification>
											<ul class="submissionWizard__reviewPanel__list">
												<li
													v-for="file in components.submissionFiles.items"
													:key="file.id"
													class="submissionWizard__reviewPanel__item__value"
												>
													<a
														:href="file.url"
														class="submissionWizard__reviewPanel__fileLink"
													>
														<File
															:document-type="file.documentType"
															:name="localize(file.name)"
														></File>
													</a>
													<span
														class="submissionWizard__reviewPanel__list__actions"
													>
														<Badge
															v-if="file.genreId"
															:is-primary="!file.genreIsSupplementary"
														>
															{{ localize(file.genreName) }}
														</Badge>
													</span>
												</li>
											</ul>
										</template>
										<template v-else-if="section.id === 'contributors'">
											<Notification
												v-if="!publication.authors.length"
												type="warning"
												class="submissionWizard__reviewEmptyWarning"
											>
												<Icon icon="Error" class="h-5 w-5" :inline="true"></Icon>
												No contributors have been added to this submission.
											</Notification>
											<ul v-else class="submissionWizard__reviewPanel__list">
												<li v-for="(error, i) in errors.contributors" :key="i">
													<Notification type="warning">
														<Icon
															icon="Error"
															class="h-5 w-5"
															:inline="true"
														></Icon>
														{{ error }}
													</Notification>
												</li>
												<li
													v-for="author in publication.authors"
													:key="author.id"
													class="submissionWizard__reviewPanel__item__value"
												>
													<span
														class="submissionWizard__reviewPanel__list__name"
													>
														{{ getAuthorName(author) }}
													</span>
													<span
														class="submissionWizard__reviewPanel__list__actions"
													>
														<Badge
															v-if="publication.primaryContactId === author.id"
															:is-primary="true"
														>
															Submitting Author
														</Badge>
														<Badge>{{ localize(author.userGroupName) }}</Badge>
													</span>
												</li>
											</ul>
										</template>
										<template v-else-if="section.id === 'details'">
											<div class="submissionWizard__reviewPanel__item">
												<template v-if="errors.title">
													<Notification
														v-for="(error, i) in errors.title"
														:key="i"
														type="warning"
													>
														<Icon icon="Error" class="h-5 w-5"></Icon>
														{{ error }}
													</Notification>
												</template>
												<h4 class="submissionWizard__reviewPanel__item__header">
													Title
												</h4>
												<div
													class="submissionWizard__reviewPanel__item__value"
													v-strip-unsafe-html="localize(publication.title)"
												/>
											</div>
											<div class="submissionWizard__reviewPanel__item">
												<template v-if="errors.abstract">
													<Notification
														v-for="(error, i) in errors.abstract"
														:key="i"
														type="warning"
													>
														<Icon icon="Error" class="h-5 w-5"></Icon>
														{{ error }}
													</Notification>
												</template>
												<h4 class="submissionWizard__reviewPanel__item__header">
													Abstract
												</h4>
												<div
													class="submissionWizard__reviewPanel__item__value"
													v-strip-unsafe-html="localize(publication.abstract)"
												/>
											</div>
											<div
												v-if="localize(publication.keywords).length"
												class="submissionWizard__reviewPanel__item"
											>
												<template v-if="errors.abstract">
													<Notification
														v-for="(error, i) in errors.abstract"
														:key="i"
														type="warning"
													>
														<Icon icon="Error" class="h-5 w-5"></Icon>
														{{ error }}
													</Notification>
												</template>
												<h4 class="submissionWizard__reviewPanel__item__header">
													Keywords
												</h4>
												<div class="submissionWizard__reviewPanel__item__value">
													{{
														localize(publication.keywords).join(
															t('common.commaListSeparator'),
														)
													}}
												</div>
											</div>
										</template>
										<template v-else-if="section.id === 'editors'">
											<div
												v-if="publication.subjects.length"
												class="submissionWizard__reviewPanel__item"
											>
												<h4 class="submissionWizard__reviewPanel__item__header">
													Subjects
												</h4>
												<div class="submissionWizard__reviewPanel__item__value">
													{{
														publication.subjects.join(
															t('common.commaListSeparator'),
														)
													}}
												</div>
											</div>
											<div
												v-if="publication.categoryIds.length"
												class="submissionWizard__reviewPanel__item"
											>
												<h4 class="submissionWizard__reviewPanel__item__header">
													Categories
												</h4>
												<ul class="submissionWizard__reviewPanel__item__value">
													<li
														v-for="currentCategoryTitle in currentCategoryTitles"
														:key="currentCategoryTitle"
													>
														{{ currentCategoryTitle }}
													</li>
												</ul>
											</div>
											<div class="submissionWizard__reviewPanel__item">
												<h4 class="submissionWizard__reviewPanel__item__header">
													Comments for the Editor
												</h4>
												<div class="submissionWizard__reviewPanel__item__value">
													<template v-if="submission.commentsForEditor">
														{{ submission.commentsForEditor }}
													</template>
													<template v-else>No comments.</template>
												</div>
											</div>
										</template>
									</div>
								</div>
							</template>
						</PanelSection>
					</Panel>
				</Step>
			</Steps>
		</div>

		<ButtonRow class="submissionWizard__footer">
			<template #end>
				<PkpButton
					v-if="!isOnFirstStep"
					:is-warnable="true"
					@click="previousStep"
				>
					Back
				</PkpButton>
				<!--
					Leave this v-else in so that the slot
					is never empty.
				-->
				<span v-else></span>
			</template>
			<span
				role="status"
				aria-live="polite"
				class="submissionWizard__lastSaved"
				:class="
					isDisconnected ? 'submissionWizard__lastSaved--disconnected' : ''
				"
			>
				<Spinner v-if="isAutosaving || isDisconnected"></Spinner>
				<template v-if="isAutosaving">Saving</template>
				<template v-else-if="isDisconnected">Reconnecting</template>
				<template v-else-if="lastAutosavedMessage">
					{{ lastAutosavedMessage }}
				</template>
			</span>
			<PkpButton :is-disabled="isDisconnected" @click="saveForLater">
				Save for Later
			</PkpButton>
			<PkpButton
				:is-primary="true"
				:is-disabled="isOnLastStep && !canSubmit"
				@click="nextStep"
			>
				<template v-if="isOnLastStep">Submit</template>
				<template v-else>Continue</template>
			</PkpButton>
		</ButtonRow>

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
		// Set up the form for the details step
		let detailsForm = {...titleAbstractForm};
		detailsForm.fields = detailsForm.fields.filter(
			(field) => !['prefix', 'subtitle'].includes(field.name),
		);
		detailsForm.fields.push({
			...fieldKeywords,
			groupId: 'default',
		});

		// Remove save buttons from forms
		[detailsForm, confirmForm, forTheEditorsForm].forEach((form) => {
			delete form.pages[0].submitButton;
		});

		return {
			categories: {...categories},
			components: {
				contributors: {
					canEditPublication: true,
					emptyLabel: 'No contributors yet.',
					form: {...submissionFileForm},
					id: 'contributors',
					i18nAddContributor: 'Add Contributor',
					i18nConfirmDelete:
						'Are you sure you want to remove this contributor?',
					i18nDeleteContributor: 'Delete Contributor',
					i18nEditContributor: 'Edit',
					i18nSetPrimaryContact: 'Set Primary Contact',
					i18nPrimaryContact: 'Primary Contact',
					i18nContributors: 'Contributors',
					i18nSaveOrder: 'Save Order',
					i18nPreview: 'Preview',
					i18nPreviewDescription:
						'Contributors to this publication will be identified in this journal in the following formats.',
					i18nDisplay: 'Display',
					i18nFormat: 'Format',
					i18nAbbreviated: 'Abbreviated',
					i18nPublicationLists: 'Publication Lists',
					i18nFull: 'Full',
					publicationApiUrlFormat: '',
					title: 'Contributors',
				},
				reconfigureSubmission: {...formChangeSubmission},
				submissionFiles: {
					addFileLabel: 'Add File',
					apiUrl: 'http://httpbin.org/post',
					cancelUploadLabel: 'Cancel Upload',
					genrePromptLabel: 'What type of file is this?',
					emptyLabel:
						'Upload any files the editorial team will need to evaluate your submission.',
					emptyAddLabel: 'Upload File',
					fileStage: 1,
					form: {...submissionFileForm},
					genres: [...genres],
					id: 'submissionFiles',
					items: [...submissionFiles],
					options: {...dropzoneOptions},
					otherLabel: 'Other',
					primaryLocale: 'en',
					removeConfirmLabel: 'Are you sure you want to remove this file?',
					stageId: 1,
					title: 'Files',
					uploadProgressLabel: 'Uploading {$percent}% complete',
				},
			},
			i18nConfirmSubmit:
				'The submission, <strong>{$title}</strong>, will be submitted to <strong>Journal of Public Knowledge</strong> for editorial review. Are you sure you want to complete this submission?',
			i18nDiscardChanges: 'No, discard unsaved changes',
			i18nDisconnected: 'Disconnected',
			i18nLastAutosaved: 'Last saved {$when}',
			i18nSubmit: 'Submit',
			i18nTitleSeparator: ' | ',
			i18nUnableToSave:
				'An error was encountered and we were unable to save your submission. You may have been disconnected.',
			i18nUnsavedChanges: 'Unsaved Changes',
			i18nUnsavedChangesMessage:
				'We found unsaved changes from {$when}. This can happen if you lose connection to the server while working. Restoring those changes may overwrite any changes you have made since then. Would you like to restore those changes now?',
			publication: {...submission.publications[0]},
			submission: {...submission},
			steps: [
				{
					id: 'details-step',
					name: 'Details',
					sections: [
						{
							id: 'details',
							type: 'form',
							name: 'Submission Details',
							description: `<p>
									Please provide the following details to help us manage your submission in our system.
								</p>`,
							form: {...detailsForm},
						},
					],
				},
				{
					id: 'files-step',
					name: 'Upload Files',
					sections: [
						{
							id: 'files',
							name: 'Upload Files',
							type: 'files',
							description: `<p>
									Provide any files our editorial team may need to evaluate your
									submission. In addition to the main work, you may wish to
									submit data sets, conflict of interest statements, or other
									supplementary files if these will be helpful for our editors.
								</p>`,
						},
					],
				},
				{
					id: 'contributors-step',
					name: 'Contributors',
					sections: [
						{
							id: 'contributors',
							type: 'contributors',
							name: 'Contributors',
							description: `<p>
									Add details for all of the contributors to this submission.
									Contributors added here will be sent an email confirmation of
									the submission, as well as a copy of all editorial decisions
									recorded against this submission.
								</p>
								<p>
									If a contributor can not be contacted by email, for example an
									institution or an anonymous contributor, please do not enter a
									fake email here. You can add this information in a message to
									the editor at a later step in the submissio process.
								</p>`,
						},
					],
				},
				{
					id: 'editors-step',
					name: 'For the Editors',
					sections: [
						{
							id: 'editors',
							type: 'form',
							name: 'For the Editors',
							description: `<p>
									Please provide the following details in order to help our editorial team manage your submission.
								</p>
								<p>
									When entering metdata such as keywords, provide entries that you think would be most helpful to the person managing your submission. If your submission is accepted, this information can be changed before publication.
								</p>`,
							form: {...forTheEditorsForm},
						},
					],
				},
				{
					id: 'review-step',
					name: 'Review',
					sections: [
						{
							id: 'review',
							type: 'review',
							name: 'Review and Submit',
							description: `<p>
									Review the information you have entered before you complete
									your submission. You can change any of the details displayed
									here by clicking the edit button at the top of each section.
								</p>
								<p>
									Once you complete your submission, a member of our editorial
									team will be assigned to review it. Please ensure the details
									you have entered here are as accurate as possible.
								</p>`,
						},
						{
							id: 'confirm',
							type: 'form',
							name: 'Confirmation',
							description: `<p>Please confirm the following before you submit.</p>`,
							form: {...confirmForm},
						},
					],
				},
			],
			isModalOpenedConfig: false,
		};
	},
	methods: {
		/**
		 * Override the browser history feature because it
		 * doesn't play nicely with the #/ routing in the
		 * UI Library app
		 */
		addHistory() {
			//
		},
		/**
		 * Override the autosave functionality
		 */
		_sendAutosave() {
			//
		},
		openAlert(msg) {
			alert(msg);
		},
	},
};

export const Default = {
	render: (args) => ({
		components: {
			SubmissionWizardPageWithDataAndTemplate,
		},
		setup() {
			return {...args};
		},
		template: `
			<SubmissionWizardPageWithDataAndTemplate />
		`,
	}),

	args: {},
};
