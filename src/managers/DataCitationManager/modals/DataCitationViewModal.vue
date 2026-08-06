<template>
	<SideModalBody>
		<template #title>
			{{ t('submission.dataCitations.viewModal.title') }}
		</template>
		<SideModalLayoutBasic>
			<PkpForm v-bind="form" field-heading-element="h2" :display-only="true" />
		</SideModalLayoutBasic>
	</SideModalBody>
</template>

<script setup>
import {useLocalize} from '@/composables/useLocalize';
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import SideModalLayoutBasic from '@/components/Modal/SideModalLayoutBasic.vue';
import PkpForm from '@/components/Form/Form.vue';

defineProps({
	form: {type: Object, required: true},
});

const {t} = useLocalize();
</script>
