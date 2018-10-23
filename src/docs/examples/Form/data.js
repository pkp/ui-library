import FormRaw from '!!raw-loader!@/components/Form/Form.vue';
import ViewUser from './ViewUser.vue';
import ViewArchivingPnForm from './ViewArchivingPnForm.vue';

export default {
	dataDesc: {
		id: 'Used internally. Do not modify.',
		method: 'The method to use when submitting the form. This should match the API endpoint that will handle the form. It can be `POST` (create) or `PUT` (edit).',
		action: 'Where the form should be submitted. It should be a full URL (`http://...`) to the API endpoint where this form is handled.',
		errors: 'Array of error messages, which may be added in the server or client.',
		fields: 'Array of form fields.',
		groups: 'Array of form groups. Use these to group related fields.',
		pages: 'Array of form pages.',
		visibleLocales: 'The locale(s) the form is currently being presented in.',
		supportedFormLocales: 'The locale(s) supported by the site or context (journal/press) of this form. If a form has multilingual fields, it will display a separate input control for each of these locales.',
		currentPage: 'Contains the page ID of the currently active page. If empty, it will be set to the first page when mounted.',
		isSaving: 'Tracks whether a save operation is in progress.',
	},
	examples: {
		'user': {
			label: 'User Profile',
			component: ViewUser,
			componentRaw: FormRaw,
		},
		'archiving-pn': {
			label: 'PKP Publishing Network',
			component: ViewArchivingPnForm,
			componentRaw: FormRaw,
		},
	},
};
