import {ref} from 'vue';

import Composer from './Composer.vue';
import fileAttachers from '@/mocks/fileAttachers';
import insertContent from '@/mocks/insertContent';
import emailTemplate from '@/mocks/emailTemplate';

export default {
	title: 'Components/Composer',
	component: Composer,
	parameters: {
		// Sets delay to wait until the loading indicator is gone
		chromatic: {delay: 300},
	},
};

export const Default = {
	render: (args) => ({
		components: {Composer},
		setup() {
			const emailTemplates = [emailTemplate];
			emailTemplates.push({
				...emailTemplate,
				key: 'ACCEPTED_CONDITIONAL',
				name: {
					en: 'Accepted With Conditions',
				},
				subject: {
					en: 'Accepted With Conditions',
				},
			});
			emailTemplates.push({
				...emailTemplate,
				key: 'ACCEPTED_EARLY_PUBLICATION',
				name: {
					en: 'Accepted for Early Publication',
				},
				subject: {
					en: 'Accepted for Early Publication',
				},
			});
			const recipientOptions = [
				{
					value: 2,
					label: {
						en: 'Carlo Corino',
						fr_CA: 'Carlo Fr Corino',
					},
				},
				{
					value: 3,
					label: {
						en: 'Daniel Barnes',
						fr_CA: 'Daniel Fr Barnes',
					},
				},
				{
					value: 4,
					label: {
						en: 'Stephanie Minoue',
						fr_CA: 'Stephanie Fr Minoue',
					},
				},
				{
					value: 5,
					label: {
						en: 'Paul Hudson',
						fr_CA: 'Paul Fr Hudson',
					},
				},
			];

			const composerState = ref({
				attachers: [...fileAttachers],
				attachments: [],
				bcc: '',
				body: '',
				cc: '',
				initialTemplateKey: 'EDITOR_DECISION_ACCEPT',
				emailTemplates: emailTemplates,
				emailTemplatesApiUrl:
					'https://httbin.org/publicknowledge/api/v1/emailTemplates',
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
				subject: '',
				to: [2, 3],
				recipientOptions: recipientOptions,
				recipients: recipientOptions.map((r) => r.value),
				variables: {
					en: [...insertContent],
					fr_CA: [...insertContent],
				},
			});

			function composerChanged(id, data) {
				Object.keys(data).forEach((key) => {
					composerState.value[key] = data[key];
				});
			}
			return {args, composerState, composerChanged};
		},
		template: `

			<Composer
				v-bind="args"
				:attachers="composerState.attachers"
				:attachments="composerState.attachments"
				:bcc="composerState.bcc"
				:body="composerState.body"
				:can-change-recipients="false"
				:cc="composerState.cc"
				:email-templates="composerState.emailTemplates"
				:email-templates-api-url="composerState.emailTemplatesApiUrl"
				:initial-template-key="composerState.initialTemplateKey"
				:locale="composerState.locale"
				:locales="composerState.locales"
				:subject="composerState.subject"
				:to="composerState.to"
				:recipient-options="composerState.recipientOptions"
				:recipients="composerState.recipientOptions.map((r) => r.value)"
				:variables="composerState.variables"
				@set="composerChanged"
			>
				<template #description>
					<h2>Notify Authors</h2>
					<p>
						Send an email to the authors to let them know that their submission
						has been accepted for publication.
					</p>
				</template>
			</Composer>
		`,
	}),

	args: {
		addCCLabel: 'Add CC/BCC',
		attachedFilesLabel: 'Attached Files:',
		attachFilesLabel: 'Attach Files',
		bccLabel: 'BCC:',
		bodyLabel: 'Message',
		canChangeRecipients: false,
		ccLabel: 'CC:',
		confirmSwitchLocaleLabel:
			'Are you sure you want to change to {$localeName} to compose this email? Any changes you have made to the subject and body of the email will be lost.',
		deselectLabel: 'Deselect',
		findTemplateLabel: 'Find Template',
		insertLabel: 'Insert',
		insertModalLabel: 'Insert Content',
		insertContentLabel: 'Content',
		insertSearchLabel: 'Find content to insert',
		loadTemplateLabel: 'Email Templates',
		moreSearchResultsLabel: '{$number} more',
		removeItemLabel: 'Remove {$item}',
		searchingLabel: 'Searching',
		searchResultsLabel: 'Search Results',
		subjectLabel: 'Subject:',
		switchToLabel: 'Switch To:',
		switchToNamedLanguageLabel: 'Switch to {$name}',
		recipientsLabel: 'To:',
	},
};
