<template>
	<list>
		<list-item v-for="item in items" :key="item">
			{{ item }}
			<orderer
				@up="up"
				@down="down"
				:itemId="item"
				:itemTitle="item"
				:isDraggable="isDraggable"
				:i18n="i18n"
			/>
		</list-item>
	</list>
</template>

<script>
import List from '@/components/List/List.vue';
import ListItem from '@/components/List/ListItem.vue';
import Orderer from '@/components/Orderer/Orderer.vue';

export default {
	components: {
		List,
		ListItem,
		Orderer
	},
	data: function() {
		return {
			items: ['One', 'Two', 'Three'],
			isDraggable: false,
			i18n: {
				orderUp: 'Increase position of {$itemTitle}',
				orderDown: 'Decrease position of {$itemTitle}'
			}
		};
	},
	methods: {
		/**
		 * Movin' on up!
		 *
		 * @param id string|int The item to move
		 */
		up: function(id) {
			const index = this.items.findIndex(item => {
				return item === id;
			});
			if (!index) {
				return;
			}
			this.items.splice(index - 1, 0, this.items.splice(index, 1)[0]);
		},

		/**
		 * Get down tonight!
		 *
		 * @param id string|int The item to move
		 */
		down: function(id) {
			const index = this.items.findIndex(item => {
				return item === id;
			});
			if (index < 0 || index >= this.items.length - 1) {
				return;
			}
			this.items.splice(index + 1, 0, this.items.splice(index, 1)[0]);
		}
	}
};
</script>
