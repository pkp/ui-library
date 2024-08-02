<template>
	<SideModalBody>
		<template #title>
			{{ t('submission.wizard.changeSubmission') }}
		</template>
		<SideModalLayoutBasic>
			<PkpForm
				v-bind="reconfigureSubmissionForm"
				@set="(...args) => emit('set', ...args)"
				@success="(...args) => emit('reconfigureSubmission', ...args)"
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
	reconfigureSubmissionForm: {type: Object, required: true},
});
const emit = defineEmits(['set', 'reconfigureSubmission']);
</script>
