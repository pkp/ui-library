<template>
	<!-- Use the v-bind syntax to bind all props at once. -->
	<catalog-list-panel v-bind="components.example" @set="set" />
</template>

<script>
import Container from '@/components/Container/Container.vue';
import CatalogListPanel from '@/components/ListPanel/submissions/CatalogListPanel.vue';
import {propsCatalogListPanel} from '../config';

export default {
	extends: Container,
	components: {
		CatalogListPanel
	},
	data() {
		return {
			components: {
				example: {
					...propsCatalogListPanel,
					id: 'example',
					title: 'Catalog List Panel (OMP)'
				}
			}
		};
	}
};
</script>
