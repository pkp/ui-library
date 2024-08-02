import {ref} from 'vue';
import Orderer from './Orderer.vue';
import List from '@/components/List/List.vue';
import ListItem from '@/components/List/ListItem.vue';
import {VueDraggable} from 'vue-draggable-plus';

import './Orderer.stories.less';

export default {
	title: 'Components/Orderer',
	component: Orderer,
};

export const Default = {
	render: (args) => ({
		components: {Orderer, List, ListItem},
		setup() {
			const items = ref(['One', 'Two', 'Three']);

			function up(id) {
				const index = items.value.findIndex((item) => {
					return item === id;
				});
				if (!index) {
					return;
				}
				items.value.splice(index - 1, 0, items.value.splice(index, 1)[0]);
			}

			function down(id) {
				const index = items.value.findIndex((item) => {
					return item === id;
				});
				if (index < 0 || index >= items.value.length - 1) {
					return;
				}
				items.value.splice(index + 1, 0, items.value.splice(index, 1)[0]);
			}

			return {items, up, down, args};
		},
		template: `
	<List>
		<ListItem v-for="item in items" :key="item">
			{{ item }}
			<Orderer
				v-bind="args"
				:item-id="item"
				:item-title="item"
				@down="down"
				@up="up"
			/>
		</ListItem>
	</List>
		`,
	}),
	args: {
		isDraggable: false,
	},
};

export const Draggable = {
	render: (args) => ({
		components: {Orderer, List, ListItem, VueDraggable},
		setup() {
			const items = ref(['One', 'Two', 'Three']);

			function up(id) {
				const index = items.value.findIndex((item) => {
					return item === id;
				});
				if (!index) {
					return;
				}
				items.value.splice(index - 1, 0, items.value.splice(index, 1)[0]);
			}

			function down(id) {
				const index = items.value.findIndex((item) => {
					return item === id;
				});
				if (index < 0 || index >= items.value.length - 1) {
					return;
				}
				items.value.splice(index + 1, 0, items.value.splice(index, 1)[0]);
			}

			return {items, up, down, args};
		},
		template: `
			<List class="viewOrderer--draggable">
				<VueDraggable ref="el" v-model="items">
					<ListItem v-for="item in items" :key="item">
						{{ item }}
						<Orderer :item-id="item" :item-title="item" @down="down" @up="up" />
					</ListItem>
				</VueDraggable>
	</List>
		`,
	}),
	args: {
		isDraggable: false,
	},
};
