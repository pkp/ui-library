<template>
	<DropdownMenuRoot class="BaseDropdownMenu">
		<slot />
	</DropdownMenuRoot>
</template>

<script setup>
import {DropdownMenuRoot} from 'reka-ui';
import {provide} from 'vue';

const props = defineProps({
	items: {
		type: Array,
		default: () => [],
	},
});

const emit = defineEmits(['select']);

const handleClick = (item) => {
	if (item.disabled) return;
	if (item.actionFn) {
		item.actionFn();
	} else {
		emit('select', item.name || item.label);
	}
};

provide('items', props.items);
provide('handleClick', handleClick);
</script>
