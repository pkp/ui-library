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
import PreviewOrderer from './PreviewOrderer.vue';
import draggable from 'vuedraggable';

export default {
	extends: PreviewOrderer,
	components: {
		draggable
	},
	data() {
		return {
			...PreviewOrderer.data(),
			isDraggable: true
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
