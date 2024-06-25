<template>
	<p>{{ t('manager.dois.update.partialFailure') }}</p>
	<ul>
		<li v-for="errorMessage in failedDoiActions" :key="errorMessage.index">
			{{ errorMessage }}
		</li>
	</ul>
</template>

<script setup>
import {useLocalize} from '@/composables/useLocalize';
defineProps({
	failedDoiActions: {type: Array, required: true},
});
const {t} = useLocalize();
</script>
