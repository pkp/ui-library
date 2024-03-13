<template>
	<div v-if="activeFiltersList.length" class="flex items-center gap-1">
		<Badge
			v-for="filter in activeFiltersList"
			:key="filter.fieldLabel + filter.label"
		>
			<strong>{{ filter.fieldLabel }}:</strong>
			{{ filter.label }}
		</Badge>
		<pkpButton
			:is-warnable="true"
			:is-link="true"
			@click="(...args) => emit('clearFilters', ...args)"
		>
			{{ t('common.filtersClear') }}
		</pkpButton>
	</div>
</template>

<script setup>
import Badge from '@/components/Badge/Badge.vue';

import {defineEmits, defineProps} from 'vue';
import {useLocalize} from '@/composables/useLocalize';

const {t} = useLocalize();

defineProps({activeFiltersList: {type: Array, required: true}});
const emit = defineEmits(['clearFilters']);
</script>
