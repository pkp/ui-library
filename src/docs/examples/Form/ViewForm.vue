<template>
	<div>
		<pkp-form
			v-bind="forms.test"
			@set-errors="setFormErrors"
			@set-visible-locales="setFormVisibleLocales"
		/>
	</div>
</template>

<script>
import PkpForm from '@/components/Form/Form.vue';
import FormTest from './implementations/helpers/form-test';

export default {
	name: 'ViewForm',
	components: {
		PkpForm,
	},
	data: function () {
		return {
			forms: {
				[FormTest.id]: FormTest,
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
