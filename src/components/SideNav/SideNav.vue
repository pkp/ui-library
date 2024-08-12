<template>
	<div
		v-if="Object.keys(links).length"
		class="nav-section sticky top-12 flex h-screen flex-none"
	>
		<SideMenu :items="items"></SideMenu>
	</div>
</template>

<script setup>
import SideMenu from '../SideMenu/SideMenu.vue';
import {reactive} from 'vue';

const props = defineProps({
	links: {
		type: Object,
		required: true,
		validator: (value) => {
			return Object.keys(value).every((key) => 'name' in value[key]);
		},
	},
	ariaLabel: {
		type: String,
		default: 'Site Navigation',
	},
});

const items = reactive(convertLinksToArray(props.links));

function convertLinksToArray(links, parent, level = 1) {
	const result = [];

	for (const key in links) {
		const link = links[key];
		const item = {
			...link,
			label: link.name,
			link: link.url,
		};

		if (link.submenu) {
			item.items = convertLinksToArray(link.submenu, item, level + 1);
		}

		result.push(item);
	}

	return result;
}
</script>

<style lang="less" scoped>
@import '../../styles/_import';

.nav-section {
	height: calc(100vh - 3rem);
}
</style>
