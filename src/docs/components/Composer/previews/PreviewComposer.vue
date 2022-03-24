<template>
	<div class="previewComposer">
		<composer
			addCCLabel="Add CC/BCC"
			attachedFilesLabel="Attached Files:"
			:attachers="attachers"
			attachFilesLabel="Attach Files"
			:attachments="attachments"
			:bcc="bcc"
			bccLabel="BCC:"
			:body="body"
			bodyLabel="Message"
			:canChangeRecipients="false"
			:cc="cc"
			ccLabel="CC:"
			confirmSwitchLocaleLabel="Are you sure you want to change to {$localeName} to compose this email? Any changes you have made to the subject and body of the email will be lost."
			deselectLabel="Deselect"
			:emailTemplates="emailTemplates"
			:emailTemplatesApiUrl="emailTemplatesApiUrl"
			findTemplateLabel="Find Template"
			:initialTemplateKey="initialTemplateKey"
			insertLabel="Insert"
			insertModalLabel="Insert Content"
			insertContentLabel="Content"
			insertSearchLabel="Find content to insert"
			loadTemplateLabel="Load a Template"
			:locale="locale"
			:locales="locales"
			moreSearchResultsLabel="{$number} more"
			removeItemLabel="Remove {$item}"
			searchingLabel="Searching"
			searchResultsLabel="Search Results"
			:subject="subject"
			subjectLabel="Subject:"
			switchToLabel="Switch To:"
			switchToNamedLanguageLabel="Switch to {$name}"
			:to="to"
			recipientsLabel="To:"
			:recipientOptions="recipientOptions"
			:recipients="recipientOptions.map(r => r.value)"
			:variables="variables"
			@set="composerChanged"
		>
			<template slot="description">
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
import fileAttachers from '@/docs/data/fileAttachers';
import insertContent from '../../../data/insertContent';

export default {
	components: {
		Composer
	},
	data() {
		const emailTemplates = [emailTemplate];
		emailTemplates.push({
			...emailTemplate,
			key: 'ACCEPTED_CONDITIONAL',
			subject: {
				en_US: 'Accepted With Conditions'
			}
		});
		emailTemplates.push({
			...emailTemplate,
			key: 'ACCEPTED_EARLY_PUBLICATION',
			subject: {
				en_US: 'Accepted for Early Publication'
			}
		});

		const recipientOptions = [
			{
				value: 2,
				label: {
					en_US: 'Carlo Corino',
					fr_CA: 'Carlo Fr Corino'
				}
			},
			{
				value: 3,
				label: {
					en_US: 'Daniel Barnes',
					fr_CA: 'Daniel Fr Barnes'
				}
			},
			{
				value: 4,
				label: {
					en_US: 'Stephanie Minoue',
					fr_CA: 'Stephanie Fr Minoue'
				}
			},
			{
				value: 5,
				label: {
					en_US: 'Paul Hudson',
					fr_CA: 'Paul Fr Hudson'
				}
			}
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
				'http://localhost:8000/publicknowledge/api/v1/emailTemplates',
			locale: 'en_US',
			locales: [
				{
					locale: 'en_US',
					name: 'English (United States)'
				},
				{
					locale: 'fr_CA',
					name: 'French (Canada)'
				}
			],
			subject: '',
			to: [2, 3],
			recipientOptions: recipientOptions,
			recipients: recipientOptions.map(r => r.value),
			variables: {
				en_US: [...insertContent],
				fr_CA: [...insertContent]
			}
		};
	},
	methods: {
		composerChanged(id, data) {
			Object.keys(data).forEach(key => {
				this[key] = data[key];
			});
		}
	}
};
</script>
