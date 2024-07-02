<template>
	<p>{{ t('manager.dois.update.partialFailure') }}</p>
	<ul class="list-inside list-disc">
		<li v-for="(errorMessage, index) in failedDoiActions" :key="index">
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
