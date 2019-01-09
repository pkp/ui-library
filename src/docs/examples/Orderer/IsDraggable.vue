<template>
	<list class="viewOrderer--draggable">
		<draggable v-model="items">
			<list-item v-for="item in items" :key="item">
				{{ item }}
				<orderer
					@up="up"
					@down="down"
					:itemId="item"
					:itemTitle="item"
					:i18n="i18n"
				/>
			</list-item>
		</draggable>
	</list>
</template>

<script>
import ViewOrderer from './ViewOrderer.vue';

export default {
	name: 'ViewOrdererDraggable',
	extends: ViewOrderer,
	data: function () {
		return {
			items: ['One', 'Two', 'Three'],
			isDraggable: false,
			i18n: {
				orderUp: 'Increase position of {$itemTitle}',
				orderDown: 'Decrease position of {$itemTitle}',
			},
		};
	},
};
</script>

<style lang="less">
@import '../../../styles/_import';

.viewOrderer--draggable {

	.listItem {
		padding-left: 4em;
	}
}
</style>
