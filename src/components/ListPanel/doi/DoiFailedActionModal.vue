<template>
	<SideModalBody>
		<template #title>
			{{ t('manager.dois.update.failedCreation') }}
		</template>
		<SideModalLayoutBasic>
			<p>{{ t('manager.dois.update.partialFailure') }}</p>
			<ul>
				<li v-for="errorMessage in failedDoiActions" :key="errorMessage.index">
					{{ errorMessage }}
				</li>
			</ul>
		</SideModalLayoutBasic>
	</SideModalBody>
</template>

<script setup>
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import SideModalLayoutBasic from '@/components/Modal/SideModalLayoutBasic.vue';
import {useLocalize} from '@/composables/useLocalize';
defineProps({
	failedDoiActions: {type: Array, required: true},
});
const {t} = useLocalize();
</script>
