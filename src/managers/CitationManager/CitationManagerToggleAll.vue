<template>
	<a
		v-if="citationStore.citationsMetadataLookup"
		class="cursor-pointer"
		@click="citationStore.toggleAllItemsExpansion"
	>
		{{
			citationStore.allIdsExpanded
				? t('submission.citations.structured.collapseAll')
				: t('submission.citations.structured.expandAll')
		}}
	</a>
	<span v-else>&nbsp;</span>
</template>

<script setup>
import {useLocalize} from '@/composables/useLocalize';
import {useCitationManagerStore} from './citationManagerStore';

const {t} = useLocalize();

const citationStore = useCitationManagerStore();
</script>
