<template>
	<Search
		:search-phrase="store.searchPhrase"
		:search-label="t('editor.submission.search')"
		@search-phrase-changed="(...args) => store.setSearchPhrase(...args)"
	></Search>
</template>
<script setup>
import Search from '@/components/Search/Search.vue';
import {useLocalize} from '@/composables/useLocalize';

const {t} = useLocalize();
import {useDashboardPageStore} from '../dashboardPageStore';

const store = useDashboardPageStore();
</script>
