<template>
	<list class="viewOrderer--draggable">
		<VueDraggable ref="el" v-model="items">
			<list-item v-for="item in items" :key="item">
				{{ item }}
				<orderer :itemId="item" :itemTitle="item" @down="down" @up="up" />
			</list-item>
		</VueDraggable>
	</list>
</template>

<script>
import PreviewOrderer from './PreviewOrderer.vue';
import {VueDraggable} from 'vue-draggable-plus';

export default {
	extends: PreviewOrderer,
	components: {
		VueDraggable,
	},
	data() {
		return {
			...PreviewOrderer.data(),
		};
	},
};
</script>

<style lang="less">
@import '../../../../styles/_import';

.viewOrderer--draggable {
	.listItem {
		padding-inline-start: 4em;
	}
}
</style>
