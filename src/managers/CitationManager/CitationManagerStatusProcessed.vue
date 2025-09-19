<template>
	<div v-if="total > 0">
		<div class="flex items-center py-2">
			<Icon
				:icon="processed === total ? 'Complete' : 'InProgress'"
				:class="'inline-block h-auto w-12 align-middle'"
				:inline="true"
			/>
			<div class="align-middle">
				<span class="font-semibold">
					{{
						processed === total
							? t('submission.citations.structured.processed.title', {
									total: total,
								})
							: t('submission.citations.structured.processing.title', {
									processed: processed,
									total: total,
								})
					}}
				</span>
				<br />
				<p class="text-lg-normal">
					{{
						processed === total
							? t('submission.citations.structured.processed.description')
							: t('submission.citations.structured.processing.description')
					}}
				</p>
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
</script>
