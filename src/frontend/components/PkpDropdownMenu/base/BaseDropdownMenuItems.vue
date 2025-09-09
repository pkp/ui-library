<template>
	<DropdownMenuPortal>
		<DropdownMenuContent v-bind="$attrs" class="BaseDropdownMenuItems">
			<template v-for="item in items" :key="item.name">
				<slot :item="item" />
			</template>
		</DropdownMenuContent>
	</DropdownMenuPortal>
</template>
<script setup>
defineOptions({
	inheritAttrs: false, // Disable attribute inheritance for the root element
});
import {inject} from 'vue';
import {DropdownMenuContent, DropdownMenuPortal} from 'reka-ui';
const items = inject('items');
</script>
