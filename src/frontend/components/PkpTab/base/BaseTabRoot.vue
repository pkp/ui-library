<template>
	<TabsRoot :default-value="defaultValue" class="BaseTabRoot">
		<slot />
	</TabsRoot>
</template>
<script setup>
import {TabsRoot} from 'reka-ui';

defineProps({defaultValue: {type: String, required: false, default: null}});
</script>
