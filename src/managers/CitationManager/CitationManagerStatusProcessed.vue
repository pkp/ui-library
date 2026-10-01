<template>
	<div v-if="total > 0">
		<div class="flex items-center py-2">
			<Icon
				:icon="isFinished ? 'Complete' : 'InProgress'"
				:class="'inline-block h-auto w-12 align-middle'"
				:inline="true"
			/>
			<div class="align-middle">
				<span class="font-semibold">{{ statusTitle }}</span>
				<br />
				<p class="text-lg-normal">{{ statusDescription }}</p>
			</div>
		</div>
	</div>
</template>

<script setup>
import {useLocalize} from '@/composables/useLocalize';
import Icon from '@/components/Icon/Icon.vue';
import {useCitationManagerStore} from './citationManagerStore.js';
import {computed} from 'vue';

const {t} = useLocalize();

const citationStore = useCitationManagerStore();

const total = computed(() => citationStore.totalCitations);

const processed = computed(() => citationStore.processedCitations);

const failed = computed(() => citationStore.failedCitations);

const finished = computed(() => citationStore.finishedCitations);

const isFinished = computed(() => finished.value === total.value);

const statusTitle = computed(() => {
	if (!isFinished.value) {
		return t('submission.citations.structured.processing.title', {
			processed: finished.value,
			total: total.value,
		});
	}

	if (failed.value > 0) {
		return t('submission.citations.structured.processedWithFailures.title', {
			processed: processed.value,
			total: total.value,
			failed: failed.value,
		});
	}

	return t('submission.citations.structured.processed.title', {
		total: total.value,
	});
});

const statusDescription = computed(() => {
	if (!isFinished.value) {
		return t('submission.citations.structured.processing.description');
	}

	return failed.value > 0
		? t('submission.citations.structured.processedWithFailures.description')
		: t('submission.citations.structured.processed.description');
});
</script>
