<template>
	<list class="viewOrderer--draggable">
		<draggable v-model="items">
			<list-item v-for="item in items" :key="item">
				{{ item }}
				<orderer :itemId="item" :itemTitle="item" @down="down" @up="up" />
			</list-item>
		</draggable>
	</list>
</template>

<script>
import PreviewOrderer from './PreviewOrderer.vue';
import draggable from 'vuedraggable';

export default {
	extends: PreviewOrderer,
	components: {
		draggable
	},
	data() {
		return {
			...PreviewOrderer.data()
		};
	}
};
</script>

<style lang="less">
@import '../../../../styles/_import';

.viewOrderer--draggable {
	.listItem {
		padding-left: 4em;
	}
}
</style>
