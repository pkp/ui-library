<template>
	<div class="border border-light p-4">
		<h2 class="lg-bold text-heading">
			{{ t('notification.type.roundStatusTitle', {round: reviewRound.round}) }}
		</h2>
		<p class="text-sm-normal">{{ props.reviewRound.status }}</p>
	</div>
</template>

<script setup>
import {useLocalize} from '@/composables/useLocalize';

const props = defineProps({
	reviewRound: {type: Object, required: true},
});
const {t} = useLocalize();
</script>
