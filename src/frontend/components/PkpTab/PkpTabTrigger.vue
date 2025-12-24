<template>
	<TabsTrigger :value="value" class="PkpTabTrigger"><slot /></TabsTrigger>
</template>
<script setup>
import {TabsTrigger} from 'reka-ui';

defineProps({value: {type: String, required: true}});
</script>
