<template>
	<!-- Use the v-bind syntax to bind all props at once. -->
	<list-panel v-bind="components.example" :title="title" @set="set">
		<pagination
			v-if="lastPage > 1"
			slot="footer"
			:currentPage="currentPage"
			:lastPage="lastPage"
			:i18n="i18n"
			@set-page="setPage"
		/>
	</list-panel>
</template>

<script>
import Container from '@/components/Container/Container.vue';
import ListPanel from '@/components/ListPanel/ListPanel.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
import {props} from '../config';
import items from '../helpers/items';
import i18n from '../helpers/i18n';

let manyItems = [...items];
for (let i = 4; i < 30; i++) {
	manyItems.push({
		id: i,
		title: 'Item ' + i
	});
}

export default {
	extends: Container,
	components: {
		ListPanel,
		Pagination
	},
	data() {
		return {
			components: {
				example: {
					...props,
					id: 'example',
					count: 3,
					items: manyItems.slice(0, 3),
					itemsMax: 30
				}
			},
			allItems: manyItems,
			title: 'List Panel with Pagination',
			i18n: i18n.pagination
		};
	},
	computed: {
		currentPage() {
			return (
				Math.floor(
					this.components.example.offset / this.components.example.count
				) + 1
			);
		},
		lastPage() {
			return Math.ceil(
				this.components.example.itemsMax / this.components.example.count
			);
		}
	},
	methods: {
		setPage: function(page) {
			this.components.example.offset =
				page * this.components.example.count - this.components.example.count;
			this.components.example.items = this.allItems.slice(
				this.components.example.offset,
				this.components.example.count + this.components.example.offset
			);
		}
	}
};
</script>
