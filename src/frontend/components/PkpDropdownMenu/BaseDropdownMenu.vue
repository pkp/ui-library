<template>
	<DropdownMenuRoot>
		<slot />
	</DropdownMenuRoot>
</template>

<script setup>
import {DropdownMenuRoot} from 'reka-ui';
import {provide} from 'vue';

const props = defineProps({
	items: {
		type: Array,
		default: () => [
			{
				label: 'Edit',
				name: 'edit',
				disabled: false,
			},
			{
				label: 'Notify',
				name: 'notify',
				disabled: false,
			},
			{
				label: 'Login As',
				name: 'login_as',
				disabled: false,
			},
			{
				label: 'Remove',
				name: 'remove',
				disabled: false,
			},
		],
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
