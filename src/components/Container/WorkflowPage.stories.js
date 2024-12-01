import WorkflowPage from '@/components/Container/WorkflowPage.vue';
import formCitations from '@/components/Form/mocks/form-citations';
import formMetadata from '@/components/Form/mocks/form-metadata';
import formTitleAbstract from '@/components/Form/mocks/form-title-abstract';
import basePublication from '@/mocks/publication';
import authors from '@/mocks/authors';
import fieldAffiliation from '@/components/Form/mocks/field-text-affiliation';
import fieldAuthorsRole from '@/components/Form/mocks/field-options-authors-role';
import fieldBiography from '@/components/Form/mocks/field-rich-textarea-bio';
import fieldConfirmation from '@/components/Form/mocks/field-options-confirmation';
import fieldCountry from '@/components/Form/mocks/field-select-country';
import fieldEmail from '@/components/Form/mocks/field-text-email';
import fieldGivenName from '@/components/Form/mocks/field-text-given-name';
import fieldFamilyName from '@/components/Form/mocks/field-text-family-name';
import fieldOrcid from '@/components/Form/mocks/field-text-orcid';
import fieldUrl from '@/components/Form/mocks/field-text-url';

export default {
	title: 'Pages/WorkflowPage',
	component: WorkflowPage,
};

const WorkflowPageWithDataAndTemplate = {
	extends: WorkflowPage,
	template: `	<div class="pkpWorkflow">
		<PkpHeader :is-one-line="true" class="pkpWorkflow__header">
			<h1 class="pkpWorkflow__identification">
				<Badge
					v-if="submission.status === getConstant('STATUS_PUBLISHED')"
					class="pkpWorkflow__identificationStatus"
					:is-success="true"
				>
					Published
				</Badge>
				<Badge
					v-else-if="submission.status === getConstant('STATUS_SCHEDULED')"
					class="pkpWorkflow__identificationStatus"
					:is-primary="true"
				>
					Scheduled
				</Badge>
				<span class="pkpWorkflow__identificationId">{{ submission.id }}</span>
				<span class="pkpWorkflow__identificationDivider">/</span>
				<span
					v-if="currentPublication.authorsStringShort"
					class="pkpWorkflow__identificationAuthor"
				>
					{{ currentPublication.authorsStringShort }}
				</span>
				<span
					v-if="currentPublication.authorsStringShort"
					class="pkpWorkflow__identificationDivider"
				>
					/
				</span>
				<span class="pkpWorkflow__identificationTitle">
					{{
						localizeSubmission(
							currentPublication.fullTitle,
							currentPublication.locale,
						)
					}}
				</span>
			</h1>
			<template #actions>
				<PkpButton element="a" :href="submission.urlPublished">
					{{ t('common.view') }}
				</PkpButton>
				<PkpButton
					ref="activityButton"
					@click="alert('Opens the editorial history in a modal.')"
				>
					Activity Log
				</PkpButton>
				<PkpButton
					ref="library"
					@click="alert('Opens the submission library in a modal.')"
				>
					Library
				</PkpButton>
			</template>
		</PkpHeader>
		<tabs default-tab="workflow">
			<tab id="workflow" label="Workflow">
				<Notification type="warning">
					This component preview does not include the full workflow.
					<PkpButton @click="showTab('publication')">
						Show Publication
					</PkpButton>
				</Notification>
			</tab>
			<tab id="publication" label="Publication">
				<div ref="publication" class="pkpPublication" aria-live="polite">
					<PkpHeader class="pkpPublication__header" :is-one-line="false">
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
							<Dropdown
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
							</Dropdown>
						</span>
						<template #actions>
							<PkpButton
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
							</PkpButton>
							<PkpButton
								v-else-if="
									workingPublication.status === getConstant('STATUS_SCHEDULED')
								"
								:is-warnable="true"
								@click="
									alert('Opens a modoal to confirm scheduling for publication.')
								"
							>
								Unschedule
							</PkpButton>
							<PkpButton
								v-else-if="
									workingPublication.status === getConstant('STATUS_PUBLISHED')
								"
								:is-warnable="true"
								@click="alert('Opens a modal to confirm unpublishing.')"
							>
								Unpublish
							</PkpButton>
							<PkpButton
								v-if="canCreateNewVersion"
								ref="createVersion"
								@click="
									alert(
										'Creates a new version and loads that as the working publication.',
									)
								"
							>
								Create New Version
							</PkpButton>
						</template>
					</PkpHeader>
					<tabs
						class="pkpPublication__tabs"
						:is-side-tabs="true"
						:label="currentPublicationTabsLabel"
					>
						<tab id="titleAbstract" label="Title & Abstract">
							<PkpForm v-bind="components.titleAbstract" @set="set" />
						</tab>
						<tab id="contributors" label="Contributors">
							<ContributorsListPanel
								v-bind="components.contributors"
								class="pkpWorkflow__contributors"
								:items="workingPublication.authors"
								:publication="workingPublication"
								:publication-api-url="
									submissionApiUrl + '/publications/' + workingPublication.id
								"
								@set="set"
								@updated:publication="setWorkingPublication"
								@updated:contributors="setContributors"
							></ContributorsListPanel>
						</tab>
						<tab id="metadata" label="Metadata">
							<PkpForm v-bind="components.metadata" @set="set" />
						</tab>
						<tab v-if="supportsReferences" id="citations" label="References">
							<PkpForm v-bind="components.citations" @set="set" />
						</tab>
						<tab id="galleys" label="Galleys">
							<div id="representations-grid" ref="representations">
								<Spinner></Spinner>
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
						<Spinner></Spinner>
					</span>
				</div>
			</tab>
		</tabs>
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
	data: function () {
		const currentPublication = {
			...basePublication,
			id: 852,
			datePublished: '2019-03-23 09:12:32',
			isPublished: true,
			issueId: 1,
			lastModified: '2019-03-23 09:12:32',
			status: 3,
			version: 2,
		};
		const latestPublication = {
			...basePublication,
			id: 921,
			lastModified: '2019-06-03 18:03:32',
			status: 1,
			title: {
				en: 'Amet sit dolor ipsum lorem',
				fr_CA: 'FR Amet sit dolor ipsum lorem',
			},
			version: 3,
		};
		return {
			activityLogLabel: 'Activity Log',
			canAccessPublication: true,
			canEditPublication: true,
			components: {
				contributors: {
					canEditPublication: true,
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
					items: [...authors],
					publicationApiUrlFormat: '',
					title: 'Contributors',
					form: {
						id: 'contributor',
						method: 'POST',
						action:
							'https://httbin.org/publicknowledge/api/v1/submissions/16/publications/__publicationId__/contributors',
						fields: [
							{
								...fieldGivenName,
								groupId: 'default',
								isMultilingual: true,
								value: {en: ''},
							},
							{
								...fieldFamilyName,
								isRequired: false,
								groupId: 'default',
								isMultilingual: true,
								value: {en: ''},
							},
							{
								...fieldFamilyName,
								name: 'preferredPublicName',
								label: 'Preferred Public Name',
								isRequired: false,
								groupId: 'default',
								isMultilingual: true,
								value: {en: ''},
							},
							{
								...fieldEmail,
								groupId: 'default',
							},
							{
								...fieldCountry,
								groupId: 'default',
							},
							{
								...fieldUrl,
								groupId: 'default',
							},
							{
								...fieldOrcid,
								groupId: 'default',
							},
							{
								...fieldBiography,
								groupId: 'default',
							},
							{
								...fieldAffiliation,
								groupId: 'default',
							},
							{
								...fieldAuthorsRole,
							},
							{
								...fieldConfirmation,
								name: 'includeInBrowse',
								label: 'Publication Lists',
								groupId: 'default',
								isMultilingual: false,
								value: true,
								options: [
									{
										value: true,
										label:
											'Include this contributor when identifying authors in lists of publications.',
									},
								],
							},
						],
						groups: [{id: 'default', pageId: 'default'}],
						pages: [{id: 'default', submitButton: {label: 'Save'}}],
						primaryLocale: 'en',
						visibleLocales: ['en'],
						supportedFormLocales: [{key: 'en', label: 'English'}],
						errors: {},
					},
				},
				citations: formCitations,
				metadata: formMetadata,
				titleAbstract: formTitleAbstract,
			},
			currentPublication: currentPublication,
			editorialHistoryUrl: 'http://example.org',
			publicationFormIds: ['titleAbstract'],
			publicationList: [
				{
					id: 801,
					datePublished: '2019-01-01 12:01:23',
					status: 3,
					version: 1,
				},
				{
					id: currentPublication.id,
					datePublished: currentPublication.datePublished,
					status: currentPublication.status,
					version: currentPublication.version,
				},
				{
					id: latestPublication.id,
					datePublished: latestPublication.datePublished,
					status: latestPublication.status,
					version: latestPublication.version,
				},
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
				submissionProgress: '',
				urlAuthorWorkflow: '/authorDashboard/submission/1',
				urlEditorialWorkflow: '/workflow/access/1',
				urlWorkflow: '/workflow/access/1',
				urlPublished: '/articles/view/1',
			},
			submissionApiUrl: 'http://example.org',
			submissionFileApiUrl: 'http://example.org',
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
			workingPublication: latestPublication,
		};
	},
	created() {
		pkp.localeKeys['contributor.listPanel.preview.description'] =
			'Contributors to this publication will be identified in this journal in the following formats.';
		pkp.localeKeys['contributor.listPanel.preview.format'] = 'Format';
		pkp.localeKeys['contributor.listPanel.preview.display'] = 'Display';
		pkp.localeKeys['contributor.listPanel.preview.abbreviated'] = 'Abbreviated';
		pkp.localeKeys['contributor.listPanel.preview.publicationLists'] =
			'Publication Lists';
		pkp.localeKeys['contributor.listPanel.preview.full'] = 'Full';
	},
	methods: {
		alert(msg) {
			alert(msg);
		},
		showTab(tab) {
			pkp.eventBus.$emit('open-tab', tab);
		},
	},
};

export const Default = {
	render: (args) => ({
		components: {
			WorkflowPageWithDataAndTemplate,
		},
		setup() {
			return {...args};
		},
		template: `
			<WorkflowPageWithDataAndTemplate />
		`,
	}),

	args: {},
};
