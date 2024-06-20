<template>
	<SideModalBody>
		<template #title>
			{{ title }}
		</template>
		<SideModalLayoutBasic>
			<PkpForm
				v-bind="usersReportForm"
				@set="(...args) => emit('set', ...args)"
				@success="(...args) => emit('loadExport', ...args)"
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
	usersReportForm: {type: Object, required: true},
});
const emit = defineEmits(['set', 'loadExport']);
</script>
