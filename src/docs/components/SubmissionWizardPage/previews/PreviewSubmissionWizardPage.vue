<template>
	<div class="app__page width width--wide">
		<div class="submissionWizard">
			<div class="submissionWizard__submissionDetails">
				{{ submission.id }}
				<span class="app__breadcrumbsSeparator" aria-hidden="true">/</span>
				{{ publication.authorsStringShort }}
				<span class="app__breadcrumbsSeparator" aria-hidden="true">/</span>
				{{ localize(publication.title) }}
			</div>
			<h1 class="app__pageHeading" ref="pageTitle">
				Make Submission
				<pkp-button>Save for Later</pkp-button>
			</h1>
			<div class="submissionWizard__submissionConfiguration">
				Submitting to the
				<strong>Articles</strong>
				section in
				<strong>English</strong>
				.
				<button class="-linkButton" @click="$modal.show('config')">
					Change
				</button>
				<modal
					:closeLabel="__('common.close')"
					name="config"
					title="##Change Submission Type##"
				>
					## TODO ##
				</modal>
			</div>
			<steps
				class="submissionWizard__steps"
				:current="currentStep.id"
				:started-steps="startedSteps"
				label="Complete the steps to make a submission"
				progress-label="{$current}/{$total} steps"
				scroll-to="$refs.pageTitle"
				show-steps-label="Show all steps"
				@step:open="openStep"
			>
				<step
					v-for="step in steps"
					:key="step.id"
					:id="step.id"
					:label="step.name"
				>
					<panel>
						<panel-section v-for="section in step.sections" :key="section.id">
							<template slot="header">
								<h2>{{ section.name }}</h2>
								<div v-html="section.description" />
							</template>
							<pkp-form
								v-if="section.type === 'form'"
								v-bind="section.form"
								ref="autosaveForms"
								@set="updateForm"
							/>
							<submission-files-list-panel
								v-else-if="section.type === 'files'"
								addFileLabel="Add File"
								apiUrl="http://localhost:8000/publicknowledge/api/v1/submissions/1/files"
								cancelUploadLabel="Cancel Upload"
								genrePromptLabel="What kind of file is this?"
								emptyLabel="Upload any files the editorial team will need to evaluate your submission."
								emptyAddLabel="Upload Files"
								:fileStage="2"
								:form="components.submissionFiles.form"
								:genres="components.submissionFiles.genres"
								:id="section.id"
								:items="components.submissionFiles.items"
								:options="components.submissionFiles.options"
								otherLabel="Other"
								primaryLocale="en"
								removeConfirmLabel="Are you sure you want to remove this file?"
								:stageId="1"
								title="Files"
								uploadProgressLabel="Uploading {$percent}% complete"
								@set="set"
							/>
							<contributors-list-panel
								v-else-if="section.type === 'contributors'"
								add-contributor-label="Add Contributor"
								:can-edit-publication="true"
								confirm-delete-message="Are you sure you want to remove {$name} as a contributor? This action can not be undone."
								delete-contributor-label="Remove"
								edit-contributor-label="Edit"
								:form="{
									/** TODO */
								}"
								id="contributors"
								:items="publication.authors"
								:publication="publication"
								publication-api-url="https://localhost:8000/publicknowledge/api/v1/submissions/1/publications/1/contributors"
								title="Contributors"
								@updated:contributors="setContributors"
							/>
							<template v-else-if="section.type === 'review'">
								<div
									v-for="reviewStep in steps.filter(
										(iStep) => iStep.id !== step.id
									)"
									:key="reviewStep.id"
									class="submissionWizard__reviewPanel"
								>
									<div class="submissionWizard__reviewPanel__header">
										<h3 :id="'review-' + reviewStep.id">
											{{ reviewStep.name }}
										</h3>
										<pkp-button
											:aria-describedby="'review-' + reviewStep.id"
											class="submissionWizard__reviewPanel__edit"
											@click="openStep(reviewStep.id)"
										>
											Edit
										</pkp-button>
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
											<ul
												v-if="components.submissionFiles.items.length"
												class="submissionWizard__reviewPanel__list"
											>
												<li
													v-for="file in components.submissionFiles.items"
													:key="file.id"
													class="submissionWizard__reviewPanel__item__value"
												>
													<file
														:documentType="file.documentType"
														:id="'file' + file.id"
														:name="localize(file.name)"
													/>
													<span
														class="submissionWizard__reviewPanel__list__actions"
													>
														<badge :is-primary="!file.genreIsSupplementary">
															{{ localize(file.genreName) }}
														</badge>
														<pkp-button
															element="a"
															class="submissionWizard__reviewPanel__download"
															:href="file.url"
															target="_blank"
															rel="noopener noreferrer"
															:aria-describedby="'file' + file.id"
														>
															<icon icon="download" />
															<span class="-screenReader">Download</span>
														</pkp-button>
													</span>
												</li>
											</ul>
											<notification v-else type="warning">
												<icon icon="exclamation-triangle" :inline="true" />
												No files have been uploaded for this submission.
											</notification>
										</template>
										<template v-else-if="section.id === 'contributors'">
											<ul
												v-if="publication.authors.length"
												class="submissionWizard__reviewPanel__list"
											>
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
														<badge
															v-if="publication.primaryContactId === author.id"
															:is-primary="true"
														>
															Submitting Author
														</badge>
														<badge>{{ localize(author.userGroupName) }}</badge>
													</span>
												</li>
											</ul>
											<notification v-else type="warning">
												<icon icon="exclamation-triangle" :inline="true" />
												No contributors have been added for this submission.
											</notification>
										</template>
										<template v-else-if="section.id === 'details'">
											<div class="submissionWizard__reviewPanel__item">
												<h4 class="submissionWizard__reviewPanel__item__header">
													Title
												</h4>
												<div class="submissionWizard__reviewPanel__item__value">
													{{ localize(publication.title) }}
												</div>
											</div>
											<div class="submissionWizard__reviewPanel__item">
												<h4 class="submissionWizard__reviewPanel__item__header">
													Abstract
												</h4>
												<div
													class="submissionWizard__reviewPanel__item__value"
													v-html="localize(publication.abstract)"
												/>
											</div>
										</template>
										<template v-else-if="section.id === 'editors'">
											<div
												v-if="publication.keywords.length"
												class="submissionWizard__reviewPanel__item"
											>
												<h4 class="submissionWizard__reviewPanel__item__header">
													Keywords
												</h4>
												<div class="submissionWizard__reviewPanel__item__value">
													{{
														publication.keywords.join(
															pkp.localeKeys['common.commaListSeparator']
														)
													}}
												</div>
											</div>
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
															pkp.localeKeys['common.commaListSeparator']
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
						</panel-section>
					</panel>
				</step>
			</steps>
		</div>

		<button-row class="submissionWizard__footer">
			<template slot="end">
				<pkp-button
					v-if="!isOnFirstStep"
					:isWarnable="true"
					@click="previousStep"
				>
					Back
				</pkp-button>
				<!--
					Leave this v-else in so that the slot
					is never empty.
				-->
				<span v-else></span>
			</template>
			<spinner v-if="isSaving"></spinner>
			<span
				v-else-if="isDisconnected"
				class="submissionWizard__lastSaved submissionWizard__lastSaved--disconnected"
			>
				<spinner />
				Reconnecting
			</span>
			<span v-else-if="lastSavedTimestamp" class="submissionWizard__lastSaved">
				Last saved {{ lastSavedTimestamp }}
			</span>
			<pkp-button>Save for Later</pkp-button>
			<pkp-button :isPrimary="true" @click="nextStep">Continue</pkp-button>
		</button-row>

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
import ContributorsListPanel from '../../../../components/ListPanel/contributors/ContributorsListPanel.vue';
import File from '../../../../components/File/File.vue';
import PkpForm from '../../../../components/Form/Form.vue';
import SubmissionWizardPage from '@/components/Container/SubmissionWizardPage.vue';
import SubmissionFilesListPanel from '../../../../components/ListPanel/submissionFiles/SubmissionFilesListPanel.vue';
import confirmForm from '@/docs/components/Form/helpers/form-confirm';
import categories from '../../../data/categories';
import dropzoneOptions from '../../../data/dropzoneOptions';
import forTheEditorsForm from '@/docs/components/Form/helpers/form-for-the-editors';
import genres from '../../../data/genres';
import submission from '../../../data/submission';
import submissionFiles from '../../../data/submissionFiles';
import submissionFileForm from '@/docs/components/Form/helpers/form-submission-file';
import titleAbstractForm from '@/docs/components/Form/helpers/form-title-abstract';

export default {
	extends: SubmissionWizardPage,
	components: {
		ContributorsListPanel,
		File,
		PkpForm,
		SubmissionFilesListPanel,
	},
	data() {
		// Set up the form for the details step
		let detailsForm = {...titleAbstractForm};
		detailsForm.fields = detailsForm.fields.filter(
			(field) => !['prefix', 'subtitle'].includes(field.name)
		);

		// Remove save buttons from forms
		[detailsForm, confirmForm, forTheEditorsForm].forEach((form) => {
			delete form.pages[0].submitButton;
		});

		return {
			categories: [...categories],
			components: {
				submissionFiles: {
					form: {...submissionFileForm},
					genres: [...genres],
					items: [...submissionFiles],
					options: {...dropzoneOptions},
				},
			},
			publication: {...submission.publications[0]},
			submission: {...submission},
			steps: [
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
						{
							id: 'relations',
							type: 'form',
							name: 'Preprint Status',
							description: `<p>
									Let us know if this preprint has been accepted or published elsewhere.
								</p>`,
							form: {
								...detailsForm,
								id: 'relations',
								action: '/example/submissions/1',
								fields: [...detailsForm.fields.slice(0, 1)],
							},
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
		};
	},
};
</script>

<style lang="less">
@import '../../../../styles/_import';

.component--SubmissionWizardPage .component__exampleWrapper {
	background: @bg;
	max-width: 100%; // Let the page class define the width
}
</style>
