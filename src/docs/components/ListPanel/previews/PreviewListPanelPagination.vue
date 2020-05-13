<template>
	<list-panel :items="items" title="List Panel with Pagination">
		<pagination
			v-if="lastPage > 1"
			slot="footer"
			:currentPage="currentPage"
			:isLoading="isLoading"
			:lastPage="lastPage"
			@set-page="setPage"
		/>
	</list-panel>
</template>

<script>
import ListPanel from '@/components/ListPanel/ListPanel.vue';
import Pagination from '@/components/Pagination/Pagination.vue';

let manyItems = [];
for (let i = 1; i < 31; i++) {
	manyItems.push({
		id: i,
		title: 'Item ' + i
	});
}

export default {
	components: {
		ListPanel,
		Pagination
	},
	data() {
		return {
			allItems: manyItems,
			count: 5,
			isLoading: false,
			items: manyItems.slice(0, 5),
			itemsMax: manyItems.length,
			offset: 0
		};
	},
	computed: {
		currentPage() {
			return Math.floor(this.offset / this.count) + 1;
		},
		lastPage() {
			return Math.ceil(this.itemsMax / this.count);
		}
	},
	methods: {
		setPage: function(page) {
			// Mock a delay for a remote request
			this.isLoading = true;
			setTimeout(() => {
				this.offset = page * this.count - this.count;
				this.items = this.allItems.slice(this.offset, this.count + this.offset);
				this.isLoading = false;
			}, 1000);
		}
	}
};
</script>
