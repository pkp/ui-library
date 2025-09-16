<template>
	<DropdownMenuItem
		:disabled="item.disabled"
		class="BaseDropdownMenuItem"
		@click="handleClick(item)"
	>
		<slot />
	</DropdownMenuItem>
</template>
<script setup>
import {provide, inject} from 'vue';
import {DropdownMenuItem} from 'reka-ui';

const props = defineProps({item: {type: Object, required: true}});
provide('item', props.item);
const handleClick = inject('handleClick');
</script>
