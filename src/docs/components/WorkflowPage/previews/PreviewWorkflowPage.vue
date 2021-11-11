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
								:items-max="workingPublication.authors.length"
								:publication="workingPublication"
								@edited="contributorEdited"
								@added="contributorAdded"
								@deleted="contributorDeleted"
								@primary-contact-changed="primaryContactChanged"
								@contributors-order-changed="contributorsOrderChanged"
								@preview-publication-authors="previewPublicationAuthors"
								@reset-contributors="resetContributors"
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
					description: '',
					expanded: [],
					headingLevel: 'h2',
					id: 'contributors',
					isSidebarVisible: false,
					items: [
						{
							affiliation: {en_US: ''},
							biography: {en_US: ''},
							country: 'AU',
							email: 'defstat2@gmail.com',
							familyName: {en_US: 'Ευσταθιου'},
							fullName: 'Δημητριος Ευσταθιου',
							givenName: {en_US: 'Δημητριος'},
							id: 23,
							includeInBrowse: true,
							orcid: '',
							preferredPublicName: {en_US: 'Δημητριος Ευσταθιου'},
							publicationId: 16,
							seq: 0,
							submissionLocale: null,
							url: '',
							userGroupId: 14,
							userGroupLabel: 'Author'
						},
						{
							affiliation: {en_US: ''},
							biography: {en_US: ''},
							country: 'GR',
							email: 'defstat@gmail.com',
							familyName: {en_US: 'Efstathiou'},
							fullName: 'Dimitrios Efstathiou',
							givenName: {en_US: 'Dimitrios'},
							id: 22,
							includeInBrowse: true,
							orcid: '',
							preferredPublicName: {en_US: 'Dimitrios Efstathiou'},
							publicationId: 16,
							seq: 1,
							submissionLocale: null,
							url: '',
							userGroupId: 14,
							userGroupLabel: 'Author'
						},
						{
							affiliation: {en_US: ''},
							biography: {en_US: ''},
							country: '',
							email: 'defstat@gmail.com',
							familyName: {en_US: 'admin'},
							fullName: 'admin admin',
							givenName: {en_US: 'admin'},
							id: 21,
							includeInBrowse: true,
							orcid: '',
							preferredPublicName: {en_US: ''},
							publicationId: 16,
							seq: 2,
							submissionLocale: null,
							url: '',
							userGroupId: 2
						}
					],
					title: 'Contributors',
					getParams: {contextIds: 1, count: 30},
					addContributorLabel: 'Add Contributor',
					apiUrl:
						'http://localhost:8088/index.php/ts/api/v1/submissions/16/publications/__publicationId__/contributors',
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
								name: 'email',
								component: 'field-text',
								label: 'Email',
								groupId: 'default',
								isRequired: true,
								isMultilingual: false,
								inputType: 'text',
								optIntoEdit: false,
								optIntoEditLabel: '',
								size: 'normal',
								prefix: '',
								value: ''
							},
							{
								name: 'country',
								component: 'field-select',
								label: 'Country',
								description:
									'Select the country where this journal is located, or the country of the mailing address for the journal or publisher.',
								groupId: 'default',
								isRequired: true,
								isMultilingual: false,
								options: [
									{value: 'AF', label: 'Afghanistan'},
									{value: 'AL', label: 'Albania'},
									{value: 'DZ', label: 'Algeria'},
									{value: 'AS', label: 'American Samoa'},
									{value: 'AD', label: 'Andorra'},
									{value: 'AO', label: 'Angola'},
									{value: 'AI', label: 'Anguilla'},
									{value: 'AQ', label: 'Antarctica'},
									{value: 'AG', label: 'Antigua and Barbuda'},
									{value: 'AR', label: 'Argentina'},
									{value: 'AM', label: 'Armenia'},
									{value: 'AW', label: 'Aruba'},
									{value: 'AU', label: 'Australia'},
									{value: 'AT', label: 'Austria'},
									{value: 'AZ', label: 'Azerbaijan'},
									{value: 'BS', label: 'Bahamas'},
									{value: 'BH', label: 'Bahrain'},
									{value: 'BD', label: 'Bangladesh'},
									{value: 'BB', label: 'Barbados'},
									{value: 'BY', label: 'Belarus'},
									{value: 'BE', label: 'Belgium'},
									{value: 'BZ', label: 'Belize'},
									{value: 'BJ', label: 'Benin'},
									{value: 'BM', label: 'Bermuda'},
									{value: 'BT', label: 'Bhutan'},
									{value: 'BO', label: 'Bolivia, Plurinational State of'},
									{value: 'BQ', label: 'Bonaire, Sint Eustatius and Saba'},
									{value: 'BA', label: 'Bosnia and Herzegovina'},
									{value: 'BW', label: 'Botswana'},
									{value: 'BV', label: 'Bouvet Island'},
									{value: 'BR', label: 'Brazil'},
									{value: 'IO', label: 'British Indian Ocean Territory'},
									{value: 'BN', label: 'Brunei Darussalam'},
									{value: 'BG', label: 'Bulgaria'},
									{value: 'BF', label: 'Burkina Faso'},
									{value: 'BI', label: 'Burundi'},
									{value: 'CV', label: 'Cabo Verde'},
									{value: 'KH', label: 'Cambodia'},
									{value: 'CM', label: 'Cameroon'},
									{value: 'CA', label: 'Canada'},
									{value: 'KY', label: 'Cayman Islands'},
									{value: 'CF', label: 'Central African Republic'},
									{value: 'TD', label: 'Chad'},
									{value: 'CL', label: 'Chile'},
									{value: 'CN', label: 'China'},
									{value: 'CX', label: 'Christmas Island'},
									{value: 'CC', label: 'Cocos (Keeling) Islands'},
									{value: 'CO', label: 'Colombia'},
									{value: 'KM', label: 'Comoros'},
									{value: 'CG', label: 'Congo'},
									{value: 'CD', label: 'Congo, The Democratic Republic of the'},
									{value: 'CK', label: 'Cook Islands'},
									{value: 'CR', label: 'Costa Rica'},
									{value: 'HR', label: 'Croatia'},
									{value: 'CU', label: 'Cuba'},
									{value: 'CW', label: 'Curaçao'},
									{value: 'CY', label: 'Cyprus'},
									{value: 'CZ', label: 'Czechia'},
									{value: 'CI', label: "Côte d'Ivoire"},
									{value: 'DK', label: 'Denmark'},
									{value: 'DJ', label: 'Djibouti'},
									{value: 'DM', label: 'Dominica'},
									{value: 'DO', label: 'Dominican Republic'},
									{value: 'EC', label: 'Ecuador'},
									{value: 'EG', label: 'Egypt'},
									{value: 'SV', label: 'El Salvador'},
									{value: 'GQ', label: 'Equatorial Guinea'},
									{value: 'ER', label: 'Eritrea'},
									{value: 'EE', label: 'Estonia'},
									{value: 'SZ', label: 'Eswatini'},
									{value: 'ET', label: 'Ethiopia'},
									{value: 'FK', label: 'Falkland Islands (Malvinas)'},
									{value: 'FO', label: 'Faroe Islands'},
									{value: 'FJ', label: 'Fiji'},
									{value: 'FI', label: 'Finland'},
									{value: 'FR', label: 'France'},
									{value: 'GF', label: 'French Guiana'},
									{value: 'PF', label: 'French Polynesia'},
									{value: 'TF', label: 'French Southern Territories'},
									{value: 'GA', label: 'Gabon'},
									{value: 'GM', label: 'Gambia'},
									{value: 'GE', label: 'Georgia'},
									{value: 'DE', label: 'Germany'},
									{value: 'GH', label: 'Ghana'},
									{value: 'GI', label: 'Gibraltar'},
									{value: 'GR', label: 'Greece'},
									{value: 'GL', label: 'Greenland'},
									{value: 'GD', label: 'Grenada'},
									{value: 'GP', label: 'Guadeloupe'},
									{value: 'GU', label: 'Guam'},
									{value: 'GT', label: 'Guatemala'},
									{value: 'GG', label: 'Guernsey'},
									{value: 'GN', label: 'Guinea'},
									{value: 'GW', label: 'Guinea-Bissau'},
									{value: 'GY', label: 'Guyana'},
									{value: 'HT', label: 'Haiti'},
									{value: 'HM', label: 'Heard Island and McDonald Islands'},
									{value: 'VA', label: 'Holy See (Vatican City State)'},
									{value: 'HN', label: 'Honduras'},
									{value: 'HK', label: 'Hong Kong'},
									{value: 'HU', label: 'Hungary'},
									{value: 'IS', label: 'Iceland'},
									{value: 'IN', label: 'India'},
									{value: 'ID', label: 'Indonesia'},
									{value: 'IR', label: 'Iran, Islamic Republic of'},
									{value: 'IQ', label: 'Iraq'},
									{value: 'IE', label: 'Ireland'},
									{value: 'IM', label: 'Isle of Man'},
									{value: 'IL', label: 'Israel'},
									{value: 'IT', label: 'Italy'},
									{value: 'JM', label: 'Jamaica'},
									{value: 'JP', label: 'Japan'},
									{value: 'JE', label: 'Jersey'},
									{value: 'JO', label: 'Jordan'},
									{value: 'KZ', label: 'Kazakhstan'},
									{value: 'KE', label: 'Kenya'},
									{value: 'KI', label: 'Kiribati'},
									{
										value: 'KP',
										label: "Korea, Democratic People's Republic of"
									},
									{value: 'KR', label: 'Korea, Republic of'},
									{value: 'KW', label: 'Kuwait'},
									{value: 'KG', label: 'Kyrgyzstan'},
									{value: 'LA', label: "Lao People's Democratic Republic"},
									{value: 'LV', label: 'Latvia'},
									{value: 'LB', label: 'Lebanon'},
									{value: 'LS', label: 'Lesotho'},
									{value: 'LR', label: 'Liberia'},
									{value: 'LY', label: 'Libya'},
									{value: 'LI', label: 'Liechtenstein'},
									{value: 'LT', label: 'Lithuania'},
									{value: 'LU', label: 'Luxembourg'},
									{value: 'MO', label: 'Macao'},
									{value: 'MG', label: 'Madagascar'},
									{value: 'MW', label: 'Malawi'},
									{value: 'MY', label: 'Malaysia'},
									{value: 'MV', label: 'Maldives'},
									{value: 'ML', label: 'Mali'},
									{value: 'MT', label: 'Malta'},
									{value: 'MH', label: 'Marshall Islands'},
									{value: 'MQ', label: 'Martinique'},
									{value: 'MR', label: 'Mauritania'},
									{value: 'MU', label: 'Mauritius'},
									{value: 'YT', label: 'Mayotte'},
									{value: 'MX', label: 'Mexico'},
									{value: 'FM', label: 'Micronesia, Federated States of'},
									{value: 'MD', label: 'Moldova, Republic of'},
									{value: 'MC', label: 'Monaco'},
									{value: 'MN', label: 'Mongolia'},
									{value: 'ME', label: 'Montenegro'},
									{value: 'MS', label: 'Montserrat'},
									{value: 'MA', label: 'Morocco'},
									{value: 'MZ', label: 'Mozambique'},
									{value: 'MM', label: 'Myanmar'},
									{value: 'NA', label: 'Namibia'},
									{value: 'NR', label: 'Nauru'},
									{value: 'NP', label: 'Nepal'},
									{value: 'NL', label: 'Netherlands'},
									{value: 'NC', label: 'New Caledonia'},
									{value: 'NZ', label: 'New Zealand'},
									{value: 'NI', label: 'Nicaragua'},
									{value: 'NE', label: 'Niger'},
									{value: 'NG', label: 'Nigeria'},
									{value: 'NU', label: 'Niue'},
									{value: 'NF', label: 'Norfolk Island'},
									{value: 'MK', label: 'North Macedonia'},
									{value: 'MP', label: 'Northern Mariana Islands'},
									{value: 'NO', label: 'Norway'},
									{value: 'OM', label: 'Oman'},
									{value: 'PK', label: 'Pakistan'},
									{value: 'PW', label: 'Palau'},
									{value: 'PS', label: 'Palestine, State of'},
									{value: 'PA', label: 'Panama'},
									{value: 'PG', label: 'Papua New Guinea'},
									{value: 'PY', label: 'Paraguay'},
									{value: 'PE', label: 'Peru'},
									{value: 'PH', label: 'Philippines'},
									{value: 'PN', label: 'Pitcairn'},
									{value: 'PL', label: 'Poland'},
									{value: 'PT', label: 'Portugal'},
									{value: 'PR', label: 'Puerto Rico'},
									{value: 'QA', label: 'Qatar'},
									{value: 'RO', label: 'Romania'},
									{value: 'RU', label: 'Russian Federation'},
									{value: 'RW', label: 'Rwanda'},
									{value: 'RE', label: 'Réunion'},
									{value: 'BL', label: 'Saint Barthélemy'},
									{
										value: 'SH',
										label: 'Saint Helena, Ascension and Tristan da Cunha'
									},
									{value: 'KN', label: 'Saint Kitts and Nevis'},
									{value: 'LC', label: 'Saint Lucia'},
									{value: 'MF', label: 'Saint Martin (French part)'},
									{value: 'PM', label: 'Saint Pierre and Miquelon'},
									{value: 'VC', label: 'Saint Vincent and the Grenadines'},
									{value: 'WS', label: 'Samoa'},
									{value: 'SM', label: 'San Marino'},
									{value: 'ST', label: 'Sao Tome and Principe'},
									{value: 'SA', label: 'Saudi Arabia'},
									{value: 'SN', label: 'Senegal'},
									{value: 'RS', label: 'Serbia'},
									{value: 'SC', label: 'Seychelles'},
									{value: 'SL', label: 'Sierra Leone'},
									{value: 'SG', label: 'Singapore'},
									{value: 'SX', label: 'Sint Maarten (Dutch part)'},
									{value: 'SK', label: 'Slovakia'},
									{value: 'SI', label: 'Slovenia'},
									{value: 'SB', label: 'Solomon Islands'},
									{value: 'SO', label: 'Somalia'},
									{value: 'ZA', label: 'South Africa'},
									{
										value: 'GS',
										label: 'South Georgia and the South Sandwich Islands'
									},
									{value: 'SS', label: 'South Sudan'},
									{value: 'ES', label: 'Spain'},
									{value: 'LK', label: 'Sri Lanka'},
									{value: 'SD', label: 'Sudan'},
									{value: 'SR', label: 'Suriname'},
									{value: 'SJ', label: 'Svalbard and Jan Mayen'},
									{value: 'SE', label: 'Sweden'},
									{value: 'CH', label: 'Switzerland'},
									{value: 'SY', label: 'Syrian Arab Republic'},
									{value: 'TW', label: 'Taiwan, Province of China'},
									{value: 'TJ', label: 'Tajikistan'},
									{value: 'TZ', label: 'Tanzania, United Republic of'},
									{value: 'TH', label: 'Thailand'},
									{value: 'TL', label: 'Timor-Leste'},
									{value: 'TG', label: 'Togo'},
									{value: 'TK', label: 'Tokelau'},
									{value: 'TO', label: 'Tonga'},
									{value: 'TT', label: 'Trinidad and Tobago'},
									{value: 'TN', label: 'Tunisia'},
									{value: 'TR', label: 'Turkey'},
									{value: 'TM', label: 'Turkmenistan'},
									{value: 'TC', label: 'Turks and Caicos Islands'},
									{value: 'TV', label: 'Tuvalu'},
									{value: 'UG', label: 'Uganda'},
									{value: 'UA', label: 'Ukraine'},
									{value: 'AE', label: 'United Arab Emirates'},
									{value: 'GB', label: 'United Kingdom'},
									{value: 'US', label: 'United States'},
									{value: 'UM', label: 'United States Minor Outlying Islands'},
									{value: 'UY', label: 'Uruguay'},
									{value: 'UZ', label: 'Uzbekistan'},
									{value: 'VU', label: 'Vanuatu'},
									{value: 'VE', label: 'Venezuela, Bolivarian Republic of'},
									{value: 'VN', label: 'Viet Nam'},
									{value: 'VG', label: 'Virgin Islands, British'},
									{value: 'VI', label: 'Virgin Islands, U.S.'},
									{value: 'WF', label: 'Wallis and Futuna'},
									{value: 'EH', label: 'Western Sahara'},
									{value: 'YE', label: 'Yemen'},
									{value: 'ZM', label: 'Zambia'},
									{value: 'ZW', label: 'Zimbabwe'},
									{value: 'AX', label: 'Åland Islands'}
								],
								value: ''
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
								name: 'orcid',
								component: 'field-text',
								label: 'ORCID iD',
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
								name: 'affiliation',
								component: 'field-text',
								label: 'Affiliation',
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
