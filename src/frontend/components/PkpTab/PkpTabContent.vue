<template>
	<TabsContent :class="cn('root')" :value="value">
		<slot v-if="!lazy || hasBeenActive" />
	</TabsContent>
</template>
<script setup>
import {ref, watch} from 'vue';
import {TabsContent, injectTabsRootContext} from 'reka-ui';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';

const props = defineProps({
	value: {type: String, required: true},
	/**
	 * Render the content only once the tab is opened for the first time, then keep it.
	 * Useful for content that loads data, so it is only fetched when a reader needs it.
	 */
	lazy: {type: Boolean, default: false},
	styles: {type: Object, default: () => ({})},
});

const {cn} = usePkpStyles('PkpTabContent', props.styles);

const rootContext = injectTabsRootContext();
const hasBeenActive = ref(false);
watch(
	() => rootContext.modelValue.value === props.value,
	(isActive) => {
		if (isActive) {
			hasBeenActive.value = true;
		}
	},
	{immediate: true},
);
</script>
