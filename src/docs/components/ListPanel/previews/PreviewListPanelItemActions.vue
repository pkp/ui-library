<template>
	<list-panel :items="items" title="List Panel with Item Actions">
		<template #item-actions="{item}">
			<pkp-button @click="openModal(item.title)">Edit</pkp-button>
			<pkp-button :is-warnable="true" @click="openModal(item.title)">
				Delete
			</pkp-button>
		</template>
	</list-panel>
</template>

<script>
import ListPanel from '@/components/ListPanel/ListPanel.vue';
import items from '../helpers/items';

export default {
	components: {
		ListPanel,
	},
	data() {
		return {
			items: [...items],
		};
	},
	methods: {
		openModal(title) {
			alert('You opened a modal for ' + title + '.');
		},
	},
};
</script>
