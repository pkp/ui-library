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
			deselectLabel="Deselect"
			:emailTemplates="emailTemplates"
			:emailTemplatesApiUrl="emailTemplatesApiUrl"
			findTemplateLabel="Find Template"
			:initialTemplateKey="initialTemplateKey"
			loadTemplateLabel="Load a Template"
			moreSearchResultsLabel="{$number} more"
			removeItemLabel="Remove {$item}"
			searchingLabel="Searching"
			:subject="subject"
			subjectLabel="Subject:"
			switchLanguageLabel="Switch To:"
			:to="to"
			recipientsLabel="To:"
			:recipientOptions="recipientOptions"
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
			subject: '',
			to: [2, 3],
			recipientOptions: [
				{
					value: 2,
					label: 'Carlo Corino'
				},
				{
					value: 3,
					label: 'Daniel Barnes'
				},
				{
					value: 4,
					label: 'Stephanie Minoue'
				},
				{
					value: 5,
					label: 'Paul Hudson'
				}
			],
			variables: {
				en_US: {
					journalName: 'Journal of Public Knowledge',
					journalUrl: 'http://example.org',
					senderName: 'Daniel Barnes',
					submissionTitle:
						'Towards Designing an Intercultural Curriculum: A Case Study from the Atlantic Coast of Nicaragua'
				}
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
