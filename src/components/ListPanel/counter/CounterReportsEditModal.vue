<template>
	<SideModalBody>
		<template #title>
			{{ title }}
		</template>
		<SideModalLayoutBasic>
			<PkpForm
				v-bind="activeForm"
				@set="(...args) => emit('updateForm', ...args)"
				@success="(...args) => counterFormSubmit(...args)"
			/>
		</SideModalLayoutBasic>
	</SideModalBody>
</template>

<script setup>
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import SideModalLayoutBasic from '@/components/Modal/SideModalLayoutBasic.vue';
import PkpForm from '@/components/Form/Form.vue';
import {useForm} from '@/composables/useForm';

const props = defineProps({
	title: {type: String, required: true},
	submitAction: {type: String, required: true},
	activeForm: {type: Object, required: true},
});
const emit = defineEmits(['updateForm', 'formSuccess']);

/**
 * Get the report parameters
 *
 * @param Object
 * @return Object
 */
function getReportParams(formSubmitValues) {
	let params = {};
	for (const [key, value] of Object.entries(formSubmitValues)) {
		switch (key) {
			case 'customer_id':
			case 'begin_date':
			case 'end_date':
			case 'yop':
			case 'item_id':
				if (value != null && value.length > 0) {
					params[key] = value;
				}
				break;
			case 'metric_type':
			case 'attributes_to_show':
				if (value != null && value.length > 0) {
					params[key] = value.join('|');
				}
				break;
			case 'include_parent_details':
				if (value == true) {
					params.include_parent_details = 'True';
				}
				break;
			case 'granularity':
				if (value == true) {
					params.granularity = 'Totals';
				}
				break;
		}
	}
	return params;
}

/**
 * Submit the form
 *
 * @param {Object}
 */
function counterFormSubmit(submittedValues) {
	const {form: form} = useForm(props.activeForm);

	form.isSaving = true;

	$.ajax({
		context: form,
		method: form.method,
		url: props.submitAction,
		headers: {
			Accept: 'text/tab-separated-values; charset=utf-8',
		},
		data: getReportParams(submittedValues),
		error(r) {
			form.isSaving = false;
			if (r.status && r.status === 400) {
				if (Object.prototype.hasOwnProperty.call(r.responseJSON, 'Code')) {
					// COUNTER speific errors should actually not occur
					// because of the form/user input validation
					// but consider them for any case as well.
					pkp.eventBus.$emit(
						'notify',
						r.responseJSON.Code +
							':' +
							r.responseJSON.Message +
							'(' +
							r.responseJSON.Data +
							')',
						'warning',
					);
				} else {
					// Field validation errors
					emit('updateForm', form.id, {errors: r.responseJSON});
				}
			} else {
				form.error(r);
			}
		},
		success(r) {
			var blob = new Blob([r]);
			var link = document.createElement('a');
			link.href = window.URL.createObjectURL(blob);
			link.download = 'counterReport.tsv';
			link.click();
			form.isSaving = false;
			emit('formSuccess', this.id, r);
		},
	});
}
</script>
