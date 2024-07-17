<template>
	<SideModalBody>
		<template #title>
			{{ title }}
		</template>
		<SideModalLayoutBasic>
			<CounterReportForm
				v-bind="activeForm"
				@set="(...args) => emit('updateForm', ...args)"
				@success="(...args) => emit('formSuccess', ...args)"
			/>
		</SideModalLayoutBasic>
	</SideModalBody>
</template>

<script setup>
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import SideModalLayoutBasic from '@/components/Modal/SideModalLayoutBasic.vue';
import CounterReportForm from '@/components/Form/counter/CounterReportForm.vue';

defineProps({
	title: {type: String, required: true},
	activeForm: {type: Object, required: true},
});
const emit = defineEmits(['updateForm', 'formSuccess']);
</script>
