<template>
	<list-panel :items="items">
		<pkp-header slot="header">
			<h2>List Panel with Actions</h2>
			<template slot="actions">
				<pkp-button @click="openModal">Add Item</pkp-button>
				<pkp-button @click="openModal" :isWarnable="true">
					Reset Defaults
				</pkp-button>
			</template>
		</pkp-header>
	</list-panel>
</template>

<script>
import ListPanel from '@/components/ListPanel/ListPanel.vue';
import PkpHeader from '@/components/Header/Header.vue';
import items from '../helpers/items';

export default {
	components: {
		ListPanel,
		PkpHeader
	},
	data() {
		return {
			items: [...items]
		};
	},
	methods: {
		openModal() {
			alert('You opened this modal.');
		}
	}
};
</script>
