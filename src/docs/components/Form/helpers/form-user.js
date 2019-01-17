import Form from './form';
import GroupIdentity from './group-identity';
import GroupContact from './group-contact';
import GroupPreferences from './group-preferences';
import GroupProfile from './group-profile';
import FieldOptionsUserLocales from './field-options-user-locales';
import FieldOptionsConfirmation from './field-options-confirmation.js';
import FieldOptionsEmails from './field-options-emails.js';
import FieldRichTextareaBio from './field-rich-textarea-bio';
import FieldTextAffiliation from './field-text-affiliation';
import FieldTextareaMailingAddress from './field-textarea-mailing-address';
import FieldTextEmail from './field-text-email';
import FieldTextFamilyName from './field-text-family-name';
import FieldTextGivenName from './field-text-given-name';
import FieldTextOrcid from './field-text-orcid';
import FieldTextPhone from './field-text-phone';
import FieldTextUrl from './field-text-url';
import FieldSelectCountry from './field-select-country';

export default {
	...Form,
	id: 'user',
	action: '/example/user',
	fields: [
		FieldTextGivenName,
		FieldTextFamilyName,
		FieldTextEmail,
		FieldTextAffiliation,
		FieldTextPhone,
		FieldSelectCountry,
		FieldTextareaMailingAddress,
		FieldOptionsUserLocales,
		FieldOptionsConfirmation,
		FieldOptionsEmails,
		FieldTextUrl,
		FieldRichTextareaBio,
		FieldTextOrcid
	],
	groups: [
		{...GroupIdentity, pageId: 'account'},
		{...GroupContact, pageId: 'account'},
		{...GroupPreferences, pageId: 'preferences'},
		{...GroupProfile, pageId: 'profile'}
	],
	pages: [
		{
			id: 'account',
			label: 'Account Details',
			submitButton: {
				label: 'Next',
				isPrimary: true
			}
		},
		{
			id: 'preferences',
			label: 'Preferences',
			submitButton: {
				label: 'Next',
				isPrimary: true
			},
			previousButton: {
				label: 'Previous'
			}
		},
		{
			id: 'profile',
			label: 'Profile',
			submitButton: {
				label: 'Submit',
				isPrimary: true
			},
			previousButton: {
				label: 'Previous'
			}
		}
	],
	supportedFormLocales: [
		...Form.supportedFormLocales,
		{
			key: 'fr_CA',
			label: 'Français (Canada)'
		},
		{
			key: 'ar_AR',
			label: 'عربى'
		}
	],
	errors: {
		email: ['Please provide a valid email address'],
		affiliation: {
			en_US: ['You must enter your affiliation in English.'],
			fr_CA: ['You must enter your affiliation in French.'],
			ar_AR: ['You must enter your affiliation in Arabic.']
		},
		'user-locales': ['You must select at least two options.'],
		bio: {
			fr_CA: ['Please provide a bio statement to accompany your publication.']
		},
		country: ['Please select your country.'],
		'mailing-address': [
			'You must enter a mailing address where you can receive post.'
		]
	}
};
