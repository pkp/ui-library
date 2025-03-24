<template>
	<SideModalBody>
		<template #title>
			{{ title }}
		</template>
		<SideModalLayoutBasic>
			<PkpForm v-bind="formData" @set="updateForm" @success="handleSuccess" />
		</SideModalLayoutBasic>
	</SideModalBody>
</template>

<script setup>
import {ref, watch} from 'vue';
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import SideModalLayoutBasic from '@/components/Modal/SideModalLayoutBasic.vue';
import PkpForm from '@/components/Form/Form.vue';

const props = defineProps({
	title: {type: String, required: true},
	activeForm: {type: Object, required: true},
});

const emit = defineEmits(['updateForm', 'formSuccess']);

// Create a reactive form data reference
const formData = ref(props.activeForm);

// Watch for changes to activeForm prop
watch(
	() => props.activeForm,
	(newForm) => {
		formData.value = newForm;
	},
	{deep: true},
);

function updateForm(formId, data) {
	// Update the reactive form data
	Object.keys(data).forEach((key) => {
		formData.value[key] = data[key];
	});
	emit('updateForm', formId, data);
}

function handleSuccess(response) {
	emit('formSuccess', response);
}
</script>
