<template>
	<SideModalBody>
		<template #title>
			{{ t('submission.catalogEntry.new') }}
		</template>
		<SideModalLayoutBasic>
			<PkpForm
				v-bind="activeForm"
				@set="(...args) => emit('setAddEntryForm', ...args)"
				@success="(...args) => emit('addEntryFormSuccess', ...args)"
			/>
		</SideModalLayoutBasic>
	</SideModalBody>
</template>

<script setup>
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import SideModalLayoutBasic from '@/components/Modal/SideModalLayoutBasic.vue';
import PkpForm from '@/components/Form/Form.vue';
import {useLocalize} from '@/composables/useLocalize';
defineProps({
	activeForm: {type: Object, required: true},
});
const {t} = useLocalize();
const emit = defineEmits(['setAddEntryForm', 'addEntryFormSuccess']);
</script>
