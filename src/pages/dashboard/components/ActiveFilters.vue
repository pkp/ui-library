<template>
	<div
		v-if="activeFiltersList.length"
		class="flex flex-wrap items-center gap-2"
	>
		<div
			v-for="filter in activeFiltersList"
			:key="filter.fieldLabel + filter.label"
			class="flex flex-none items-center gap-x-1 rounded bg-selection-light px-2 py-1.5"
		>
			<span class="text-lg-normal">{{ filter.fieldLabel }}:</span>
			<span class="text-lg-semibold">{{ filter.label }}</span>
			<button
				class="flex items-center border-0 bg-transparent"
				@click="(...args) => emit('removeFilter', filter.name, filter.value)"
			>
				<Icon class="h-4 w-4 text-negative" icon="Cancel" :aria-hidden="true" />
				<span class="sr-only">remove filter (todo better label)</span>
			</button>
		</div>
		<PkpButton
			:is-warnable="true"
			:is-link="true"
			@click="(...args) => emit('clearFilters', ...args)"
		>
			{{ t('common.filtersClear') }}
		</PkpButton>
	</div>
</template>

<script setup>
import {defineEmits, defineProps} from 'vue';
import {useLocalize} from '@/composables/useLocalize';
import PkpButton from '@/components/Button/Button.vue';
import Icon from '@/components/Icon/Icon.vue';

const {t} = useLocalize();

defineProps({activeFiltersList: {type: Array, required: true}});
const emit = defineEmits(['clearFilters', 'removeFilter']);
</script>
