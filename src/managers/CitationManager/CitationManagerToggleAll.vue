<template>
	<a @click="citationStore.allRowsExpandedChanged" class="cursor-pointer">
		{{
			citationStore.allRowsExpanded
				? t('submission.citations.structured.collapseAll')
				: t('submission.citations.structured.expandAll')
		}}
	</a>
</template>

<script setup>
import {useLocalize} from '@/composables/useLocalize';
import {useCitationManagerStore} from '@/managers/CitationManager/citationManagerStore';

const {t} = useLocalize();

const citationStore = useCitationManagerStore();
</script>
