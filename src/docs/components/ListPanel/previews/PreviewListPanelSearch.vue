<template>
	<list-panel :items="items">
		<pkp-header slot="header">
			<h2>List Panel with Search</h2>
			<template slot="actions">
				<search
					:searchPhrase="searchPhrase"
					@search-phrase-changed="setSearchPhrase"
				/>
			</template>
		</pkp-header>
	</list-panel>
</template>

<script>
import ListPanel from '@/components/ListPanel/ListPanel.vue';
import PkpHeader from '@/components/Header/Header.vue';
import Search from '@/components/Search/Search.vue';
import items from '../helpers/items';

export default {
	components: {
		ListPanel,
		PkpHeader,
		Search
	},
	data() {
		return {
			items: [...items],
			originalItems: [...items],
			searchPhrase: ''
		};
	},
	methods: {
		/**
		 * Normally you would send the search request to the server
		 */
		setSearchPhrase(searchPhrase) {
			this.searchPhrase = searchPhrase;
			if (!searchPhrase.length) {
				this.items = [...this.originalItems];
			} else {
				this.items = this.originalItems.filter(item => {
					return (
						new RegExp(searchPhrase, 'i').test(item.title) ||
						new RegExp(searchPhrase, 'i').test(item.subtitle)
					);
				});
			}
		}
	}
};
</script>
