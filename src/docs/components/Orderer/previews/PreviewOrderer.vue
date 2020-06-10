<template>
	<list>
		<list-item v-for="item in items" :key="item">
			{{ item }}
			<orderer
				:isDraggable="false"
				:itemId="item"
				:itemTitle="item"
				@down="down"
				@up="up"
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
	data() {
		return {
			items: ['One', 'Two', 'Three']
		};
	},
	methods: {
		/**
		 * Movin' on up!
		 *
		 * @param {String|Number} id The item to move
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
		 * @param {String|Number} id The item to move
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
