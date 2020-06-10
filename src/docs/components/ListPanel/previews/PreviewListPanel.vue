<template>
	<list-panel :items="items" title="List Panel" />
</template>

<script>
import ListPanel from '@/components/ListPanel/ListPanel.vue';
import items from '../helpers/items.js';

export default {
	components: {
		ListPanel
	},
	data() {
		return {
			items: [...items]
		};
	}
};
</script>
