<template>
	<Search
		:search-phrase="store.searchPhrase"
		:search-label="t('userAccess.search')"
		@search-phrase-changed="store.setSearchPhrase"
	/>
</template>
<script setup>
import Search from '@/components/Search/Search.vue';

import {useUserAccessManagerStore} from './UserAccessManagerStore';

const store = useUserAccessManagerStore();
</script>
