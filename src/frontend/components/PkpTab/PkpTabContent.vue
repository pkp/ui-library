<template>
	<TabsContent :class="cn('root')" :value="value"><slot /></TabsContent>
</template>
<script setup>
import {TabsContent} from 'reka-ui';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';

const props = defineProps({
	value: {type: String, required: true},
	styles: {type: Object, default: () => ({})},
});

const {cn} = usePkpStyles('PkpTabContent', props.styles);
</script>
