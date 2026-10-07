<template>
	<div v-if="citationStore.totalCitations > 0">
		<div class="flex items-center py-2">
			<Icon
				:icon="citationStore.isFinished ? 'Complete' : 'InProgress'"
				:class="'inline-block h-auto w-12 align-middle'"
				:inline="true"
			/>
			<div class="align-middle">
				<span class="font-semibold">{{ citationStore.statusTitle }}</span>
				<br />
				<p class="text-lg-normal">{{ citationStore.statusDescription }}</p>
			</div>
		</div>
	</div>
</template>

<script setup>
import Icon from '@/components/Icon/Icon.vue';
import {useCitationManagerStore} from './citationManagerStore.js';

const citationStore = useCitationManagerStore();
</script>
