<template>
	<TabsContent class="BaseTabContent" :value="value"><slot /></TabsContent>
</template>
<script setup>
import {TabsContent} from 'reka-ui';

defineProps({value: {type: String, required: true}});
</script>
