<template>
	<SideModalBody>
		<template #title>
			{{ title }}
		</template>
		<SideModalLayoutBasic>
			<PkpForm
				v-bind="activeForm"
				@set="(...args) => emit('setForm', ...args)"
				@success="(...args) => emit('formSuccess', ...args)"
			/>
		</SideModalLayoutBasic>
	</SideModalBody>
</template>

<script setup>
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import SideModalLayoutBasic from '@/components/Modal/SideModalLayoutBasic.vue';
import PkpForm from '@/components/Form/Form.vue';

defineProps({
	title: {type: String, required: true},
	activeForm: {type: Object, required: true},
});
const emit = defineEmits(['setForm', 'formSuccess']);
</script>
