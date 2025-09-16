<template>
	<PkpSearch
		:search-label="t('submission.citations.structured.search.placeholder')"
		@search-phrase-changed="(...args) => citationStore.setSearchPhrase(...args)"
	/>
</template>

<script setup>
import {useLocalize} from '@/composables/useLocalize';
import PkpSearch from '@/components/Search/Search.vue';
import {useCitationManagerStore} from '@/managers/CitationManager/citationManagerStore';

const {t} = useLocalize();

const citationStore = useCitationManagerStore();
</script>
