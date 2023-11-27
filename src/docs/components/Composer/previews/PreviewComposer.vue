<template>
	<div class="previewComposer">
		<composer
			add-c-c-label="Add CC/BCC"
			attached-files-label="Attached Files:"
			:attachers="attachers"
			attach-files-label="Attach Files"
			:attachments="attachments"
			:bcc="bcc"
			bcc-label="BCC:"
			:body="body"
			body-label="Message"
			:can-change-recipients="false"
			:cc="cc"
			cc-label="CC:"
			confirm-switch-locale-label="Are you sure you want to change to {$localeName} to compose this email? Any changes you have made to the subject and body of the email will be lost."
			deselect-label="Deselect"
			:email-templates="emailTemplates"
			:email-templates-api-url="emailTemplatesApiUrl"
			find-template-label="Find Template"
			:initial-template-key="initialTemplateKey"
			insert-label="Insert"
			insert-modal-label="Insert Content"
			insert-content-label="Content"
			insert-search-label="Find content to insert"
			load-template-label="Email Templates"
			:locale="locale"
			:locales="locales"
			more-search-results-label="{$number} more"
			remove-item-label="Remove {$item}"
			searching-label="Searching"
			search-results-label="Search Results"
			:subject="subject"
			subject-label="Subject:"
			switch-to-label="Switch To:"
			switch-to-named-language-label="Switch to {$name}"
			:to="to"
			recipients-label="To:"
			:recipient-options="recipientOptions"
			:recipients="recipientOptions.map((r) => r.value)"
			:variables="variables"
			@set="composerChanged"
		>
			<template #description>
				<h2>Notify Authors</h2>
				<p>
					Send an email to the authors to let them know that their submission
					has been accepted for publication.
				</p>
			</template>
		</composer>
	</div>
</template>

<script>
import Composer from './ExampleComposer.vue';
import emailTemplate from '@/docs/data/emailTemplate';
import fileAttachers from '../../../data/fileAttachers';
import insertContent from '../../../data/insertContent';

export default {
	components: {
		Composer,
	},
	data() {
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

		return {
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
		};
	},
	methods: {
		composerChanged(id, data) {
			Object.keys(data).forEach((key) => {
				this[key] = data[key];
			});
		},
	},
};
</script>
