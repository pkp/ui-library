<template>
	<!-- Use the v-bind syntax to bind all props at once. -->
	<list-panel
		v-bind="components.example"
		@set="set"
	>
		<pkp-header slot="header">
			{{ title }}
			<template slot="actions">
				<pkp-search
					:searchPhrase="components.example.searchPhrase"
					:searchLabel="i18n.search"
					:clearSearchLabel="i18n.clearSearch"
					@search-phrase-changed="setSearchPhrase"
				/>
			</template>
		</pkp-header>
	</list-panel>
</template>

<script>
import Container from '@/components/Container/Container.vue';
import PkpHeader from '@/components/Header/Header.vue';
import PkpSearch from '@/components/Search/Search.vue';
import {props} from '../config';
import items from '../helpers/items';

export default {
	extends: Container,
	components: {
		PkpSearch,
		PkpHeader
	},
	data() {
		return {
			components: {
				example: {
					...props,
					id: 'example',
					items: items
				}
			},
			originalItems: [...items],
			title: 'List Panel with Search',
			i18n: {
				search: 'Search',
				clearSearch: 'Clear search'
			}
		};
	},
	methods: {
		setSearchPhrase(searchPhrase) {
			this.components.example.searchPhrase = searchPhrase;
		}
	}
};
</script>
