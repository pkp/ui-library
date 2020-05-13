<template>
	<list-panel
		:expanded="expanded"
		:items="items"
		title="List Panel with Item Expander"
		class="previewListPanelItemExpander"
	>
		<template v-slot:itemActions="{item}">
			<pkp-button @click="openModal(item.title)">Edit</pkp-button>
			<expander
				:isExpanded="expanded.includes(item.id)"
				:itemName="item.title"
				@toggle="toggleExpanded(item.id)"
			/>
		</template>
		<template v-slot:itemExpanded="{item}">
			<list>
				<list-item>
					Ut enim ad minim veniam, quis nostrud
				</list-item>
				<list-item>
					Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.
				</list-item>
			</list>
			<div class="listPanel__itemExpandedActions">
				<pkp-button @click="openModal">Approve</pkp-button>
				<pkp-button :isWarnable="true" @click="openModal">Decline</pkp-button>
			</div>
		</template>
	</list-panel>
</template>

<script>
import Expander from '@/components/Expander/Expander.vue';
import List from '@/components/List/List.vue';
import ListItem from '@/components/List/ListItem.vue';
import ListPanel from '@/components/ListPanel/ListPanel.vue';
import items from '../helpers/items';

export default {
	components: {
		Expander,
		List,
		ListItem,
		ListPanel
	},
	data() {
		return {
			items: [...items],
			expanded: []
		};
	},
	methods: {
		openModal(title) {
			alert('Edit ' + title);
		},
		toggleExpanded(id) {
			if (this.expanded.includes(id)) {
				this.expanded = this.expanded.filter(k => k !== id);
			} else {
				this.expanded.push(id);
			}
		}
	}
};
</script>
