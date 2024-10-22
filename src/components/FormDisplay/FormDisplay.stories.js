import FormDisplay from './FormDisplay.vue';
import {useForm} from '@/composables/useForm';
import {ref} from 'vue';
export default {
	title: 'Components/FormDisplay',
	component: FormDisplay,
	render: (args) => ({
		components: {FormDisplay},
		setup() {
			const {connectWithPayload} = useForm(args.form);
			const payload = ref({
				givenName: 'Jarda',
				familyName: 'Kotesovec',
				affiliation: 'PKP',
				country: 'AI',
			});
			connectWithPayload(payload);
			return {args};
		},
		template: '<FormDisplay v-bind="args.form"></FormDisplay>',
	}),
};

export const Base = {
	render: (args) => ({
		components: {FormDisplay},
		setup() {
			const {connectWithPayload} = useForm(args.form);
			const payload = ref({
				givenName: 'Jarda',
				familyName: 'Kotesovec',
				affiliation: 'PKP',
				country: 'AI',
			});
			connectWithPayload(payload);
			return {args};
		},
		template: '<FormDisplay v-bind="args.form"></FormDisplay>',
	}),
	args: {
		form: {
			id: 'userDetails',
			method: 'POST',
			action: 'http://localhost/ojs/index.php/publicknowledge/api/v1/users',
			fields: [
				{
					name: 'givenName',
					component: 'field-text',
					label: 'Given Name',
					groupId: 'default',
					isRequired: true,
					isMultilingual: false,
					description:
						'Also known as a forename or the first name, it is tha part of a personal name that identifies a preson',
					value: null,
					inputType: 'text',
					optIntoEdit: false,
					optIntoEditLabel: '',
					size: 'large',
					prefix: '',
				},
				{
					name: 'familyName',
					component: 'field-text',
					label: 'Family Name',
					groupId: 'default',
					isRequired: true,
					isMultilingual: false,
					description:
						"A surname, family name, or last name is the mostly  hereditary portion of one's personal name that indicates one's family",
					value: null,
					inputType: 'text',
					optIntoEdit: false,
					optIntoEditLabel: '',
					size: 'large',
					prefix: '',
				},
				{
					name: 'affiliation',
					component: 'field-text',
					label: 'Affiliation',
					groupId: 'default',
					isRequired: true,
					isMultilingual: false,
					description: 'This is the institute you are affiliated with',
					value: null,
					inputType: 'text',
					optIntoEdit: false,
					optIntoEditLabel: '',
					size: 'large',
					prefix: '',
				},
				{
					name: 'country',
					component: 'field-select',
					label: 'County of affiliation',
					groupId: 'default',
					isRequired: true,
					isMultilingual: false,
					description:
						'This is a country in which the institute you are affiliated with is situated',
					value: null,
					inputType: 'text',
					optIntoEdit: false,
					optIntoEditLabel: '',
					options: [
						{
							value: '',
							label: 'Select a country',
							disabled: true,
						},
						{
							value: 'AF',
							label: 'Afghanistan',
						},
						{
							value: 'AL',
							label: 'Albania',
						},
						{
							value: 'DZ',
							label: 'Algeria',
						},
						{
							value: 'AS',
							label: 'American Samoa',
						},
						{
							value: 'AD',
							label: 'Andorra',
						},
						{
							value: 'AO',
							label: 'Angola',
						},
						{
							value: 'AI',
							label: 'Anguilla',
						},
						{
							value: 'AQ',
							label: 'Antarctica',
						},
						{
							value: 'AG',
							label: 'Antigua and Barbuda',
						},
					],
					size: 'large',
					prefix: '',
				},
			],
			groups: [
				{
					id: 'default',
					pageId: 'default',
				},
			],
			hiddenFields: {},
			pages: [
				{
					id: 'default',
					submitButton: {
						label: 'Save',
					},
				},
			],
			primaryLocale: 'en',
			visibleLocales: ['en'],
			supportedFormLocales: [
				{
					key: 'en',
					label: 'English',
				},
				{
					key: 'fr_CA',
					label: 'French',
				},
			],
			errors: {},
		},
	},
};

export const Multilingual = {
	render: (args) => ({
		components: {FormDisplay},
		setup() {
			const {connectWithPayload} = useForm(args.form);
			const payload = ref({
				givenName: {en: 'Jarda', fr_CA: 'Jardous'},
				familyName: {en: 'Kotesovec', fr_CA: ''},
				affiliation: {en: 'PKP', fr_CA: 'PKP fr'},
				country: 'AI',
			});
			connectWithPayload(payload);
			return {args};
		},
		template: '<FormDisplay v-bind="args.form"></FormDisplay>',
	}),
	args: {
		form: {
			id: 'userDetails',
			method: 'POST',
			action: 'http://localhost/ojs/index.php/publicknowledge/api/v1/users',
			fields: [
				{
					name: 'givenName',
					component: 'field-text',
					label: 'Given Name',
					groupId: 'default',
					isRequired: true,
					isMultilingual: true,
					description:
						'Also known as a forename or the first name, it is tha part of a personal name that identifies a preson',
					value: null,
					inputType: 'text',
					optIntoEdit: false,
					optIntoEditLabel: '',
					size: 'large',
					prefix: '',
				},
				{
					name: 'familyName',
					component: 'field-text',
					label: 'Family Name',
					groupId: 'default',
					isRequired: true,
					isMultilingual: true,
					description:
						"A surname, family name, or last name is the mostly  hereditary portion of one's personal name that indicates one's family",
					value: null,
					inputType: 'text',
					optIntoEdit: false,
					optIntoEditLabel: '',
					size: 'large',
					prefix: '',
				},
				{
					name: 'affiliation',
					component: 'field-text',
					label: 'Affiliation',
					groupId: 'default',
					isRequired: true,
					isMultilingual: true,
					description: 'This is the institute you are affiliated with',
					value: null,
					inputType: 'text',
					optIntoEdit: false,
					optIntoEditLabel: '',
					size: 'large',
					prefix: '',
				},
				{
					name: 'country',
					component: 'field-select',
					label: 'County of affiliation',
					groupId: 'default',
					isRequired: true,
					isMultilingual: false,
					description:
						'This is a country in which the institute you are affiliated with is situated',
					value: null,
					inputType: 'text',
					optIntoEdit: false,
					optIntoEditLabel: '',
					options: [
						{
							value: '',
							label: 'Select a country',
							disabled: true,
						},
						{
							value: 'AF',
							label: 'Afghanistan',
						},
						{
							value: 'AL',
							label: 'Albania',
						},
						{
							value: 'DZ',
							label: 'Algeria',
						},
						{
							value: 'AS',
							label: 'American Samoa',
						},
						{
							value: 'AD',
							label: 'Andorra',
						},
						{
							value: 'AO',
							label: 'Angola',
						},
						{
							value: 'AI',
							label: 'Anguilla',
						},
						{
							value: 'AQ',
							label: 'Antarctica',
						},
						{
							value: 'AG',
							label: 'Antigua and Barbuda',
						},
						{
							value: 'AR',
							label: 'Argentina',
						},
						{
							value: 'AM',
							label: 'Armenia',
						},
						{
							value: 'AW',
							label: 'Aruba',
						},
					],
					size: 'large',
					prefix: '',
				},
			],
			groups: [
				{
					id: 'default',
					pageId: 'default',
				},
			],
			hiddenFields: {},
			pages: [
				{
					id: 'default',
					submitButton: {
						label: 'Save',
					},
				},
			],
			primaryLocale: 'en',
			visibleLocales: ['en'],
			supportedFormLocales: [
				{
					key: 'en',
					label: 'English',
				},
				{
					key: 'fr_CA',
					label: 'French',
				},
			],
			errors: {},
		},
	},
};
