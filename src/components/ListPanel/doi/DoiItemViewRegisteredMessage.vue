<template>
	<SideModalBody>
		<template #title>
			{{ t('manager.dois.registration.viewRecord.title') }}
		</template>
		<SideModalLayoutBasic>
			<p>{{ registeredMessageAgencyPreamble }}</p>
			<p>{{ registeredMessage }}</p>
		</SideModalLayoutBasic>
	</SideModalBody>
</template>

<script setup>
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import SideModalLayoutBasic from '@/components/Modal/SideModalLayoutBasic.vue';
import {useLocalize} from '@/composables/useLocalize';
defineProps({
	registeredMessageAgencyPreamble: {type: String, required: true},
	registeredMessage: {type: String, required: true},
});
const {t} = useLocalize();
</script>
