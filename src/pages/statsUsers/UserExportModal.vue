<template>
	<SideModalBody>
		<template #title>
			{{ t('manager.export.usersToCsv.label') }}
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
import {useLocalize} from '@/composables/useLocalize';
const {t} = useLocalize();

defineProps({
	usersReportForm: {type: Object, required: true},
});
const emit = defineEmits(['set', 'loadExport']);
</script>
