<template>
	<div>
		<pkp-form
			v-bind="forms.archivePn"
			@set-errors="setFormErrors"
			@set-visible-locales="setFormVisibleLocales"
		/>
	</div>
</template>

<script>
import PkpForm from '@/components/Form/Form.vue';
import FormTest from './implementations/helpers/form-test';
import FieldArchivingPn from './implementations/helpers/field-archiving-pn';

let FormArchive = {...FormTest};
FormArchive.id = 'archivePn';
FormArchive.fields = [FieldArchivingPn];
delete FormArchive.pages[0].submitButton;

export default {
	name: 'ViewArchivingPnForm',
	components: {
		PkpForm,
	},
	data: function () {
		return {
			forms: {
				[FormArchive.id]: FormArchive,
			},
		};
	},
	methods: {
		/**
		 * Get a form by its id
		 *
		 * @return Object
		 */
		getForm: function (formId) {
			return this.forms[formId] ? this.forms[formId] : false;
		},

		/**
		 * Set the errors in the form
		 */
		setFormErrors: function (formId, errors) {
			if (this.getForm(formId)) {
				this.getForm(formId).errors = errors;
			}
		},

		/**
		 * Set the visible locales in the form
		 */
		setFormVisibleLocales: function (formId, visibleLocales) {
			if (this.getForm(formId)) {
				this.getForm(formId).visibleLocales = visibleLocales;
			}
		},
	},
};
</script>
