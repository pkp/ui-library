<template>
	<list-panel :items="items">
		<template #header>
			<pkp-header>
				<h2>List Panel with Actions</h2>
				<template #actions>
					<pkp-button @click="openModal">Add Item</pkp-button>
					<pkp-button :is-warnable="true" @click="openModal">
						Reset Defaults
					</pkp-button>
				</template>
			</pkp-header>
		</template>
	</list-panel>
</template>

<script>
import ListPanel from '@/components/ListPanel/ListPanel.vue';
import PkpHeader from '@/components/Header/Header.vue';
import items from '../helpers/items';

export default {
	components: {
		ListPanel,
		PkpHeader,
	},
	data() {
		return {
			items: [...items],
		};
	},
	methods: {
		openModal() {
			alert('You opened this modal.');
		},
	},
};
</script>
