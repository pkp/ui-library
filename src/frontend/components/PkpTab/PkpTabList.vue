<template>
	<TabsList :class="cn('root')"><slot /></TabsList>
</template>
<script setup>
import {TabsList} from 'reka-ui';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';

const props = defineProps({
	styles: {type: Object, default: () => ({})},
});

const {cn} = usePkpStyles(props.styles);
</script>
