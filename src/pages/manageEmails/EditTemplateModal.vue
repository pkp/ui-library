<template>
	<SideModalBody>
		<template #title>
			{{ title }}
		</template>
		<SideModalLayoutBasic>
			<PkpForm
				ref="templateForm"
				class="manageEmails__templateForm"
				v-bind="currentTemplateForm"
				@set="(...args) => emit('updateCurrentTemplateForm', ...args)"
				@success="(...args) => emit('templateSaved', ...args)"
			></PkpForm>
		</SideModalLayoutBasic>
	</SideModalBody>
</template>

<script setup>
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import SideModalLayoutBasic from '@/components/Modal/SideModalLayoutBasic.vue';
import PkpForm from '@/components/Form/Form.vue';

defineProps({
	title: {type: String, required: true},
	currentTemplateForm: {required: true, type: Object},
});

const emit = defineEmits(['updateCurrentTemplateForm', 'templateSaved']);
</script>
