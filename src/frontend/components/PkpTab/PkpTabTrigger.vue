<template>
	<TabsTrigger :value="value" class="PkpTabTrigger"><slot /></TabsTrigger>
</template>
<script setup>
import {inject, onUnmounted} from 'vue';
import {TabsTrigger} from 'reka-ui';

const props = defineProps({value: {type: String, required: true}});

// Register with parent PkpTabRoot for validation
const tabRoot = inject('pkpTabRoot', null);
tabRoot?.register(props.value);
onUnmounted(() => tabRoot?.unregister(props.value));
</script>
