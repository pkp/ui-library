<template>
	<div class="pkpWorkflow" v-cloak>
		<pkp-header :is-one-line="true" class="pkpWorkflow__header">
			<h1 class="pkpWorkflow__identification">
				<badge
					v-if="submission.status === getConstant('STATUS_PUBLISHED')"
					class="pkpWorkflow__identificationStatus"
					:is-success="true"
				>
					Published
				</badge>
				<badge
					v-else-if="submission.status === getConstant('STATUS_SCHEDULED')"
					class="pkpWorkflow__identificationStatus"
					:is-primary="true"
				>
					Scheduled
				</badge>
				<span class="pkpWorkflow__identificationId">{{ submission.id }}</span>
				<span class="pkpWorkflow__identificationDivider">/</span>
				<span class="pkpWorkflow__identificationAuthor">
					{{ currentPublication.authorsStringShort }}
				</span>
				<span class="pkpWorkflow__identificationDivider">/</span>
				<span class="pkpWorkflow__identificationTitle">
					{{
						localizeSubmission(
							currentPublication.fullTitle,
							currentPublication.locale
						)
					}}
				</span>
			</h1>
			<template slot="actions">
				<pkp-button element="a" :href="submission.urlPublished">
					{{ __('common.view') }}
				</pkp-button>
				<pkp-button
					ref="activityButton"
					@click="alert('Opens the editorial history in a modal.')"
				>
					Activity Log
				</pkp-button>
				<pkp-button
					ref="library"
					@click="alert('Opens the submission library in a modal.')"
				>
					Library
				</pkp-button>
			</template>
		</pkp-header>
		<tabs default-tab="workflow">
			<tab id="workflow" label="Workflow">
				... Workflow ...
			</tab>
			<tab id="publication" label="Publication">
				<div class="pkpPublication" ref="publication" aria-live="polite">
					<pkp-header class="pkpPublication__header" :is-one-line="false">
						<span class="pkpPublication__status">
							<strong>{{ statusLabel }}</strong>
							<span
								v-if="
									workingPublication.status === getConstant('STATUS_QUEUED') &&
										workingPublication.id === currentPublication.id
								"
								class="pkpPublication__statusUnpublished"
							>
								Unscheduled
							</span>
							<span
								v-else-if="
									workingPublication.status === getConstant('STATUS_SCHEDULED')
								"
							>
								Scheduled
							</span>
							<span
								v-else-if="
									workingPublication.status === getConstant('STATUS_PUBLISHED')
								"
								class="pkpPublication__statusPublished"
							>
								Published
							</span>
							<span v-else class="pkpPublication__statusUnpublished">
								Unpublished
							</span>
						</span>
						<span
							v-if="publicationList.length > 1"
							class="pkpPublication__version"
						>
							<strong tabindex="0">{{ versionLabel }}</strong>
							{{ workingPublication.version }}
							<dropdown
								class="pkpPublication__versions"
								label="All Versions"
								:is-link="true"
								submenu-label="Submenu"
							>
								<ul>
									<li
										v-for="publication in publicationList"
										:key="publication.id"
									>
										<button
											class="pkpDropdown__action"
											:disabled="publication.id === workingPublication.id"
											@click="setWorkingPublicationById(publication.id)"
										>
											{{ publication.version }} /
											<template
												v-if="
													publication.status === getConstant('STATUS_QUEUED') &&
														publication.id === currentPublication.id
												"
											>
												Unscheduled
											</template>
											<template
												v-else-if="
													publication.status === getConstant('STATUS_SCHEDULED')
												"
											>
												Scheduled
											</template>
											<template
												v-else-if="
													publication.status === getConstant('STATUS_PUBLISHED')
												"
											>
												{{ publication.datePublished }}
											</template>
											<template v-else>Unpublished</template>
										</button>
									</li>
								</ul>
							</dropdown>
						</span>
						<template slot="actions">
							<pkp-button
								v-if="
									workingPublication.status === getConstant('STATUS_QUEUED')
								"
								ref="publish"
								@click="alert('Opens a modal to confirm publishing.')"
							>
								{{
									submission.status === getConstant('STATUS_PUBLISHED')
										? publishLabel
										: schedulePublicationLabel
								}}
							</pkp-button>
							<pkp-button
								v-else-if="
									workingPublication.status === getConstant('STATUS_SCHEDULED')
								"
								:is-warnable="true"
								@click="
									alert('Opens a modoal to confirm scheduling for publication.')
								"
							>
								Unschedule
							</pkp-button>
							<pkp-button
								v-else-if="
									workingPublication.status === getConstant('STATUS_PUBLISHED')
								"
								:is-warnable="true"
								@click="alert('Opens a modal to confirm unpublishing.')"
							>
								Unpublish
							</pkp-button>
							<pkp-button
								v-if="canCreateNewVersion"
								ref="createVersion"
								@click="
									alert(
										'Creates a new version and loads that as the working publication.'
									)
								"
							>
								Create New Version
							</pkp-button>
						</template>
					</pkp-header>
					<div
						v-if="workingPublication.status === getConstant('STATUS_PUBLISHED')"
						class="pkpPublication__versionPublished"
					>
						This version has been published and can not be edited.
					</div>
					<tabs
						class="pkpPublication__tabs"
						:is-side-tabs="true"
						:label="currentPublicationTabsLabel"
					>
						<tab id="titleAbstract" label="Title & Abstract">
							<pkp-form v-bind="components.titleAbstract" @set="set" />
						</tab>
						<tab id="contributors" label="Contributors">
							<contributors-list-panel
								v-bind="components.contributors"
								class="pkpWorkflow__contributors"
								@set="set"
								:items="workingPublication.authors"
								:publication="workingPublication"
								:publication-api-url="
									submissionApiUrl + '/publications/' + workingPublication.id
								"
								@updated:publication="setWorkingPublication"
								@updated:contributors="setContributors"
							></contributors-list-panel>
						</tab>
						<tab id="metadata" label="Metadata">
							<pkp-form v-bind="components.metadata" @set="set" />
						</tab>
						<tab v-if="supportsReferences" id="citations" label="Citations">
							<pkp-form v-bind="components.citations" @set="set" />
						</tab>
						<tab id="identifiers" label="Identifiers">
							... DOIs ...
						</tab>
						<tab id="galleys" label="Galleys">
							<div id="representations-grid" ref="representations">
								<spinner></spinner>
							</div>
						</tab>
						<tab id="license" label="Permissions & Disclosure">
							... copyright and license ...
						</tab>
						<tab id="issue" label="Issue">
							... issue form for cover image, section, etc...
						</tab>
					</tabs>
					<span class="pkpPublication__mask" :class="publicationMaskClasses">
						<spinner></spinner>
					</span>
				</div>
			</tab>
		</tabs>
	</div>
</template>

<script>
import WorkflowPage from '@/components/Container/WorkflowPage.vue';
import formCitations from '@/docs/components/Form/helpers/form-citations';
import formMetadata from '@/docs/components/Form/helpers/form-metadata';
import formTitleAbstract from '@/docs/components/Form/helpers/form-title-abstract';
import basePublication from '@/docs/data/publication';
import authors from '@/docs/data/authors';
import fieldCountry from '../../../helpers/field-select-country';
import fieldEmail from '../../../helpers/field-text-email';
import fieldOrcid from '../../../helpers/field-text-orcid';
import fieldAffiliation from '../../../helpers/field-text-affiliation';

export default {
	extends: WorkflowPage,
	data: function() {
		const currentPublication = {
			...basePublication,
			id: 852,
			datePublished: '2019-03-23 09:12:32',
			isPublished: true,
			issueId: 1,
			lastModified: '2019-03-23 09:12:32',
			status: 3,
			version: 2
		};
		const latestPublication = {
			...basePublication,
			id: 921,
			lastModified: '2019-06-03 18:03:32',
			status: 1,
			title: {
				en_US: 'Amet sit dolor ipsum lorem',
				fr_CA: 'FR Amet sit dolor ipsum lorem'
			},
			version: 3
		};
		return {
			activityLogLabel: 'Activity Log',
			canAccessPublication: true,
			canEditPublication: true,
			components: {
				contributors: {
					id: 'contributors',
					items: [...authors],
					title: 'Contributors',
					addContributorLabel: 'Add Contributor',
					publicationApiUrl:
						'http://localhost:8088/index.php/ts/api/v1/submissions/16/publications',
					confirmDeleteMessage:
						'Are you sure you want to remove {$name} as a contributor? This action can not be undone.',
					count: 30,
					deleteContributorLabel: 'Delete',
					editContributorLabel: 'Edit',
					canEditPublication: true,
					form: {
						id: 'contributor',
						method: 'POST',
						action:
							'http://localhost:8088/index.php/ts/api/v1/submissions/16/publications/__publicationId__/contributors',
						fields: [
							{
								name: 'givenName',
								component: 'field-text',
								label: 'Given Name',
								groupId: 'default',
								isRequired: true,
								isMultilingual: true,
								inputType: 'text',
								optIntoEdit: false,
								optIntoEditLabel: '',
								size: 'normal',
								prefix: '',
								value: {en_US: ''}
							},
							{
								name: 'familyName',
								component: 'field-text',
								label: 'Family Name',
								groupId: 'default',
								isRequired: false,
								isMultilingual: true,
								inputType: 'text',
								optIntoEdit: false,
								optIntoEditLabel: '',
								size: 'normal',
								prefix: '',
								value: {en_US: ''}
							},
							{
								name: 'preferredPublicName',
								component: 'field-text',
								label: 'Preferred Public Name',
								groupId: 'default',
								isRequired: false,
								isMultilingual: true,
								inputType: 'text',
								optIntoEdit: false,
								optIntoEditLabel: '',
								size: 'normal',
								prefix: '',
								value: {en_US: ''}
							},
							{
								...fieldEmail,
								isMultilingual: false,
								optIntoEdit: false,
								optIntoEditLabel: '',
								size: 'normal',
								prefix: ''
							},
							{
								...fieldCountry,
								description:
									'Select the country where this journal is located, or the country of the mailing address for the journal or publisher.',
								isMultilingual: false
							},
							{
								name: 'url',
								component: 'field-text',
								label: 'Homepage URL',
								groupId: 'default',
								isRequired: false,
								isMultilingual: false,
								inputType: 'text',
								optIntoEdit: false,
								optIntoEditLabel: '',
								size: 'normal',
								prefix: '',
								value: ''
							},
							{
								...fieldOrcid,
								label: 'ORCID',
								isRequired: false,
								isMultilingual: false,
								optIntoEdit: false,
								optIntoEditLabel: '',
								size: 'normal',
								prefix: ''
							},
							{
								name: 'biography',
								component: 'field-rich-textarea',
								label: 'Bio Statement (e.g., department and rank)',
								groupId: 'default',
								isRequired: false,
								isMultilingual: true,
								plugins: 'paste,link,noneditable',
								insertPreparedContentLabel: 'Insert',
								renderPreparedContent: false,
								toolbar: 'bold italic superscript subscript | link',
								skinUrl:
									'http://localhost:8088/lib/ui-library/public/styles/tinymce',
								value: {en_US: ''}
							},
							{
								...fieldAffiliation,
								isRequired: false,
								optIntoEdit: false,
								optIntoEditLabel: '',
								size: 'normal',
								prefix: ''
							},
							{
								name: 'userGroupId',
								component: 'field-options',
								label: "Contributor's role",
								groupId: 'default',
								isRequired: false,
								isMultilingual: false,
								value: 14,
								type: 'radio',
								isOrderable: false,
								options: [
									{value: 14, label: 'Author'},
									{value: 15, label: 'Translator'}
								]
							},
							{
								name: 'includeInBrowse',
								component: 'field-options',
								label: 'Publication Lists',
								groupId: 'default',
								isRequired: false,
								isMultilingual: false,
								value: true,
								type: 'checkbox',
								isOrderable: false,
								options: [
									{
										value: true,
										label:
											'Include this contributor when identifying authors in lists of publications.'
									}
								]
							}
						],
						groups: [{id: 'default', pageId: 'default'}],
						pages: [{id: 'default', submitButton: {label: 'Save'}}],
						primaryLocale: 'en_US',
						visibleLocales: ['en_US'],
						supportedFormLocales: [{key: 'en_US', label: 'English'}],
						errors: {}
					}
				},
				citations: formCitations,
				metadata: formMetadata,
				titleAbstract: formTitleAbstract
			},
			currentPublication: currentPublication,
			editorialHistoryUrl: 'http://example.org',
			publicationFormIds: ['titleAbstract'],
			publicationList: [
				{
					id: 801,
					datePublished: '2019-01-01 12:01:23',
					status: 3,
					version: 1
				},
				{
					id: currentPublication.id,
					datePublished: currentPublication.datePublished,
					status: currentPublication.status,
					version: currentPublication.version
				},
				{
					id: latestPublication.id,
					datePublished: latestPublication.datePublished,
					status: latestPublication.status,
					version: latestPublication.version
				}
			],
			publicationTabsLabel: 'Publication details for version {$version}',
			publishLabel: 'Publish',
			publishUrl: 'http://example.org',
			representationsGridUrl: 'http://example.org',
			schedulePublicationLabel: 'Schedule for Publication',
			statusLabel: 'Status: ',
			submission: {
				contextId: 1,
				currentPublicationId: 852,
				dateLastActivity: '2018-11-03 12:34:53',
				dateSubmitted: '2018-08-03',
				id: 732,
				lastModified: '2019-06-03 18:03:32',
				stageId: 5,
				status: 1,
				submissionProgress: 0,
				urlAuthorWorkflow: '/authorDashboard/submission/1',
				urlEditorialWorkflow: '/workflow/access/1',
				urlWorkflow: '/workflow/access/1',
				urlPublished: '/articles/view/1'
			},
			submissionApiUrl: 'http://example.org',
			submissionLibraryLabel: 'Library',
			submissionLibraryUrl: 'http://example.org',
			supportsReferences: true,
			unpublishConfirmLabel:
				"Are you sure you don't want this to be published?",
			unpublishLabel: 'Unpublish',
			unscheduleConfirmLabel:
				"Are you sure you don't want this scheduled for publication?",
			versionLabel: 'Version: ',
			versionConfirmTitle: 'Create New Version',
			versionConfirmMessage: 'Are you sure you want to create a new version?',
			workingPublication: latestPublication
		};
	},
	methods: {
		alert(msg) {
			alert(msg);
		}
	}
};
</script>

<style lang="less">
@import '../../../../styles/_import';

.component--WorkflowPage .component__exampleWrapper {
	background: @bg;
}
</style>
