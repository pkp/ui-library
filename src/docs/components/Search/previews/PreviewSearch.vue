<template>
	<search
		:searchPhrase="searchPhrase"
		searchLabel="Search"
		clearSearchLabel="Clear search"
		@search-phrase-changed="setSearchPhrase"
	/>
</template>

<script>
import Search from '@/components/Search/Search.vue';

export default {
	components: {
		Search
	},
	data() {
		return {
			searchPhrase: ''
		};
	},
	methods: {
		setSearchPhrase(newVal) {
			this.searchPhrase = newVal;
		}
	}
};
</script>
