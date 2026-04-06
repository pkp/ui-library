<template>
	<TabsTrigger :value="value" :class="cn('root')"><slot /></TabsTrigger>
</template>
<script setup>
import {inject, onUnmounted} from 'vue';
import {TabsTrigger} from 'reka-ui';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';

const props = defineProps({
	value: {type: String, required: true},
	styles: {type: Object, default: () => ({})},
});

const {cn} = usePkpStyles('PkpTabTrigger', props.styles);

// Register with parent PkpTabRoot for validation
const tabRoot = inject('pkpTabRoot', null);
tabRoot?.register(props.value);
onUnmounted(() => tabRoot?.unregister(props.value));
</script>
