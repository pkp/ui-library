<template>
	<PkpButton
		v-if="citationStore.citationsMetadataLookup"
		:is-link="true"
		@click="citationStore.toggleAllItemsExpansion"
	>
		{{
			citationStore.allIdsExpanded
				? t('submission.citations.structured.collapseAll')
				: t('submission.citations.structured.expandAll')
		}}
	</PkpButton>
	<span v-else>&nbsp;</span>
</template>

<script setup>
import {useLocalize} from '@/composables/useLocalize';
import PkpButton from '@/components/Button/Button.vue';
import {useCitationManagerStore} from './citationManagerStore';

const {t} = useLocalize();

const citationStore = useCitationManagerStore();
</script>
